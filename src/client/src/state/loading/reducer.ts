import { AnyAction } from "redux"

import { LoadingPDFState, State } from "../state"
import {
    is_error_during_loading,
    is_resolved_relative_file_path,
    is_set_vault_config,
    is_update_loading_status,
} from "./actions"



export function loading_reducer (state: State, action: AnyAction): State
{
    if (is_update_loading_status(action))
    {
        const loading: LoadingPDFState = {
            ...state.loading_pdf,
            status: action.status,
            loading_stage: action.stage,
        }
        state = { ...state, loading_pdf: loading }
    }


    if (is_error_during_loading(action))
    {
        const loading: LoadingPDFState = {
            ...state.loading_pdf,
            status: "errored",
            loading_stage: action.error_stage,
            loading_error_type: action.error_type,
        }
        state = { ...state, loading_pdf: loading }
    }


    if (is_set_vault_config(action))
    {
        const loading: LoadingPDFState = {
            ...state.loading_pdf,
            vault_config_loaded: true,
            labels: action.config.labels,
            publish_root_path: action.config.publish_root_path,
        }
        state = { ...state, loading_pdf: loading }
    }


    if (is_resolved_relative_file_path(action))
    {
        const loading: LoadingPDFState = {
            ...state.loading_pdf,
            status: "resolved", // action.status
            resolved_relative_file_path: action.relative_file_path,
        }
        state = { ...state, loading_pdf: loading }
    }


    return state
}
