import { parse_location_path } from "../utils/location"
import { State } from "./state"



export function get_starting_state (): State
{
    return {
        routing: parse_location_path()
    }
}
