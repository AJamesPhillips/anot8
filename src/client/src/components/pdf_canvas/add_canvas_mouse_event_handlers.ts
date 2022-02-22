import { Store } from "redux"

import { ACTIONS } from "../../state/actions"
import { next_annotation_id_for_user } from "../../state/annotations/getters"
import { get_compound_id } from "../../state/annotations/utils"
import { Annotation } from "../../state/interfaces"
import { State } from "../../state/state"
import { get_element_position } from "../../utils/screen"
import { create_empty_annotation_el } from "../annotations_on_pdf/AnnotationOnPDF"



interface AddCanvasPointerEventHandlersArgs
{
    store: Store<State>
    canvas: HTMLCanvasElement
    annotations_container_el: HTMLElement
    page_number: number
}
export function add_canvas_pointer_event_handlers ({ store, canvas, annotations_container_el, page_number }: AddCanvasPointerEventHandlersArgs)
{
    const {
        pointer_down_handler,
        pointer_moved_handler,
        pointer_up_handler,
    } = create_pointer_handlers({ annotations_container_el, page_number })

    let editing_on_this_canvas = false
    let left: number
    let top: number

    canvas.onpointerdown = function (e)
    {
        editing_on_this_canvas = true

        const position = get_element_position(canvas)
        left = position.left
        top = position.top

        const pages_container_scroll_left = document.getElementById("pages_container")?.scrollLeft ?? 0

        const x = e.clientX - left + document.body.scrollLeft + pages_container_scroll_left
        const y = e.clientY - top + document.body.scrollTop

        pointer_down_handler({ x, y })
    }

    canvas.onpointermove = function (e)
    {
        if (!editing_on_this_canvas) return

        const pages_container_scroll_left = document.getElementById("pages_container")?.scrollLeft ?? 0

        const x = e.clientX - left + document.body.scrollLeft + pages_container_scroll_left
        const y = e.clientY - top + document.body.scrollTop
        pointer_moved_handler({ x, y })
    }

    canvas.onpointerup = function (e)
    {
        if (!editing_on_this_canvas) return
        editing_on_this_canvas = false

        const pages_container_scroll_left = document.getElementById("pages_container")?.scrollLeft ?? 0

        const x = e.clientX - left + document.body.scrollLeft + pages_container_scroll_left
        const y = e.clientY - top + document.body.scrollTop
        const partial_annotation = pointer_up_handler({ x, y })

        if (partial_annotation)
        {
            const new_annotation = complete_annotation(store.getState(), partial_annotation)
            store.dispatch(ACTIONS.annotations.create_annotation({ new_annotation }))
        }
    }
}



interface Point
{
    x: number
    y: number
}



interface CreatePointerHandlersArgs
{
    annotations_container_el: HTMLElement
    page_number: number
}
function create_pointer_handlers ({ annotations_container_el, page_number }: CreatePointerHandlersArgs)
{
    let highlight_start_x: number
    let highlight_start_y: number
    let highlight_end_x: number
    let highlight_end_y: number
    let temp_annotation_el: undefined | HTMLElement

    function reset ()
    {
        if (temp_annotation_el) temp_annotation_el.remove()

        highlight_start_x = 0
        highlight_start_y = 0
        highlight_end_x = 0
        highlight_end_y = 0
        temp_annotation_el = undefined
    }

    function pointer_down_handler ({ x, y }: Point)
    {
        reset()

        temp_annotation_el = create_empty_annotation_el({ annotations_container_el })

        highlight_start_x = highlight_end_x = x
        highlight_start_y = highlight_end_y = y
        update_temp_annotation_el()
    }


    function pointer_moved_handler ({ x, y }: Point)
    {
        highlight_end_x = x
        highlight_end_y = y
        valid_annotation_size()
            ? temp_annotation_el!.classList.remove("invalid")
            : temp_annotation_el!.classList.add("invalid")
        update_temp_annotation_el()
    }


    function pointer_up_handler ({ x, y }: Point): Annotation | undefined
    {
        highlight_end_x = x
        highlight_end_y = y
        update_temp_annotation_el()

        const el = temp_annotation_el!

        let partial_annotation: Annotation | undefined = undefined

        if (valid_annotation_size())
        {
            partial_annotation = {
                page_number,
                left: el.style.left,
                top: el.style.top,
                width: el.style.width,
                height: el.style.height,
                colour: window.getComputedStyle(el).backgroundColor,
                text: "",
                labels: [],
                comment: "",

                // incomplete fields
                id: -1,
                user_name: "",
                safe_user_name: "",
                compound_id: "",
            }
        }

        reset()

        return partial_annotation
    }


    function update_temp_annotation_el ()
    {
        if (!temp_annotation_el) return

        const { width, height } = calc_size()

        temp_annotation_el.style.left = str(width < 0 ? highlight_start_x + width : highlight_start_x)
        temp_annotation_el.style.width = str(width < 0 ? -width : width)

        temp_annotation_el.style.top = str(height < 0 ? highlight_start_y + height : highlight_start_y)
        temp_annotation_el.style.height = str(height < 0 ? -height : height)
    }


    const MIN_SIZE = 10

    function valid_annotation_size ()
    {
        const { width, height } = calc_size()

        return Math.abs(width) >= MIN_SIZE && Math.abs(height) >= MIN_SIZE
    }


    function calc_size ()
    {
        const width = highlight_end_x - highlight_start_x
        const height = highlight_end_y - highlight_start_y

        return { width, height }
    }


    function str (num: number) { return num.toString() }


    return {
        pointer_down_handler,
        pointer_moved_handler,
        pointer_up_handler,
    }
}



function complete_annotation (state: State, annotation: Annotation): Annotation
{
    const { user_name, safe_user_name } = state.user
    const id = next_annotation_id_for_user(state, safe_user_name)
    const compound_id = get_compound_id({ id, safe_user_name })

    return {
        ...annotation,
        id,
        user_name,
        safe_user_name,
        compound_id,
    }
}
