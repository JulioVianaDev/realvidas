"use client";

import * as React from "react";
import {
    AudioWaveform,
    BookOpen,
    Command,
    Frame,
    GalleryVerticalEnd,
    LayoutDashboardIcon,
    Map,
    PieChart,
    School2,
    User2Icon,
    Anchor,
    GraduationCapIcon,
    Calendar,
    Settings,
    Database,
    BarChart,
    Brain,
    Building2,
    Briefcase,
    LayoutGrid,
    KanbanSquare,
    ClipboardList,
    Users,
    ShieldCheck,
} from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { useUserStore } from "@/zustand/user.store";
import { RoleType } from "@global-types/entities/user.entity-type";
import { AppModule } from "@global-types/entities/profile.entity-type";
import { useGetMyPermissionsQuery } from "@/hooks/query/profile/profile.query";
import { useTranslation } from "@/contexts/TranslationsContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    useAdminListTenantsQuery,
    useGetEnterprisesByTenantQuery,
    useGetMyEnterprisesQuery,
} from "@/hooks/query/enterprise/enterprise.query";
import { usePatchMyCurrentTenantMutation } from "@/hooks/query/user/user.query";
import { useTrialStore } from "@/zustand/trial.store";

import { NavProjects } from "@/components/nav-projects";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavMain } from "../nav-main";

// Add role permissions to navigation items
const getNavigationData = (
    t: (key: string) => string,
    canManageProfiles: boolean,
) => ({
    navMain: [
        // Top-level Users entry (outside Settings) for tenant admins.
        ...(canManageProfiles
            ? [
                  {
                      title: t("sidebar.users"),
                      url: "/users",
                      icon: Users,
                      allowedRoles: ["ADMIN", "USER"] as RoleType[],
                  },
              ]
            : []),

        {
            title: t("sidebar.customers"),
            url: "/customers",
            icon: Building2,
            allowedRoles: ["ADMIN", "USER"] as RoleType[],
            module: "CLIENTES" as AppModule,
        },

        // {
        //     title: "Escolas",
        //     url: "schools",
        //     icon: School2,
        //     isActive: true,
        //     allowedRoles: ["ADMIN", "SECRETARY"] as RoleType[],
        //     items: [
        //         {
        //             title: "Escolas",
        //             url: "/schools",
        //             allowedRoles: [
        //                 "ADMIN",
        //                 "SECRETARY",
        //             ] as RoleType[],
        //         },
        //         {
        //             title: "Turmas",
        //             url: "/classrooms",
        //             allowedRoles: [
        //                 "ADMIN",
        //                 "SECRETARY",
        //                 "TEACHER",
        //             ] as RoleType[],
        //         },
        //     ],
        // },

        {
            title: t("sidebar.settings"),
            url: "/settings",
            icon: Settings,
            allowedRoles: ["ADMIN", "USER"] as RoleType[],
            items: [
                {
                    title: t("sidebar.emails"),
                    url: "/settings/emails",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },

                {
                    title: t("sidebar.configurationEnterprises"),
                    url: "/configuration/enterprise",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },

                // Only users who can manage profiles (permit-all / tenant
                // admin) see the permissions panel.
                ...(canManageProfiles
                    ? [
                          {
                              title: t("sidebar.profiles"),
                              url: "/configuration/profiles",
                              allowedRoles: [
                                  "ADMIN",
                                  "USER",
                              ] as RoleType[],
                          },
                      ]
                    : []),
            ],
        },
    ],
    adminSaasNav: [
        {
            title: t("sidebar.adminSaas"),
            url: "/admin",
            icon: ShieldCheck,
            allowedRoles: ["ADMIN"] as RoleType[],
            items: [
                {
                    title: t("sidebar.adminSaasTenants"),
                    url: "/admin/tenants",
                    allowedRoles: ["ADMIN"] as RoleType[],
                },
                {
                    title: t("sidebar.adminSaasUsers"),
                    url: "/admin/users",
                    allowedRoles: ["ADMIN"] as RoleType[],
                },
                {
                    title: t("sidebar.adminSaasPlans"),
                    url: "/admin/plans",
                    allowedRoles: ["ADMIN"] as RoleType[],
                },
                {
                    title: t("sidebar.adminSaasAnalytics"),
                    url: "/admin/analytics",
                    allowedRoles: ["ADMIN"] as RoleType[],
                },
            ],
        },
    ],
    projects: [
        // {
        //     name: "Design Engineering",
        //     url: "#",
        //     icon: Frame,
        //     allowedRoles: ["ADMIN"] as RoleType[],
        // },
    ],
});

