import { DefaultWorkbenchStorage } from "../configuration/DefaultWorkbenchStorage"

export type WorkbenchStorage = {
  location: Omit<DefaultWorkbenchStorage, "prompt">;
  base?: string;
};
