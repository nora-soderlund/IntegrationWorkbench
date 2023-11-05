import { WorkbenchStorage } from "./WorkbenchStorage";
import { WorkbenchCollectionData } from "./collections/WorkbenchCollectionData";
import { WorkbenchRequestData } from "./requests/WorkbenchRequestData";

export type WorkbenchData = {
  id: string;
  name: string;
  repository?: string;
  storage: WorkbenchStorage;
  requests: WorkbenchRequestData[];
  collections: WorkbenchCollectionData[];
};
