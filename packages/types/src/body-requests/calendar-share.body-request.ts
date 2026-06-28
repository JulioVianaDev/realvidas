import { CalendarPermissionType } from "../entities/calendar-share.entity-type";

export interface ICreateCalendarShareBodyRequest {
    memberId: string;
    permission: CalendarPermissionType;
}

export interface IUpdateCalendarShareBodyRequest {
    permission: CalendarPermissionType;
}
