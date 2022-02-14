import { h } from "preact"
import { get_url_to_file } from "../state/loading/getters"
import { State } from "../state/state"
import { get_anot8_perma_link, NoPermaLinkReason } from "../utils/perma_link"
import { connect } from "../utils/preact-redux-simple/connect"



const map_state = (state: State) => ({
    url_to_file: get_url_to_file(state),
    ...get_anot8_perma_link(state),
})
type Props = ReturnType<typeof map_state>
const connector = connect(map_state)


function _TopInfoPanel (props: Props)
{
    const { url_to_file, anot8_perma_link, no_perma_link_reason } = props
    if (!url_to_file) return null

    const reason = no_perma_link_reason === NoPermaLinkReason.loading_from_url ? "loading from URL"
        : "-1 present in part of link"

    const perma_link_elements = anot8_perma_link
        ? [<br/>, <a href={anot8_perma_link}>PermaLink: {anot8_perma_link}</a>]
        : [<br/>, <span style="color: grey; font-size: small;">PermaLink not available ({reason})</span>]

    return <div>
        {/* show raw link */}
        <a href={url_to_file}>Showing PDF from: {url_to_file}</a>
        {/* show perma link if available */}
        {perma_link_elements}
    </div>
}

export const TopInfoPanel = connector(_TopInfoPanel)
