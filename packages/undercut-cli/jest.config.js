import nodeConfig from "@undercut/config/jest/jest.config.node.cjs";

export default {
	...nodeConfig,
	setupFiles: [
		`./src/polyfills.js`,
	],
};
