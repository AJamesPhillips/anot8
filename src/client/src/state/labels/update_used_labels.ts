import { Store } from "redux"

import { ACTIONS } from "../actions"
import { get_all_annotations } from "../annotations/getters"
import { AnnotationsBySafeUserName, State } from "../state"



export function update_used_labels (store: Store<State>)
{
    let annotations_by_safe_user_name: AnnotationsBySafeUserName
    store.subscribe(() =>
    {
        const state = store.getState()

        if (state.annotations.annotations_by_safe_user_name === annotations_by_safe_user_name) return
        annotations_by_safe_user_name = state.annotations.annotations_by_safe_user_name

        const { used_labels: current_used_labels } = state.labels
        const missing_labels = new Set(current_used_labels)

        const used_labels = new Set<string>()
        let mismatch = false

        get_all_annotations(annotations_by_safe_user_name).forEach(({ labels }) =>
        {
            labels.forEach(label => {
                used_labels.add(label)
                missing_labels.delete(label)
                if (!current_used_labels.has(label)) mismatch = true
            })
        })

        if (mismatch || missing_labels.size) store.dispatch(ACTIONS.labels.set_used_labels({ used_labels }))
    })
}
