
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

`localStorage.setItem("priority_labels", JSON.stringify(["label one"]))`

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

### Possible features

#### On get fail recompute allowed_relative_file_paths

If a new folder is added within an existing specified directory, or a PDF is added to an existing directory, neither it and its PDFs or the new PDFs will be served until the "populate_data" function is run again or the server is restarted.

