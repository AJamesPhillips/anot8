
# anot8.org

Website to support permalinks from [anot8 (annotator)](http://github.com/centerofci/anot8) projects.

Example: https://anot8.org/r/1772.1/1?highlighted_annotation_ids=0


## Deployment

Use the following AWS CLI command to deploy a new version of the site.  Remember
to have run the `npm run build` command from the `/src/client` directory first:

    aws s3 sync ./public s3://anot8.org --acl public-read --delete
