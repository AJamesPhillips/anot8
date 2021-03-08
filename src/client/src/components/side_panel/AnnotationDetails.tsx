import { h } from "preact"
import { ACTIONS } from "../../state/actions"
import { get_all_selected_annotations } from "../../state/annotations/getters"

import { Annotation } from "../../state/interfaces"
import { State } from "../../state/state"
import { get_store } from "../../state/store"
import { connect } from "../../utils/preact-redux-simple/connect"
import { AnnotationDetailsForm } from "./AnnotationDetailsForm"



interface OwnProps {}


const map_state = (state: State, own_props: OwnProps) => ({
    annotations: get_all_selected_annotations(state),
    safe_user_name: state.user.safe_user_name,
})
type Props = ReturnType<typeof map_state>
const connector = connect(map_state)



function _AnnotationDetails (props: Props)
{
    const { annotations, safe_user_name } = props

    if (annotations.length === 0)
    {
        return <div>No annotations selected</div>
    }
    else if (annotations.length > 1)
    {
        return <div>Multiple annotations selected</div>
    }
    else
    {
        const annotation = annotations[0]

        const on_change = (changes: Partial<Annotation>) =>
        {
            const edited_annotation = {
                ...annotation,
                ...changes,
                dirty: true,
            }
            get_store().dispatch(ACTIONS.annotations.edit_annotation({ annotation: edited_annotation }))
        }

        return <AnnotationDetailsForm
            disabled={annotation.safe_user_name !== safe_user_name}
            text={annotation.text}
            comment={annotation.comment}
            on_change={on_change}
        />
    }
}

export const AnnotationDetails = connector(_AnnotationDetails)
