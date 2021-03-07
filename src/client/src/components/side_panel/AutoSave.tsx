import { h } from "preact"

import { get_all_annotations } from "../../state/annotations/getters"
import { get_url_to_write_file_annotations } from "../../state/loading/getters"
import { State } from "../../state/state"
import { connect } from "../../utils/preact-redux-simple/connect"



const map_state = (state: State) => ({
    ready: state.annotations.status !== "not ready",
    loading: state.annotations.status === "loading",
    saved: state.annotations.status === "saved",
    saving: state.annotations.status === "saving",
    annotations_count: get_all_annotations(state).length,
    url_to_write_file_annotations: get_url_to_write_file_annotations(state),
})
type Props = ReturnType<typeof map_state>
const connector = connect(map_state)


function _AutoSave (props: Props)
{
    const { ready, loading, saved, saving, annotations_count, url_to_write_file_annotations } = props

    if (!ready || loading) return null

    if (!url_to_write_file_annotations)
    {
        return <div>
            <span style="background-color: yellow;">⚠</span> Saving not enabled. Must <a href="https://github.com/centerofci/anot8">run locally</a>.
        </div>
    }
    else if (saving)
    {
        return <div>Auto saving...</div>
    }
    else if (saved)
    {
        return <div>Saved ({annotations_count})</div>
    }
    else
    {
        return <div>Loaded ({annotations_count})</div>
    }
}

export const AutoSave = connector(_AutoSave)
