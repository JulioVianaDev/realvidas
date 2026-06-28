// Calendar Share Entity Types

export type CalendarPermissionType = "READ" | "WRITE" | "OWNER";

export const CalendarPermissionValues: {
    READ: "READ";
    WRITE: "WRITE";
    OWNER: "OWNER";
} = {
    READ: "READ",
    WRITE: "WRITE",
    OWNER: "OWNER",
};

export interface ICalendarShareEntity {
    id: string;
    calendarId: string;
    memberId: string;
    permission: CalendarPermissionType;
    createdAt: Date;
    updatedAt: Date;
}

// Share with calendar info
export interface ICalendarShareWithCalendar extends ICalendarShareEntity {
    calendar: {
        id: string;
        name: string;
        googleCalendarId: string;
        color: string | null;
        description: string | null;
    };
}

// Share with member info
export interface ICalendarShareWithMember extends ICalendarShareEntity {
    member: {
        id: string;
        userId: string;
        role: string;
        user: {
            id: string;
            name: string;
            email: string;
            imageUrl: string | null;
        };
    };
}

// Full share info
export interface ICalendarShareFull extends ICalendarShareEntity {
    calendar: {
        id: string;
        name: string;
        googleCalendarId: string;
        color: string | null;
        description: string | null;
    };
    member: {
        id: string;
        userId: string;
        role: string;
        user: {
            id: string;
            name: string;
            email: string;
            imageUrl: string | null;
        };
    };
}

