import { Action, AnyAction } from "redux"



interface SetErrorArgs
{
    error: string | Event
}
interface ActionSetError extends Action, SetErrorArgs {}

const set_error_type = "set_error"

const set_error = (args: SetErrorArgs): ActionSetError =>
{
    return { type: set_error_type, ...args }
}

export const is_set_error = (action: AnyAction): action is ActionSetError =>
{
    return action.type === set_error_type
}



export const errors_actions = {
    set_error,
}
