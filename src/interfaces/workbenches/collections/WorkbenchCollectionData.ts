import { WorkbenchRequestData } from "../requests/WorkbenchRequestData";

export type WorkbenchCollectionData = {
    id: string;
    name: string;
    requests: WorkbenchRequestData[];
};
