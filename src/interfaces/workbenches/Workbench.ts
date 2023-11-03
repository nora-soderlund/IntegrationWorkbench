import { WorkbenchCollection } from "./collections/WorkbenchCollection";

export type Workbench = {
    name: string;
    repository?: string;
    collections: WorkbenchCollection[];
};