
# File Annotations Server

* Serves PDFs and annotations meta data
* Allows creation of new annotations
* Renders:
* * PDFs
* * their annotations
* * highlighted annotations
* Can serve PDFs from local file system by relative file paths e.g. http://localhost:5003/r/-1.1/-1?relative_file_path=example_pdfs/visible_directory/example_1.pdf
* * serve PDFs from other websites e.g. https://anot8.org/r/1772.1/1?highlighted_annotation_ids=0 uses a PDF file from the github repo.


## Change log

See the [change log](./CHANGE_LOG.md) for breaking changes.


## TODO

* Guard against multiple tabs open with the same PDF, which will result in annotations being overwritten and lost.


## Installation

    python3 -m venv venv
    . venv/bin/activate
    pip install -r requirements.txt


## Configure a new vault

    cp config/local_vault_template.json config/new\ vault.json

`new vault` can be any name.

These vault config files are just pointers to other directories of PDFs so you
will want to edit the `root_path` attribute to point to the parent directory for
your PDFs to annotate.  This path can be relative or absolute.  If you edit this
file or any other .json file with a rich text editor you might run into problems
and errors so we would recommend you try to edit them using a plain text editor.

Once the annotate server has started it will create a new
`anot8_vault_config.json` file at this new root_path directory.

You will then want to edit the `directories` attribute of the
**new anot8_vault_config.json** to contain the directories of the files you want
to annotate.  These directory paths are relative to `root_path`.

Specifying directories allows you to limit by whitelisting what files are
available for the annotations server to serve.


### Specifying labels

Edit the `labels` attribute of the **anot8_vault_config.json** file to be a list
of strings, e.g:

    "labels": ["label one", "another label"]


## Run local

    . venv/bin/activate
    export FLASK_APP=src/server/annotator.py && flask run --port=5003


## Local server features

### Show all annotation vaults

http://localhost:5003/vaults


### See PDFs coverd by a particular vault

Replace "1" with your annotations vault id

http://localhost:5003/vault/1


### View and annotating local PDFs

http://localhost:5003/r/1772.1/1

1772 is the "naming authority id" of CCI on anot8.org \
1 (of ".1") is the vault id \
1 (which is trailing) is the file id

The naming authority id is only needed for anot8.org permalinks.  And file id is not needed if the relative_file_path is used instead, for example:

http://localhost:5003/r/-1.1/-1?relative_file_path=example_pdfs/visible_directory/example_1.pdf


#### Local vault id versus anot8 vault id

Additionally when you first set up a vault of PDFs to annotate, the vault will not have yet been assigned an anot8.org vault id.  So you access your vault through the `local_vault_id` you specify in the json files in the /config directory.  For the "local_vault_template" vault the local_vault_id is "demo".  So the example PDFs in this repo can be accessed using: http://localhost:5003/r/-1.demo/1


### Priority labels

When annotating specific pieces of data it's helpful to prioritise certain labels to the top of the labels list.  This can be done using:

    localStorage.setItem("priority_labels", JSON.stringify(["label one", "another label"]))


### Hiding common label roots

It's possible to hide common label roots.  For example if you have the following labels:

    "root label"
    "root label/parent one/parent two/Alpha"
    "root label/parent one/parent two/Bravo"

And using the following:

    localStorage.setItem("hide_label_roots", JSON.stringify(["root label/parent one/"]))

Then the label list will display:

    "parent two/Alpha"
    "parent two/Bravo"
    "root label"


### Use anot8.org server when running locally

The render_pdf.html file can use the anot8.org naming authority server (i.e. how to translate a file_id into a url of a file) instead of your local server by setting:

    localStorage.setItem("override_naming_authority_server_url", "https://raw.githubusercontent.com/centerofci/anot8/master/anot8_org_naming_authority_lookup.json") // set value to "" to revert to using your local server

This will work when running locally or from anot8.org.


## Anot8.org (central resolving server) features

### Permalinks

To get permalinks which work for anyone you'll need to open a new issue here: https://github.com/CenterOfCI/anot8.org/issues/new?title=Request%20for%20perma%20link%20name%20id to get a naming id and have it added to the anot8.org resolver.

Once set up the following type of anot8.org URLs (with a naming authority id and file id as well as their vault id) should work, e.g.:

https://anot8.org/r/1772.1/1?highlighted_annotation_ids=0


### Non-permanent annotator

You can visit https://anot8.org/r and set the url of the PDF to load.  Once it loads you can annotate it.  The annotations are impermanent and will be lost if you clear your browser storage or change to a different computer.
You can however copy the resulting URL and send it to anyone else for whom it will load the PDF and annotate it with your annotations.  Due to the limitations of URL length it's best to plan on not sharing more than 10 annotations this way.

If the website serving the PDF does not allow your browser to load it directly, then anot8 will fallback to using a proxy server.  This is not guarenteed to work.  If it still errors please [report it here](https://github.com/centerofci/anot8/issues/new).

At the moment it is only possible to save your annotations when running the server locally.  If [there is interest](https://github.com/centerofci/anot8/issues/6) then we can look at persisting annotations in a database.


### Redirect from anot8.org to local

TODO ~~You can visit anot8.org/resolver and follow the instructions to allow it to find your local server.  It will store the information in that browsers local storage.  Redirecting to local will be faster in terms of download speed and will also allow you to annotation your (local) files.~~



## Dev

### Updating server dependencies

Remember to:

    pip freeze > requirements.txt


### Watching and recompiling client code

    src/client$  npm run watch

Or to just build:

    src/client$  npm run build


## Deployment

See [README.md in /src/anot8.org/README.md](/src/anot8.org/README.md)
