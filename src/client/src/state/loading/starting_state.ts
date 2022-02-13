import { LoadingPDFState, LoadingStatus } from "../state"



export function get_starting_loading_state (): LoadingPDFState
{
    return {
        status: LoadingStatus.not_ready,
        loading_stage: undefined,
        loading_error_type: undefined,

        vault_config_loaded: false,
        publish_root_path: undefined,

        resolved_relative_file_path: undefined,
    }
}
