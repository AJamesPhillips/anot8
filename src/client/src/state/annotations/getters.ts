import { Annotation, MaybeAnnotation } from "../interfaces"
import { State } from "../state"



export function get_users_annotations (state: State): Annotation[]
{
    return (state.annotations.main_annotations || []).filter(is_not_deleted)
}



export function get_annotation (state: State, compound_annotation_id: string): Annotation | undefined
{
    return (state.annotations.main_annotations || [])
        .find(factory_annotation_matches_compound_id(compound_annotation_id))
}



export function get_annotation_ids_to_display_for_page (state: State, page_number: number): string[]
{
    return (state.annotations.main_annotations || [])
        .filter(is_not_deleted)
        .filter(a => a.page_number === page_number)
        .map(({ id, user_name }) => `${id}-${user_name || ""}`)
}



function is_not_deleted (annotation: MaybeAnnotation): annotation is Annotation
{
    return !annotation.deleted
}



function factory_annotation_matches_compound_id (compound_annotation_id: string)
{
    const [id_str, user_name] = compound_annotation_id.split("-")
    const id = parseInt(id_str, 10)

    return (a: MaybeAnnotation): a is Annotation =>
    {
        return is_not_deleted(a) && a.id === id && a.user_name === user_name
    }
}
