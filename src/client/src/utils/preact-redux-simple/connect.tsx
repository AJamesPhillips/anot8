import { h, FunctionComponent, Component } from "preact"
import { Unsubscribe } from "redux"

import { State } from "../../state/state"
import { get_store } from "../../state/store"


const store = get_store()



export function connect <MappedState> (map_state: (state: State) => MappedState)
{
    function connector <OwnProps> (ComponentToWrap: FunctionComponent<MappedState & OwnProps>)
    {
        return class WrappedComponent extends Component<OwnProps, MappedState>
        {
            private unsubscribe: Unsubscribe

            constructor(props: OwnProps)
            {
                super(props)
                this.setState(map_state(store.getState()))

                this.unsubscribe = store.subscribe(() => {
                    this.setState(map_state(store.getState()))
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