const hasAccess = (
    allowedRoles: RoleType[] | undefined,
    userRole: RoleType | undefined,
): boolean => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
};

/** Effective module-permission context for the current user. */
type ModuleAccessContext = {
    isAdmin: boolean;
    permitAll: boolean;
    allowedModules: AppModule[];
};

/**
 * A nav item without a `module` is always allowed (role still applies).
 * Module-gated items require permitAll, the module in the user's list, or a
 * SaaS admin (main role ADMIN bypasses tenant module permissions).
 */
const hasModuleAccess = (
    module: AppModule | undefined,
    ctx: ModuleAccessContext,
): boolean => {
    if (!module) return true;
    if (ctx.isAdmin || ctx.permitAll) return true;
    return ctx.allowedModules.includes(module);
};

type NavItemWithTitle = {
    title: string;
    allowedRoles?: RoleType[];
    module?: AppModule;
    items?: NavItemWithTitle[];
};

const compareNavTitleAsc = (
    a: NavItemWithTitle,
    b: NavItemWithTitle,
): number =>
    a.title.localeCompare(b.title, undefined, {
        sensitivity: "base",
        numeric: true,
    });

const sortNavItemsByTitleAsc = <T extends NavItemWithTitle>(
    items: T[],
): T[] =>
    [...items].sort(compareNavTitleAsc).map((item) =>
        item.items?.length
            ? {
                  ...item,
                  items: sortNavItemsByTitleAsc(item.items),
              }
            : item,
    );

const filterNavItems = <T extends NavItemWithTitle>(
    items: T[],
    userRole: RoleType | undefined,
    moduleCtx: ModuleAccessContext,
): T[] => {
    return items
        .filter(
            (item) =>
                hasAccess(item.allowedRoles, userRole) &&
                hasModuleAccess(item.module, moduleCtx),
        )
        .map((item) => {
            if (!item.items?.length) {
                return item;
            }

            return {
                ...item,
                items: item.items.filter(
                    (subItem) =>
                        hasAccess(subItem.allowedRoles, userRole) &&
                        hasModuleAccess(subItem.module, moduleCtx),
                ),
            };
        });
};

