


export function parse_location_search ()
{
    const query = window.location.search.substring(1)
    const vars: { [key: string]: undefined | string } = {}

    if (query)
    {
        query.split("&").forEach(key_var => {
            const [key, _var] = key_var.split("=")
            vars[decodeURIComponent(key)] = decodeURIComponent(_var)
        })
    }

    return vars
}
