import { h } from "preact"
import { useEffect, useRef, useState } from "preact/hooks"
import { State } from "../../state/state"
import { connect } from "../../utils/preact-redux-simple/connect"



interface OwnProps {}


const map_state = (state: State) => ({
})
type Props = ReturnType<typeof map_state> & OwnProps
const connector = connect(map_state)


enum DisplayPhase
{
    _1_waiting_for_doi_or_url = 1,
    _2_waiting_for_unpaywall_email_address = 2,
    _3_searching_by_doi = 3,
    _4_have_doi_search_response = 4,
}

interface UnpaywallJSONErrorResponse
{
    HTTP_status_code: number
    error: boolean
    message: string
}
interface UnpaywallJSONSuccessResponse
{
    title: string
    published_date: string
    journal_name: string
    best_oa_location: {
        url_for_pdf: string
    }
}
type UnpaywallJSONResponse = UnpaywallJSONSuccessResponse & UnpaywallJSONErrorResponse


function _SetPDF_URL_or_DOI (props: Props)
{
    const [url_or_doi, set_url_or_doi] = useState("")
    const is_doi = !!(/^(10\.\d{4,5}\/[\S]+[^;,.\s])$/.exec(url_or_doi))
    const initial_render = useRef(true)

    const [display_phase, set_display_phase] = useState(DisplayPhase._1_waiting_for_doi_or_url)
    const [unpaywall_email_address, _set_unpaywall_email_address] = useState(get_unpaywall_email_address())
    const [unpaywall_json, set_unpaywall_json] = useState<UnpaywallJSONResponse | undefined>(undefined)

    useEffect(() =>
    {
        if (!url_or_doi) set_display_phase(DisplayPhase._1_waiting_for_doi_or_url)
    }, [url_or_doi])



    function load_pdf (url: string, doi?: string)
    {
        // We do not have to encode the url if it does not contain the "&" character
        const safe_url = url.includes("&") ? encodeURIComponent(url) : url

        let new_location = "url=" + safe_url
        if (doi) new_location = "doi=" + doi + "&" + new_location
        new_location = "/r/?" + new_location

        document.location.href = new_location
    }


    function set_unpaywall_email_address (email_address: string)
    {
        _set_unpaywall_email_address(email_address)
        localStorage.setItem(LOCAL_STORAGE_UNPAYWALL_EMAIL_ADDRESS_KEY, email_address)
    }


    async function search_unpaywall ()
    {
        set_display_phase(DisplayPhase._3_searching_by_doi)

        const start_search = performance.now()

        const response = await fetch(`https://api.unpaywall.org/v2/${url_or_doi}?email=${unpaywall_email_address}`)
        const json = await response.json()

        const delay = Math.max(2000 - (performance.now() - start_search), 0)

        setTimeout(() =>
        {
            set_unpaywall_json(json)
            set_display_phase(DisplayPhase._4_have_doi_search_response)
        }, delay)
    }


    const found_pdf_via_unpaywall = !!(unpaywall_json?.best_oa_location.url_for_pdf)


    function display_phase_to_class (dp: DisplayPhase)
    {
        if (dp < display_phase) return "section pre_hidden"
        if (dp === display_phase) return "section"
        return "section post_hidden"
    }


    return <div className="set_pdf_url_or_doi">
        Enter a URL or DOI of a PDF to annotate...

        <p>
            <input
                type="text"
                placeholder="Enter a URL or DOI"
                onInput={e => set_url_or_doi(e.currentTarget.value)}
                onBlur={e => set_url_or_doi(e.currentTarget.value)}
                ref={e =>
                {
                    if (!initial_render.current) return
                    initial_render.current = false
                    setTimeout(() => e && e.focus(), 0)
                }}
            />
        </p>

        <p
            className={display_phase_to_class(DisplayPhase._1_waiting_for_doi_or_url)}
            // style={{
            //     maxHeight: display_phase === DisplayPhase._1_waiting_for_doi_or_url ? 80 : 0,
            //     padding: display_phase === DisplayPhase._1_waiting_for_doi_or_url ? 20 : 0,
            // }}
        >
            <button
                disabled={!url_or_doi || is_doi}
                title={is_doi ? "Is a DOI not a URL" : ""}
                onClick={() => load_pdf(url_or_doi)}
            >
                Load PDF
            </button>
            &nbsp;
            <button
                disabled={!is_doi}
                title={is_doi ? "Is a URL not a DOI" : ""}
                onClick={() =>
                {
                    if (!unpaywall_email_address)
                    {
                        set_display_phase(DisplayPhase._2_waiting_for_unpaywall_email_address)
                        return
                    }

                    search_unpaywall()
                }}
            >
                Search unpaywall.org
            </button>

            <br />
            <br />

            <div
                style={{ color: "grey", cursor: "pointer" }}
                onClick={() =>
                {
                    set_display_phase(DisplayPhase._2_waiting_for_unpaywall_email_address)
                }}
            >
                <span style={{ color: "blue" }}>Edit</span> email address
            </div>
        </p>


        <p
            className={display_phase_to_class(DisplayPhase._2_waiting_for_unpaywall_email_address)}
            // style={{
            //     maxHeight: display_phase === DisplayPhase._2_waiting_for_unpaywall_email_address ? 140 : 0,
            //     padding: display_phase === DisplayPhase._2_waiting_for_unpaywall_email_address ? 20 : 0,
            // }}
        >
            Unpaywall <a href="https://unpaywall.org/products/api">needs an email address</a> to prevent abuse of their search function.

            <br />
            <br />

            <input
                type="text"
                style={{ width: 200 }}
                placeholder="Enter an email address for Unpaywall"
                value={unpaywall_email_address}
                onInput={e => set_unpaywall_email_address(e.currentTarget.value)}
                onBlur={e => set_unpaywall_email_address(e.currentTarget.value)}
                ref={e =>
                {
                    if (display_phase !== DisplayPhase._2_waiting_for_unpaywall_email_address) return
                    setTimeout(() => e && e.focus(), 0)
                }}
            />

            <br />
            <br />

            <button
                disabled={!is_doi || !unpaywall_email_address}
                onClick={() => search_unpaywall()}
            >
                Search Unpaywall.org
            </button>
        </p>


        <p
            className={display_phase_to_class(DisplayPhase._3_searching_by_doi)}
            style={{
                maxHeight: display_phase === DisplayPhase._3_searching_by_doi ? 100 : 0,
                padding: display_phase === DisplayPhase._3_searching_by_doi ? 20 : 0,
            }}
        >
            Searching Unpaywall using "{unpaywall_email_address}"...

            <br />
            <br />

            <div
                style={{ color: "grey", cursor: "pointer" }}
                onClick={() =>
                {
                    set_display_phase(DisplayPhase._2_waiting_for_unpaywall_email_address)
                }}
            >
                <span style={{ color: "blue" }}>Edit</span> email address
            </div>
        </p>


        <p
            className={display_phase_to_class(DisplayPhase._4_have_doi_search_response)}
            // style={{
            //     maxHeight: display_phase === DisplayPhase._4_have_doi_search_response ? 150 : 0,
            //     padding: display_phase === DisplayPhase._4_have_doi_search_response ? 20 : 0,
            // }}
        >
            {found_pdf_via_unpaywall ? "Success" : "Error"}

            <br />
            <br />

            <div
                style={{ color: found_pdf_via_unpaywall ? "black" : "#A00", cursor: "pointer" }}
            >
                {unpaywall_json?.message}
                {describe_article(unpaywall_json)}
            </div>

            <br />
            <br />

            <button
                onClick={() =>
                {
                    found_pdf_via_unpaywall
                        ? load_pdf(unpaywall_json?.best_oa_location.url_for_pdf!, url_or_doi)
                        : search_unpaywall()
                }}
            >
                {found_pdf_via_unpaywall ? "Load PDF in Anot8" : "Search Unpaywall.org"}
            </button>
        </p>

    </div>
}

export const SetPDF_URL_or_DOI = connector(_SetPDF_URL_or_DOI)



const LOCAL_STORAGE_UNPAYWALL_EMAIL_ADDRESS_KEY = "unpaywall_email_address"
function get_unpaywall_email_address ()
{
    return localStorage.getItem(LOCAL_STORAGE_UNPAYWALL_EMAIL_ADDRESS_KEY) || ""
}



function describe_article (unpaywall_json: UnpaywallJSONResponse | undefined)
{
    if (!unpaywall_json) return ""

    const {title, published_date, journal_name} = unpaywall_json

    let article_description = title

    if (published_date) article_description += (" - " + published_date)
    if (journal_name) article_description += (" in " + journal_name)

    return article_description
}
