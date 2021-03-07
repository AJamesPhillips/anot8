import { h } from "preact"
import { ACTIONS } from "../../state/actions"

import { get_selected_annotation } from "../../state/getters"
import { Annotation } from "../../state/interfaces"
import { State } from "../../state/state"
import { get_store } from "../../state/store"
import { connect } from "../../utils/preact-redux-simple/connect"
import { AnnotationDetailsForm } from "./AnnotationDetailsForm"



interface OwnProps {}


const map_state = (state: State, own_props: OwnProps) => ({
    annotation: get_selected_annotation(state),
})
type Props = ReturnType<typeof map_state>
const connector = connect(map_state)



function _AnnotationDetails (props: Props)
{
    const { annotation } = props

    if (annotation === "none")
    {
        return <div>No annotations selected</div>
    }
    else if (annotation === "multiple")
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
                dirty: true,
            }
            get_store().dispatch(ACTIONS.annotations.edit_annotation({ annotation: edited_annotation }))
        }

        return <AnnotationDetailsForm
            text={annotation.text}
            comment={annotation.comment}
            on_change={on_change}
        />
    }
}

export const AnnotationDetails = connector(_AnnotationDetails)