export function AppSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const user = useUserStore((state) => state.userAuth);
    const userData = useUserStore((state) => state.user);
    const setEnterpriseId = useTrialStore(
        (state) => state.setEnterpriseId,
    );
    const isAdmin = user?.role === "ADMIN";
    const { mutate: patchMyCurrentTenant } =
        usePatchMyCurrentTenantMutation();

    // Only query permissions once the user has a tenant; the endpoint is
    // tenant-scoped and has no connection before a workspace exists.
    const { data: myPermissions } = useGetMyPermissionsQuery(
        !!user && !!userData?.currentTenantViewId,
    );
    const permitAll = myPermissions?.permitAll ?? false;
    const allowedModules = myPermissions?.modules ?? [];
    const canManageProfiles =
        isAdmin || (myPermissions?.canManage ?? false);

    const moduleCtx = React.useMemo<ModuleAccessContext>(
        () => ({ isAdmin, permitAll, allowedModules }),
        [isAdmin, permitAll, allowedModules],
    );

    const isCalendarPage = pathname === "/calendar";

    const data = React.useMemo(
        () => getNavigationData(t, canManageProfiles),
        [t, canManageProfiles],
    );

    const filteredNavMain = React.useMemo(() => {
        return sortNavItemsByTitleAsc(
            filterNavItems(data.navMain, user?.role, moduleCtx),
        );
    }, [data.navMain, user?.role, moduleCtx]);

    const filteredProjects = React.useMemo(() => {
        return sortNavItemsByTitleAsc(
            filterNavItems(data.projects, user?.role, moduleCtx),
        );
    }, [data.projects, user?.role, moduleCtx]);

    const filteredAdminSaasNav = React.useMemo(() => {
        return sortNavItemsByTitleAsc(
            filterNavItems(data.adminSaasNav, user?.role, moduleCtx),
        );
    }, [data.adminSaasNav, user?.role, moduleCtx]);

    const { data: adminTenants = [] } =
        useAdminListTenantsQuery(isAdmin);
    const [selectedTenantId, setSelectedTenantId] = React.useState<
        string | null
    >(() => localStorage.getItem("selected-tenant-id") || null);
    const { data: adminTenantEnterprises = [] } =
        useGetEnterprisesByTenantQuery(
            selectedTenantId,
            isAdmin && !!selectedTenantId,
        );
    const { data: myEnterprisesResponse } = useGetMyEnterprisesQuery(
        { page: 1, pageSize: 10, includeInactive: false },
        !isAdmin && !!selectedTenantId,
    );
    const enterprises = React.useMemo(() => {
        if (isAdmin) return adminTenantEnterprises;
        return (myEnterprisesResponse?.data || []).map(
            (enterprise) => ({
                id: enterprise.id,
                name: enterprise.name,
            }),
        );
    }, [
        adminTenantEnterprises,
        isAdmin,
        myEnterprisesResponse?.data,
    ]);
    const [selectedEnterpriseId, setSelectedEnterpriseId] =
        React.useState<string | null>(
            () =>
                localStorage.getItem("selected-enterprise-id") ||
                null,
        );

    /** Avoid repeated PATCH while userData still has no currentTenantViewId (e.g. Strict Mode). */
    const adminDefaultTenantPatchSentRef = React.useRef(false);

    React.useEffect(() => {
        if (!user) {
            adminDefaultTenantPatchSentRef.current = false;
            return;
        }

        if (!isAdmin) {
            const tenantIdFromUser =
                userData?.currentTenantViewId || null;
            setSelectedTenantId(tenantIdFromUser);
            if (tenantIdFromUser) {
                localStorage.setItem(
                    "selected-tenant-id",
                    tenantIdFromUser,
                );
            }
            return;
        }

        if (userData?.currentTenantViewId) {
            adminDefaultTenantPatchSentRef.current = false;
            setSelectedTenantId(userData.currentTenantViewId);
            localStorage.setItem(
                "selected-tenant-id",
                userData.currentTenantViewId,
            );
            return;
        }

        const firstTenantId = adminTenants[0]?.id;
        if (!firstTenantId) {
            return;
        }

        setSelectedTenantId(firstTenantId);
        localStorage.setItem("selected-tenant-id", firstTenantId);

        if (adminDefaultTenantPatchSentRef.current) {
            return;
        }
        adminDefaultTenantPatchSentRef.current = true;
        patchMyCurrentTenant(
            { tenantId: firstTenantId },
            {
                onError: () => {
                    adminDefaultTenantPatchSentRef.current = false;
                },
            },
        );
    }, [
        user,
        isAdmin,
        userData?.currentTenantViewId,
        adminTenants,
        patchMyCurrentTenant,
    ]);

    React.useEffect(() => {
        if (enterprises.length === 0) {
            setSelectedEnterpriseId(null);
            return;
        }

        const exists = enterprises.some(
            (enterprise) => enterprise.id === selectedEnterpriseId,
        );
        const nextEnterpriseId = exists
            ? selectedEnterpriseId
            : enterprises[0].id;

        if (!nextEnterpriseId) return;
        setSelectedEnterpriseId(nextEnterpriseId);
        setEnterpriseId(nextEnterpriseId);
        localStorage.setItem(
            "selected-enterprise-id",
            nextEnterpriseId,
        );
    }, [enterprises, selectedEnterpriseId, setEnterpriseId]);

    const { state: sidebarState } = useSidebar();
    const sidebarCollapsed = sidebarState === "collapsed";

    const selectedTenantLabel = React.useMemo(() => {
        if (!selectedTenantId) return "";
        const tenant = adminTenants.find(
            (x) => x.id === selectedTenantId,
        );
        return (
            tenant?.createdByUserName ||
            tenant?.createdByUserId ||
            selectedTenantId
        );
    }, [adminTenants, selectedTenantId]);

    const selectedEnterpriseLabel = React.useMemo(() => {
        const ent = enterprises.find(
            (x) => x.id === selectedEnterpriseId,
        );
        return ent?.name || enterprises[0]?.name || "";
    }, [enterprises, selectedEnterpriseId]);

    const onTenantChange = (tenantId: string) => {
        setSelectedTenantId(tenantId);
        localStorage.setItem("selected-tenant-id", tenantId);
        patchMyCurrentTenant({ tenantId });
    };

    const onEnterpriseChange = (enterpriseId: string) => {
        setSelectedEnterpriseId(enterpriseId);
        setEnterpriseId(enterpriseId);
        localStorage.setItem("selected-enterprise-id", enterpriseId);
    };

    return (
        <div className="relative">
            <Sidebar
                collapsible="icon"
                {...props}
            >
                <div className="w-full flex justify-start items-center border-b">
                    <SidebarTrigger />
                </div>
                {/*
                 <SidebarHeader>
                    <TeamSwitcher teams={data.teams} />
                </SidebarHeader>
                */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent
                            className={cn(
                                "space-y-2 px-2",
                                sidebarCollapsed &&
                                    "flex flex-col items-center space-y-2 px-1",
                            )}
                        >
                            {isAdmin ? (
                                sidebarCollapsed ? (
                                    <DropdownMenu>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <DropdownMenuTrigger
                                                    asChild
                                                >
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 shrink-0"
                                                        disabled={
                                                            adminTenants.length <=
                                                            1
                                                        }
                                                        aria-label={t(
                                                            "sidebar.tenant",
                                                        )}
                                                    >
                                                        <Building2 className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                align="center"
                                                className="max-w-[min(280px,var(--radix-tooltip-content-available-width))]"
                                            >
                                                <p className="text-muted-foreground text-xs font-medium">
                                                    {t(
                                                        "sidebar.tenant",
                                                    )}
                                                </p>
                                                <p className="text-sm font-medium leading-snug">
                                                    {selectedTenantLabel ||
                                                        "—"}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <DropdownMenuContent
                                            side="right"
                                            align="start"
                                            className="w-56"
                                        >
                                            <DropdownMenuLabel>
                                                {t(
                                                    "sidebar.switchTenant",
                                                )}
                                            </DropdownMenuLabel>
                                            <DropdownMenuRadioGroup
                                                value={
                                                    selectedTenantId ||
                                                    ""
                                                }
                                                onValueChange={
                                                    onTenantChange
                                                }
                                            >
                                                {adminTenants.map(
                                                    (tenant) => (
                                                        <DropdownMenuRadioItem
                                                            key={
                                                                tenant.id
                                                            }
                                                            value={
                                                                tenant.id
                                                            }
                                                        >
                                                            {tenant.createdByUserName ||
                                                                tenant.createdByUserId}
                                                        </DropdownMenuRadioItem>
                                                    ),
                                                )}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Select
                                        value={selectedTenantId || ""}
                                        onValueChange={onTenantChange}
                                        disabled={
                                            adminTenants.length <= 1
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select tenant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {adminTenants.map(
                                                (tenant) => (
                                                    <SelectItem
                                                        key={
                                                            tenant.id
                                                        }
                                                        value={
                                                            tenant.id
                                                        }
                                                    >
                                                        {tenant.createdByUserName ||
                                                            tenant.createdByUserId}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                )
                            ) : null}

                            {enterprises.length <= 1 ? (
                                sidebarCollapsed ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 shrink-0"
                                                aria-label={
                                                    selectedEnterpriseLabel
                                                }
                                            >
                                                <Briefcase className="size-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            align="center"
                                            className="max-w-[min(280px,var(--radix-tooltip-content-available-width))]"
                                        >
                                            <p className="text-muted-foreground text-xs font-medium">
                                                {t(
                                                    "sidebar.enterprise",
                                                )}
                                            </p>
                                            <p className="text-sm font-medium leading-snug">
                                                {selectedEnterpriseLabel ||
                                                    "—"}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <div className="rounded-md border px-3 py-2 text-sm">
                                        {enterprises[0]?.name ||
                                            "No enterprise"}
                                    </div>
                                )
                            ) : sidebarCollapsed ? (
                                <DropdownMenu>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DropdownMenuTrigger
                                                asChild
                                            >
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 shrink-0"
                                                    aria-label={t(
                                                        "sidebar.enterprise",
                                                    )}
                                                >
                                                    <Briefcase className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            align="center"
                                            className="max-w-[min(280px,var(--radix-tooltip-content-available-width))]"
                                        >
                                            <p className="text-muted-foreground text-xs font-medium">
                                                {t(
                                                    "sidebar.enterprise",
                                                )}
                                            </p>
                                            <p className="text-sm font-medium leading-snug">
                                                {selectedEnterpriseLabel ||
                                                    "—"}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <DropdownMenuContent
                                        side="right"
                                        align="start"
                                        className="w-56"
                                    >
                                        <DropdownMenuLabel>
                                            {t(
                                                "sidebar.switchEnterprise",
                                            )}
                                        </DropdownMenuLabel>
                                        <DropdownMenuRadioGroup
                                            value={
                                                selectedEnterpriseId ||
                                                ""
                                            }
                                            onValueChange={
                                                onEnterpriseChange
                                            }
                                        >
                                            {enterprises.map(
                                                (enterprise) => (
                                                    <DropdownMenuRadioItem
                                                        key={
                                                            enterprise.id
                                                        }
                                                        value={
                                                            enterprise.id
                                                        }
                                                    >
                                                        {
                                                            enterprise.name
                                                        }
                                                    </DropdownMenuRadioItem>
                                                ),
                                            )}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Select
                                    value={selectedEnterpriseId || ""}
                                    onValueChange={onEnterpriseChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select enterprise" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {enterprises.map(
                                            (enterprise) => (
                                                <SelectItem
                                                    key={
                                                        enterprise.id
                                                    }
                                                    value={
                                                        enterprise.id
                                                    }
                                                >
                                                    {enterprise.name}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <NavMain items={filteredNavMain} />
                    {filteredAdminSaasNav.length > 0 ? (
                        <NavMain
                            items={filteredAdminSaasNav}
                            groupLabel={t("sidebar.adminSaasSection")}
                        />
                    ) : null}
                    {/* <NavProjects projects={filteredProjects} /> */}
                    {/* <SidebarGroup className="px-1">
                        {isCalendarPage ? <SidebarCalendar /> : null}
                    </SidebarGroup>
                    {isCalendarPage && (
                        <SidebarGroup className="px-1 mt-3 pt-4 border-t">
                            <SidebarGroupLabel className="uppercase text-muted-foreground/65">
                                Calendars
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {etiquettes.map((item) => (
                                        <SidebarMenuItem
                                            key={item.id}
                                        >
                                            <SidebarMenuButton
                                                asChild
                                                className="relative rounded-md [&>svg]:size-auto justify-between has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px]"
                                            >
                                                <span>
                                                    <span className="font-medium flex items-center justify-between gap-3">
                                                        <Checkbox
                                                            id={
                                                                item.id
                                                            }
                                                            className="sr-only peer"
                                                            checked={isColorVisible(
                                                                item.color,
                                                            )}
                                                            onCheckedChange={() =>
                                                                toggleColorVisibility(
                                                                    item.color,
                                                                )
                                                            }
                                                        />
                                                        <RiCheckLine
                                                            className="peer-not-data-[state=checked]:invisible"
                                                            size={16}
                                                            aria-hidden="true"
                                                        />
                                                        <label
                                                            htmlFor={
                                                                item.id
                                                            }
                                                            className="peer-not-data-[state=checked]:line-through peer-not-data-[state=checked]:text-muted-foreground/65 after:absolute after:inset-0"
                                                        >
                                                            {
                                                                item.name
                                                            }
                                                        </label>
                                                    </span>
                                                    <span
                                                        className="size-1.5 rounded-full bg-(--event-color)"
                                                        style={
                                                            {
                                                                "--event-color": `var(--color-${item.color}-400)`,
                                                            } as React.CSSProperties
                                                        }
                                                    ></span>
                                                </span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )} */}
                </SidebarContent>
                <SidebarFooter className="border-t px-3 py-2">
                    <p className="text-muted-foreground text-[10px] text-center">
                        v{__APP_VERSION__}
                    </p>
                </SidebarFooter>
            </Sidebar>
        </div>
    );
}
