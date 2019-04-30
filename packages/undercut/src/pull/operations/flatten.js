import { assert } from "../../utils/assertions.js";
import { isFunction, isIterable } from "../../utils/lang.js";

function* spreadRec(canSpread, maxDepth, currentDepth, value) {
	if (currentDepth > maxDepth) {
		return;
	}

	if (currentDepth < maxDepth && canSpread(value)) {
		for (const item of value) {
			yield* spreadRec(canSpread, maxDepth, currentDepth + 1, item);
		}
	} else {
		yield value;
	}
}

function flattenCore(canSpread, depth) {
	assert(isFunction(canSpread), "Predicate is required, must be a function.");
	assert(Number.isFinite(depth) && depth >= 0, "Depth is required, must be an integer >= 0.");

	depth = Math.trunc(depth);

	return function* (iterable) {
		for (const item of iterable) {
			yield* spreadRec(canSpread, depth, 0, item);
		}
	};
}

export function flatten(depth = 1) {
	return flattenCore(Array.isArray, depth);
}

export function flattenIterables(depth = 1) {
	return flattenCore(isIterable, depth);
}
