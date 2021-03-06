import { h } from "preact"
import { State } from "../state/state"
import { connect } from "../utils/preact-redux-simple/connect"



interface OwnProps {}


const map_state = (state: State) => ({ ...state.loading, ...state.routing })
type Props = ReturnType<typeof map_state> & OwnProps
const connector = connect(map_state)


function _LoadingProgress (props: Props)
{
    const { status } = props

    if (status === "not ready") return <div>Starting...</div>

    if (status === "loading") return <div>Downloading PDF...</div>

    if (status === "downloaded") return <div>Downloaded PDF.  Rendering...</div>

    if (status === "errored")
    {
        const {
            loading_stage: stage,
            loading_error_type: error_during_loading__type,
            naming_authority,
            vault_id,
            file_id,
        } = props

        let error_message = ""

        if (error_during_loading__type === "404")
        {
            if (stage === "resolve_naming_authority_url")
            {
                error_message = `naming authority "${naming_authority}" not found`
            }
            else if (stage === "resolve_vault_url")
            {
                error_message = `vault id "${vault_id}" not found`
            }
            else if (stage === "resolve_pdf_file_url")
            {
                error_message = `No relative file path found for file id "${file_id}"`
            }
        }

        return <div>Error: {error_message}</div>
    }
}

export const LoadingProgress = connector(_LoadingProgress)
