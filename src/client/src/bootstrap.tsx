import {
    h,
    render,
    // createContext,
} from "preact"

import { App } from "./app"
// import { config_store } from "./state/store"



// const store = config_store()

const root_element = document.getElementById("pages_container")

render(<App />, root_element)

// const Provider = createContext(store).Provider

// render(<Provider value={store}><App /></Provider>, root_element)
