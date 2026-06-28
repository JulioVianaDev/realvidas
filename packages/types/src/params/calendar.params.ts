export interface IGetCalendarsParams {
    enterpriseId: string;
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
}

export interface IGetCalendarByIdParams {
    id: string;
}

export interface IGetMyCalendarsParams {
    enterpriseId: string;
    memberId: string;
    page?: number;
    pageSize?: number;
}

export interface IGetCalendarByGoogleIdParams {
    googleCalendarId: string;
}

