import { AnyAction, Reducer } from "redux"

import { loading_reducer } from "./loading/reducer"
import { State } from "./state"



export const root_reducer: Reducer<State, any> = ((state: State, action: AnyAction) =>
{
    state = loading_reducer(state, action)

    return state
}) as any
