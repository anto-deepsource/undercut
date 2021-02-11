"use strict";

const { IGNORE_PATTERNS } = require(`../index.cjs`);

module.exports = {
	collectCoverageFrom: [
		`**/*.?(c|m)js`,
	],
	coveragePathIgnorePatterns: IGNORE_PATTERNS,
	coverageProvider: `v8`,
	injectGlobals: false,
	moduleFileExtensions: [`js`, `cjs`, `mjs`, `json`, `jsx`, `ts`, `tsx`, `node`],
	testMatch: [
		`**/*.test.*.?(c|m)js`,
		`**/*.test.?(c|m)js`,
	],
	testPathIgnorePatterns: IGNORE_PATTERNS,
	testRunner: `jest-circus/runner`,
	transform: {
		"\\.(c|m)?js$": `@undercut/config/jest/babel_jest_transformer.cjs`
	},
	transformIgnorePatterns: [],
};
