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



interface SetSelectedIdsArgs
{
    selected_compound_ids: string[]
}
interface ActionSetSelectedIds extends Action, SetSelectedIdsArgs {}

const set_selected_ids_type = "set_selected_ids"

const set_selected_ids = (args: SetSelectedIdsArgs): ActionSetSelectedIds =>
{
    return { type: set_selected_ids_type, ...args }
}

export const is_set_selected_ids = (action: AnyAction): action is ActionSetSelectedIds => {
    return action.type === set_selected_ids_type
}



export const selected_annotations_actions = {
    toggle_annotation_highlight,
    set_selected_ids,
}
