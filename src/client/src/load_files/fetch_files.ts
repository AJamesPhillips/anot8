import { Store } from "redux"
import { ACTIONS } from "../state/actions"
import { get_url_to_file, get_url_to_file_annotations } from "../state/loading/getters"
import { State } from "../state/state"
import { get_store } from "../state/store"



export function fetch_files ()
{
    const store = get_store()

    fetch_pdf(store)
    fetch_annotation_files(store)
}



function fetch_pdf (store: Store<State>)
{
    const state = store.getState()
    const pdf_file_url = get_url_to_file(state)

    fetch(pdf_file_url)
    .then(() =>
    {
        console.log("Got PDF file")
    })
}



function fetch_annotation_files (store: Store<State>)
{
    const state = store.getState()
    const file_annotations_url = get_url_to_file_annotations(state)

    fetch(file_annotations_url)
    .then(resp => resp.json())
    .then(annotations_file =>
    {
        store.dispatch(ACTIONS.annotations.got_main_annotations_file({ annotations_file }))
    })
}
