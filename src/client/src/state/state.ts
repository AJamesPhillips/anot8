

interface RoutingState
{
    naming_authority: string
    vault_id: string
    file_id: string
}



export interface State
{
    routing: RoutingState
}
