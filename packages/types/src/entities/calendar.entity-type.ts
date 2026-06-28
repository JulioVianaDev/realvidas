// Calendar Entity Types

export interface ICalendarEntity {
    id: string;
    enterpriseId: string;

    // Google Calendar data
    googleCalendarId: string | null;
    name: string;
    description: string | null;
    color: string | null;
    timeZone: string | null;

    isActive: boolean;
    isMainCalendar: boolean; // Indica se é o calendário principal da empresa
    eventsQuantity: number; // Contador de eventos (mantido atomicamente)
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

// Calendar with enterprise info
export interface ICalendarWithEnterprise extends ICalendarEntity {
    enterprise: {
        id: string;
        name: string;
    };
}

// Calendar with shares count
export interface ICalendarWithCounts extends ICalendarEntity {
    _count: {
        shares: number;
        events: number;
    };
}

// Full calendar info
export interface ICalendarFull extends ICalendarEntity {
    enterprise: {
        id: string;
        name: string;
    };
    _count: {
        shares: number;
        events: number;
    };
}
