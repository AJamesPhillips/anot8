

export interface RoutingState
{
    naming_authority: string
    vault_id: string
    file_id: string
    relative_file_path: string | undefined
}


export type LoadingStatus = "not ready" | "resolving" | "loading" | "downloaded" | "errored"
export type LoadingStage = "resolve_naming_authority_url" | "resolve_vault_url" | "resolve_pdf_file_url" | "pdf_file" | "annotations_file"
export type LoadingErrorType = "404" | "other"
export interface LoadingState
{
    status: LoadingStatus
    downloading_file_name: string | undefined
    loading_stage: undefined | LoadingStage
    loading_error_type: undefined | LoadingErrorType

    vault_config_loaded: boolean
    labels: string[]
    publish_root_path: string | undefined

    resolved_relative_file_path: string | undefined
}



export interface State
{
    routing: RoutingState
    running_locally: boolean
    override_naming_authority_server_url: string
    loading: LoadingState
}
