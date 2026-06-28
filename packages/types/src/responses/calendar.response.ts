import { Paginate } from "../helpers/paginate";
import {
    ICalendarEntity,
    ICalendarWithEnterprise,
    ICalendarWithCounts,
    ICalendarFull,
} from "../entities/calendar.entity-type";

export type IGetCalendarsResponse = Paginate<ICalendarWithCounts>;

export type IGetCalendarByIdResponse = ICalendarFull | null;

export type IGetMyCalendarsResponse = Paginate<ICalendarWithCounts>;

export type ICreateCalendarResponse = ICalendarEntity;

export type IUpdateCalendarResponse = ICalendarEntity;

export interface IDeleteCalendarResponse {
    success: boolean;
    id: string;
}

export interface ISyncCalendarsResponse {
    success: boolean;
    message: string;
    syncedCount: number;
    calendars: ICalendarEntity[];
}

