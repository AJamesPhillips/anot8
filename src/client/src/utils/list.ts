


export function toggle_list_entry <S> (list: S[], entry: S)
{
    const new_list = list.filter(e => e !== entry)

    if (new_list.length === list.length) new_list.push(entry)

    return new_list
}



export function replace_entry<I> (existing: I[], entry: I, predicate: (element: I) => boolean, description: string)
{
    return replace_entries(existing, item => predicate(item) ? entry : item, description)
}



export function replace_entries<I> (existing: I[], replacer: (element: I) => I, description: string)
{
    return existing.map(item => replacer(item))
}



export function remove_entry <I> (list: I[], predicate: (i: I) => boolean): I[]
{
    return list.filter(i => !predicate(i))
}



export function ensure_entry_status <I> (list: I[], value: I, ensure_presence: boolean): I[]
{
    let result = list.filter(v => v !== value)
    const not_present = list.length === result.length
    if (not_present)
    {
        if (ensure_presence) result.push(value)
        else result = list // no not change return value
    }
    else
    {
        if (ensure_presence) result = list // no not change return value
    }

    return result
}
