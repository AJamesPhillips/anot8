import { Action, AnyAction } from "redux"
import { VaultConfig } from "../interfaces"
import { LoadingStage, LoadingErrorType, LoadingStatus } from "../state"



interface UpdateLoadingStatusArgs
{
    status: LoadingStatus
    stage: LoadingStage
}
interface ActionUpdateLoadingStatus extends Action, UpdateLoadingStatusArgs {}

const update_loading_status_type = "update_loading_status"

const update_loading_status = (args: UpdateLoadingStatusArgs): ActionUpdateLoadingStatus =>
{
    return { type: update_loading_status_type, ...args }
}

export const is_update_loading_status = (action: AnyAction): action is ActionUpdateLoadingStatus => {
    return action.type === update_loading_status_type
}



interface ErrorDuringLoadingArgs
{
    error_stage: LoadingStage
    error_type: LoadingErrorType
}
interface ActionErrorDuringLoading extends Action, ErrorDuringLoadingArgs {}

const error_during_loading_type = "error_during_loading"

const error_during_loading = (args: ErrorDuringLoadingArgs): ActionErrorDuringLoading =>
{
    return { type: error_during_loading_type, ...args }
}

export const is_error_during_loading = (action: AnyAction): action is ActionErrorDuringLoading => {
    return action.type === error_during_loading_type
}



interface SetVaultConfigArgs
{
    config: VaultConfig
}
interface ActionSetVaultConfig extends Action, SetVaultConfigArgs {}

const set_vault_config_type = "set_vault_config"

const set_vault_config = (args: SetVaultConfigArgs): ActionSetVaultConfig =>
{
    return { type: set_vault_config_type, ...args }
}

export const is_set_vault_config = (action: AnyAction): action is ActionSetVaultConfig => {
    return action.type === set_vault_config_type
}



interface ResolvedRelativeFilePathArgs
{
    relative_file_path: string
}
interface ActionResolvedRelativeFilePath extends Action, ResolvedRelativeFilePathArgs {}

const resolved_relative_file_path_type = "resolved_relative_file_path"

const resolved_relative_file_path = (args: ResolvedRelativeFilePathArgs): ActionResolvedRelativeFilePath =>
{
    return { type: resolved_relative_file_path_type, ...args }
}

export const is_resolved_relative_file_path = (action: AnyAction): action is ActionResolvedRelativeFilePath => {
    return action.type === resolved_relative_file_path_type
}



export const loading_actions = {
    update_loading_status,
    error_during_loading,
    set_vault_config,
    resolved_relative_file_path,
}
