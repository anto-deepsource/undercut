import { testPush } from "../utils/tests.js";

import { flatten } from "./operations/flatten.js";
import { map } from "./operations/map.js";
import { zip } from "./operations/zip.js";

import { createPushTarget } from "./push_targets.js";

import {
	composeOperations,
	createPushLine,
	push,
	pushItems,
} from "./push_core.js";

test("composeOperations", () => {
	function interleave(...sources) {
		return composeOperations([
			zip(...sources),
			flatten()
		]);
	}

	expect(testPush(interleave([2, 4]), [1, 3])).toEqual([1, 2, 3, 4]);

	function* fakeOperation(observer) {
		try {
			while (true) {
				observer.next(yield);
			}
		} finally {
			observer.return();
		}
	}

	const pipeline = [
		fakeOperation,
		fakeOperation,
		interleave([2, 4]),
		fakeOperation
	];

	expect(pushItems(pipeline, [1, 3])).toEqual([1, 2, 3, 4]);
});

test("createPushLine", () => {
	function testPushLine(pushLineFactory, source) {
		const target = createPushTarget();
		const pushline = pushLineFactory(target);

		try {
			source.forEach(item => pushline.next(item));
		} finally {
			pushline.return();
		}

		return target.items;
	}

	expect(() => createPushLine()).toThrow();
	expect(() => createPushLine([])).toThrow();
	expect(() => createPushLine(1, [])).toThrow();
	expect(() => createPushLine([], 1)).toThrow();
	expect(() => createPushLine(1, 2)).toThrow();

	expect(testPushLine(t => createPushLine([], t), [])).toEqual([]);
	expect(testPushLine(t => createPushLine([], t), [2, 3])).toEqual([2, 3]);

	const target = createPushTarget();
	const pushLine = createPushLine([
		map(x => x * 2)
	], target);

	[0, 1, 2].forEach(x => pushLine.next(x));

	expect(target.items).toEqual([0, 2, 4]);

	target.clear();
	[0, 1, 2].forEach(x => pushLine.next(x));
	[7].forEach(x => pushLine.next(x));
	[0, 1, 2].forEach(x => pushLine.next(x));

	expect(target.items).toEqual([0, 2, 4, 14, 0, 2, 4]);

	pushLine.return();
});

test("push", () => {
	expect(() => push()).toThrow();
	expect(() => push(createPushTarget())).toThrow();
	expect(() => push(createPushTarget(), [])).toThrow();
	expect(() => push(1, [], [])).toThrow();
	expect(() => push(createPushTarget(), 2, [])).toThrow();
	expect(() => push(createPushTarget(), [], 3)).toThrow();

	let target;

	target = createPushTarget();
	expect(push(target, [], [])).toBe(target);

	target = createPushTarget();
	expect(push(target, [], []).items).toEqual([]);

	target = createPushTarget();
	expect(push(target, [], [6, 7]).items).toEqual([6, 7]);

	target = createPushTarget();
	expect(push(target, [map(x => x + 1)], []).items).toEqual([]);

	target = createPushTarget();
	expect(push(target, [map(x => x * 0)], [3, 4]).items).toEqual([0, 0]);
});

test("pushItems", () => {
	expect(() => pushItems()).toThrow();
	expect(() => pushItems([])).toThrow();
	expect(() => pushItems(2, [])).toThrow();
	expect(() => pushItems([], 3)).toThrow();

	expect(pushItems([], [])).toEqual([]);
	expect(pushItems([], [6, 7])).toEqual([6, 7]);
	expect(pushItems([map(x => x + 1)], [])).toEqual([]);
	expect(pushItems([map(x => x * 0)], [3, 4])).toEqual([0, 0]);
});
