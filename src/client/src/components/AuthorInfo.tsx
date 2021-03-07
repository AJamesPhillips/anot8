import { h } from "preact"
import { useState } from "preact/hooks"

import { ACTIONS } from "../state/actions"
import { State } from "../state/state"
import { get_store } from "../state/store"
import { get_safe_user_name } from "../state/user/utils"
import { connect } from "../utils/preact-redux-simple/connect"



const map_state = (state: State) => ({
    user_name: state.user.user_name,
})
type Props = ReturnType<typeof map_state>
const connector = connect(map_state)



function _AuthorInfo (props: Props)
{
    const [editing, set_editing] = useState(false)
    const [user_name, set_user_name] = useState(props.user_name)

    if (editing)
    {
        return <div>
            <input
                type="text"
                ref={r => r && r.focus()}
                value={user_name}
                onKeyUp={e => set_user_name(e.currentTarget.value)}
                onBlur={() => {
                    get_store().dispatch(ACTIONS.user.set_user_name({ user_name }))
                    set_editing(false)
                }}
            ></input>
        <br />
        Will display as: {get_safe_user_name(user_name)}
        </div>
    }

    return <div onClick={() => set_editing(true)}>{props.user_name || "Set user name"}</div>
}

export const AuthorInfo = connector(_AuthorInfo)
