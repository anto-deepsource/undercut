import { testOperationPull, testOperationPush } from "../../utils/tests.js";

import { filter as filterPull } from "../../pull/operations/filter.js";
import { filter as filterPush } from "../../push/operations/filter.js";

function testFilter(testOperation, filter) {
	expect(() => filter()).toThrow();

	testOperation(filter, {
		args: [x => x > 5],
		source: [6, 7],
		target: [6, 7],
		callbackArgs: [[6, 0], [7, 1]]
	});
	testOperation(filter, {
		args: [x => x > 5],
		source: [],
		target: [],
		callbackArgs: []
	});
	testOperation(filter, {
		args: [x => x > 5],
		source: [],
		target: [],
		callbackArgs: []
	});
	testOperation(filter, {
		args: [x => x > 5],
		source: [1],
		target: []
	});
	testOperation(filter, {
		args: [x => x > 5],
		source: [2, 5],
		target: []
	});
	testOperation(filter, {
		args: [x => x > 5],
		source: [1, 7, 2, 5],
		target: [7]
	});
}

describe("filter", () => {
	test("pull", () => testFilter(testOperationPull, filterPull));
	test("push", () => testFilter(testOperationPush, filterPush));
});
