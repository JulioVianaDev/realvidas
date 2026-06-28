import { Paginate } from "../helpers/paginate";
import {
    ICalendarShareEntity,
    ICalendarShareWithCalendar,
    ICalendarShareWithMember,
    ICalendarShareFull,
} from "../entities/calendar-share.entity-type";

export type IGetCalendarSharesResponse = Paginate<ICalendarShareWithMember>;

export type IGetMemberCalendarSharesResponse = Paginate<ICalendarShareWithCalendar>;

export type IGetCalendarShareByIdResponse = ICalendarShareFull | null;

export type ICreateCalendarShareResponse = ICalendarShareEntity;

export type IUpdateCalendarShareResponse = ICalendarShareEntity;

export interface IDeleteCalendarShareResponse {
    success: boolean;
    id: string;
}

