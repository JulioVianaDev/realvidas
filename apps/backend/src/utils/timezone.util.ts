/**
 * Utility functions for timezone conversion using UTC offsets
 */

/**
 * Converts a UTC offset string (e.g., "UTC-3", "UTC+5") to hours offset number
 * @param utcOffset - UTC offset string like "UTC-3" or "UTC+5"
 * @returns number representing hours offset from UTC (e.g., -3, 5)
 */
export function parseUtcOffset(utcOffset: string | null | undefined): number {
    if (!utcOffset) {
        return 0; // Default to UTC
    }

    // Remove "UTC" prefix and parse the offset
    const offsetStr = utcOffset.replace(/^UTC/, '').trim();
    
    if (offsetStr.startsWith('+')) {
        return parseInt(offsetStr.substring(1), 10);
    } else if (offsetStr.startsWith('-')) {
        return parseInt(offsetStr, 10);
    } else {
        // If no sign, try to parse as number (assume positive)
        const num = parseInt(offsetStr, 10);
        return isNaN(num) ? 0 : num;
    }
}

/**
 * Converts a Date to the specified timezone using UTC offset
 * @param date - Date to convert
 * @param utcOffset - UTC offset string like "UTC-3" or "UTC+5"
 * @returns Date adjusted for the timezone offset
 */
export function convertToTimezone(date: Date, utcOffset: string | null | undefined): Date {
    const offsetHours = parseUtcOffset(utcOffset);
    const utcTime = date.getTime();
    const offsetMs = offsetHours * 60 * 60 * 1000;
    return new Date(utcTime - offsetMs);
}

/**
 * Converts a Date from the specified timezone to UTC
 * @param date - Date in the specified timezone
 * @param utcOffset - UTC offset string like "UTC-3" or "UTC+5"
 * @returns Date in UTC
 */
export function convertFromTimezoneToUtc(date: Date, utcOffset: string | null | undefined): Date {
    const offsetHours = parseUtcOffset(utcOffset);
    const localTime = date.getTime();
    const offsetMs = offsetHours * 60 * 60 * 1000;
    return new Date(localTime + offsetMs);
}

/**
 * Validates if a UTC offset string is in the correct format
 * @param utcOffset - UTC offset string to validate
 * @returns boolean indicating if the format is valid
 */
export function isValidUtcOffset(utcOffset: string): boolean {
    if (!utcOffset) {
        return false;
    }

    // Pattern: UTC followed by + or - and a number
    const pattern = /^UTC[+-]?\d+$/;
    return pattern.test(utcOffset);
}

