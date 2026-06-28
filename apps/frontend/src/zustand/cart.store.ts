import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ICartItemSnapshot } from "@global-types/entities/cart-item.entity-type";

/**
 * Cart is client-side only. It's keyed by enterpriseId so a customer browsing
 * multiple enterprises doesn't mix items. On checkout the snapshot is POSTed
 * to the public orders endpoint.
 */

function genId() {
    return (
        Math.random().toString(36).substring(2, 15) +
        Date.now().toString(36)
    );
}

interface CartPerEnterprise {
    items: ICartItemSnapshot[];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCpf: string;
    notes: string;
}

const emptyCart = (): CartPerEnterprise => ({
    items: [],
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerCpf: "",
    notes: "",
});

interface CartState {
    byEnterprise: Record<string, CartPerEnterprise>;
    get: (enterpriseId: string) => CartPerEnterprise;
    addItem: (
        enterpriseId: string,
        item: Omit<ICartItemSnapshot, "id">,
    ) => void;
    removeItem: (enterpriseId: string, itemId: string) => void;
    updateQuantity: (
        enterpriseId: string,
        itemId: string,
        quantity: number,
    ) => void;
    setCustomer: (
        enterpriseId: string,
        patch: Partial<
            Pick<
                CartPerEnterprise,
                | "customerName"
                | "customerEmail"
                | "customerPhone"
                | "customerCpf"
                | "notes"
            >
        >,
    ) => void;
    clear: (enterpriseId: string) => void;
    subtotal: (enterpriseId: string) => number;
    total: (enterpriseId: string) => number;
    itemCount: (enterpriseId: string) => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, getState) => ({
            byEnterprise: {},
            get: (enterpriseId) =>
                getState().byEnterprise[enterpriseId] ?? emptyCart(),
            addItem: (enterpriseId, item) =>
                set((s) => {
                    const cur = s.byEnterprise[enterpriseId] ?? emptyCart();
                    return {
                        byEnterprise: {
                            ...s.byEnterprise,
                            [enterpriseId]: {
                                ...cur,
                                items: [
                                    ...cur.items,
                                    { ...item, id: genId() },
                                ],
                            },
                        },
                    };
                }),
            removeItem: (enterpriseId, itemId) =>
                set((s) => {
                    const cur = s.byEnterprise[enterpriseId];
                    if (!cur) return s;
                    return {
                        byEnterprise: {
                            ...s.byEnterprise,
                            [enterpriseId]: {
                                ...cur,
                                items: cur.items.filter(
                                    (i) => i.id !== itemId,
                                ),
                            },
                        },
                    };
                }),
            updateQuantity: (enterpriseId, itemId, quantity) =>
                set((s) => {
                    const cur = s.byEnterprise[enterpriseId];
                    if (!cur) return s;
                    const items =
                        quantity <= 0
                            ? cur.items.filter((i) => i.id !== itemId)
                            : cur.items.map((i) =>
                                  i.id === itemId ? { ...i, quantity } : i,
                              );
                    return {
                        byEnterprise: {
                            ...s.byEnterprise,
                            [enterpriseId]: { ...cur, items },
                        },
                    };
                }),
            setCustomer: (enterpriseId, patch) =>
                set((s) => {
                    const cur = s.byEnterprise[enterpriseId] ?? emptyCart();
                    return {
                        byEnterprise: {
                            ...s.byEnterprise,
                            [enterpriseId]: { ...cur, ...patch },
                        },
                    };
                }),
            clear: (enterpriseId) =>
                set((s) => ({
                    byEnterprise: {
                        ...s.byEnterprise,
                        [enterpriseId]: emptyCart(),
                    },
                })),
            subtotal: (enterpriseId) => {
                const cur = getState().byEnterprise[enterpriseId];
                if (!cur) return 0;
                return cur.items.reduce(
                    (sum, i) => sum + i.unitPrice * i.quantity,
                    0,
                );
            },
            total: (enterpriseId) => {
                const cur = getState().byEnterprise[enterpriseId];
                if (!cur) return 0;
                return cur.items.reduce(
                    (sum, i) => sum + i.unitPrice * i.quantity,
                    0,
                );
            },
            itemCount: (enterpriseId) => {
                const cur = getState().byEnterprise[enterpriseId];
                if (!cur) return 0;
                return cur.items.reduce((sum, i) => sum + i.quantity, 0);
            },
        }),
        { name: "pixie-cart" },
    ),
);
