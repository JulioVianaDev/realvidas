export interface ICartSelectedIncrement {
    incrementGroupId: string;
    incrementId: string;
    quantity: number;
}

/**
 * Snapshot of a product/combo at the moment it was added to cart or order.
 * Stored as JSONB in orders so that later edits to the product don't
 * retroactively change historical orders.
 */
export interface ICartItemSnapshot {
    id: string;
    type: "product" | "combo";
    productId: string | null;
    comboId: string | null;
    name: string;
    imageUrl: string | null;
    quantity: number;
    /** Unit price in cents at the moment of purchase. */
    unitPrice: number;
    selectedIncrements: ICartSelectedIncrement[];
    notes: string | null;
}
