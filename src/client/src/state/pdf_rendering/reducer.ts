import { AnyAction } from "redux"
import { update_substate } from "../../utils/update_state"

import { RenderingPDFState, State } from "../state"
import { is_finished_rendering_pdf, is_rendered_page, is_start_rendering_pdf } from "./actions"



export function pdf_rendering_reducer (state: State, action: AnyAction): State
{
    if (is_start_rendering_pdf(action))
    {
        const rendering_pdf: RenderingPDFState = {
            ...state.rendering_pdf,
            max_pages: action.max_pages,
            status: "rendering",
        }
        state = { ...state, rendering_pdf }
    }


    if (is_rendered_page(action))
    {
        const rendering_pdf: RenderingPDFState = {
            ...state.rendering_pdf,
            last_rendered_page_canvas: action.canvas,
            last_rendered_page_number: action.page_number,
        }
        state = { ...state, rendering_pdf }
    }


    if (is_finished_rendering_pdf(action))
    {
        state = update_substate(state, "rendering_pdf", "status", "finished")
    }

    return state
}
