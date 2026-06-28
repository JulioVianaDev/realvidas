/**
 * Converts an array of files and an object into a FormData instance.
 * 
 * @param object - Object with key-value pairs to append to FormData
 * @param files - Array of File objects to append to FormData (first file uses key "file")
 * @returns FormData instance with files and object values appended
 */
export const convertObjectToFormData = (
    object: Record<string, any>,
    files?: File[],
): FormData => {
    const formData = new FormData();

    const appendFormData = (
        fd: FormData,
        key: string,
        value: any,
    ) => {
        if (value === null || value === undefined) {
            return;
        }
        // Files are appended directly
        if (value instanceof File) {
            fd.append(key, value);
            return;
        }
        // Arrays: use bracket notation with index
        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                appendFormData(fd, `${key}[${index}]`, item);
            });
            return;
        }
        // Objects: use bracket notation for nested keys
        if (typeof value === "object") {
            Object.entries(value).forEach(
                ([childKey, childValue]) => {
                    appendFormData(
                        fd,
                        `${key}[${childKey}]`,
                        childValue,
                    );
                },
            );
            return;
        }
        // Primitives: coerce to string
        fd.append(key, String(value));
    };

    // Append files from the array
    // First file uses key "file" to match backend FileInterceptor('file')
    // Additional files use "file0", "file1", etc.
    if (files && files.length > 0) {
        formData.append("file", files[0]);
        files.slice(1).forEach((file, index) => {
            formData.append(`file${index + 1}`, file);
        });
    }

    // Append all object properties using bracket notation for nested objects
    Object.entries(object).forEach(([key, value]) => {
        appendFormData(formData, key, value);
    });

    return formData;
};

