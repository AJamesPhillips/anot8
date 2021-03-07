import { Annotation, MaybeAnnotation } from "./interfaces"



export type AnnotationsBySafeUserName = { [safe_user_name: string]: undefined | MaybeAnnotation[] }
export type AnnotationsByPageNumber = { [page_number: number]: undefined | Annotation[] }
export type AnnotationsByCompoundId = { [compound_id: string]: undefined | Annotation }
export interface AnnotationsState
{
    status: "not ready" | "loading" | "loaded" | "error" | "saved" | "saving"
    annotation_files_to_load: string[]
    annotation_files_loaded: string[]
    annotation_user_names: undefined | string[]
    // all the annotations
    annotations_by_safe_user_name: AnnotationsBySafeUserName
    // easier access of annotations
    annotations_by_page_number: AnnotationsByPageNumber
    all_annotations: Annotation[]
    annotations_by_compound_id: AnnotationsByCompoundId
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
    last_rendered_page_number: undefined | number
}



export interface RoutingState
{
    naming_authority: string
    vault_id: string
    file_id: string
    relative_file_path: string | undefined
}



export interface SelectedAnnotationsState
{
    selected_compound_ids: string[]
}



export interface UserState
{
    user_name: string
    safe_user_name: string
}



export interface State
{
    annotations: AnnotationsState
    loading_pdf: LoadingPDFState
    override_naming_authority_server_url: string
    rendering_pdf: RenderingPDFState
    routing: RoutingState
    running_locally: boolean
    selected_annotations: SelectedAnnotationsState
    user: UserState
}
