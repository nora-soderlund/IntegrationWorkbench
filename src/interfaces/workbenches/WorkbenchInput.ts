import { WorkbenchStorage } from "./WorkbenchStorage";
import { WorkbenchCollection } from "./collections/WorkbenchCollection";

export type WorkbenchInput = {
  name: string;
  repository?: string;
  storage: WorkbenchStorage;
  collections: WorkbenchCollection[];
};
