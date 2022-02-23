import { h } from "preact"
import { useState } from "preact/hooks"
import { ACTIONS } from "../../state/actions"
import { get_selected_annotation_ids_owned_by_user } from "../../state/annotations/getters"

import { State } from "../../state/state"
import { get_store } from "../../state/store"
import { connect } from "../../utils/preact-redux-simple/connect"



interface OwnProps {}


const map_state = (state: State) => ({
    selected_annotation_ids_owned_by_user: get_selected_annotation_ids_owned_by_user(state),
})
type Props = ReturnType<typeof map_state> & OwnProps
const connector = connect(map_state)



function _DeleteButton (props: Props)
{
    const [confirm_delete, set_confirm_delete] = useState(false)

    const disabled = !props.selected_annotation_ids_owned_by_user
    const fill = disabled ? "#aaa" : (confirm_delete ? "#A00" : "#000")


    return <div>
        <button
            disabled={disabled}
            title="Delete annotations"
            onClick={() =>
            {
                if (!confirm_delete)
                {
                    set_confirm_delete(true)
                }
                else
                {
                    const compound_ids = props.selected_annotation_ids_owned_by_user.split(",")
                    get_store().dispatch(ACTIONS.annotations.delete_annotations({ compound_ids }))
                    set_confirm_delete(false)
                }
            }}
        >
            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" style={{ width: 20, fill }}>
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
            </svg>

            <br />
            {confirm_delete && <span style={{ fontSize: 10, color: "#A00" }}>CONFIRM</span>}
        </button>

        {confirm_delete && <p>
            <button
                disabled={disabled}
                title="Cancel delete"
                onClick={() =>
                {
                    set_confirm_delete(false)
                }}
                style={{ width: "100%" }}
            >
                <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" style={{ width: 20, fill: "#000" }}>
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path>
                </svg>

                <br />
                <span style={{ fontSize: 10 }}>CANCEL</span>
            </button>
        </p>}
    </div>
}

export const DeleteButton = connector(_DeleteButton)
