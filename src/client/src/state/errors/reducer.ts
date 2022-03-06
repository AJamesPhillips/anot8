import { AnyAction } from "redux"

import { State } from "../state"
import { is_set_error } from "./actions"



export function errors_reducer (state: State, action: AnyAction): State
{

    if (is_set_error(action))
    {
        const { error } = action

        state = {
            ...state,
            errors: { error }
        }
    }

    return state
}
