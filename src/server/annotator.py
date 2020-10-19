from functools import wraps
import json
import os
import re
import sys

from flask import Flask, make_response, request, abort, jsonify, Response, redirect
import jinja2

from vault_config import get_vault_configs, get_vault_config_by_id
from id_mappings import (
    get_naming_authority,
    local_url,
    perma_url,
    upsert_file_perma_id_mapping,
    get_data_file_relative_file_path_for_id,
)
from anot8_org_config import upsert_perma_id_mappings_and_anot8_config, update_anot8_config
from common import supported_relative_file_path, anot8_org_config_dir_path
from annotations import upsert_meta_data_annotations_file


dir_path = os.path.dirname(os.path.realpath(__file__))
app = Flask(__name__)

upsert_perma_id_mappings_and_anot8_config()

@app.after_request
def add_header(response):
    # if "Cache-Control" not in response.headers:
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


@app.route("/")
def index ():
    vault_configs = get_vault_configs()

    html = """<h1>Welcome to your local annotations server</h1>
    See <a href="/vaults">list of ({}) vaults:</a>""".format(len(vault_configs))

    html += html_list_of_vaults(vault_configs)

    return html


@app.route("/vaults")
def vaults ():
    vault_configs = get_vault_configs()

    if not vault_configs:
        return "<h1>No vault configs</h1>"

    vault_html_links = "<h1>{} vault configs</h1>".format(len(vault_configs))
    vault_html_links += html_list_of_vaults(vault_configs)

    return vault_html_links


def html_list_of_vaults (vault_configs):
    vault_html_links = "<ul>"

    for vault_config in vault_configs.values():
        vault_html_links += "<li><a href=\"/vault/{vault_id}\">{vault_name}</a></li>".format(**vault_config)

    vault_html_links += "</ul>"

    return vault_html_links


def vault_config_from_id (func):

    @wraps(func)
    def decorated_function(vault_id):
        vault_config = None
        try:
            vault_config = get_vault_config_by_id(vault_id)
        except Exception as e:
            print(e)
            pass

        if not vault_config:
            return "<h1>Unknown vault id {}</h1>".format(jinja2.escape(vault_id)), 404

        return func(vault_id, vault_config)

    return decorated_function


@app.route("/vault/<vault_id>")
@vault_config_from_id
def vault_files (vault_id, vault_config):
    root_path = vault_config["root_path"]
    directories = vault_config["directories"]
    pdf_file_path_html_links = ""

    naming_authority = get_naming_authority() or -1

    for directory in directories:
        pdf_file_path_html_links += "<div>Directory: <span style=\"font-weight: bold;\">" + directory + "</span><br/>\n"

        file_names = os.listdir(root_path + directory)
        file_names.sort()

        for file_name in file_names:
            if not file_name.endswith(".pdf"):
                continue

            data_file_relative_file_path = directory + file_name

            url = local_url(vault_config, data_file_relative_file_path)
            pdf_file_path_html_links += "<a href=\"{url}\">{file_name}</a>".format(url=url, file_name=file_name)

            pdf_file_path_html_links += perma_link_html(vault_config, data_file_relative_file_path)

            pdf_file_path_html_links += "<br/>\n"

        pdf_file_path_html_links += "</div>\n"

    return pdf_file_path_html_links


def perma_link_html (vault_config, data_file_relative_file_path):
    if not get_naming_authority():
        return "&nbsp;&nbsp;&nbsp;No PermaLink yet"

    url = perma_url(vault_config, data_file_relative_file_path)
    if not url:
        return "&nbsp;&nbsp;&nbsp;No PermaLink yet"

    url_short = url.replace("https://", "")

    return "&nbsp;&nbsp;&nbsp;<a href=\"{url}\">{url_short}</a>\n".format(url=url, url_short=url_short)


# May retire this page
# @app.route("/render/<vault_id>")
# @vault_config_from_id
# def render_pdf (vault_id, vault_config):
#     relative_file_path = request.args.get("relative_file_path", None)

#     supported = supported_relative_file_path(vault_config, relative_file_path)
#     if not supported["supported"]:
#         return "<h1>Unknown relative_file_path {}</h1>".format(jinja2.escape(relative_file_path)), 404

#     with open(dir_path + "/../client/render_pdf.html", "r") as f:
#         html = f.read()

#     return html


@app.route("/serve_file/<vault_id>")
@vault_config_from_id
def serve_file (vault_id, vault_config):
    relative_file_path = request.args.get("relative_file_path", "")

    is_annotations = relative_file_path.endswith(".pdf.annotations")
    supported = supported_relative_file_path(vault_config, relative_file_path)
    allow = supported["supported"] or (supported["is_annotations"] and supported["supported_directory"])

    if not allow:
        return "<h1>Unknown relative_file_path {}</h1>".format(jinja2.escape(relative_file_path)), 404

    if relative_file_path.endswith(".pdf"):
        return serve_pdf_file(vault_config, relative_file_path)
    elif relative_file_path.endswith(".pdf.annotations"):
        return serve_pdf_annotations(vault_config, relative_file_path)


