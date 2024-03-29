import { AnyAction, Reducer } from "redux"

import { annotations_reducer } from "./annotations/reducer"
import { errors_reducer } from "./errors/reducer"
import { labels_reducer } from "./labels/reducer"
import { loading_reducer } from "./loading/reducer"
import { pdf_rendering_reducer } from "./pdf_rendering/reducer"
import { selected_annotations_reducer } from "./selected_annotations/reducer"
import { State } from "./state"
import { user_reducer } from "./user/reducer"



export const root_reducer: Reducer<State, any> = ((state: State, action: AnyAction) =>
{
    const start = state

    state = annotations_reducer(state, action)
    state = errors_reducer(state, action)
    state = labels_reducer(state, action)
    state = loading_reducer(state, action)
    state = pdf_rendering_reducer(state, action)
    state = selected_annotations_reducer(state, action)
    state = user_reducer(state, action)

    // console .log(action, "before:", start, "after:", state)

    ;(window as any).debug_state = state

    return state
}) as any
