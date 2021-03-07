import { AnyAction } from "redux"

import { State } from "../state"
import { is_set_user_name } from "./actions"
import { get_safe_user_name } from "./utils"



export function user_reducer (state: State, action: AnyAction): State
{
    if (is_set_user_name(action))
    {
        const { user_name } = action
        const safe_user_name = get_safe_user_name(user_name)

        localStorage.setItem("user_name", user_name)

        state = {
            ...state,
            user: { user_name, safe_user_name }
        }
    }


    return state
}
