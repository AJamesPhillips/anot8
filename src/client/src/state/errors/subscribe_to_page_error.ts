import { Store } from "redux"
import { ACTIONS } from "../actions"
import { State } from "../state"



export function subscribe_to_page_error (store: Store<State>)
{
    window.onerror = error =>
    {
        store.dispatch(ACTIONS.errors.set_error({ error }))
    }
}
