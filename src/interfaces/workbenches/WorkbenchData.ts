import { WorkbenchCollectionData } from "./collections/WorkbenchCollectionData";
import { WorkbenchRequestData } from "./requests/WorkbenchRequestData";

export type WorkbenchData = {
  id: string;
  name: string;
  description?: string;
  repository?: string;
  requests: WorkbenchRequestData[];
  collections: WorkbenchCollectionData[];
};
