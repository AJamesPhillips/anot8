import { MaybeAnnotation, Annotation } from "../interfaces"



export function is_not_deleted (annotation: MaybeAnnotation): annotation is Annotation
{
    return !annotation.deleted
}



export function get_compound_id ({ id, safe_user_name }: { id: number, safe_user_name: string })
{
    return safe_user_name ? `${id}-${safe_user_name || ""}` : id.toString()
}
