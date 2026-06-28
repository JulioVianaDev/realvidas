import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldGroup } from "@/components/ui/field-group";
import { FileUpload, FileUploadRef } from "@/components/file-upload";
import {
    TimezoneCombobox,
    getDefaultTimezoneComboboxValue,
    normalizeStoredTimezoneToComboboxValue,
} from "@/components/timezone-combobox";
import CpfInput from "@/components/CpfInput";
import CnpjInput from "@/components/CnpjInput";
import { useTranslation } from "@/contexts/TranslationsContext";
import {
    useCreateEnterpriseMutation,
    useUpdateEnterpriseMutation,
    useGetEnterpriseByIdQuery,
} from "@/hooks/query/enterprise/enterprise.query";
import { ArrowLeft, Building2, Link2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ENTERPRISE_DESCRIPTION_MAX_LENGTH } from "@global-types/entities/enterprise.entity-type";
import {
    SHORT_PATH_MAX_LENGTH,
    SHORT_PATH_MIN_LENGTH,
} from "@global-types/entities/url-shortener.entity-type";
import { getPublicCatalogUrl } from "@/lib/public-catalog-url";
import { useCheckShortPathAvailabilityQuery } from "@/hooks/query/url-shortener/url-shortener.query";

export type EnterpriseDetailsFormProps = {
    editEnterpriseId?: string;
    onCancel: () => void;
    onSuccess: () => void;
    /** When true, renders only the form card (no page shell / duplicate title). */
    embedded?: boolean;
};

