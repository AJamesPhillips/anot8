import { h } from "preact"

import { ClearSelectionButton } from "./ClearSelectionButton"
import { DeleteButton } from "./DeleteButton"
import { SelectAllButton } from "./SelectAllButton"



export function AnnotationActions (props: {})
{
    return <div style={{ display: "flex", flexDirection: "column" }}>
        <DeleteButton />
        <SelectAllButton />
        <ClearSelectionButton />
    </div>
}
