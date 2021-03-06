import { LoadingState } from "../state"



export function get_starting_loading_state (): LoadingState
{
    return {
        status: "not ready",
        downloading_file_name: undefined,
        loading_stage: undefined,
        loading_error_type: undefined,

        vault_config_loaded: false,
        labels: [],
        publish_root_path: undefined,

        resolved_relative_file_path: undefined,
    }
}
