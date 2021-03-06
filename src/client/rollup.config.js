import typescript from "rollup-plugin-typescript2"
import replace from "@rollup/plugin-replace"
import { nodeResolve } from "@rollup/plugin-node-resolve"



export default {
	input: "./src/bootstrap.tsx",
  output: {
    file: "../anot8.org/public/bundle.js",
    format: "iife"
  },
	plugins: [
    replace({
      preventAssignment: true, // set to remove their warning message
      "process.env.NODE_ENV": JSON.stringify("production"), // this is undesirable... it's another hack
      // to work around redux failing in the browser due to them performing a similar transformation
      // on their code (the dist version) but not on the es (or lib) version which is used by rollup
    }),
		typescript(/*{ plugin options }*/),
    nodeResolve(),
	]
}
