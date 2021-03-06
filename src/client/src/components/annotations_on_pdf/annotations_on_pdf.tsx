import { h, render } from "preact"
import { Store } from "redux"

import { ACTIONS } from "../../state/actions"
import { State } from "../../state/state"
import { AnnotationsContainer } from "./AnnotationsContainer"



let called_add_annotations_to_PDF_page = false
export function add_annotations_to_PDF_page (store: Store<State>)
{
    if (called_add_annotations_to_PDF_page) throw new Error("Only expecting to call add_annotations_to_PDF_page once")
    called_add_annotations_to_PDF_page = true

    const unsubscribe = store.subscribe(() =>
    {
        const state = store.getState()
        const {
            status,
            last_rendered_page_annotations_container: annotations_container_el,
            last_rendered_page_number: page_number,
        } = state.rendering_pdf

        if (status === "finished") unsubscribe()

        if (!annotations_container_el || page_number === undefined)
        {
            return
        }

        render(<AnnotationsContainer page_number={page_number} />, annotations_container_el)
        store.dispatch(ACTIONS.pdf_rendering.have_setup_annotations_container({}))
    })
}
