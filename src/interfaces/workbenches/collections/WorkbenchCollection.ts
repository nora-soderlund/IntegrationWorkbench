import { WorkbenchRequest } from "../requests/WorkbenchRequest";

export type WorkbenchCollection = {
    name: string;
    requests: WorkbenchRequest[];
};
