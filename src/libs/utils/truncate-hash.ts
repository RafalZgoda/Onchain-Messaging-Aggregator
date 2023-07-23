export function truncateHash(
	hash: string,
	numLettersBefore?: number,
	numLettersAfter?: number
): string {
	numLettersBefore = numLettersBefore || 4;
	numLettersAfter = numLettersAfter || 5;
	if (hash.length < numLettersBefore + numLettersAfter) {
		return hash;
	}
	const truncatedHash =
		hash.substring(0, numLettersBefore) +
		"..." +
		hash.substring(hash.length - numLettersAfter);
	return truncatedHash;
}
