
# anot8.org

Website to support permalinks from [anot8 (annotator)](http://github.com/centerofci/anot8) projects.

Example: https://anot8.org/r/1772.1/1?highlighted_annotation_ids=0


## Deployment

* Upload /src/client/render_pdf.html to anot8.org s3 bucket.
* Expand `Additional upload options`
* Under Access control list (ACL) make sure everytime to re-check `Everyone (public access): Read`
* ... followed by `I understand the effects of these changes on this object.`
* Edit the meta data for Type: `System defined`, Key: `Content-Type` from `text/html` to `text/html; charset=utf8`
