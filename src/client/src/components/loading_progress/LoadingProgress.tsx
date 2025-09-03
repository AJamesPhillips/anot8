import { h } from "preact"
import { useRef, useState } from "preact/hooks"
import { LoadingStage, State } from "../../state/state"
import { connect } from "../../utils/preact-redux-simple/connect"
import { SetPDF_URL_or_DOI } from "./SetPDF_URL_or_DOI"



interface OwnProps {}


const map_state = (state: State) => ({
    //
    initialising_error: !!state.errors.error,
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

    const { initialising_error, loading_status, rendering_status, max_pages, page_number } = props

    if (initialising_error) return <div>
        Page error.  Please file a big report on <a href="https://github.com/centerofci/anot8/issues">GitHub</a>
    </div>

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
        return <div>Rendering page {page_number} / {max_pages} ({progress}%)</div>
    }


    // if (status === "errored")
    const {
        stage,
        error_during_loading__type,
        naming_authority,
        vault_id,
        file_id,
    } = props

    if (error_during_loading__type === "422")
    {
        if (stage === LoadingStage.analysing_location_path)
        {
            return <SetPDF_URL_or_DOI />
        }
    }

    let error_message: string | h.JSX.Element = "Unknown error"

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


    if (error_during_loading__type === "403" && stage === LoadingStage.fetch_pdf_by_proxy)
    {
        error_message = <div>
            Anot8 PDF proxy has encountered an error.  Please <a href="https://github.com/centerofci/anot8/issues/new?title=403%20error%20from%20PDF%20proxy">report it here</a>.
            <br />
            <br />
        </div>
    }


    return <div>Error: {error_message}</div>
}

export const LoadingProgress = connector(_LoadingProgress)
