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
const getNavigationData = (t: (key: string) => string) => ({
    navMain: [
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
            title: t("sidebar.scheduling"),
            url: "#",
            icon: Calendar,
            allowedRoles: ["ADMIN", "USER"] as RoleType[],
            items: [
                {
                    title: t("sidebar.events"),
                    url: "/events",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.calendar"),
                    url: "/calendars",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.chat"),
                    url: "/chat",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.scheduleProfiles"),
                    url: "/schedules",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
            ],
        },
        {
            title: t("sidebar.reports"),
            url: "/reports",
            icon: BarChart,
            allowedRoles: ["ADMIN", "USER"] as RoleType[],
            items: [
                {
                    title: t("sidebar.appointments"),
                    url: "/reports/appointments",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.messages"),
                    url: "/reports/messages",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
            ],
        },
        {
            title: t("sidebar.sellerArea"),
            url: "/seller",
            icon: User2Icon,
            allowedRoles: ["ADMIN", "USER"] as RoleType[],
            items: [
                {
                    title: t("sidebar.sales"),
                    url: "/seller/sales",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.createCoupons"),
                    url: "/seller/create-coupons",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.payments"),
                    url: "/seller/payments",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
            ],
        },
        {
            title: t("sidebar.catalog"),
            url: "/catalog",
            icon: LayoutGrid,
            allowedRoles: ["ADMIN", "USER"] as RoleType[],
            items: [
                {
                    title: t("sidebar.catalogOverview"),
                    url: "/catalog",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.catalogView"),
                    url: "/catalog/view",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.categories"),
                    url: "/catalog/categories",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.products"),
                    url: "/catalog/products",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.combos"),
                    url: "/catalog/combos",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
            ],
        },
        {
            title: t("sidebar.offerings"),
            url: "/offerings",
            icon: ClipboardList,
            allowedRoles: ["ADMIN", "USER"] as RoleType[],
            items: [
                {
                    title: t("sidebar.offeringsOverview"),
                    url: "/offerings",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.offeringsServices"),
                    url: "/offerings/services",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.offeringsCategories"),
                    url: "/offerings/categories",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.offeringsProfessionals"),
                    url: "/offerings/professionals",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
            ],
        },
        {
            title: t("sidebar.pipelines"),
            url: "/pipelines",
            icon: KanbanSquare,
            allowedRoles: ["ADMIN", "USER"] as RoleType[],
            items: [
                {
                    title: t("sidebar.pipelinesList"),
                    url: "/pipelines",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
            ],
        },
        {
            title: t("sidebar.customers"),
            url: "/customers",
            icon: Users,
            allowedRoles: ["ADMIN", "USER"] as RoleType[],
            items: [
                {
                    title: t("sidebar.customersList"),
                    url: "/customers",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.campaignsList"),
                    url: "/customers/campaigns",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
            ],
        },
        {
            title: t("sidebar.artificialIntelligence"),
            url: "/ai",
            icon: Brain,
            allowedRoles: ["ADMIN", "USER"] as RoleType[],
            items: [
                {
                    title: t("sidebar.assistants"),
                    url: "/ai/assistants",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.tools"),
                    url: "/ai/tools",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.ralphs"),
                    url: "/ai/ralphs",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.usage"),
                    url: "/ai/usage",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
            ],
        },

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
                    title: t("sidebar.flows"),
                    url: "/settings/flows",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.socialMedias"),
                    url: "/settings/social-medias",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.configurationEnterprises"),
                    url: "/configuration/enterprise",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
            ],
        },
        {
            title: t("sidebar.administrative"),
            url: "/administrative",
            icon: Database,
            allowedRoles: ["ADMIN", "USER"] as RoleType[],
            items: [
                {
                    title: t("sidebar.logs"),
                    url: "/logs",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.dashboard"),
                    url: "/adm/dashboard",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.myPayments"),
                    url: "/payments",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.myPlan"),
                    url: "/subscription",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.paymentsMonitoring"),
                    url: "/adm/payments-dashboard",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.credits"),
                    url: "/credits",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
                {
                    title: t("sidebar.enterprise"),
                    url: "/enterprise",
                    allowedRoles: ["ADMIN", "USER"] as RoleType[],
                },
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

type NavItemWithTitle = {
    title: string;
    allowedRoles?: RoleType[];
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
): T[] => {
    return items
        .filter((item) => hasAccess(item.allowedRoles, userRole))
        .map((item) => {
            if (!item.items?.length) {
                return item;
            }

            return {
                ...item,
                items: item.items.filter((subItem) =>
                    hasAccess(subItem.allowedRoles, userRole),
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

    const isCalendarPage = pathname === "/calendar";

    const data = React.useMemo(() => getNavigationData(t), [t]);

    const filteredNavMain = React.useMemo(() => {
        return sortNavItemsByTitleAsc(
            filterNavItems(data.navMain, user?.role),
        );
    }, [data.navMain, user?.role]);

    const filteredProjects = React.useMemo(() => {
        return sortNavItemsByTitleAsc(
            filterNavItems(data.projects, user?.role),
        );
    }, [data.projects, user?.role]);

    const filteredAdminSaasNav = React.useMemo(() => {
        return sortNavItemsByTitleAsc(
            filterNavItems(data.adminSaasNav, user?.role),
        );
    }, [data.adminSaasNav, user?.role]);

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
