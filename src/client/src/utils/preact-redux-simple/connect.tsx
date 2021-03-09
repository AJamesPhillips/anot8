import { h, FunctionComponent, Component } from "preact"
import { Unsubscribe } from "redux"

import { State } from "../../state/state"
import { get_store } from "../../state/store"


const store = get_store()


export function connect <MappedState, OwnProps> (map_state: (state: State, own_props: OwnProps) => MappedState)
{
    function connector (ComponentToWrap: FunctionComponent<MappedState & OwnProps>)
    {
        return class WrappedComponent extends Component<OwnProps, MappedState>
        {
            private unsubscribe: Unsubscribe

            constructor(own_props: OwnProps)
            {
                super(own_props)
                this.setState(map_state(store.getState(), own_props))

                this.unsubscribe = store.subscribe(() => {
                    this.setState(map_state(store.getState(), own_props))
                })
            }

            componentWillUnmount ()
            {
                this.unsubscribe()
            }

            shouldComponentUpdate (next_props: Readonly<OwnProps>, next_state: Readonly<MappedState>)
            {
                const prop_keys = Object.keys(this.props)
                const state_keys = Object.keys(this.state)
                const nprop_keys = Object.keys(next_props)
                const nstate_keys = Object.keys(next_state)

                let should_update = false

                if (prop_keys.length !== nprop_keys.length || state_keys.length !== nstate_keys.length) return true

                const change_in_props = prop_keys.find(k => (this.props as any)[k] !== (next_props as any)[k])
                if (change_in_props) return true

                const change_in_state = state_keys.find(k => (this.state as any)[k] !== (next_state as any)[k])
                if (change_in_state) return true

                return should_update
            }

            render ()
            {
                return <ComponentToWrap {...this.props} {...this.state} />
            }
        }
    }

    return connector
}
