import { annotations_actions } from "./annotations/actions"
import { label_actions } from "./labels/actions"
import { loading_actions } from "./loading/actions"
import { pdf_rendering_actions } from "./pdf_rendering/actions"



export const ACTIONS = {
    annotations: annotations_actions,
    label: label_actions,
    loading: loading_actions,
    pdf_rendering: pdf_rendering_actions,
}
