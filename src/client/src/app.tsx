import { h } from "preact"

import { connect } from "./utils/preact-redux-simple/connect"
import { State } from "./state/state"



interface OwnProps {}


const map_state = (state: State) => ({ ...state.loading })
const connector = connect(map_state)
type Props = ReturnType<typeof map_state> & OwnProps


function _App (props: Props)
{
    return <div>Hello {props.status}</div>
}


export const App = connector(_App)
