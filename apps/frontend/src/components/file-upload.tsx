import {
    useState,
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
    memo,
} from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileUploadRef {
    getFile: () => File | null;
    clearFile: () => void;
}

export interface FileUploadProps {
    /**
     * Accept file types (e.g., "image/*", ".png,.jpg")
     */
    accept?: string;
    /**
     * Maximum file size in bytes
     */
    maxSize?: number;
    /**
     * Initial preview URL (for existing images)
     */
    initialPreviewUrl?: string;
    /**
     * Size of the circular upload area
     */
    size?: "sm" | "md" | "lg";
    /**
     * Additional className
     */
    className?: string;
    /**
     * Disabled state
     */
    disabled?: boolean;
}

const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
};

const previewSizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
};

export const FileUpload = memo(
    forwardRef<FileUploadRef, FileUploadProps>(
        (
            {
                accept = "image/*",
                maxSize,
                initialPreviewUrl,
                size = "md",
                className,
                disabled = false,
            },
            ref,
        ) => {
            const [file, setFile] = useState<File | null>(null);
            const [previewUrl, setPreviewUrl] = useState<
                string | null
            >(initialPreviewUrl || null);
            const [error, setError] = useState<string | null>(null);
            const fileInputRef = useRef<HTMLInputElement>(null);

            // Expose file getter and clear method via ref to avoid parent re-renders
            useImperativeHandle(
                ref,
                () => ({
                    getFile: () => file,
                    clearFile: () => {
                        if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                        }
                        setFile(null);
                        setError(null);
                        if (
                            previewUrl &&
                            previewUrl.startsWith("blob:")
                        ) {
                            URL.revokeObjectURL(previewUrl);
                        }
                        setPreviewUrl(initialPreviewUrl || null);
                    },
                }),
                [file, previewUrl, initialPreviewUrl],
            );

            // Clean up object URLs on unmount
            useEffect(() => {
                return () => {
                    if (
                        previewUrl &&
                        previewUrl.startsWith("blob:")
                    ) {
                        URL.revokeObjectURL(previewUrl);
                    }
                };
            }, [previewUrl]);

            const validateFile = (selectedFile: File): boolean => {
                // Validate file size
                if (maxSize && selectedFile.size > maxSize) {
                    const maxSizeMB = (
                        maxSize /
                        (1024 * 1024)
                    ).toFixed(2);
                    setError(
                        `File size must be less than ${maxSizeMB}MB`,
                    );
                    return false;
                }

                // Validate file type
                if (accept) {
                    const acceptPatterns = accept
                        .split(",")
                        .map((pattern) => pattern.trim());
                    const isValidType = acceptPatterns.some(
                        (pattern) => {
                            if (pattern.startsWith(".")) {
                                // Extension match (e.g., ".png")
                                const extension =
                                    "." +
                                    selectedFile.name
                                        .split(".")
                                        .pop()
                                        ?.toLowerCase();
                                return (
                                    extension ===
                                    pattern.toLowerCase()
                                );
                            } else if (pattern.includes("/*")) {
                                // MIME type wildcard (e.g., "image/*")
                                const baseType =
                                    pattern.split("/")[0];
                                return selectedFile.type.startsWith(
                                    baseType + "/",
                                );
                            } else {
                                // Exact MIME type match (e.g., "image/png")
                                return selectedFile.type === pattern;
                            }
                        },
                    );

                    if (!isValidType) {
                        setError(
                            `File type not allowed. Accepted: ${accept}`,
                        );
                        return false;
                    }
                }

                return true;
            };

            const handleFileSelect = (selectedFile: File | null) => {
                if (!selectedFile) {
                    setFile(null);
                    setPreviewUrl(initialPreviewUrl || null);
                    setError(null);
                    return;
                }

                if (!validateFile(selectedFile)) {
                    return;
                }

                // Clean up previous preview URL if it was a blob
                if (previewUrl && previewUrl.startsWith("blob:")) {
                    URL.revokeObjectURL(previewUrl);
                }

                setFile(selectedFile);
                setError(null);

                // Create preview URL
                const objectUrl = URL.createObjectURL(selectedFile);
                setPreviewUrl(objectUrl);
            };

            const handleInputChange = (
                e: React.ChangeEvent<HTMLInputElement>,
            ) => {
                e.preventDefault();
                e.stopPropagation();
                const selectedFile = e.target.files?.[0] || null;
                handleFileSelect(selectedFile);
            };

            const handleRemove = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                handleFileSelect(null);
            };

            const handleClick = (e: React.MouseEvent) => {
                e.stopPropagation();
                if (!disabled && fileInputRef.current) {
                    // Use setTimeout to ensure the click happens after event handling
                    setTimeout(() => {
                        fileInputRef.current?.click();
                    }, 0);
                }
            };

            return (
                <div
                    data-file-upload
                    className={cn(
                        "flex flex-col items-center gap-2",
                        className,
                    )}
                    onClick={(e) => {
                        // Only stop propagation if not clicking on button or input
                        const target = e.target as HTMLElement;
                        if (
                            !target.closest("button") &&
                            !target.closest('input[type="file"]')
                        ) {
                            e.stopPropagation();
                        }
                    }}
                    onPointerDown={(e) => {
                        // Only stop propagation if not clicking on button or input
                        const target = e.target as HTMLElement;
                        if (
                            !target.closest("button") &&
                            !target.closest('input[type="file"]')
                        ) {
                            e.stopPropagation();
                        }
                    }}
                    onMouseDown={(e) => {
                        // Only stop propagation if not clicking on button or input
                        const target = e.target as HTMLElement;
                        if (
                            !target.closest("button") &&
                            !target.closest('input[type="file"]')
                        ) {
                            e.stopPropagation();
                        }
                    }}
                >
                    <div className="relative">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={accept}
                            onChange={handleInputChange}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            onFocus={(e) => {
                                e.stopPropagation();
                            }}
                            onBlur={(e) => {
                                e.stopPropagation();
                            }}
                            className="hidden"
                            disabled={disabled}
                        />
                        <button
                            type="button"
                            onClick={handleClick}
                            disabled={disabled}
                            className={cn(
                                "relative rounded-full border-2 border-dashed transition-all overflow-hidden",
                                sizeClasses[size],
                                disabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer hover:border-primary",
                                error
                                    ? "border-destructive"
                                    : "border-muted-foreground/25",
                            )}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className={cn(
                                        "w-full h-full object-cover rounded-full",
                                        previewSizeClasses[size],
                                    )}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Upload
                                        className={cn(
                                            "text-muted-foreground",
                                            size === "sm"
                                                ? "w-6 h-6"
                                                : size === "md"
                                                  ? "w-8 h-8"
                                                  : "w-10 h-10",
                                        )}
                                    />
                                </div>
                            )}
                            {previewUrl && !disabled && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                    <Upload
                                        className={cn(
                                            "text-white",
                                            size === "sm"
                                                ? "w-6 h-6"
                                                : size === "md"
                                                  ? "w-8 h-8"
                                                  : "w-10 h-10",
                                        )}
                                    />
                                </div>
                            )}
                        </button>
                        {file && !disabled && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 rounded-full w-6 h-6"
                                onClick={handleRemove}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                    {error && (
                        <p className="text-sm text-destructive text-center">
                            {error}
                        </p>
                    )}
                </div>
            );
        },
    ),
);

FileUpload.displayName = "FileUpload";
