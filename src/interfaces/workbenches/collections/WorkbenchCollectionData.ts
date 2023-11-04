import { WorkbenchRequestData } from "../requests/WorkbenchRequestData";

export type WorkbenchCollectionData = {
    name: string;
    requests: WorkbenchRequestData[];
};
