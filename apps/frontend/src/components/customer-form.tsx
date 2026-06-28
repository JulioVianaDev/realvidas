import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    BR_STATES,
    BrState,
} from "@global-types/entities/customer.entity-type";
import { ICreateCustomerBodyRequest } from "@global-types/body-requests/customer.body-request";
import { useTranslation } from "@/contexts/TranslationsContext";
import { InputPhone } from "@/components/InputPhone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type CustomerFormValues = {
    razaoSocial: string;
    limiteTolerancia: string;
    nomeFantasia: string;
    cnpjCpf: string;
    responsavel: string;
    email: string;
    telefone: string;
    celular: string;
    phoneCountry: string;
    endereco: string;
    complemento: string;
    bairro: string;
    cidade: string;
    cep: string;
    estado: string;
};

const EMPTY: CustomerFormValues = {
    razaoSocial: "",
    limiteTolerancia: "",
    nomeFantasia: "",
    cnpjCpf: "",
    responsavel: "",
    email: "",
    telefone: "",
    celular: "",
    phoneCountry: "br",
    endereco: "",
    complemento: "",
    bairro: "",
    cidade: "",
    cep: "",
    estado: "",
};

const toNull = (value: string): string | null => {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
};

export function toCustomerBody(
    values: CustomerFormValues,
): ICreateCustomerBodyRequest {
    return {
        razaoSocial: values.razaoSocial.trim(),
        nomeFantasia: toNull(values.nomeFantasia),
        cnpjCpf: toNull(values.cnpjCpf),
        responsavel: toNull(values.responsavel),
        email: toNull(values.email),
        telefone: toNull(values.telefone),
        celular: toNull(values.celular),
        phoneCountry: toNull(values.phoneCountry),
        endereco: toNull(values.endereco),
        complemento: toNull(values.complemento),
        bairro: toNull(values.bairro),
        cidade: toNull(values.cidade),
        cep: toNull(values.cep),
        estado: (values.estado || null) as BrState | null,
        limiteTolerancia: values.limiteTolerancia.trim()
            ? Number(values.limiteTolerancia)
            : null,
    };
}

export function CustomerForm({
    defaultValues,
    onSubmit,
    onCancel,
    submitting,
}: {
    defaultValues?: Partial<CustomerFormValues>;
    onSubmit: (body: ICreateCustomerBodyRequest) => void;
    onCancel: () => void;
    submitting?: boolean;
}) {
    const { t } = useTranslation();

    const schema = z.object({
        razaoSocial: z
            .string()
            .min(1, t("customer.form.validation.razaoSocialRequired")),
        limiteTolerancia: z.string(),
        nomeFantasia: z.string(),
        cnpjCpf: z.string(),
        responsavel: z.string(),
        email: z.string(),
        telefone: z.string(),
        celular: z.string(),
        phoneCountry: z.string(),
        endereco: z.string(),
        complemento: z.string(),
        bairro: z.string(),
        cidade: z.string(),
        cep: z.string(),
        estado: z.string(),
    });

    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { ...EMPTY, ...defaultValues },
    });

    const submit = (values: CustomerFormValues) => {
        onSubmit(toCustomerBody(values));
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(submit)}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                    {/* Razão Social (wide) + Limite Tolerância (narrow) */}
                    <div className="md:col-span-8">
                        <FormField
                            control={form.control}
                            name="razaoSocial"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("customer.form.razaoSocial")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t(
                                                "customer.form.razaoSocial",
                                            )}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <FormField
                            control={form.control}
                            name="limiteTolerancia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t(
                                            "customer.form.limiteTolerancia",
                                        )}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Two-column rows */}
                    {(
                        [
                            ["nomeFantasia", "cnpjCpf"],
                            ["responsavel", "email"],
                        ] as const
                    ).map(([left, right]) => (
                        <FieldPair
                            key={left}
                            left={left}
                            right={right}
                            control={form.control}
                            t={t}
                        />
                    ))}

                    {/* Telefone + Celular (InputPhone with country flag) */}
                    <div className="md:col-span-6">
                        <FormField
                            control={form.control}
                            name="telefone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("customer.form.telefone")}
                                    </FormLabel>
                                    <FormControl>
                                        <InputPhone
                                            initialValue={field.value}
                                            initialCountry={
                                                form.getValues(
                                                    "phoneCountry",
                                                ) || "br"
                                            }
                                            onChange={({
                                                phone,
                                                country,
                                            }) => {
                                                field.onChange(phone);
                                                form.setValue(
                                                    "phoneCountry",
                                                    country,
                                                );
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="md:col-span-6">
                        <FormField
                            control={form.control}
                            name="celular"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("customer.form.celular")}
                                    </FormLabel>
                                    <FormControl>
                                        <InputPhone
                                            initialValue={field.value}
                                            initialCountry={
                                                form.getValues(
                                                    "phoneCountry",
                                                ) || "br"
                                            }
                                            preferredPhoneType="MOBILE"
                                            onChange={({
                                                phone,
                                                country,
                                            }) => {
                                                field.onChange(phone);
                                                form.setValue(
                                                    "phoneCountry",
                                                    country,
                                                );
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {(
                        [
                            ["endereco", "complemento"],
                            ["bairro", "cidade"],
                        ] as const
                    ).map(([left, right]) => (
                        <FieldPair
                            key={left}
                            left={left}
                            right={right}
                            control={form.control}
                            t={t}
                        />
                    ))}

                    {/* CEP + Estado (select) */}
                    <div className="md:col-span-6">
                        <FormField
                            control={form.control}
                            name="cep"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("customer.form.cep")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="00000-000"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="md:col-span-6">
                        <FormField
                            control={form.control}
                            name="estado"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("customer.form.estado")}
                                    </FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={t(
                                                        "customer.form.estadoPlaceholder",
                                                    )}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {BR_STATES.map((uf) => (
                                                <SelectItem
                                                    key={uf}
                                                    value={uf}
                                                >
                                                    {uf}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        {t("common.cancel")}
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting
                            ? t("customer.form.saving")
                            : t("customer.form.save")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

/** Renders two half-width text fields side by side. */
function FieldPair({
    left,
    right,
    control,
    t,
}: {
    left: keyof CustomerFormValues;
    right: keyof CustomerFormValues;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: any;
    t: (key: string) => string;
}) {
    return (
        <>
            <div className="md:col-span-6">
                <FormField
                    control={control}
                    name={left}
                    render={({ field }: { field: any }) => (
                        <FormItem>
                            <FormLabel>
                                {t(`customer.form.${left}`)}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t(
                                        `customer.form.${left}`,
                                    )}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="md:col-span-6">
                <FormField
                    control={control}
                    name={right}
                    render={({ field }: { field: any }) => (
                        <FormItem>
                            <FormLabel>
                                {t(`customer.form.${right}`)}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t(
                                        `customer.form.${right}`,
                                    )}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
}
