import { Annotation } from "../interfaces"
import { State } from "../state"



export function get_users_annotations (state: State): Annotation[]
{
    return state.annotations.main_annotations || []
}
