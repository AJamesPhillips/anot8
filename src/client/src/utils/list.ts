


export function toggle_list_entry <S> (list: S[], entry: S)
{
    const new_list = list.filter(e => e !== entry)

    if (new_list.length === list.length) new_list.push(entry)

    return new_list
}
