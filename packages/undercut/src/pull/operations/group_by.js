import { assertSelector } from "../../utils/assertions.js";

export function groupBy(keySelector) {
	assertSelector(keySelector);

	return function* (iterable) {
		const groups = new Map();

		let index = 0;

		for (const item of iterable) {
			const key = keySelector(item, index);

			let groupItems = groups.get(key);

			if (!groupItems) {
				groupItems = [];
				groups.set(key, groupItems);
			}

			groupItems.push(item);

			index++;
		}

		yield* groups;
	};
}
