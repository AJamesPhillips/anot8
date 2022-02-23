import { h } from "preact"
import { ACTIONS } from "../../state/actions"
import { get_all_annotation_ids_owned_by_user } from "../../state/annotations/getters"

import { State } from "../../state/state"
import { get_store } from "../../state/store"
import { connect } from "../../utils/preact-redux-simple/connect"



interface OwnProps {}


const map_state = (state: State) => ({
    any_selected_annotations: state.selected_annotations.selected_compound_ids.length > 0,
})
type Props = ReturnType<typeof map_state> & OwnProps
const connector = connect(map_state)



function _ClearSelectionButton (props: Props)
{
    const disabled = !props.any_selected_annotations
    const fill = disabled ? "#aaa" : "#000"


    return <div>
        <button
            disabled={disabled}
            title="Clear all selected annotations"
            onClick={() =>
            {
                get_store().dispatch(ACTIONS.selected_annotations.set_selected_ids({
                    selected_compound_ids: [],
                }))
            }}
        >
            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" style={{ width: 20, fill }}>
                <path d="M3 2h18v2H3zm0 18h18v2H3zm0-6h3v2H3zm15 0h3v2H18zm-15-6h3v2H3zm15 0h3v2H18z M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                {/* <path d="M3 14h3v2H3zm15 0h3v2H18zm-15-6h3v2H3zm15 0h3v2H18z M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path> */}
            </svg>
        </button>
    </div>
}

export const ClearSelectionButton = connector(_ClearSelectionButton)
