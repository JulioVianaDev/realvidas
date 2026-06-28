import { CalendarPermissionType } from "../entities/calendar-share.entity-type";

export interface IGetCalendarSharesParams {
    calendarId: string;
    page?: number;
    pageSize?: number;
    permission?: CalendarPermissionType | "ALL";
}

export interface IGetMemberCalendarSharesParams {
    memberId: string;
    page?: number;
    pageSize?: number;
}

export interface IGetCalendarShareByIdParams {
    id: string;
}
