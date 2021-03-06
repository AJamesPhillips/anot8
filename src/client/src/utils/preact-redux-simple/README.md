
Ideally we would use preact-redux or react-redux.  This route was chosen after 8 fruitless hours of attempts to set up and debug a build system for typescript, preact, redux, and react-redux (or preact-redux), first using rollup, and later trying to use webpack.  Various errors encountered.  Webpack errored reporting it could not find react or react-dom despite resolve.alias being set in its config.  Rollup errored on prop-types (required by react-redux) not exporting a default value despite claiming it was.

Minor rollup rant, it was not able to find redux... good because then it includes the wrong version.  I put in a hack to put the right version straight into the HTML page, but now it is including it again.  Why?
