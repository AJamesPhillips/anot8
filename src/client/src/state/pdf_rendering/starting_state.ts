import { RenderingPDFState } from "../state"



export function get_starting_rendering_pdf_state (): RenderingPDFState
{
    return {
        status: "not started",
        max_pages: undefined,
        last_rendered_page_canvas: undefined,
        last_rendered_page_number: undefined,
    }
}
