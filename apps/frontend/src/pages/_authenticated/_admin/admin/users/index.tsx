import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useQueryParams from "@/hooks/useQueryparams";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    useDeleteUser,
    useSubmitCreateUsersByFile,
    useUsersQuery,
} from "@/hooks/query/user/user.query";
import { RoleType, RoleValues } from "@global-types/entities/user.entity-type";
import { Pagination } from "@/components/Paginate";
import { useDebounce } from "use-debounce";
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import { useDialogStore } from "./-zustand/useDialogStore";
import { useUserSelectedStore } from "./-zustand/userSelectedStore";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { FieldGroup } from "@/components/ui/field-group";
import Papa from "papaparse";
import { useState } from "react";
import { validateData } from "@global-types/helpers/validateCsvFile";
import { useToast } from "@/hooks/use-toast";
import { createFileRoute } from "@tanstack/react-router";
const permittedFields = [
    "name",
    "email",
    "cpf",
    "age",
    "gender",
    "role",
    "coins",
];

export const Route = createFileRoute("/_authenticated/_admin/admin/users/")({
    component: UsersPage,
});

function UsersPage() {
    const { search: searchQuery, save: saveQuery } = useQueryParams();
    const {
        isOpen,
        openDialog,
        closeDialog,
        changeStatusIsOpenCsv,
        isOpenImportCsv,
    } = useDialogStore();
    const { setUser } = useUserSelectedStore();
    const [isValidCSv, setIsValidCsv] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const { toast } = useToast();
    function handleFileUpload(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    const { data } = results;
                    const { errors } = validateData(data);
                    if (errors.length > 0) {
                        setIsValidCsv(false);
                    } else {
                        setFile(file);
                        setIsValidCsv(true);
                    }
                },
                error: function (error) {
                    setIsValidCsv(false);
                    console.error("Error parsing file:", error);
                },
            });
        }
    }

    function handleSearch(value: string) {
        saveQuery({ search: value });
    }
    function handleRole(role: string) {
        saveQuery({ role });
    }
    const page = Number(searchQuery.get("page") ?? 1);
    const search = searchQuery.get("search") ?? "";
    const role = (searchQuery.get("role") as RoleType) ?? "ALL";
    const [value] = useDebounce(search, 300);
    const { data, refetch } = useUsersQuery({
        page,
        search: value,
        role,
    });
    const { mutate } = useDeleteUser();
    const sendFile = useSubmitCreateUsersByFile();
    return (
        <>
            <div className="w-full pt-4">
                <div className="flex w-full justify-end my-2 pr-4 space-x-3  px-8">
                    <Card className="border-none w-[550px]">
                        <CardHeader>
                            <CardTitle>
                                Alunos registrados no sistema
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <div className="flex w-full justify-end my-2 pr-4 space-x-3">
                        <Input
                            onChange={(e) => {
                                e.preventDefault();
                                handleSearch(e.target.value);
                            }}
                            value={search}
                            placeholder="Pesquisar..."
                            className="w-48"
                        />
                        <Select
                            onValueChange={(value) =>
                                handleRole(value)
                            }
                            defaultValue={role}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filtre o tipo de agente" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    key={"ALL"}
                                    value={"ALL"}
                                >
                                    Todos
                                </SelectItem>
                                {Object.entries(RoleValues).map(
                                    ([key, value]) => (
                                        <SelectItem
                                            key={key}
                                            value={value}
                                        >
                                            {value}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>

                        <Button onClick={openDialog}>
                            Cadastrar aluno
                        </Button>
                        <Button
                            onClick={() =>
                                changeStatusIsOpenCsv(true)
                            }
                        >
                            Importar alunos com csv
                        </Button>
                    </div>
                </div>
                <div className="mx-8 border-2 border-secondary rounded-md mb-3">
                    <Table className="">
                        {!data?.data.length ? (
                            <TableCaption>
                                A list of your recent invoices.
                            </TableCaption>
                        ) : null}
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">
                                    Nome
                                </TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Moedas</TableHead>
                                <TableHead>Idade</TableHead>
                                <TableHead className="text-right">
                                    Ações
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.name}
                                    </TableCell>
                                    <TableCell>
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        {/* {user.coins} */}
                                    </TableCell>
                                    <TableCell>{user.age}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="w-full flex justify-end space-x-1">
                                            <Pencil1Icon
                                                className="cursor-pointer"
                                                color="yellow"
                                                width={20}
                                                height={20}
                                                onClick={() => {
                                                    setUser(user);
                                                    openDialog();
                                                }}
                                            />
                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    <TrashIcon
                                                        className="cursor-pointer"
                                                        color="red"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Tem
                                                            certeza
                                                            que deseja
                                                            deletar
                                                            este
                                                            aluno?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Ao remover
                                                            o aluno
                                                            ele sairá
                                                            das salas
                                                            de aula
                                                            que está
                                                            cadastrado
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => {
                                                                mutate(
                                                                    user.id,
                                                                );
                                                            }}
                                                        >
                                                            Continue
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Pagination
                        currentPage={page}
                        total={data?.metadata.total ?? 0}
                        limit={
                            data && data.metadata.total < 10
                                ? data.metadata.total
                                : 10
                        }
                    />
                </div>
                <Dialog
                    open={isOpen}
                    onOpenChange={(close) => {
                        if (!close) {
                            closeDialog();
                            setUser(null);
                        }
                    }}
                >
                    <DialogContent className="max-w-screen-lg">
                        <DialogHeader />
                        {/* <UserForm /> */}
                    </DialogContent>
                </Dialog>
                <Dialog
                    open={isOpenImportCsv}
                    onOpenChange={changeStatusIsOpenCsv}
                >
                    <DialogContent className="max-w-2xl">
                        <div>
                            O csv precisa ter a primeira linha com os
                            nomes da informação dos alunos. Cada valor
                            das primeiras linhas precisa ter os nomes
                            para o arquivo ser válido
                            <div className="my-2">
                                Campos Permitidos:
                            </div>
                            <div className="font-bold">
                                {permittedFields.map((f) => (
                                    <>{` ${f}, `}</>
                                ))}
                            </div>
                        </div>
                        <FieldGroup>
                        <Label htmlFor="picture">
                            Importar Arquivo Csv
                        </Label>
                        <Input
                            id="csv-upload"
                            type="file"
                            accept=".csv, text/csv"
                            onChange={handleFileUpload}
                        />
                        </FieldGroup>
                        <div className="flex justify-between items-center pl-2">
                            <div>
                                {isValidCSv && file ? (
                                    <Label className="text-green-500">
                                        {" "}
                                        CSV válido
                                    </Label>
                                ) : !isValidCSv && file ? (
                                    <Label className="text-red-500">
                                        CSV inválido
                                    </Label>
                                ) : null}
                            </div>
                            <Button
                                onClick={() => {
                                    if (file) {
                                        sendFile.mutate(
                                            { file },
                                            {
                                                onSuccess: () => {
                                                    changeStatusIsOpenCsv(
                                                        false,
                                                    );
                                                    setFile(null);
                                                    saveQuery({
                                                        page: "1",
                                                    });
                                                    toast({
                                                        title: "Alunos importados!",
                                                        description:
                                                            "Alunos importados com sucesso, podem acessar a plataforma!",
                                                        variant:
                                                            "default",
                                                    });
                                                    refetch();
                                                },
                                                onError: (error) => {
                                                    toast({
                                                        title: "Algo deu errado!",
                                                        description:
                                                            "Ocorreu um erro ao importar o csv cheque se o csv contém dados validos!",
                                                        variant:
                                                            "destructive",
                                                    });
                                                    console.error(
                                                        "File upload failed",
                                                        error,
                                                    );
                                                },
                                            },
                                        );
                                    }
                                }}
                                disabled={
                                    file && isValidCSv ? false : true
                                }
                            >
                                Enviar arquivo
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
