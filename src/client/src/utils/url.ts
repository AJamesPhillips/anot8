


type SearchObject = { [key: string]: undefined | string }


export function parse_location_search ()
{
    const query = window.location.search.substring(1)
    const obj: SearchObject = {}

    if (query)
    {
        query.split("&").forEach(key_var => {
            // Allows for parsing parameters where there is a URL which itself has parameters in it like:
            // https://anot8.org/r/?url=https://example.com/serve_file?id=123
            const index_of_equals = key_var.indexOf("=")
            if (index_of_equals === -1) return

            const key = key_var.slice(0, index_of_equals)
            const _var = key_var.slice(index_of_equals + 1)
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
