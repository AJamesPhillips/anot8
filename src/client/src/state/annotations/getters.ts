import { Annotation } from "../interfaces"
import { State } from "../state"
import { get_compound_id, is_not_deleted } from "./utils"



export function get_all_annotations (state: State): Annotation[]
{
    let all_annotations: Annotation[] = []

    Object.values(state.annotations.annotations_by_safe_user_name)
    .forEach(user_specific_annotations =>
    {
        const annotations = user_specific_annotations!.filter(is_not_deleted)
        all_annotations = all_annotations.concat(annotations)
    })

    return all_annotations
}



export function get_annotation_by_compound_id (state: State, compound_annotation_id: string): Annotation | undefined
{
    return state.annotations.annotations_by_compound_id[compound_annotation_id]
}



export function get_annotation_ids_for_page (state: State, page_number: number)
{
    return (state.annotations.annotations_by_page_number[page_number] || [])
        .map(get_compound_id)
        .join(",")
}
