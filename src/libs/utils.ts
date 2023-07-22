export function truncateHash(
	address: string,
	numLettersBefore: number,
	numLettersAfter: number
): string {
	if (address.length < numLettersBefore + numLettersAfter) {
		return address;
	}

	const truncatedHash =
		address.substring(0, numLettersBefore) +
		"..." +
		address.substring(address.length - numLettersAfter);
	return truncatedHash;
}
