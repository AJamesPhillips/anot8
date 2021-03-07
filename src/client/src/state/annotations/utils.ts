import { MaybeAnnotation, Annotation } from "../interfaces"



export function is_not_deleted (annotation: MaybeAnnotation): annotation is Annotation
{
    return !annotation.deleted
}



const safe_regexp = new RegExp("[^a-z0-9_]", "g")
export function get_safe_user_name (user_name: string)
{
    return user_name.trim().toLowerCase().replace(safe_regexp, "_")
}



export function get_compound_id ({ id, safe_user_name }: { id: number, safe_user_name: string })
{
    return safe_user_name ? `${id}-${safe_user_name || ""}` : id.toString()
}
