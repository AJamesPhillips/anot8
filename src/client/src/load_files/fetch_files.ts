import { Store } from "redux"
import type * as PDFJS from "pdfjs-dist/types/src/pdf"
declare const pdfjsLib: typeof PDFJS

import { ACTIONS } from "../state/actions"
import { get_url_to_file, get_url_to_file_annotations } from "../state/loading/getters"
import { State } from "../state/state"
import { get_store } from "../state/store"
import { AnnotationsFile } from "../state/interfaces"
import { get_safe_user_name } from "../state/user/utils"



export function fetch_files ()
{
    const store = get_store()

    // fetch_annotation_files(store)
    return fetch_pdf(store)
}



function fetch_pdf (store: Store<State>)
{
    const state = store.getState()
    const url_to_file = get_url_to_file(state)

    return new Promise<PDFJS.PDFDocumentProxy>(resolve =>
    {
        pdfjsLib.getDocument(url_to_file).promise
        .then(pdf => resolve(pdf))
        .catch(e =>
        {
            // Assume it has failed due to Same origin policy and lack of permissible CORS headers
            // on requested resource.
            // Fall back to a proxy service
            const proxy_url_to_file = "https://cors-anywhere.herokuapp.com/" + url_to_file
            pdfjsLib.getDocument(proxy_url_to_file).promise
                .then(pdf => resolve(pdf))
        })
    })
}



function fetch_annotation_files (store: Store<State>)
{
    fetch_annotation_file({ store, user_name: "" })
    .then((annotations_file: AnnotationsFile) =>
    {
        annotations_file.annotation_user_names.forEach(user_name =>
        {
            fetch_annotation_file({ store, user_name })
        })
    })
    .catch(e =>
    {
        if (e === FetchAnnotationFileError.no_file_annotations_url) return
        console.error("fetch_annotation_files error: ", e)
    })
}



interface FetchAnnotationFileArgs
{
    store: Store<State>
    user_name: string
}
enum FetchAnnotationFileError
{
    no_file_annotations_url,
}
function fetch_annotation_file ({ store, user_name }: FetchAnnotationFileArgs)
{
    const safe_user_name = get_safe_user_name(user_name)
    const state = store.getState()
    const file_annotations_url = get_url_to_file_annotations({ state, safe_user_name })

    if (!file_annotations_url) return Promise.reject(FetchAnnotationFileError.no_file_annotations_url)

    return fetch(file_annotations_url)
    .then(resp => resp.json())
    .then((annotations_file: AnnotationsFile) =>
    {
        store.dispatch(ACTIONS.annotations.got_annotations_file({ annotations_file, user_name }))

        return annotations_file
    })
}
