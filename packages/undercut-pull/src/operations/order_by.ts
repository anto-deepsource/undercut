import type { Comparator, PullOperation } from "@undercut/types";

import { assert } from "@undercut/utils/assert";
import { composeComparators } from "@undercut/utils";

import { sort } from "./sort.js";

export function orderBy<T>(...comparators: Array<Comparator<T>>): PullOperation<T> {
	assert(comparators.length > 0, `You must specify at least 1 order by "asc" or "desc" function calls.`);

	return sort(composeComparators(comparators));
}
