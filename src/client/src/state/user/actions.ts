import { Action, AnyAction } from "redux"



interface MouseUpArgs {}
interface ActionMouseUp extends Action, MouseUpArgs {}

const mouse_up_type = "mouse_up"

const mouse_up = (args: MouseUpArgs): ActionMouseUp =>
{
    return { type: mouse_up_type, ...args }
}

export const is_mouse_up = (action: AnyAction): action is ActionMouseUp => {
    return action.type === mouse_up_type
}



export const user_actions = {
}
