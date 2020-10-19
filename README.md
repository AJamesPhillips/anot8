
# File Annotations Server

* Serves PDFs and annotations meta data
* Allows creation of new annotations
* Renders:
* * PDFs
* * their annotations
* * highlighted annotations
* Can serve PDFs from local file system by relative file paths e.g. http://localhost:5003/render/vault_name?url=file://../../data/PDFs/134919.pdf&highlighted_annotation_ids=1,2
* TODO:
* * serve PDFs from websites e.g. http://localhost:5003/render/vault_name/?url=https://raw.githubusercontent.com/AJamesPhillips/SARS-CoV-2-testing-kit-validation-data/master/data/FDA-EUA/PDFs/134919.pdf&highlighted_annotation_ids=1,2


## Installation

    python3 -m venv venv
    . venv/bin/activate
    pip install -r requirements.txt


## Configure a new vault

    cp config/vault_template.json config/new_vault_name.json

Increase the `vault_id` by 1

### Specifying sources (directories) of PDFs

Edit the `directories` attribute to contain the directories of the files you want to annotate.  These can be absolute paths but we'd recommend using relative file paths.  Relative paths are relative to inside the top level directory so will typically start with `../`.  If you also set the `root_path` attribute then you can set the `directories` paths relative to this `root_path` instead.  This is preferable as when you sync files between different computers, if the directory subtree resides in a different root directory in the file system, then you only need to change the `root_path` config.

Specifying directories allows you to limit by whitelisting what files are available for the annotations server to serve.

### Specifying labels

Edit the `labels` attribute to be a list of strings.   e.g.

    "labels": ["label one", "another label"]


## Run local

    . venv/bin/activate
    export FLASK_APP=src/server/annotator.py && flask run --port=5003

## Feature examples for local server

### Show all annotation vaults

http://localhost:5003/vaults

### See PDFs coverd by a particular vault

Replace "vault_template" with your annotations vault name

http://localhost:5003/vault/vault_template

### View and annotating local PDFs

http://localhost:5003/render?vault=vault_template&file=visible_directory/example.pdf&highlighted_annotation_ids=1,2

### Priority labels

When annotating specific pieces of data it's helpful to priorities certain labels.  This can be done using:

`localStorage.setItem("priority_label_ids", JSON.stringify(["label one", "another label"]))`

## Feature examples for central resolving server

You can visit anot8.org/resolver and follow the instructions to allow it to find your local server.  It will store the information in that browsers local storage.  To get links to work for anyone you'll need to open a new issue here: https://github.com/AJamesPhillips/anot8.org/issues/new?title=Request%20for%20perma%20link%20name%20id to get a naming id and have it added to the anot8.org resolver.

Once set up the following features should also work:

<!--- TODO: -->
<!--- ### Show all annotation vaults -->
<!--- anot8.org/vaults -->

### See PDFs coverd by a particular vault

Replace "vault_template" with your annotations vault name



### View PDFs from remote server

anot8.org/r/?file=example.pdf&vault=https://raw.githubusercontent.com/AJamesPhillips/Annotator/config/vault_template

anot8.org resolver could be setup with `localstorage` state which maps vault of: "vault_template" to "https://raw.githubusercontent.com/AJamesPhillips/Annotator/config/vault_template".  So then this will also work:

anot8.org/r/?file=example.pdf&vault=vault_template

But it won't work for anyone else... so is pointless.

----

We could do something similar to doi.org and act as a central registry.  Then I have a naming authority on there.  And for now just hack it in javascript so it sees the following URL:

anot8.org/r/1772.1/2?h=1

It knows that 1772 naming authority: AJP
"AJP" knows .1 refers to the vault named "vault_template"
Asks "AJP" what item 2 refers to, AJP responds and says get: "https://raw.githubusercontent.com/AJamesPhillips/Annotator/example_pdfs/visible_directory/example_2.pdf"

So the render_pdf.html code loads that file.
It also loads that file + ".annotations" and highlights the annotation with id == 1


ID mappings

| ID               | From | To             |
| ---------------- | ---- | -------------- |
| Naming authority | 1772 | AJP            |
| Vault            | 1    | vault_template |
| Item             | 2    | https://raw.githubusercontent.com/AJamesPhillips/ Annotator/example_pdfs/visible_directory/example_2.pdf |

Local annotator script generates and updates mapping dictionary.

Example of mapping dictionary:

    resolve_vault = {
        "1772": {
            "1": {
                "root_path": "https://raw.githubusercontent.com/AJamesPhillips/Annotator/",
                "schema_version": 1
            }
        }
    }

    object_infos_by_na_id = {
        "1772": {
            "1": {
                "2": "example_pdfs/visible_directory/example_2.pdf"
            }
        }
    }

    resolver (request)
    {
        vaults = resolve_vault[reqest.naming_authority]
        vault = vaults[reqest.vault_id]

        object_infos_by_vault_id = object_infoss_by_na_id[reqest.naming_authority]
        object_infos = object_infos_by_vault_id[reqest.vault_id]
        object_info = object_infos[reqest.object_id]

        request_url = vault.root_path + object_info
        request_urls = [request_url]

        // See below for explanation
        custom_vault_resolvers = custom_resolvers[reqest.naming_authority]
        custom_vault_resolver = custom_vault_resolvers[reqest.vault_id]
        if (custom_vault_resolver)
        {
            first_request_url = vault.root_path + object_info
            request_urls.unshift(first_request_url)
        }

        return request_urls
    }

The resolver knows its root_path is: "https://raw.githubusercontent.com/AJamesPhillips/Annotator/" so prepends that.

#### localhost

The resolver also knows to look at localStorage before resolving incase user has requested it point to its local annotation server.

    // Stored in localStorage
    custom_resolvers = {
        "1772": {
            "1": {
                "root_path": "https://localhost:5003/serve_file/vault_template?url=file://",
                "schema_version": 1
            }
        }
    }


But then this all relies on being online... if you've copied a perma link how do you resolve that when offline?
Would prefer to have annotate://1772.1/2?h=1 and for your browser to open the annotate program.  Then for that local annotate programm to try anot8.org/r and fall back to itself (which is currently localhost:5003/r ).

Can manually edit it though.



---- Option 2:

anot8.org/r/1772.vault_template/example_pdfs/visible_directory/example.pdf?h=1

It knows that 1772  ===  naming authority: AJP
"AJP" knows item 1 refers to the vault named "vault_template"
Asks "AJP" where the vault config is, AJP responds and says: "https://raw.githubusercontent.com/AJamesPhillips/Annotator/config/vault_template.json"
This contains the root path: "https://raw.githubusercontent.com/AJamesPhillips/Annotator/"
So it knows that item "example_pdfs/visible_directory/example.pdf" can be found at: "https://raw.githubusercontent.com/AJamesPhillips/Annotator/example_pdfs/visible_directory/example.pdf"

So the render_pdf.html code loads that file.
It also loads that file + ".annotations" and highlights the annotation with id == 1




This will correctly be stopped by your local server but but the public github server won't know to authenticate this:

 anot8.org/r/?file=invisible_example.pdf

### View and annotate local PDFs


## Dev

### Updating dependencies

Remember to:

    pip freeze > requirements.txt

### Possible features

#### On get fail recompute allowed_relative_file_paths

If a new folder is added within an existing specified directory, or a PDF is added to an existing directory, neither it and its PDFs or the new PDFs will be served until the "populate_data" function is run again or the server is restarted.

