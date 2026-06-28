export interface ICreateCalendarBodyRequest {
    name: string;
    description?: string | null;
    color?: string | null;
    timeZone?: string | null;
    isMainCalendar?: boolean; // Set to true to make this the main calendar (will unset others)
}

export interface IUpdateCalendarBodyRequest {
    name?: string;
    description?: string | null;
    color?: string | null;
    timeZone?: string | null;
    isActive?: boolean;
    isMainCalendar?: boolean; // Set to true to make this the main calendar (will unset others)
}

export interface ISyncCalendarsBodyRequest {
    forceSync?: boolean;
}

