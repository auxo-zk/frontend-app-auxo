import { FormatNumberOptions } from 'src/global.config';
import { isNumeric } from '.';
import { format as fd } from 'date-fns';

/**
 *
 * @param address The input address
 * @param first The number of characters will be taken from begin of the address. This value cannot be negative
 * @param last The number of characters will be taken from last of the address. This value cannot be negative
 * @returns
 */
export function formatAddress(address: string, first = 6, last = 4): string {
    try {
        if (!address) return '---';
        if (first < 0 || last <= 0) {
            throw new Error('Invalid parameter(s)');
        }
        return address.slice(0, first) + '...' + address.slice(-last);
    } catch (e) {
        console.log(e, address);
        return 'Error-format-string';
    }
}

/**
 * Format a number
 * @param {*} number - The number needs to format
 * @param {FormatNumberOptions} options - Includes options to customize the results returned
 * @returns A string representing a number in formatted, `option.fallback` will be returned if `number` is invalid
 */
export function formatNumber(number: any, options?: FormatNumberOptions): string | FormatNumberOptions['fallback'] {
    const { fallback = '0.00', fractionDigits, delimiter, padZero, prefix, suffix, onlyPositive } = options ?? {};

    if (!isNumeric(number)) {
        return fallback;
    }

    let num: number | string = parseFloat(number);
    if (onlyPositive && num < 0) {
        num = 0;
    }
    if (isNumeric(fractionDigits)) {
        num = num.toFixed(fractionDigits);
    }
    if (!padZero) {
        num = Number(num); // remove last zeros
    }
    return (prefix ?? '') + numberWithCommas(num, delimiter) + (suffix ?? '');
}

export function numberWithCommas(x: number | string, delimiter = ','): string {
    if (!isNumeric(x)) {
        throw new Error('Must provide a correct number');
    }
    const [naturalPart, decimalPart] = x.toString().split('.');
    let out = naturalPart.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
    if (decimalPart) {
        out += '.' + decimalPart;
    }
    return out;
}

export const sleep = (milisecond: number) => new Promise((resolve) => setTimeout(resolve, milisecond));

export type TDateFormat = 'MMM dd, h:mm a' | 'MMM dd yyyy, h:mm a' | 'MMMM dd, YYY' | 'dd MMM yyyy';
export const formatDate = (date: Date | string | number, type: TDateFormat) => {
    try {
        return fd(date, type);
    } catch (err) {
        console.log(`date = ${date} ==>`, err);
        return 'Invalid Date';
    }
};
