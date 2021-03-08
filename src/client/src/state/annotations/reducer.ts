import { AnyAction } from "redux"
import { remove_entry, replace_entries, replace_entry } from "../../utils/list"
import { Annotation, MaybeAnnotation } from "../interfaces"

import { AnnotationsByCompoundId, AnnotationsByPageNumber, AnnotationsBySafeUserName, AnnotationsState, State } from "../state"
import { get_safe_user_name } from "../user/utils"
import { is_create_annotation, is_delete_annotations, is_edit_annotation, is_got_annotations_file, is_got_replacement_annotations_file, is_progress_saving_annotations } from "./actions"
import { get_all_annotations } from "./getters"
import { get_compound_id, is_not_deleted } from "./utils"



export function annotations_reducer (state: State, action: AnyAction): State
{
    if (is_got_annotations_file(action) || is_got_replacement_annotations_file(action))
    {
        const is_intial_load = is_got_replacement_annotations_file(action)
        const is_replacement = is_got_replacement_annotations_file(action)

        const { annotations_file, user_name } = action
        const safe_user_name = get_safe_user_name(user_name)

        const new_maybe_annotations = annotations_file.annotations.map(add_user_name_and_compound_id(user_name))

        const prepared_state = prepare_new_annotations({ state, new_maybe_annotations, safe_user_name, allow_merge: false, overwrite: is_replacement })

        const annotations_state: AnnotationsState = {
            ...state.annotations,
            annotation_files_loaded: [...state.annotations.annotation_files_loaded, safe_user_name],
            ...prepared_state
        }

        if (is_main_annotations_file(safe_user_name) && is_intial_load)
        {
            annotations_state.annotation_user_names = annotations_file.annotation_user_names

            const user_specific_annotation_files_to_load = annotations_file.annotation_user_names.map(get_safe_user_name)
            annotations_state.annotation_files_to_load = ["", ...user_specific_annotation_files_to_load]
        }

        if (is_intial_load && annotations_state.annotation_files_to_load.length === annotations_state.annotation_files_loaded.length)
        {
            annotations_state.status = "loaded"
        }
        if (is_replacement) annotations_state.status = "saved"

        state = { ...state, annotations: annotations_state }
    }


    if (is_create_annotation(action))
    {
        const new_maybe_annotations = [action.new_annotation]
        const { safe_user_name } = action.new_annotation

        const annotations_state: AnnotationsState = {
            ...state.annotations,
            ...prepare_new_annotations({
                state,
                new_maybe_annotations,
                safe_user_name,
                allow_merge: true,
                overwrite: false,
            })
        }

        state = { ...state, annotations: annotations_state }
    }


    if (is_edit_annotation(action))
    {
        const edited_annotation = action.annotation
        const predicate = (a: { compound_id: string }) => a.compound_id === edited_annotation.compound_id

        const annotations_by_safe_user_name = {...state.annotations.annotations_by_safe_user_name}
        annotations_by_safe_user_name[edited_annotation.safe_user_name] = replace_entry<MaybeAnnotation>(
            annotations_by_safe_user_name[edited_annotation.safe_user_name]!,
            edited_annotation, predicate, "editing state.annotations.annotations_by_safe_user_name")

        const all_annotations = replace_entry<Annotation>(
            state.annotations.all_annotations,
            edited_annotation, predicate, "editing state.annotations.all_annotations")

        const annotations_by_page_number = {...state.annotations.annotations_by_page_number}
        annotations_by_page_number[edited_annotation.page_number] = replace_entry<Annotation>(
            state.annotations.annotations_by_page_number[edited_annotation.page_number]!,
            edited_annotation, predicate, "editing state.annotations.annotations_by_page_number")

        const annotations_by_compound_id = {...state.annotations.annotations_by_compound_id}
        annotations_by_compound_id[edited_annotation.compound_id] = edited_annotation

        const new_annotations_state: AnnotationsState = {
            ...state.annotations,
            annotations_by_safe_user_name,
            all_annotations,
            annotations_by_page_number,
            annotations_by_compound_id,
        }

        state = { ...state, annotations: new_annotations_state }
    }


    if (is_delete_annotations(action))
    {
        const ids = new Set(action.compound_ids)
        const safe_user_name = state.user.safe_user_name

        const predicate = (a: { safe_user_name: string, compound_id: string }) => {
            return a.safe_user_name === safe_user_name && ids.has(a.compound_id)
        }
        const replacer = (a: MaybeAnnotation): MaybeAnnotation => {
            return predicate(a) ? { ...a, deleted: true, dirty: true } : a
        }

        const annotations_by_safe_user_name = {...state.annotations.annotations_by_safe_user_name}
        annotations_by_safe_user_name[safe_user_name] = replace_entries<MaybeAnnotation>(
            annotations_by_safe_user_name[safe_user_name]!,
            replacer, "deleting from state.annotations.annotations_by_safe_user_name")

        const all_annotations = remove_entry<Annotation>(
            state.annotations.all_annotations, predicate)

        const annotations_by_page_number = {...state.annotations.annotations_by_page_number}
        Object.keys(annotations_by_page_number).forEach(page_number_str =>
        {
            const page_number = parseInt(page_number_str, 10)
            annotations_by_page_number[page_number] = remove_entry<Annotation>(
                state.annotations.annotations_by_page_number[page_number]!, predicate)
        })

        const annotations_by_compound_id = {...state.annotations.annotations_by_compound_id}
        action.compound_ids.forEach(id =>
        {
            const annotation = annotations_by_compound_id[id]
            if (annotation && predicate(annotation)) delete annotations_by_compound_id[id]
        })

        const new_annotations_state: AnnotationsState = {
            ...state.annotations,
            annotations_by_safe_user_name,
            all_annotations,
            annotations_by_page_number,
            annotations_by_compound_id,
        }

        state = { ...state, annotations: new_annotations_state }
    }


    if (is_progress_saving_annotations(action))
    {
        const annotations = {
            ...state.annotations,
            status: action.status,
        }
        state = { ...state, annotations }
    }


    return state
}



