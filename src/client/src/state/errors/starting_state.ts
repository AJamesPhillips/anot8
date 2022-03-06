import { ErrorsState } from "../state"



export function get_starting_errors_state (): ErrorsState
{
    return {
        error: undefined
    }
}
