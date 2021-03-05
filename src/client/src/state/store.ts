import { createStore, Action, Reducer, AnyAction } from "redux"

import { get_starting_state } from "./starting_state"
import { State } from "./state"



const root_reducer: Reducer<State, any> = ((state: State, action: AnyAction) =>
{

    // state = statements_reducer(state, action)

    return state
}) as any



export function config_store ()
{
    const starting_state = get_starting_state()
    const store = createStore<State, Action, {}, {}>(root_reducer, starting_state)

    return store
}