function add_user_name_and_compound_id (user_name: string)
{
    const safe_user_name = get_safe_user_name(user_name)

    return (annotation: MaybeAnnotation): MaybeAnnotation => {
        annotation = ({ ...annotation, user_name, safe_user_name })
        const compound_id = get_compound_id(annotation)
        return { ...annotation, compound_id }
    }
}



interface PrepareNewAnnotationsArgs
{
    state: State
    new_maybe_annotations: MaybeAnnotation[]
    safe_user_name: string
    allow_merge: boolean
    overwrite: boolean
}
function prepare_new_annotations (args: PrepareNewAnnotationsArgs)
{
    const { state, new_maybe_annotations, safe_user_name, allow_merge, overwrite: allow_overwrite } = args

    const annotations_by_safe_user_name = add_new_annotations_by_safe_user_name({
        annotations_by_safe_user_name: state.annotations.annotations_by_safe_user_name,
        new_annotations: new_maybe_annotations,
        safe_user_name,
        allow_merge,
        allow_overwrite,
    })

    const all_annotations = get_all_annotations(annotations_by_safe_user_name)
    const new_annotations = new_maybe_annotations.filter(is_not_deleted)
    const annotations_by_page_number = add_new_annotations_by_page_number(
        state.annotations.annotations_by_page_number, new_annotations)
    const annotations_by_compound_id = add_new_annotations_by_compound_id(
        state.annotations.annotations_by_compound_id, new_annotations)

    return {
        annotations_by_safe_user_name,
        all_annotations,
        annotations_by_page_number,
        annotations_by_compound_id,
    }
}



interface AddNewAnnotationsBySafeUserNameArgs
{
    annotations_by_safe_user_name: AnnotationsBySafeUserName
    new_annotations: MaybeAnnotation[]
    safe_user_name: string
    allow_merge: boolean
    allow_overwrite: boolean
}
function add_new_annotations_by_safe_user_name (args: AddNewAnnotationsBySafeUserNameArgs): AnnotationsBySafeUserName
{
    const {
        annotations_by_safe_user_name,
        safe_user_name,
        allow_merge,
        allow_overwrite,
    } = args
    let { new_annotations } = args

    if (!allow_merge)
    {
        if (annotations_by_safe_user_name[safe_user_name] && !allow_overwrite)
        {
            console.error("Overwritting annotations by safe_user_name ", annotations_by_safe_user_name[safe_user_name])
        }

        return {
            ...annotations_by_safe_user_name,
            [safe_user_name]: [...new_annotations],
        }
    }
    else
    {
        const existing_annotations = annotations_by_safe_user_name[safe_user_name] || []
        new_annotations = [...existing_annotations, ...new_annotations]

        return {
            ...annotations_by_safe_user_name,
            [safe_user_name]: new_annotations,
        }
    }
}



function add_new_annotations_by_page_number (annotations_by_page_number: AnnotationsByPageNumber, new_annotations: Annotation[]): AnnotationsByPageNumber
{
    annotations_by_page_number = { ...annotations_by_page_number }

    const unique_page_numbers = Array.from(new Set(new_annotations.map(a => a.page_number)))

    unique_page_numbers.forEach(page_number =>
    {
        annotations_by_page_number[page_number] = [...(annotations_by_page_number[page_number] || [])]
    })

    new_annotations.map(a =>
    {
        annotations_by_page_number[a.page_number]!.push(a)
    })

    return annotations_by_page_number
}



function add_new_annotations_by_compound_id (annotations_by_compound_id: AnnotationsByCompoundId, new_annotations: Annotation[]): AnnotationsByCompoundId
{
    annotations_by_compound_id = { ...annotations_by_compound_id }

    new_annotations.map(a =>
    {
        annotations_by_compound_id[a.compound_id] = a
    })

    return annotations_by_compound_id
}



function is_main_annotations_file (safe_user_name: string)
{
    return safe_user_name === ""
}
