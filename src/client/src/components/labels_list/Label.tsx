import { h } from "preact"
import { ACTIONS } from "../../state/actions"

import { get_all_selected_annotations } from "../../state/annotations/getters"
import { Label, State } from "../../state/state"
import { get_store } from "../../state/store"
import { ensure_entry_status, toggle_list_entry } from "../../utils/list"
import { connect } from "../../utils/preact-redux-simple/connect"


const store = get_store()


interface OwnProps
{
    label_id: string
}


const map_state = (state: State, own_props: OwnProps) => {
    const label = state.labels.labels_by_id[own_props.label_id]

    return {
        label,
        disabled: is_disabled(state),
        is_used: state.labels.used_labels.has(label.value),
        display: matches_search_string(label, state.labels.search_string),
        ...is_checked_or_indeterminate(label, state),
        annotations_to_edit: get_all_selected_annotations(state),
        priority: state.labels.priority_labels.has(label.value),
    }
}
type Props = ReturnType<typeof map_state> & OwnProps
const connector = connect(map_state)



function _LabelComponent (props: Props)
{
    if (!props.display) return null

    function toggle_label ()
    {
        if (props.annotations_to_edit.length !== 1)
        {
            console.warn("Should not be able to edit multiple annotations")
            return
        }

        const annotation_to_edit = props.annotations_to_edit[0]
        const labels = toggle_list_entry(annotation_to_edit.labels, props.label.value)

        const new_annotation = { ...annotation_to_edit, labels }
        store.dispatch(ACTIONS.annotations.edit_annotation({ annotation: new_annotation }))
    }

    return <div
        className={"label " + (props.is_used ? " used_label " : "")}
        onClick={() => toggle_label()}
    >
        <input
            type="checkbox"
            className="label_checkbox"
            disabled={props.disabled}
            checked={props.checked}
            ref={e => e && (e.indeterminate = props.indeterminate)}
            onChange={e => {e.stopPropagation(); toggle_label()}}
        />

        {props.label.value}

        <span
            className="priority_label"
            onClick={e => {
                e.stopPropagation()
                store.dispatch(ACTIONS.labels.toggle_label_priority({ toggle_label_priority: props.label.value }))
            }}
            dangerouslySetInnerHTML={{__html: props.priority ? "&starf;" : "&star;" }}
        />
    </div>
}

export const LabelComponent = connector(_LabelComponent)



function is_disabled(state: State): boolean {
    return (
        state.selected_annotations.selected_compound_ids.length !== 1
        || !!get_all_selected_annotations(state)
            .find(({ safe_user_name }) => safe_user_name !== state.user.safe_user_name)
    )
}



function matches_search_string(label: Label, search_string: string) {
    if (!search_string) return true

    return label.lower_case_value.includes(search_string.toLowerCase())
}



function is_checked_or_indeterminate (label: Label, state: State) {
    const count = state.labels.labels_used_by_selected_annotations[label.value] || 0

    const checked = count > 0
    const indeterminate = checked && count !== state.selected_annotations.selected_compound_ids.length

    return { checked, indeterminate }
}