export function EnterpriseDetailsForm({
    editEnterpriseId,
    onCancel,
    onSuccess,
    embedded = false,
}: EnterpriseDetailsFormProps) {
    const { t } = useTranslation();
    const fileUploadRef = useRef<FileUploadRef>(null);

    const isEditMode = !!editEnterpriseId;
    const { data: enterpriseData, isLoading } = useGetEnterpriseByIdQuery(
        editEnterpriseId,
    );
    const createMutation = useCreateEnterpriseMutation();
    const updateMutation = useUpdateEnterpriseMutation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [documentType, setDocumentType] = useState<"cpf" | "cnpj">("cpf");
    const [cpf, setCpf] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [timezone, setTimezone] = useState(() =>
        getDefaultTimezoneComboboxValue(),
    );
    const [description, setDescription] = useState("");
    const [shortPath, setShortPath] = useState("");
    const [debouncedShortPath, setDebouncedShortPath] = useState("");

    useEffect(() => {
        if (isEditMode && enterpriseData) {
            setName(enterpriseData.name);
            setEmail(enterpriseData.email || "");
            setDocumentType(enterpriseData.cpf ? "cpf" : "cnpj");
            setCpf(enterpriseData.cpf || "");
            setCnpj(enterpriseData.cnpj || "");
            setTimezone(
                normalizeStoredTimezoneToComboboxValue(
                    enterpriseData.timezone,
                ),
            );
            setDescription(enterpriseData.description ?? "");
            setShortPath(enterpriseData.shortPath ?? "");
        }
    }, [isEditMode, enterpriseData]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedShortPath(shortPath), 400);
        return () => clearTimeout(timer);
    }, [shortPath]);

    const normalizedShortPath = shortPath
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");

    const shortPathQuery = useCheckShortPathAvailabilityQuery(
        debouncedShortPath
            ? debouncedShortPath
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/[^a-z0-9-]+/g, "-")
                  .replace(/^-+|-+$/g, "")
                  .replace(/-{2,}/g, "-")
            : undefined,
        editEnterpriseId,
        normalizedShortPath.length >= SHORT_PATH_MIN_LENGTH,
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditMode && editEnterpriseId) {
            await updateMutation.mutateAsync({
                id: editEnterpriseId,
                data: {
                    name: name?.trim() || undefined,
                    email: email?.trim() ? email : null,
                    cpf:
                        documentType === "cpf" && cpf?.trim()
                            ? cpf
                            : null,
                    cnpj:
                        documentType === "cnpj" && cnpj?.trim()
                            ? cnpj
                            : null,
                    timezone: timezone || null,
                    description: description.trim()
                        ? description.slice(
                              0,
                              ENTERPRISE_DESCRIPTION_MAX_LENGTH,
                          )
                        : null,
                    shortPath: normalizedShortPath || null,
                },
            });
        } else {
            const file = fileUploadRef.current?.getFile() || null;
            await createMutation.mutateAsync({
                name,
                email: email || null,
                cpf: documentType === "cpf" ? cpf || null : null,
                cnpj: documentType === "cnpj" ? cnpj || null : null,
                timezone: timezone || null,
                description: description.trim()
                    ? description.slice(
                          0,
                          ENTERPRISE_DESCRIPTION_MAX_LENGTH,
                      )
                    : null,
                shortPath: normalizedShortPath || null,
                file: file || undefined,
            });
        }

        onSuccess();
    };

    if (isLoading && isEditMode) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <div className="text-lg">{t("common.loading")}</div>
            </div>
        );
    }

    const formCard = (
            <Card>
                <CardHeader>
                    <CardTitle>
                        {isEditMode
                            ? t("enterprise.details.editTitle") ||
                              "Company Information"
                            : t("enterprise.details.createTitle") ||
                              "Company Details"}
                    </CardTitle>
                    <CardDescription>
                        {isEditMode
                            ? t(
                                  "enterprise.details.editDescription",
                              ) ||
                              "Update your company information below"
                            : t(
                                  "enterprise.details.createDescription",
                              ) ||
                              "Enter your company information below"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FieldGroup>
                                <Label className="text-sm font-medium">
                                    {t(
                                        "enterprise.dialog.create.imageLabel",
                                    ) || "Company Logo"}
                                </Label>
                                {!isEditMode ? (
                                    <FileUpload
                                        ref={fileUploadRef}
                                        accept="image/*"
                                        maxSize={5 * 1024 * 1024}
                                        size="lg"
                                    />
                                ) : enterpriseData?.imageUrl ? (
                                    <div className="flex flex-col gap-3">
                                        <FileUpload
                                            ref={fileUploadRef}
                                            accept="image/*"
                                            maxSize={5 * 1024 * 1024}
                                            size="lg"
                                            initialPreviewUrl={
                                                enterpriseData?.imageUrl ||
                                                ""
                                            }
                                        />
                                    </div>
                                ) : (
                                    <FileUpload
                                        ref={fileUploadRef}
                                        accept="image/*"
                                        maxSize={5 * 1024 * 1024}
                                        size="lg"
                                    />
                                )}
                            </FieldGroup>

                            <div className="space-y-6">
                                <FieldGroup>
                                    <Label
                                        htmlFor="name"
                                        className="text-sm font-medium"
                                    >
                                        {t(
                                            "enterprise.dialog.create.nameLabel",
                                        ) || "Name"}{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder={
                                            t(
                                                "enterprise.dialog.create.namePlaceholder",
                                            ) || "Enter company name"
                                        }
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                        className="w-full"
                                    />
                                </FieldGroup>

                                <FieldGroup>
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium"
                                    >
                                        {t(
                                            "enterprise.dialog.create.emailLabel",
                                        ) || "Email"}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={
                                            t(
                                                "enterprise.dialog.create.emailPlaceholder",
                                            ) || "company@example.com"
                                        }
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="w-full"
                                    />
                                </FieldGroup>
                            </div>
                        </div>

                        <FieldGroup>
                            <Label
                                htmlFor="timezone"
                                className="text-sm font-medium"
                            >
                                {t(
                                    "enterprise.dialog.create.timezoneLabel",
                                ) || "Timezone"}
                            </Label>
                            <TimezoneCombobox
                                value={timezone}
                                onValueChange={setTimezone}
                                placeholder={
                                    t(
                                        "enterprise.dialog.create.timezonePlaceholder",
                                    ) || "Select timezone"
                                }
                            />
                        </FieldGroup>

                        <FieldGroup>
                            <Label
                                htmlFor="short-path"
                                className="text-sm font-medium"
                            >
                                {t("enterprise.details.shortPathLabel")}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {t("enterprise.details.shortPathHint")}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground shrink-0">
                                    /s/
                                </span>
                                <Input
                                    id="short-path"
                                    placeholder="my-company"
                                    value={shortPath}
                                    onChange={(e) =>
                                        setShortPath(e.target.value)
                                    }
                                    maxLength={SHORT_PATH_MAX_LENGTH}
                                    className="w-full"
                                />
                            </div>
                            {normalizedShortPath &&
                                normalizedShortPath !== shortPath && (
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            "enterprise.details.shortPathNormalizedPreview",
                                            { value: normalizedShortPath },
                                        )}
                                    </p>
                                )}
                            {normalizedShortPath.length >=
                                SHORT_PATH_MIN_LENGTH && (
                                <p
                                    className={`text-xs ${
                                        shortPathQuery.isFetching
                                            ? "text-muted-foreground"
                                            : shortPathQuery.data?.available
                                              ? "text-green-600"
                                              : "text-destructive"
                                    }`}
                                >
                                    {shortPathQuery.isFetching
                                        ? t("common.checking")
                                        : shortPathQuery.data?.available
                                          ? t(
                                                "enterprise.details.shortPathAvailable",
                                            )
                                          : shortPathQuery.data?.reason ===
                                              "reserved"
                                            ? t(
                                                  "enterprise.details.shortPathReserved",
                                              )
                                            : shortPathQuery.data?.reason ===
                                                "invalid"
                                              ? t(
                                                    "enterprise.details.shortPathInvalid",
                                                )
                                              : t(
                                                    "enterprise.details.shortPathTaken",
                                                )}
                                </p>
                            )}
                            {normalizedShortPath.length >= SHORT_PATH_MIN_LENGTH &&
                                (shortPathQuery.data?.available ||
                                    (isEditMode &&
                                        enterpriseData?.shortPath ===
                                            normalizedShortPath)) && (
                                    <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                                        <p className="font-medium flex items-center gap-2">
                                            <Link2 className="h-4 w-4 text-primary" />
                                            {t("enterprise.details.publicCatalogLink")}
                                        </p>
                                        <a
                                            href={getPublicCatalogUrl(normalizedShortPath)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 block break-all text-primary hover:underline"
                                        >
                                            {getPublicCatalogUrl(normalizedShortPath)}
                                        </a>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {t("enterprise.details.publicCatalogLinkHint")}
                                        </p>
                                    </div>
                                )}
                        </FieldGroup>

                        <FieldGroup>
                            <Label
                                htmlFor="enterprise-description"
                                className="text-sm font-medium"
                            >
                                {t("enterprise.details.descriptionLabel") ||
                                    "Company description"}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {t("enterprise.details.descriptionHint", {
                                    max: String(
                                        ENTERPRISE_DESCRIPTION_MAX_LENGTH,
                                    ),
                                }) ||
                                    `Maximum ${ENTERPRISE_DESCRIPTION_MAX_LENGTH} characters.`}
                            </p>
                            <Textarea
                                id="enterprise-description"
                                value={description}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setDescription(
                                        v.length >
                                            ENTERPRISE_DESCRIPTION_MAX_LENGTH
                                            ? v.slice(
                                                  0,
                                                  ENTERPRISE_DESCRIPTION_MAX_LENGTH,
                                              )
                                            : v,
                                    );
                                }}
                                maxLength={ENTERPRISE_DESCRIPTION_MAX_LENGTH}
                                rows={8}
                                placeholder={
                                    t(
                                        "enterprise.details.descriptionPlaceholder",
                                    ) || ""
                                }
                                className="min-h-[160px] resize-y"
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {t("enterprise.details.descriptionCounter", {
                                    current: String(description.length),
                                    max: String(
                                        ENTERPRISE_DESCRIPTION_MAX_LENGTH,
                                    ),
                                }) ||
                                    `${description.length} / ${ENTERPRISE_DESCRIPTION_MAX_LENGTH}`}
                            </p>
                        </FieldGroup>

                        <div className="grid grid-cols-1 md:grid-cols-3">
                            <FieldGroup>
                                <Label
                                    htmlFor="document-type"
                                    className="text-sm font-medium"
                                >
                                    {t(
                                        "enterprise.dialog.create.documentTypeLabel",
                                    ) || "Document Type"}{" "}
                                    <span className="text-destructive">
                                        *
                                    </span>
                                </Label>
                                <Select
                                    value={documentType}
                                    onValueChange={(
                                        value: "cpf" | "cnpj",
                                    ) => setDocumentType(value)}
                                >
                                    <SelectTrigger id="document-type">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cpf">
                                            {t(
                                                "enterprise.dialog.create.cpfOption",
                                            ) || "CPF"}
                                        </SelectItem>
                                        <SelectItem value="cnpj">
                                            {t(
                                                "enterprise.dialog.create.cnpjOption",
                                            ) || "CNPJ"}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FieldGroup>

                            <FieldGroup className="md:col-span-2">
                                {documentType === "cpf" ? (
                                    <>
                                        <Label
                                            htmlFor="cpf-input"
                                            className="text-sm font-medium"
                                        >
                                            {t(
                                                "enterprise.dialog.create.cpfLabel",
                                            ) || "CPF"}{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <CpfInput
                                            id="cpf-input"
                                            placeholder={
                                                t(
                                                    "enterprise.dialog.create.cpfPlaceholder",
                                                ) || "000.000.000-00"
                                            }
                                            value={cpf}
                                            onChange={(e, rawValue) =>
                                                setCpf(rawValue)
                                            }
                                            required
                                            className="w-full"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Label
                                            htmlFor="cnpj-input"
                                            className="text-sm font-medium"
                                        >
                                            {t(
                                                "enterprise.dialog.create.cnpjLabel",
                                            ) || "CNPJ"}{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <CnpjInput
                                            id="cnpj-input"
                                            placeholder={
                                                t(
                                                    "enterprise.dialog.create.cnpjPlaceholder",
                                                ) ||
                                                "00.000.000/0000-00"
                                            }
                                            value={cnpj}
                                            onChange={(e, rawValue) =>
                                                setCnpj(rawValue)
                                            }
                                            required
                                            className="w-full"
                                        />
                                    </>
                                )}
                            </FieldGroup>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                            >
                                {t("common.cancel") || "Cancel"}
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    isEditMode
                                        ? updateMutation.isPending
                                        : createMutation.isPending
                                }
                            >
                                {isEditMode
                                    ? updateMutation.isPending
                                        ? t("common.saving") ||
                                          "Saving..."
                                        : t("common.save") || "Save"
                                    : createMutation.isPending
                                      ? t(
                                            "enterprise.dialog.create.creatingButton",
                                        ) || "Creating..."
                                      : t(
                                            "enterprise.dialog.create.createButton",
                                        ) || "Create"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
    );

    if (embedded) {
        return formCard;
    }

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
            <div className="mb-6">
                <Button variant="ghost" onClick={onCancel} className="mb-4 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t("common.back")}
                </Button>
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isEditMode
                                ? t("enterprise.dialog.edit.title")
                                : t("enterprise.dialog.create.title")}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {isEditMode
                                ? t("enterprise.dialog.edit.description")
                                : t("enterprise.dialog.create.description")}
                        </p>
                    </div>
                </div>
            </div>
            {formCard}
        </div>
    );
}