def serve_pdf_file (vault_config, relative_file_path):
    root_path = vault_config["root_path"]

    full_path = root_path + relative_file_path
    file_exists = os.path.isfile(full_path)
    if not file_exists:
        return "<h1>Unknown relative_file_path {}</h1>".format(jinja2.escape(relative_file_path)), 404

    with open(root_path + relative_file_path, "rb") as f:
        binary_pdf = f.read()

    response = make_response(binary_pdf)
    response.headers["Content-Type"] = "application/pdf"
    response.headers["Content-Disposition"] = "inline; filename={}.pdf".format(relative_file_path)
    return response


def serve_pdf_annotations (vault_config, annotations_relative_file_path):
    json_annotations = upsert_meta_data_annotations_file(vault_config, annotations_relative_file_path)
    upsert_file_perma_id_mapping(vault_config, annotations_relative_file_path)
    update_anot8_config(vault_config)

    return jsonify(json_annotations)


@app.route("/annotations/<vault_id>", methods = ["POST"])
@vault_config_from_id
def annotation (vault_id, vault_config):
    relative_file_path = request.args.get("relative_file_path", "")

    supported = supported_relative_file_path(vault_config, relative_file_path)
    if not supported["supported"]:
        return "<h1>Unknown relative_file_path {}</h1>".format(jinja2.escape(relative_file_path)), 404

    return update_annotations(vault_config, relative_file_path)


def update_annotations (vault_config, annotations_relative_file_path):
    meta_data = upsert_meta_data_annotations_file(vault_config, annotations_relative_file_path)
    upsert_file_perma_id_mapping(vault_config, annotations_relative_file_path)
    update_anot8_config(vault_config)
    root_path = vault_config["root_path"]

    #populate_data(vault_name)

    annotations = request.get_json()  # TODO validate this data

    # Racy but should be fine for single user
    for (i, annotation) in enumerate(annotations):
        annotation["id"] = i
        if "dirty" in annotation:
            del annotation["dirty"]
    meta_data["annotations"] = annotations

    # Racy but should be fine for single user
    with open(root_path + annotations_relative_file_path, "w") as f:
        json.dump(meta_data, f, indent=0, ensure_ascii=False)

    return json.dumps(annotations, ensure_ascii=False)


@app.route("/r/<naming_authority_and_vault_id>/<file_id>")
def perma_render_pdf (naming_authority_and_vault_id, file_id):
    [naming_authority_id, vault_id] = naming_authority_and_vault_id.split(".")

    # naming_authority = get_naming_authority()
    # if not naming_authority or naming_authority != naming_authority_id:
    #     return "Cannot support rendering PDFs from different naming authority {} vs {} (you)".format(naming_authority_id, naming_authority), 400

    vault_config = get_vault_config_by_id(vault_id)
    if not vault_config:
        return "Unknown vault id {}".format(vault_id), 404

    data_file_relative_file_path = get_data_file_relative_file_path_for_id(vault_config, file_id)
    if not data_file_relative_file_path:
        # fall back to `relative_file_path` query parameter
        relative_file_path = request.args.get("relative_file_path", "")
        if not relative_file_path:
            return "Unknown file id {} in vault {}".format(file_id, vault_id), 404

        supported = supported_relative_file_path(vault_config, relative_file_path)
        if not supported["supported"]:
            return "Unknown relative_file_path {}".format(jinja2.escape(relative_file_path)), 404

    render_pdf_on_resolver_page = True
    if render_pdf_on_resolver_page:
        with open(dir_path + "/../client/render_pdf.html", "r") as f:
            html = f.read()

        return html



    url = "/render/{vault_id}?".format(vault_id=vault_id)

    other_query_params = dict(request.args)
    other_query_params["relative_file_path"] = data_file_relative_file_path

    param_parts = []
    for (k, v) in other_query_params.items():
        param_parts.append("{k}={v}".format(k=k, v=v))

    url += "&".join(param_parts)

    return redirect(url, code=302)


# Note this is the ./anot8_org_config not the ./config
# Ideally this would be <naming_authority>.<vault_id> instead of / but we need to
# mirror what the static files in s3 will look like
@app.route("/config/<naming_authority>/<vault_id>.json")
def serve_vault_config(naming_authority, vault_id):
    config_file_path = anot8_org_config_dir_path + vault_id + ".json"
    with open(config_file_path, "r") as f:
        return f.read()

