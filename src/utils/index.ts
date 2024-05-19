export function isNumeric(num: any) {
    return !isNaN(num) && !isNaN(parseFloat(num));
}

export function getLocalStorageKeySecret(committeeId: string, memberId: string, keyId: string, network: string) {
    return `secret-${committeeId}-${keyId}-${memberId}-${network}`;
}

export function getLocalStorageKeySecretValue(committeeId: string, memberId: string, keyId: string, network: string) {
    return localStorage.getItem(getLocalStorageKeySecret(committeeId, memberId, keyId, network));
}

export function downloadTextFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain' });

    // Creating a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    // Simulating a click on the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

export function isNaturalNumber(str: string) {
    const regex = /^[0-9]+$/;
    return regex.test(str);
}

export function convertToScientificNotation(num: number) {
    if (num === 0) return '0';

    // Get the exponent in scientific notation
    const exponent = Math.floor(Math.log10(num));
    // Calculate the base number
    const base = num / Math.pow(10, exponent);

    // Adjust to match the desired format if needed
    // For example, you want 10000000 to be 10e6 instead of 1e7
    if (base === 1) {
        return `${10}e${exponent - 1}`;
    } else {
        return `${base}e${exponent}`;
    }
}
