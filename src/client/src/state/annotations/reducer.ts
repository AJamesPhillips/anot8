import { AnyAction } from "redux"
import { SUPPORTED_SCHEMA_VERSION } from "../../SUPPORTED_SCHEMA_VERSION"

import { replace_entry, replace_entries, remove_entry } from "../../utils/list"
import { MaybeAnnotation, Annotation, AnnotationsFile } from "../interfaces"
import { State, AnnotationsState } from "../state"
import { get_safe_user_name } from "../user/utils"
import {
    is_got_annotations_file,
    is_got_replacement_annotations_file,
    is_create_annotation,
    is_edit_annotation,
    is_delete_annotations,
    is_progress_saving_annotations,
} from "./actions"
import { prepare_new_annotations } from "./prepare_new_annotations"
import { add_user_name_and_compound_id } from "./utils"



export function annotations_reducer (state: State, action: AnyAction): State
{
    if (is_got_annotations_file(action) || is_got_replacement_annotations_file(action))
    {
        const is_intial_load = is_got_annotations_file(action)
        const is_replacement = is_got_replacement_annotations_file(action)

        const { annotations_file, user_name } = action
        const safe_user_name = get_safe_user_name(user_name)

        const new_maybe_annotations = annotations_file.annotations.map(add_user_name_and_compound_id(user_name))

        const prepared_state = prepare_new_annotations({
            annotations_state: state.annotations,
            new_maybe_annotations,
            safe_user_name,
            allow_overwrite: is_replacement,
        })

        const annotations_state: AnnotationsState = {
            ...state.annotations,
            annotation_files_loaded: [...state.annotations.annotation_files_loaded, safe_user_name],
            unsupported_schema_version: get_unsupported_schema_version
        (state, annotations_file),
            ...prepared_state,
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
        else if (is_replacement) annotations_state.status = "saved"

        state = { ...state, annotations: annotations_state }
    }


    if (is_create_annotation(action))
    {
        // We do not yet support persisting annotations created on anot8.org
        // nor PDFs specified by url or doi
        const temporary = !state.running_locally || !!state.routing.url || !!state.routing.doi

        const new_maybe_annotation: MaybeAnnotation = { ...action.new_annotation, temporary }
        const new_maybe_annotations = [new_maybe_annotation]
        const { safe_user_name } = new_maybe_annotation

        const annotations_state: AnnotationsState = {
            ...state.annotations,
            ...prepare_new_annotations({
                annotations_state: state.annotations,
                new_maybe_annotations,
                safe_user_name,
                allow_overwrite: false,
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



function is_main_annotations_file (safe_user_name: string)
{
    return safe_user_name === ""
}



function get_unsupported_schema_version (state: State, annotations_file: AnnotationsFile)
{
    const unsupported_schema_version = annotations_file.schema_version !== SUPPORTED_SCHEMA_VERSION

    return state.annotations.unsupported_schema_version || unsupported_schema_version
}
