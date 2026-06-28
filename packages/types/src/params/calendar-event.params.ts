import { EventStatusType } from "../entities/calendar-event.entity-type";

export interface IGetCalendarEventsParams {
    calendarId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    startDate?: Date | string;
    endDate?: Date | string;
    status?: EventStatusType | "ALL";
    isRecurring?: boolean;
}

export interface IGetEventByIdParams {
    id: string;
}

export interface IGetEventByGoogleIdParams {
    googleEventId: string;
}

export interface IGetMyEventsParams {
    enterpriseId: string;
    memberId: string;
    startDate?: Date | string;
    endDate?: Date | string;
    page?: number;
    pageSize?: number;
}

export interface IGetEnterpriseEventsParams {
    enterpriseId: string;
    startDate?: Date | string;
    endDate?: Date | string;
    page?: number;
    pageSize?: number;
    search?: string;
    status?: EventStatusType | "ALL";
    userId?: string; // Filter by user ID (single)
    userIds?: string[]; // Filter by multiple user IDs
    calendarId?: string; // Filter by calendar ID (single)
    calendarIds?: string[]; // Filter by multiple calendar IDs
    view?: "day" | "week" | "month" | "year"; // Calendar view type for date range calculation
    viewDate?: Date | string; // The date to use for view-based date range calculation
}
