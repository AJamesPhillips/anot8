


export function toggle_set_entry <S> (set: Set<S>, entry: S)
{
    if (set.has(entry)) set.delete(entry)
    else set.add(entry)
}
