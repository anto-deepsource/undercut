import { assertFunctor } from "../../utils/assert.js";
import { numbers, strings } from "../../utils/compare.js";
import { reverseComparator } from "../../utils/sorting.js";

export function sort(comparator, isReverse = false) {
	assertFunctor(comparator, "comparator");

	const actualComparator = isReverse ? reverseComparator(comparator) : comparator;

	return function* (iterable) {
		const items = [...iterable];

		yield* items.sort(actualComparator);
	};
}

export function sortNumbers(isReverse = false) {
	return sort(numbers, isReverse);
}

export function sortStrings(isReverse = false) {
	return sort(strings, isReverse);
}
