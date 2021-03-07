import { Action, AnyAction } from "redux"



interface SetUserNameArgs {
    user_name: string
}
interface ActionSetUserName extends Action, SetUserNameArgs {}

const set_user_name_type = "set_user_name"

const set_user_name = (args: SetUserNameArgs): ActionSetUserName =>
{
    return { type: set_user_name_type, ...args }
}

export const is_set_user_name = (action: AnyAction): action is ActionSetUserName => {
    return action.type === set_user_name_type
}



export const user_actions = {
    set_user_name,
}
