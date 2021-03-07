import { UserState } from "../state"



export function get_starting_user_state (): UserState
{
    return {
        user_name: "",
        safe_user_name: "",
    }
}
