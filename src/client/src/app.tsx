import { ComponentClass, h } from "preact"

import { connect } from "./preact-redux-simple/connect"
import { State } from "./state/state"



interface OwnProps {}


const map_state = (state: State) => ({
    ...state.routing,
})

const connector = connect(map_state)
type Props = ReturnType<typeof map_state> & OwnProps


function _App (props: Props)
{
    console.log("asd")

    return <div>Hello {props.naming_authority}</div>
}


export const App = connector(_App) as ComponentClass<OwnProps>
