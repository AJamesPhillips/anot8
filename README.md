
# File Annotations Server

* Serves PDFs and annotations meta data
* Allows creation of new annotations
* Renders:
* * PDFs
* * their annotations
* * highlighted annotations
* Can serve PDFs from local file system by relative file paths e.g. http://localhost:5003/r/-1.1/-1?relative_file_path=example_pdfs/visible_directory/example_2.pdf
* * serve PDFs from other websites e.g. https://anot8.org/r/1772.1/1?highlighted_annotation_ids=0 uses a PDF file from the github repo.


## Installation

    python3 -m venv venv
    . venv/bin/activate
    pip install -r requirements.txt


## Configure a new vault

    cp config/1.json config/new_vault_id.json

Suggested to increment "new_vault_id" by 1 each time.


### Specifying sources (directories) of PDFs

Edit the `root_path` attribute to point to the parent directory for your PDFs to annotate.

Once the annotate server has started you can:

* edit the `directories` attribute to contain the directories of the files you want to annotate.  These are relative file.  They are relative to `root_path`.

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

http://localhost:5003/r/-1.1/-1?relative_file_path=example_pdfs/visible_directory/example_2.pdf


### Priority labels

When annotating specific pieces of data it's helpful to prioritise certain labels to the top of the labels list.  This can be done using:

    localStorage.setItem("priority_labels", JSON.stringify(["label one"]))

### Hiding common label roots

It's also possible to hide common label roots.  For example if you have the following labels:

    "root label"
    "root label/parent one/parent two/Alpha"
    "root label/parent one/parent two/Bravo"

And using the following:

    localStorage.setItem("hide_label_roots", JSON.stringify(["root label/parent one/"]))

Then the label list will display:

    "parent two/Alpha"
    "parent two/Bravo"
    "root label"

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
