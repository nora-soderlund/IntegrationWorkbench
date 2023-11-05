import { WorkbenchRequestData } from "../requests/WorkbenchRequestData";

export type WorkbenchCollectionData = {
    id: string;
    name: string;
    description?: string;
    requests: WorkbenchRequestData[];
};
