
# anot8.org

Website to support permalinks from [anot8 (annotator)](http://github.com/centerofci/anot8) projects.

Example: https://anot8.org/r/1772.1/1?highlighted_annotation_ids=0


## Deployment

* Upload /src/client/render_pdf.html to [anot8.org s3 bucket](https://s3.console.aws.amazon.com/s3/upload/anot8.org?region=eu-west-2).
* Under "Permissions" make sure everytime to re-check `Grant public-read access`
* ... followed by `I understand the risk of granting public-read access to the specified objects.`
