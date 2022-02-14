


type SearchObject = { [key: string]: undefined | string }


export function parse_location_search ()
{
    const query = window.location.search.substring(1)
    const obj: SearchObject = {}

    if (query)
    {
        query.split("&").forEach(key_val => {
            // Allows for parsing parameters where there is a URL which itself has parameters in it like:
            // https://anot8.org/r/?url=https://example.com/serve_file?id=123
            const index_of_equals = key_val.indexOf("=")
            if (index_of_equals === -1) return

            const key = key_val.slice(0, index_of_equals)
            const val = key_val.slice(index_of_equals + 1)
            if (!key) return

            obj[decodeURIComponent(key)] = decodeURIComponent(val)
        })
    }

    return obj
}



export function object_to_search_string (obj: SearchObject)
{
    const search = Object.keys(obj)
        .filter(key => obj[key])
        .map(key =>
        {
            const val = obj[key] || "" // type guard
            // Adding encodeURIComponent so that the `url` parameter value is encoded and the ? and & are preserved
            // Is there a good reason not to do this encoding?
            return `${key}=${encodeURIComponent(val)}`
        })
    const search_string = (search.length ? "?" : "") + search.join("&")

    return search_string
}
