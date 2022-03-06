import { Store } from "redux"
import type * as PDFJS from "pdfjs-dist/types/src/pdf"
declare const pdfjsLib: typeof PDFJS | undefined

import { ACTIONS } from "../state/actions"
import { get_url_to_file, get_url_to_file_annotations } from "../state/loading/getters"
import { LoadingStage, State } from "../state/state"
import { get_store } from "../state/store"
import { AnnotationsFile } from "../state/interfaces"
import { get_safe_user_name } from "../state/user/utils"
import { santise_annotations_file } from "../utils/santise_annotations_file"



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

    return new Promise<PDFJS.PDFDocumentProxy>(async resolve =>
    {
        const have_pdfjsLib = await wait_for_pdfjsLib(store)

        have_pdfjsLib.getDocument(url_to_file).promise
        .then(pdf => resolve(pdf))
        .catch(e =>
        {
            // Assume it has failed due to Same origin policy and lack of permissible CORS headers
            // on requested resource.
            // Fall back to a proxy service
            const proxy_url_to_file = "https://cors-anywhere.herokuapp.com/" + url_to_file
            have_pdfjsLib.getDocument(proxy_url_to_file).promise
                .then(pdf => resolve(pdf))
                .catch((error: PDFJS.UnexpectedResponseException) =>
                {
                    store.dispatch(ACTIONS.loading.error_during_loading({
                        error_stage: LoadingStage.fetch_pdf_by_proxy,
                        error_type: error?.status ? (error?.status.toString()) : "other",
                    }))
                })
        })
    })
}



async function wait_for_pdfjsLib (store: Store<State>)
{
    const start = performance.now()

    while (
        !(window as any).pdfjsLib
        // hacky type guard.  Remove this
        || !pdfjsLib
    )
    {
        await wait_for_ms(50)
        console.log("Waiting for PDFJS lib")

        if ((performance.now() - start) > (3 * 60 * 1000)) // 3 minutes
        {
            store.dispatch(ACTIONS.errors.set_error({ error: "PDFJS did not load quickly enough" }))
            throw new Error("PDFJS did not load quickly enough")
        }
    }

    return pdfjsLib
}



function wait_for_ms (ms: number)
{
    return new Promise<void>(resolve =>
    {
        setTimeout(() => resolve(), ms)
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
        annotations_file = santise_annotations_file(annotations_file)
        store.dispatch(ACTIONS.annotations.got_annotations_file({ annotations_file, user_name }))

        return annotations_file
    })
}
