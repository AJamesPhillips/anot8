
interface MemoizeOptions<A, R>
{
    // bust_cache?: (current_cache: Cache<A, R>, new_args :A) => boolean,
    cache_limit?: number
    name?: string
}

type Cache <A, R> = CacheEntry<A, R>[]

interface CacheEntry<A, R>
{
    args: A
    result: R
}

export function memoize <A extends any[], R> (func: (...args: A) => R, opts: MemoizeOptions<A, R> = {}): (...args: A) => R
{
    const {
        cache_limit = 1,
        name = func.name,
    } = opts

    let cache: Cache<A, R> = []

    function in_cache (args_new: A)
    {
        return cache.find(cache_entry =>
            {
                let matches_all = true

                if (args_new.length !== cache_entry.args.length) return false

                cache_entry.args.forEach((cached_arg, index) => matches_all = matches_all && cached_arg === args_new[index])

                return matches_all
            })
    }

    return (...args: A) =>
    {
        const cached_hit = in_cache(args)
        if (cached_hit)
        {
            // console. log(`Cache hit "${name}"`)
            return cached_hit.result
        }
        // console. log(`Cache miss "${name}"`)

        const new_result = func(...args)

        cache.push({ args, result: new_result })
        cache = cache.slice(-cache_limit)

        return new_result
    }
}
