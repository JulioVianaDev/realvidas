import { Paginate } from "../helpers/paginate";
import {
    ICalendarEventEntity,
    ICalendarEventEntityWithCalendar,
} from "../entities/calendar-event.entity-type";

export type IGetCalendarEventsResponse = Paginate<ICalendarEventEntity>;

export type IGetEventByIdResponse = ICalendarEventEntityWithCalendar | null;

export type IGetMyEventsResponse = Paginate<ICalendarEventEntityWithCalendar>;

export type ICreateCalendarEventResponse = ICalendarEventEntityWithUser;

export type IUpdateCalendarEventResponse = ICalendarEventEntityWithUser;

export interface IDeleteCalendarEventResponse {
    success: boolean;
    id: string;
}

export interface ISyncCalendarEventsResponse {
    success: boolean;
    message: string;
    syncedCount: number;
    events: ICalendarEventEntity[];
}

// Calendar Event with User Info (for frontend compatibility)
// User is extracted from calendar.user to top level for convenience
export interface ICalendarEventEntityWithUser extends ICalendarEventEntityWithCalendar {
    user: {
        id: string;
        name: string;
        email: string;
        imageUrl: string | null;
    } | null;
}

export type IGetEnterpriseEventsResponse = Paginate<ICalendarEventEntityWithUser>;

