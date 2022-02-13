import { h } from "preact"

import { ACTIONS } from "../../../state/actions"
import { get_all_selected_annotations } from "../../../state/annotations/getters"
import { Label, State } from "../../../state/state"
import { get_store } from "../../../state/store"
import { toggle_list_entry } from "../../../utils/list"
import { connect } from "../../../utils/preact-redux-simple/connect"



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
        used_labels: state.labels.used_labels,
        priority_labels: state.labels.priority_labels,
        search_string: state.labels.search_string,
        ...is_checked_or_indeterminate(label, state),
        annotations_to_edit: get_all_selected_annotations(state),
    }
}
type Props = ReturnType<typeof map_state> & OwnProps
const connector = connect(map_state)



function _LabelComponent (props: Props)
{
    const { label } = props
    if (!label) return null

    const is_used = props.used_labels.has(label.value)
    const priority = props.priority_labels.has(label.value)
    const display = matches_search_string(label, props.search_string)
    if (!display) return null


    function toggle_label ()
    {
        const annotation_to_edit = props.annotations_to_edit[0]

        if (!annotation_to_edit)
        {
            console.warn("toggle_label requires an annotation")
            return
        }
        else if (props.annotations_to_edit.length > 1)
        {
            console.warn("Should not be able to edit multiple annotations")
            return
        }

        if (!label) return // type guard

        const labels = toggle_list_entry(annotation_to_edit.labels, label.value)

        const new_annotation = { ...annotation_to_edit, labels }
        store.dispatch(ACTIONS.annotations.edit_annotation({ annotation: new_annotation }))
    }


    const class_name = `label ${is_used ? "used_label" : ""} ${priority ? "priority" : ""}`

    return <div
        className={class_name}
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

        {label.display_text}

        <span
            className="priority_label"
            onClick={e => {
                e.stopPropagation()
                store.dispatch(ACTIONS.labels.toggle_label_priority({ toggle_label_priority: label.value }))
            }}
            dangerouslySetInnerHTML={{__html: priority ? "&starf;" : "&star;" }}
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



function matches_search_string (label: Label, search_string: string) {
    if (!search_string) return true

    return label.lower_case_value.includes(search_string.toLowerCase())
}



function is_checked_or_indeterminate (label: Label | undefined, state: State) {
    const count = state.labels.labels_used_by_selected_annotations[label?.value || ""] || 0

    const checked = count > 0
    const indeterminate = checked && count !== state.selected_annotations.selected_compound_ids.length

    return { checked, indeterminate }
}
