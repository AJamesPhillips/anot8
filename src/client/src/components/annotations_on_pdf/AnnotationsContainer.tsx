import { h } from "preact"
import { get_annotation_ids_for_page } from "../../state/annotations/getters"

import { State } from "../../state/state"
import { connect } from "../../utils/preact-redux-simple/connect"
import { AnnotationOnPDF } from "./AnnotationOnPDF"



interface OwnProps {
    page_number: number
}


const map_state = (state: State, own_props: OwnProps) => ({
    annotation_ids: get_annotation_ids_for_page(state, own_props.page_number),
})
type Props = ReturnType<typeof map_state> & OwnProps
const connector = connect(map_state)



function _AnnotationsContainer (props: Props)
{
    const ids = props.annotation_ids.length ? props.annotation_ids.split(",") : []

    return <div>
        {ids.map(id => <AnnotationOnPDF key={id} compound_annotation_id={id} editing_dimensions={false} />)}
    </div>
}

export const AnnotationsContainer = connector(_AnnotationsContainer)
