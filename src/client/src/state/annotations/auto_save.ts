import { Store } from "redux"
import { ACTIONS } from "../actions"

import { AnnotationsFile, MaybeAnnotation } from "../interfaces"
import { get_url_to_write_file_annotations } from "../loading/getters"
import { State } from "../state"



export function auto_save (store: Store<State>)
{
    let annotations: MaybeAnnotation[]

    store.subscribe(() =>
    {
        const state = store.getState()

        const { user_name, safe_user_name } = state.user
        const current_annotations = state.annotations.annotations_by_safe_user_name[safe_user_name] || []

        if (current_annotations === annotations) return

        if (!current_annotations.find(({ dirty }) => dirty))
        {
            annotations = current_annotations
            return
        }

        post_annotations_to_server(store, current_annotations, user_name)
        .then(annotations_file =>
        {
            store.dispatch(ACTIONS.annotations.got_annotations_file({ annotations_file, user_name, overwrite: true }))
        })
    })
}


let consecutive_server_errors = 0
function post_annotations_to_server (store: Store<State>, annotations: MaybeAnnotation[], user_name: string)
{
    if (consecutive_server_errors)
    {
        console.log(`Not saving ${annotations.length} annotations to server due to previous error`)
        return Promise.reject("previous errors encountered")
    }

    const state = store.getState()
    const url_to_write_file_annotations = get_url_to_write_file_annotations(state)

    if (!url_to_write_file_annotations)
    {
        console.log(`Not saving ${annotations.length} annotations to server as no end point to save against`)
        return Promise.reject("no endpoint set")
    }


    console.log(`Saving ${annotations.length} annotations to server for user: "${user_name}"`)

    const data_to_send = JSON.stringify({ user_name, annotations })
    return fetch(url_to_write_file_annotations, {
        // credentials: "same-origin",
        mode: "cors",
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: data_to_send,
    })
    .then(resp => {
        if (resp.status === 200) {
            return resp.json() as Promise<AnnotationsFile>
        } else {
            consecutive_server_errors += 1
            return Promise.reject("server error")
        }
    })
}