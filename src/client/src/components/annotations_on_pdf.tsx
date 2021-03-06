import { h, render } from "preact"
import { Store } from "redux"
import { ACTIONS } from "../state/actions"

import { State } from "../state/state"



let called_add_annotations_to_PDF_page = false
export function add_annotations_to_PDF_page (store: Store<State>)
{
    if (called_add_annotations_to_PDF_page) throw new Error("Only expecting to call add_annotations_to_PDF_page once")
    called_add_annotations_to_PDF_page = true

    const unsubscribe = store.subscribe(() =>
    {
        const state = store.getState()

        if (state.rendering_pdf.status === "finished") unsubscribe()

        if (!state.rendering_pdf.last_rendered_page_annotations_container)
        {
            return
        }

        const annotations_container_el = state.rendering_pdf.last_rendered_page_annotations_container
        render(<AnnotationsContainer />, annotations_container_el)
        store.dispatch(ACTIONS.pdf_rendering.have_setup_annotations_container({}))
    })
}



function AnnotationsContainer ()
{
    return <div></div>
}
