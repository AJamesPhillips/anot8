import typescript from "rollup-plugin-typescript2"
import { nodeResolve } from "@rollup/plugin-node-resolve"



export default {
	input: "./src/bootstrap.tsx",
  output: {
    file: "../anot8.org/public/bundle.js",
    format: "iife"
  },
	plugins: [
		typescript(/*{ plugin options }*/),
    nodeResolve(), // will not load code from redux/package.json unpkg attribute instead bundling code
                   // which contains `process.env`, which obviously errors when run in a browser
	]
}
