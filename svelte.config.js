import adapter from "svelte-adapter-bun";
import { preprocessMeltUI, sequence } from "@melt-ui/pp";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		csrf: {
			checkOrigin: false,
		},
	},
	preprocess: sequence([
		// ... other preprocessors
		preprocessMeltUI(), // add to the end!
	]),
};

export default config;
