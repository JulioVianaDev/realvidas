import React, { InputHTMLAttributes } from "react";
import { Input } from "./ui/input";

interface CnpjInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, rawValue: string) => void;
}

const CnpjInput: React.FC<CnpjInputProps> = ({
    value = "",
    onChange = () => { },
    type = "tel",
    ...rest
}) => {
    const CNPJ_MASK = "99.999.999/9999-99";
    const MAX_LENGTH = 14;
    const rawValue = clear(value);

    const maskedValue = rawValue ? applyMask(rawValue, CNPJ_MASK) : "";

    function onLocalChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const inputValue = clear(ev.target.value);

        if (inputValue.length > MAX_LENGTH) return;

        const maskedInput = applyMask(inputValue, CNPJ_MASK);
        ev.target.value = maskedInput;

        onChange(ev, inputValue);
    }

    function applyMask(value: string, mask: string): string {
        let result = "";
        let inc = 0;

        Array.from(value).forEach((char, index) => {
            while (mask[index + inc] && !/[0-9]/.test(mask[index + inc])) {
                result += mask[index + inc];
                inc++;
            }
            result += char;
        });

        return result;
    }

    function clear(value: string): string {
        return value.replace(/[^0-9]/g, "");
    }

    return (
        <Input
            {...rest}
            type={type}
            value={maskedValue}
            onChange={onLocalChange}
        />
    );
};

export default CnpjInput;

