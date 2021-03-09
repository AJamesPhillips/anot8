import { h } from "preact"

import { get_url_to_write_file_annotations } from "../../state/loading/getters"
import { State } from "../../state/state"
import { connect } from "../../utils/preact-redux-simple/connect"



const map_state = (state: State) => ({
    ready: state.annotations.status !== "not ready",
    loading: state.annotations.status === "loading",
    saved: state.annotations.status === "saved",
    saving: state.annotations.status === "saving",
    errored: state.annotations.status === "error",
    annotations_count: state.annotations.all_annotations.length,
    url_to_write_file_annotations: get_url_to_write_file_annotations(state),
    unsupported_schema_version: state.annotations.unsupported_schema_version,
})
type Props = ReturnType<typeof map_state>
const connector = connect(map_state)


function _AutoSave (props: Props)
{
    const {
        ready, loading, saving, saved, errored, annotations_count,
        url_to_write_file_annotations, unsupported_schema_version,
    } = props

    if (!ready || loading) return null

    if (!url_to_write_file_annotations)
    {
        return <div>
            <span style="background-color: yellow;">⚠</span> Saving not enabled. Must <a href="https://github.com/centerofci/anot8">run locally</a>.
        </div>
    }
    else if (unsupported_schema_version)
    {
        return <div>
            <span style="background-color: yellow;">⚠</span> Saving not enabled. Version of annotations file is not supported.
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
    else if (errored)
    {
        return <div>Errored</div>
    }
    else
    {
        return <div>Loaded ({annotations_count})</div>
    }
}

export const AutoSave = connector(_AutoSave)
