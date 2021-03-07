
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

Audit for malicous script injection via unsafely setting innerHTML.


## Installation

    python3 -m venv venv
    . venv/bin/activate
    pip install -r requirements.txt


## Configure a new vault

    cp config/local_vault_template.json config/new\ vault.json

`new vault` can be any name.


### Specifying sources (directories) of PDFs

Edit the `root_path` attribute to point to the parent directory for your PDFs to annotate.  This can be relative or absolute.

Once the annotate server has started it will create a new anot8_vault_config.json file at this new root_path directory.  You can then:

* edit the `directories` attribute to contain the directories of the files you want to annotate.  These are relative to `root_path`.

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

Replace "1" with your annotations vault id

http://localhost:5003/vault/1


### View and annotating local PDFs

http://localhost:5003/r/1772.1/1

1772 is the "naming authority id" of CCI on anot8.org \
.1 is the vault id \
1 is the file id

The naming authority id is only needed for anot8.org permalinks.  And file id is not needed and the relative_file_path can be used instead, for example:

http://localhost:5003/r/-1.1/-1?relative_file_path=example_pdfs/visible_directory/example_1.pdf


#### Local vault id versus anot8 vault id

Additionally when you first set up a vault of PDFs to annotate, the vault will not have yet been assigned an anot8.org vault id.  So you access your vault through the `local_vault_id` you specify in the json files in the /config directory.  For the "local_vault_template" vault the local_vault_id is "demo".  So the example PDFs in this repo can be accessed using: http://localhost:5003/r/-1.demo/1


### Priority labels

When annotating specific pieces of data it's helpful to prioritise certain labels to the top of the labels list.  This can be done using:

    localStorage.setItem("priority_labels", JSON.stringify(["label one"]))


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

The render_pdf.html file can use the anot8.org maing authority server (i.e. how to translate a file_id into a url of a file) instead of your local server by setting:

    localStorage.setItem("override_naming_authority_server_url", "https://raw.githubusercontent.com/centerofci/anot8/master/anot8_org_naming_authority_lookup.json") // set value to "" to stop

This will work when running locally or against a remote server.


## Feature examples for central resolving server

### Permalinks

To get permalinks which work for anyone you'll need to open a new issue here: https://github.com/CenterOfCI/anot8.org/issues/new?title=Request%20for%20perma%20link%20name%20id to get a naming id and have it added to the anot8.org resolver.

Once set up the following anot8.org URLs should work:

https://anot8.org/r/1772.1/1?highlighted_annotation_ids=0


### Redirect from anot8.org to local

TODO ~~You can visit anot8.org/resolver and follow the instructions to allow it to find your local server.  It will store the information in that browsers local storage.  Redirecting to local will be faster in terms of download speed and will also allow you to annotation your (local) files.~~


### Annotating files

At the moment this is only possible when running the server locally.


## Dev

### Updating dependencies

Remember to:

    pip freeze > requirements.txt


## Deployment

See [README.md in /src/anot8.org/README.md](/src/anot8.org/README.md)
