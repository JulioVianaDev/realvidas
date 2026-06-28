import { useEffect, useRef, useState } from "react";
import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
import "intl-tel-input/build/css/intlTelInput.css";
import { cn } from "@/lib/utils";

interface InputPhoneProps {
    onChange?: (value: { phone: string; country: string }) => void;
    initialValue?: string;
    initialCountry?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    id?: string;
    preferredPhoneType?: "MOBILE" | "FIXED_LINE";
}

export const InputPhone = ({
    onChange,
    initialValue,
    initialCountry = "us",
    placeholder,
    className,
    disabled = false,
    required = false,
    id = "phone",
    preferredPhoneType,
}: InputPhoneProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const itiRef = useRef<ReturnType<typeof intlTelInput> | null>(
        null,
    );
    const onChangeRef = useRef(onChange);
    const isInitialMount = useRef(true);
    const isUserTyping = useRef(false);
    const lastUserInputValue = useRef<string>("");
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [currentPhone, setCurrentPhone] = useState<string>("");
    const [currentCountry, setCurrentCountry] =
        useState<string>(initialCountry);

    // Update onChange ref when it changes
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (!inputRef.current) return;

        // Helper function to notify onChange (only after initial mount)
        const notifyChange = (
            phone: string,
            country: string,
            skipCallback = false,
        ) => {
            setCurrentPhone(phone);
            setCurrentCountry(country);
            // Only call onChange if it's not the initial mount or if explicitly requested
            if (!skipCallback && !isInitialMount.current) {
                onChangeRef.current?.({ phone, country });
            }
        };

        // Initialize the plugin (intlTelInputWithUtils includes utils, no need for utilsScript)
        itiRef.current = intlTelInput(inputRef.current, {
            initialCountry: initialCountry as any, // Type assertion for country code
            separateDialCode: false,
            formatOnDisplay: true, // Format numbers on display
            nationalMode: false, // Show international format
            autoPlaceholder: "aggressive", // Auto-generate placeholder based on country
            placeholderNumberType:
                preferredPhoneType === "MOBILE"
                    ? "MOBILE"
                    : preferredPhoneType === "FIXED_LINE"
                      ? "FIXED_LINE"
                      : undefined,
        });

        // Set initial value and country if provided (skip onChange callback on initial mount)
        if (initialValue && itiRef.current) {
            itiRef.current.setNumber(initialValue);
            const phone = itiRef.current.getNumber() || "";
            const countryData =
                itiRef.current.getSelectedCountryData();
            const country = countryData.iso2 || initialCountry;
            notifyChange(phone, country, true); // Skip callback on initial mount
        } else {
            // Even if no initial value, set state but skip onChange callback
            const countryData =
                itiRef.current.getSelectedCountryData();
            const country = countryData.iso2 || initialCountry;
            notifyChange("", country, true); // Skip callback on initial mount
        }

        // Mark initial mount as complete after setup
        isInitialMount.current = false;

        // Validation function (for UI feedback only)
        const validateNumber = () => {
            if (!itiRef.current) return;
            const inputValue = inputRef.current?.value || "";

            // Only validate if there's a value
            if (inputValue.trim().length === 0) {
                setIsValid(null);
                return;
            }

            const valid = itiRef.current.isValidNumber() ?? false;
            setIsValid(valid);
        };

        // Handle number changes with formatting
        const handleInput = () => {
            if (!itiRef.current || !inputRef.current) return;

            // Mark that user is typing
            isUserTyping.current = true;

            // Get the formatted phone number
            const phone = itiRef.current.getNumber() || "";
            const countryData =
                itiRef.current.getSelectedCountryData();
            const country = countryData.iso2 || initialCountry;

            // Store the last user input value
            lastUserInputValue.current = phone;

            notifyChange(phone, country);

            // Validate on input for immediate feedback
            validateNumber();

            // Reset typing flag after a short delay to allow for rapid typing
            setTimeout(() => {
                isUserTyping.current = false;
            }, 100);
        };

        // Handle validity changes on blur
        const handleBlur = () => {
            isUserTyping.current = false;
            validateNumber();
        };

        // Handle country changes
        const handleCountryChange = () => {
            if (!itiRef.current) return;
            const phone = itiRef.current.getNumber() || "";
            const countryData =
                itiRef.current.getSelectedCountryData();
            const country = countryData.iso2 || initialCountry;

            notifyChange(phone, country);

            // Re-validate when country changes
            validateNumber();
        };

        inputRef.current.addEventListener("input", handleInput);
        inputRef.current.addEventListener("blur", handleBlur);
        inputRef.current.addEventListener(
            "countrychange",
            handleCountryChange,
        );

        // Cleanup
        return () => {
            if (inputRef.current) {
                inputRef.current.removeEventListener(
                    "input",
                    handleInput,
                );
                inputRef.current.removeEventListener(
                    "blur",
                    handleBlur,
                );
                inputRef.current.removeEventListener(
                    "countrychange",
                    handleCountryChange,
                );
            }
            if (itiRef.current) {
                itiRef.current.destroy();
            }
            // Reset initial mount flag on cleanup
            isInitialMount.current = true;
        };
    }, [preferredPhoneType]); // Removed initialValue and initialCountry to prevent re-initialization

    // Handle updates to initialValue/initialCountry without triggering onChange
    useEffect(() => {
        if (!itiRef.current || isInitialMount.current) return;

        // Don't update from props if user is actively typing
        if (isUserTyping.current) {
            return;
        }

        // Don't update from props if the input is focused (user might be typing)
        if (inputRef.current === document.activeElement) {
            return;
        }

        // Only update if the values actually changed
        const currentPhoneValue = itiRef.current.getNumber() || "";
        const currentCountryData =
            itiRef.current.getSelectedCountryData();
        const currentCountryValue =
            currentCountryData.iso2 || initialCountry;

        // Don't update if the prop value matches what the user just typed
        if (
            initialValue !== undefined &&
            initialValue === lastUserInputValue.current
        ) {
            return;
        }

        const shouldUpdatePhone =
            initialValue !== undefined &&
            initialValue !== currentPhoneValue;
        const shouldUpdateCountry =
            initialCountry !== currentCountryValue;

        if (shouldUpdatePhone || shouldUpdateCountry) {
            // Temporarily set flag to skip onChange
            const wasInitialMount = isInitialMount.current;
            isInitialMount.current = true;

            if (shouldUpdatePhone && initialValue) {
                itiRef.current.setNumber(initialValue);
            }
            if (shouldUpdateCountry) {
                itiRef.current.setCountry(initialCountry as any);
            }

            // Update local state without triggering onChange
            const phone = itiRef.current.getNumber() || "";
            const countryData =
                itiRef.current.getSelectedCountryData();
            const country = countryData.iso2 || initialCountry;
            setCurrentPhone(phone);
            setCurrentCountry(country);

            // Restore flag
            isInitialMount.current = wasInitialMount;
        }
    }, [initialValue, initialCountry]);

    // Update disabled state
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.disabled = disabled;
        }
    }, [disabled]);

    return (
        <div className={cn("w-full", className)}>
            <input
                ref={inputRef}
                id={id}
                type="tel"
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    // Red border and ring when invalid
                    isValid === false &&
                        "border-destructive ring-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive/50",
                    // Green border and ring when valid (only if there's a value and it's valid)
                    isValid === true &&
                        currentPhone &&
                        currentPhone.trim().length > 0 &&
                        "border-green-500 ring-green-500/20 focus-visible:border-green-500 focus-visible:ring-green-500/50",
                )}
            />
        </div>
    );
};