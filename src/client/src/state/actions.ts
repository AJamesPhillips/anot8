import { annotations_actions } from "./annotations/actions"
import { labels_actions } from "./labels/actions"
import { loading_actions } from "./loading/actions"
import { pdf_rendering_actions } from "./pdf_rendering/actions"
import { selected_annotations_actions } from "./selected_annotations/actions"
import { user_actions } from "./user/actions"



export const ACTIONS = {
    annotations: annotations_actions,
    labels: labels_actions,
    loading: loading_actions,
    pdf_rendering: pdf_rendering_actions,
    selected_annotations: selected_annotations_actions,
    user: user_actions,
}
