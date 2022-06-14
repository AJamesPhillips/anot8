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
    user_name: state.user.user_name,
    safe_user_name: state.user.safe_user_name,
    running_locally: state.running_locally,
})
type Props = ReturnType<typeof map_state>
const connector = connect(map_state)



function _AnnotationDetails (props: Props)
{
    const { annotations, user_name, safe_user_name } = props

    const annotation = annotations[0]

    if (!annotation)
    {
        return <div>No annotations selected</div>
    }
    else if (annotations.length > 1)
    {
        return <div>Multiple annotations selected</div>
    }
    else
    {
        const on_change = (changes: Partial<Annotation>) =>
        {
            const edited_annotation = {
                ...annotation,
                ...changes,
            }
            get_store().dispatch(ACTIONS.annotations.edit_annotation({ annotation: edited_annotation }))
        }

        let disabled = ""
        if (!props.running_locally && !annotation.temporary)
        {
            disabled = "To edit this annotation please run the local anot8 server."
        }

        if (annotation.safe_user_name !== safe_user_name)
        {
            if (disabled) disabled += "  "
            disabled += `You can only edit your own annotations.  You are: "${user_name}", this annotation was created by: "${annotation.user_name}".  Change to this user to edit this annotation.`
        }

        return <AnnotationDetailsForm
            disabled={disabled}
            text={annotation.text}
            comment={annotation.comment}
            on_change={on_change}
        />
    }
}

export const AnnotationDetails = connector(_AnnotationDetails)
