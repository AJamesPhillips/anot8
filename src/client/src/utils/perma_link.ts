import { State } from "../state/state"



export enum NoPermaLinkReason
{
    loading_from_url,
    no_pdf_specified,
    pdf_not_added_to_central_resolver,
}

export const get_anot8_perma_link = ({ routing }: State) =>
{
    const { naming_authority, vault_id, file_id, url } = routing

    let anot8_perma_link = ""
    let no_perma_link_reason: NoPermaLinkReason | undefined = undefined

    if (!naming_authority || !vault_id || !file_id)
    {
        no_perma_link_reason = url ? NoPermaLinkReason.loading_from_url : NoPermaLinkReason.no_pdf_specified
    }
    else if (naming_authority === "-1" || vault_id === "-1" || file_id === "-1")
    {
        no_perma_link_reason = NoPermaLinkReason.pdf_not_added_to_central_resolver
    }
    else
    {
        anot8_perma_link = `https://anot8.org/r/${naming_authority}.${vault_id}/${file_id}`
    }

    return { anot8_perma_link, no_perma_link_reason }
}
