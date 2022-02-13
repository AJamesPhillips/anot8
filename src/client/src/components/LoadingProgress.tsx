import { h } from "preact"
import { useState } from "preact/hooks"
import { LoadingStage, State } from "../state/state"
import { connect } from "../utils/preact-redux-simple/connect"



interface OwnProps {}


const map_state = (state: State) => ({
    //
    loading_status: state.loading_pdf.status,
    stage: state.loading_pdf.loading_stage,
    error_during_loading__type: state.loading_pdf.loading_error_type,
    //
    rendering_status: state.rendering_pdf.status,
    max_pages: state.rendering_pdf.max_pages,
    page_number: state.rendering_pdf.last_rendered_page_number,
    //
    naming_authority: state.routing.naming_authority,
    vault_id: state.routing.vault_id,
    file_id: state.routing.file_id,
})
type Props = ReturnType<typeof map_state> & OwnProps
const connector = connect(map_state)


function _LoadingProgress (props: Props)
{
    const [visibility, set_visibility] = useState(true)
    if (!visibility) return null

    const { loading_status, rendering_status, max_pages, page_number } = props

    if (loading_status === "not ready" || loading_status === "resolving") return <div>Starting...</div>

    if (loading_status === "resolved") return <div>Downloading PDF...</div>

    if (loading_status === "downloaded")
    {
        if (rendering_status === "finished")
        {
            if (page_number === max_pages) setTimeout(() => {
                set_visibility(false)
            }, 500)
        }

        if (max_pages === undefined || page_number === undefined) return <div>Downloaded PDF.  Rendering...</div>

        const progress = ((page_number / max_pages) * 100).toFixed(0)
        return <div>Progress: {progress}%</div>
    }


    // if (status === "errored")
    const {
        stage,
        error_during_loading__type,
        naming_authority,
        vault_id,
        file_id,
    } = props

    let error_message = ""

    if (error_during_loading__type === "404")
    {
        if (stage === LoadingStage.resolve_naming_authority_url)
        {
            error_message = `naming authority "${naming_authority}" not found`
        }
        else if (stage === LoadingStage.resolve_vault_url)
        {
            error_message = `vault id "${vault_id}" not found`
        }
        else if (stage === LoadingStage.resolve_pdf_file_url)
        {
            error_message = `No relative file path found for file id "${file_id}"`
        }
    }

    return <div>Error: {error_message}</div>
}

export const LoadingProgress = connector(_LoadingProgress)
