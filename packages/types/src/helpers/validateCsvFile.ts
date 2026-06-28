export function validateData(data: any[]) {
    const errors: any[] = [];

    const sanitizedData = data.map((row, index) => {
        if (!row.name || !row.email || !row.cpf) {
            errors.push(`Row ${index + 1}: Missing required fields (name, email,cpf).`);
            return null;
        }

        const sanitizedCpf = row.cpf?.replace(/\D/g, "") || "";
        if (!sanitizedCpf) {
            errors.push(`Row ${index + 1}: Invalid CPF.`);
            return null;
        }

        return {
            ...row,
            cpf: sanitizedCpf,
        };
    });

    return { sanitizedData: sanitizedData.filter(Boolean), errors };
}
