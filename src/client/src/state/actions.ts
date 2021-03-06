import { safe_merge } from "../utils/object"
import { loading_actions } from "./loading/actions"
import { label_actions } from "./labels/actions"



export const ACTIONS = safe_merge(
    loading_actions,
    label_actions,
)
