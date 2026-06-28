import {
    EventStatusType,
    IEventAttendee,
} from "../entities/calendar-event.entity-type";

export interface ICreateCalendarEventBodyRequest {
    title: string;
    description?: string | null;
    location?: string | null;
    startTime: Date | string;
    endTime: Date | string;
    isAllDay?: boolean;
    attendees?: IEventAttendee[];
    recurrenceRule?: string | null;
    color?: string | null;
}

export interface IUpdateCalendarEventBodyRequest {
    title?: string;
    description?: string | null;
    location?: string | null;
    startTime?: Date | string;
    endTime?: Date | string;
    isAllDay?: boolean;
    attendees?: IEventAttendee[];
    recurrenceRule?: string | null;
    status?: EventStatusType;
    color?: string | null;
}

export interface ISyncCalendarEventsBodyRequest {
    startDate?: Date | string;
    endDate?: Date | string;
    forceSync?: boolean;
}
