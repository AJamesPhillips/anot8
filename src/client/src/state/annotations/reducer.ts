import { AnyAction } from "redux"
import { replace_entry } from "../../utils/list"
import { Annotation, MaybeAnnotation } from "../interfaces"

import { AnnotationsByCompoundId, AnnotationsByPageNumber, AnnotationsBySafeUserName, AnnotationsState, State } from "../state"
import { is_create_annotation, is_edit_annotation, is_got_annotations_file } from "./actions"
import { get_compound_id, get_safe_user_name, is_not_deleted } from "./utils"



export function annotations_reducer (state: State, action: AnyAction): State
{
    if (is_got_annotations_file(action))
    {
        const { annotations_file, user_name } = action
        const safe_user_name = get_safe_user_name(user_name)

        const new_maybe_annotations = annotations_file.annotations.map(add_user_name_and_compound_id(user_name))

        const prepared_state = prepare_new_annotations({ state, new_maybe_annotations, safe_user_name, allow_merge: false })

        const annotations_state: AnnotationsState = {
            ...state.annotations,
            annotation_files_loaded: [...state.annotations.annotation_files_loaded, safe_user_name],
            ...prepared_state
        }

        if (is_main_annotations_file(safe_user_name))
        {
            annotations_state.annotation_user_names = annotations_file.annotation_user_names

            const user_specific_annotation_files_to_load = annotations_file.annotation_user_names.map(get_safe_user_name)
            annotations_state.annotation_files_to_load = ["", ...user_specific_annotation_files_to_load]
        }

        if (annotations_state.annotation_files_to_load.length === annotations_state.annotation_files_loaded.length)
        {
            annotations_state.status = "loaded"
        }

        state = { ...state, annotations: annotations_state }
    }


    if (is_create_annotation(action))
    {
        const new_maybe_annotations = [action.new_annotation]
        const { safe_user_name } = action.new_annotation

        const annotations_state: AnnotationsState = {
            ...state.annotations,
            ...prepare_new_annotations({ state, new_maybe_annotations, safe_user_name, allow_merge: true })
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
}
function prepare_new_annotations (args: PrepareNewAnnotationsArgs)
{
    const { state, new_maybe_annotations, safe_user_name, allow_merge } = args

    const annotations_by_safe_user_name = add_new_annotations_by_safe_user_name(
        state.annotations.annotations_by_safe_user_name, new_maybe_annotations, safe_user_name, allow_merge)

    const new_annotations = new_maybe_annotations.filter(is_not_deleted)
    const all_annotations = [...state.annotations.all_annotations, ...new_annotations]
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



function add_new_annotations_by_safe_user_name (annotations_by_safe_user_name: AnnotationsBySafeUserName, new_annotations: MaybeAnnotation[], safe_user_name: string, allow_merge: boolean): AnnotationsBySafeUserName
{
    if (!allow_merge)
    {
        if (annotations_by_safe_user_name[safe_user_name])
        {
            console.error("Overwritting annotations by safe_user_name ", annotations_by_safe_user_name[safe_user_name])
        }

        return {
            ...annotations_by_safe_user_name,
            [safe_user_name]: new_annotations,
        }
    }
    else
    {
        let existing_annotations = annotations_by_safe_user_name[safe_user_name] || []
        existing_annotations = [...existing_annotations, ...new_annotations]

        return {
            ...annotations_by_safe_user_name,
            [safe_user_name]: existing_annotations,
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
