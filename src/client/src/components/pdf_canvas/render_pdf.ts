import { Store } from "redux"
import type { PageViewport } from "pdfjs-dist/types/web/interfaces"
import type { PDFDocumentProxy, RenderParameters } from "pdfjs-dist/types/src/display/api"

import { ACTIONS } from "../../state/actions"
import { State } from "../../state/state"
import { get_store } from "../../state/store"
import { add_annotations_to_PDF_page } from "../annotations_on_pdf/annotations_on_pdf"
import { add_canvas_pointer_event_handlers } from "./add_canvas_mouse_event_handlers"



let called_render_pdf = false
export function render_pdf (pdf: PDFDocumentProxy, pages_container_el: HTMLElement)
{
    if (called_render_pdf) throw new Error("Only expecting to call render_pdf once")
    called_render_pdf = true

    const store = get_store()
    store.dispatch(ACTIONS.pdf_rendering.start_rendering_pdf({ max_pages: pdf.numPages }))

    // assume there is always at least 1 page to render
    render_pdf_page({ pdf, pages_container_el, page_number: 1, store })
}



interface RenderPdfPageArgs
{
    pdf: PDFDocumentProxy
    pages_container_el: HTMLElement
    page_number: number
    store: Store<State>
}
function render_pdf_page ({ pdf, pages_container_el, page_number, store }: RenderPdfPageArgs)
{
    pdf.getPage(page_number)
    .then(page =>
    {
        const scale = 1.5
        const viewport = page.getViewport({ scale: scale })


        const single_page_container_el = create_single_page_container_el(pages_container_el, viewport)
        const canvas = create_pdf_canvas(single_page_container_el, viewport)
        const render_context = create_canvas_context(canvas, viewport)
        const annotations_container_el = create_annotations_container_el({ single_page_container_el, page_number })
        add_page_number({ pages_container_el, page_number })


        page.render(render_context)
        .promise.then(() =>
        {
            add_canvas_pointer_event_handlers({ store, canvas, annotations_container_el, page_number })
            add_annotations_to_PDF_page({ annotations_container_el, page_number })
            store.dispatch(ACTIONS.pdf_rendering.rendered_page({ page_number }))

            if (page_number < pdf.numPages)
            {
                render_pdf_page({
                    pdf,
                    pages_container_el,
                    page_number: page_number + 1,
                    store,
                })
            }
            else
            {
                store.dispatch(ACTIONS.pdf_rendering.finished_rendering_pdf({}))
            }
        })
    })
}



function create_single_page_container_el (pages_container_el: HTMLElement, viewport: PageViewport)
{
    const single_page_container_el = document.createElement("div")
    single_page_container_el.className = "page_container"

    single_page_container_el.style.height = viewport.height.toString()
    single_page_container_el.style.width = viewport.width.toString()

    pages_container_el.appendChild(single_page_container_el)

    return single_page_container_el
}



function create_pdf_canvas (single_page_container_el: HTMLElement, viewport: PageViewport)
{
    const canvas = document.createElement("canvas")
    canvas.height = viewport.height
    canvas.width = viewport.width
    single_page_container_el.appendChild(canvas)

    return canvas
}



function create_canvas_context (canvas: HTMLCanvasElement, viewport: PageViewport)
{
    const canvasContext = canvas.getContext("2d")!

    const render_context: RenderParameters = { canvasContext, viewport }
    return render_context
}



interface CreateAnnotationsContainerElArgs
{
    single_page_container_el: HTMLElement
    page_number: number
}
function create_annotations_container_el ({ single_page_container_el, page_number }: CreateAnnotationsContainerElArgs)
{
    const annotations_container_el = document.createElement("div")
    annotations_container_el.className = "annotations_container"
    annotations_container_el.id = `annotations_container_el_${page_number}`
    single_page_container_el.appendChild(annotations_container_el)

    return annotations_container_el
}



interface AddPageNumberArgs
{
    pages_container_el: HTMLElement
    page_number: number
}
function add_page_number ({ pages_container_el, page_number }: AddPageNumberArgs)
{
    const page_number_el = document.createElement("div")
    page_number_el.innerText = page_number.toString()
    pages_container_el.appendChild(page_number_el)

    pages_container_el.appendChild(document.createElement("br"))
}
