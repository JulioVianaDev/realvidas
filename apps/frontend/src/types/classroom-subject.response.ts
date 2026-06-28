import { SubjectTypeReturn } from './subject';

export interface IGetClassroomSubjectsResponse {
    data: SubjectTypeReturn[];
    metadata: {
        total: number;
    };
} 