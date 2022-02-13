


type SearchObject = { [key: string]: undefined | string }


export function parse_location_search ()
{
    const query = window.location.search.substring(1)
    const obj: SearchObject = {}

    if (query)
    {
        query.split("&").forEach(key_var => {
            const [key = "", _var = ""] = key_var.split("=")
            if (!key) return
            obj[decodeURIComponent(key)] = decodeURIComponent(_var)
        })
    }

    return obj
}



export function object_to_search_string (obj: SearchObject)
{
    const search = Object.keys(obj)
        .filter(key => obj[key])
        .map(key => `${key}=${/* encodeURIComponent */(obj[key])}`)
    const search_string = (search.length ? "?" : "") + search.join("&")

    return search_string
}
