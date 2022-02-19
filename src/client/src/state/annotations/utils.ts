import { MaybeAnnotation, Annotation } from "../interfaces"
import { get_safe_user_name } from "../user/utils"



export function add_user_name_and_compound_id (user_name: string)
{
    const safe_user_name = get_safe_user_name(user_name)

    return (annotation: MaybeAnnotation): MaybeAnnotation => {
        annotation = ({ ...annotation, user_name, safe_user_name })
        const compound_id = get_compound_id(annotation)
        return { ...annotation, compound_id }
    }
}



export function is_not_deleted (annotation: MaybeAnnotation): annotation is Annotation
{
    return !annotation.deleted
}



export function get_compound_id ({ id, safe_user_name }: { id: number, safe_user_name: string })
{
    return safe_user_name ? `${id}-${safe_user_name}` : id.toString()
}
