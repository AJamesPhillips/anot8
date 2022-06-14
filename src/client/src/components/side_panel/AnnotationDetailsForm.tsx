import { h } from "preact"
import { useState } from "preact/hooks"

import { Annotation } from "../../state/interfaces"



interface Props
{
    disabled: string
    text: string
    comment: string
    on_change: (changes: Partial<Annotation>) => void
}
export function AnnotationDetailsForm (props: Props)
{
    const [text, set_text] = useState(props.text)
    const [comment, set_comment] = useState(props.comment)

    return <div title={props.disabled}>
        Text: <input
            disabled={!!props.disabled}
            className={props.disabled ? "disabled_input_text" : ""}
            type="text"
            id="annotation_text"
            value={props.text}
            onChange={e => set_text(e.currentTarget.value)}
            onBlur={() => props.on_change({ text, comment })}
        />
        <br/>
        Comment: <input
            disabled={!!props.disabled}
            className={props.disabled ? "disabled_input_text" : ""}
            type="text"
            id="annotation_comment"
            value={props.comment}
            onChange={e => set_comment(e.currentTarget.value)}
            onBlur={() => props.on_change({ text, comment })}
        />
    </div>
}
