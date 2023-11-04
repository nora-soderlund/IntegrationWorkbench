import { WorkbenchStorage } from "./WorkbenchStorage";
import { WorkbenchCollectionData } from "./collections/WorkbenchCollectionData";

export type WorkbenchData = {
  id: string;
  name: string;
  repository?: string;
  storage: WorkbenchStorage;
  collections: WorkbenchCollectionData[];
};
