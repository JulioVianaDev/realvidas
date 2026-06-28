"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useLocation } from "@tanstack/react-router";

export function NavMain({
    items,
    groupLabel,
}: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
    groupLabel?: string;
}) {
    const { pathname } = useLocation();
    return (
        <SidebarGroup>
            {groupLabel ? (
                <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
            ) : null}
            <SidebarMenu>
                {items.map((item) => {
                    // Leaf item (no sub-items) → render as a direct link.
                    if (!item.items?.length) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    className={
                                        item.url === pathname
                                            ? "bg-secondary text-white"
                                            : ""
                                    }
                                >
                                    <a href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    const isOpen = item.items?.some(
                        (subItem) => subItem.url === pathname,
                    );
                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            className="group/collapsible"
                            defaultOpen={isOpen}
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map(
                                            (subItem) => (
                                                <SidebarMenuSubItem
                                                    key={
                                                        subItem.title
                                                    }
                                                    className={
                                                        subItem.url ===
                                                        pathname
                                                            ? "bg-secondary text-white rounded-md"
                                                            : ""
                                                    }
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                    >
                                                        <a
                                                            href={
                                                                subItem.url
                                                            }
                                                        >
                                                            <span>
                                                                {
                                                                    subItem.title
                                                                }
                                                            </span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ),
                                        )}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
