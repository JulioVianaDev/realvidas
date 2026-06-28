// Calendar Event Entity Types

export type EventStatusType = "CONFIRMED" | "TENTATIVE" | "CANCELLED";

export const EventStatusValues: {
    CONFIRMED: "CONFIRMED";
    TENTATIVE: "TENTATIVE";
    CANCELLED: "CANCELLED";
} = {
    CONFIRMED: "CONFIRMED",
    TENTATIVE: "TENTATIVE",
    CANCELLED: "CANCELLED",
};
export type EventColor =
    | "blue"
    | "green"
    | "red"
    | "yellow"
    | "purple"
    | "orange";

export interface ICalendarEventEntity {
    id: string;
    calendarId: string;

    // Google Calendar Event data
    googleEventId?: string;
    title: string;
    description: string | null;
    location: string | null;

    startTime: Date | string;
    endTime: Date | string;
    isAllDay: boolean;

    // Recurrence
    isRecurring: boolean;
    recurrenceRule: string | null;

    // Attendees
    attendees: any | null; // JSON

    // Metadata
    status: EventStatusType;
    color: EventColor;

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

// Event with calendar info
export interface ICalendarEventEntityWithCalendar
    extends ICalendarEventEntity {
    calendar: {
        id: string;
        name: string;
        googleCalendarId: string | null;
        enterpriseId: string;
        userId?: string | null;
        isMainCalendar?: boolean;
        user?: {
            id: string;
            name: string;
            email: string;
            imageUrl: string | null;
        } | null;
    };
}

// Attendee type
export interface IEventAttendee {
    email: string;
    displayName?: string;
    responseStatus?:
        | "needsAction"
        | "declined"
        | "tentative"
        | "accepted";
    optional?: boolean;
}

export interface ICalendarCell {
    day: number;
    currentMonth: boolean;
    date: Date;
}