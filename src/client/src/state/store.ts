import { createStore, Action, Store } from "redux"

import { root_reducer } from "./reducer"
import { get_starting_state } from "./starting_state"
import { State } from "./state"



let store: Store<State>
export function get_store ()
{
    if (store) return store

    const starting_state = get_starting_state()
    store = createStore<State, Action, {}, {}>(root_reducer, starting_state)

    return store
}
