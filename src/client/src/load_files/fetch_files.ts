import { Store } from "redux"
import { getDocument, PDFDocumentProxy } from "pdfjs-dist"
declare const pdfjsLib: any;

import { ACTIONS } from "../state/actions"
import { get_url_to_file, get_url_to_file_annotations } from "../state/loading/getters"
import { State } from "../state/state"
import { get_store } from "../state/store"



export function fetch_files ()
{
    const store = get_store()

    fetch_annotation_files(store)
    return fetch_pdf(store)
}



function fetch_pdf (store: Store<State>)
{
    const state = store.getState()
    const url_to_file = get_url_to_file(state)

    const get_doc = pdfjsLib.getDocument as (typeof getDocument)

    return new Promise<PDFDocumentProxy>(resolve =>
    {
        get_doc(url_to_file).promise.then(pdf => resolve(pdf))
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
