import { Action, AnyAction } from "redux"



const start_rendering_pdf_type = "start_rendering_pdf"

interface StartRenderingPDFPageArgs
{
    max_pages: number
}
interface ActionStartRenderingPDFPage extends Action, StartRenderingPDFPageArgs {}
const start_rendering_pdf = (args: StartRenderingPDFPageArgs): ActionStartRenderingPDFPage =>
{
    return { type: start_rendering_pdf_type, ...args }
}

export const is_start_rendering_pdf = (action: AnyAction): action is ActionStartRenderingPDFPage => {
    return action.type === start_rendering_pdf_type
}



const rendered_page_type = "rendered_page"

interface RenderedPageArgs
{
    canvas: HTMLCanvasElement
    page_number: number
}
interface ActionRenderedPage extends Action, RenderedPageArgs {}
const rendered_page = (args: RenderedPageArgs): ActionRenderedPage =>
{
    return { type: rendered_page_type, ...args }
}

export const is_rendered_page = (action: AnyAction): action is ActionRenderedPage => {
    return action.type === rendered_page_type
}



const finished_rendering_pdf_type = "finished_rendering_pdf"

interface FinishedRenderingPDFArgs {}
interface ActionFinishedRenderingPDF extends Action, FinishedRenderingPDFArgs {}
const finished_rendering_pdf = (args: FinishedRenderingPDFArgs): ActionFinishedRenderingPDF =>
{
    return { type: finished_rendering_pdf_type, ...args }
}

export const is_finished_rendering_pdf = (action: AnyAction): action is ActionFinishedRenderingPDF => {
    return action.type === finished_rendering_pdf_type
}



export const pdf_rendering_actions = {
    start_rendering_pdf,
    rendered_page,
    finished_rendering_pdf,
}
