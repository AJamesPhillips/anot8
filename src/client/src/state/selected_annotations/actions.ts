import { Action, AnyAction } from "redux"



interface ToggleAnnotationHighlightArgs
{
    compound_id: string
}
interface ActionToggleAnnotationHighlight extends Action, ToggleAnnotationHighlightArgs {}

const toggle_annotation_highlight_type = "toggle_annotation_highlight"

const toggle_annotation_highlight = (args: ToggleAnnotationHighlightArgs): ActionToggleAnnotationHighlight =>
{
    return { type: toggle_annotation_highlight_type, ...args }
}

export const is_toggle_annotation_highlight = (action: AnyAction): action is ActionToggleAnnotationHighlight => {
    return action.type === toggle_annotation_highlight_type
}



export const selected_annotations_actions = {
    toggle_annotation_highlight,
}
