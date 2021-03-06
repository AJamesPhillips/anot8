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

            render ()
            {
                return <ComponentToWrap {...this.props} {...this.state} />
            }
        }
    }

    return connector
}
