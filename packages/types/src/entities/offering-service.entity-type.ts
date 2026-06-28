/**
 * Offering-service = a bookable service offering sold by the enterprise
 * (haircut, consultation, etc). Distinct from food catalog products and
 * distinct from NestJS @Injectable services.
 */
export interface IOfferingServiceEntity {
    id: string;
    enterpriseId: string;
    categoryId: string;
    name: string;
    description: string;
    /** Duration in minutes. */
    durationMin: number;
    /** Price in cents. */
    price: number;
    originalPrice: number | null;
    imageUrl: string | null;
    /** Professional IDs that can perform this offering. */
    professionalIds: string[];
    requiresScheduling: boolean;
    maxPerDay: number | null;
    tags: string[];
    notes: string | null;
    active: boolean;
    featured: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
