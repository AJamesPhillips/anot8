import { AnyAction } from "redux"
import { Annotation } from "../interfaces"

import { AnnotationsState, State } from "../state"
import { is_got_main_annotations_file } from "./actions"



export function annotations_reducer (state: State, action: AnyAction): State
{
    if (is_got_main_annotations_file(action))
    {
        const annotations: AnnotationsState = {
            ...state.annotations,
            status: "loaded",
            annotation_user_names: action.annotations_file.annotation_user_names,
            main_annotations: action.annotations_file.annotations.map(add_user_name("")),
        }
        state = { ...state, annotations }
    }

    return state
}



function add_user_name (user_name: string)
{
    return (a: Annotation): Annotation => ({ ...a, user_name })
}
