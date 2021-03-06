import { AnyAction, Reducer } from "redux"

import { annotations_reducer } from "./annotations/reducer"
import { loading_reducer } from "./loading/reducer"
import { pdf_rendering_reducer } from "./pdf_rendering/reducer"
import { State } from "./state"



export const root_reducer: Reducer<State, any> = ((state: State, action: AnyAction) =>
{
    state = annotations_reducer(state, action)
    state = loading_reducer(state, action)
    state = pdf_rendering_reducer(state, action)

    return state
}) as any
