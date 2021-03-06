import { h, FunctionComponent, Component } from "preact"

import { State } from "../../state/state"
import { get_store } from "../../state/store"


const store = get_store()



export function connect <MappedState> (map_state: (state: State) => MappedState)
{
    function connector <OwnProps> (ComponentToWrap: FunctionComponent<MappedState & OwnProps>)
    {
        return class WrappedComponent extends Component<OwnProps, MappedState>
        {
            constructor(props: OwnProps)
            {
                super(props)
                this.setState(map_state(store.getState()))

                store.subscribe(() => {
                    this.setState(map_state(store.getState()))
                })
            }

            render ()
            {
                return <ComponentToWrap {...this.props} {...this.state} />
            }
        }
    }

    return connector
}
