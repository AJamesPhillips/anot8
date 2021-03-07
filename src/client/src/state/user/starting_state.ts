import { UserState } from "../state"
import { get_safe_user_name } from "./utils"



export function get_starting_user_state (): UserState
{
    const user_name = localStorage.getItem("user_name") || ""
    const safe_user_name = get_safe_user_name(user_name)

    return {
        user_name,
        safe_user_name,
    }
}
