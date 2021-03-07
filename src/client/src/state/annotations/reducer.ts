import { AnyAction } from "redux"
import { Annotation, MaybeAnnotation } from "../interfaces"

import { AnnotationsByCompoundId, AnnotationsByPageNumber, AnnotationsBySafeUserName, AnnotationsState, State } from "../state"
import { is_got_annotations_file } from "./actions"
import { get_compound_id, get_safe_user_name, is_not_deleted } from "./utils"



export function annotations_reducer (state: State, action: AnyAction): State
{
    if (is_got_annotations_file(action))
    {
        const { annotations_file, user_name } = action
        const safe_user_name = get_safe_user_name(user_name)

        const new_maybe_annotations = annotations_file.annotations.map(add_user_name_and_compound_id(user_name))
        const new_annotations = new_maybe_annotations.filter(is_not_deleted)

        const annotations_by_safe_user_name = add_new_annotations_by_safe_user_name(
            state.annotations.annotations_by_safe_user_name, new_maybe_annotations, safe_user_name)

        const all_annotations = [...state.annotations.all_annotations, ...new_annotations]
        const annotations_by_page_number = add_new_annotations_by_page_number(
            state.annotations.annotations_by_page_number, new_annotations)
        const annotations_by_compound_id = add_new_annotations_by_compound_id(
            state.annotations.annotations_by_compound_id, new_annotations)


        const annotations: AnnotationsState = {
            ...state.annotations,
            status: "loaded", // this field does not make sense now with multiple user annotation files
            annotations_by_safe_user_name,
            //
            annotations_by_page_number,
            all_annotations,
            annotations_by_compound_id,
        }

        if (is_main_annotations_file(safe_user_name))
        {
            annotations.annotation_user_names = annotations_file.annotation_user_names
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


function is_main_annotations_file (safe_user_name: string)
{
    return safe_user_name === ""
}



function add_new_annotations_by_safe_user_name (annotations_by_safe_user_name: AnnotationsBySafeUserName, new_annotations: MaybeAnnotation[], safe_user_name: string): AnnotationsBySafeUserName
{
    return {
        ...annotations_by_safe_user_name,
        [safe_user_name]: new_annotations,
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
        const id = get_compound_id(a)
        annotations_by_compound_id[id] = a
    })

    return annotations_by_compound_id
}
