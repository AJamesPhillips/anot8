// rollup.config.js
import resolve from "@rollup/plugin-node-resolve"


export default {
  input: "build/bootstrap.js",
  output: {
    file: "../anot8.org/public/bundle.js",
    format: "iife"
  },
  plugins: [ resolve() ]
}