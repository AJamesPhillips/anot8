import { MaybeAnnotation } from "./interfaces"



export interface AnnotationsState
{
    status: "not ready" | "loading" | "loaded" | "error" | "saved" | "saving"
    annotation_user_names: undefined | string[]
    main_annotations: undefined | MaybeAnnotation[]
}



export type LoadingStatus = "not ready" | "resolving" | "resolved" | "downloaded" | "errored"
export type LoadingStage = "resolve_naming_authority_url" | "resolve_vault_url" | "resolve_pdf_file_url" | "pdf_file"
export type LoadingErrorType = "404" | "other"
export interface LoadingPDFState
{
    status: LoadingStatus
    loading_stage: undefined | LoadingStage
    loading_error_type: undefined | LoadingErrorType

    vault_config_loaded: boolean
    labels: string[]
    publish_root_path: string | undefined

    resolved_relative_file_path: string | undefined
}



export interface RenderingPDFState
{
    status: "not started" | "rendering" | "finished"
    max_pages: undefined | number
    last_rendered_page_annotations_container: undefined | HTMLElement
    last_rendered_page_number: undefined | number
    last_rendered_page_canvas: undefined | HTMLCanvasElement
}



export interface RoutingState
{
    naming_authority: string
    vault_id: string
    file_id: string
    relative_file_path: string | undefined
}



export interface State
{
    annotations: AnnotationsState
    loading_pdf: LoadingPDFState
    override_naming_authority_server_url: string
    rendering_pdf: RenderingPDFState
    routing: RoutingState
    running_locally: boolean
}
