import { UserInput } from "../UserInput";

export type EnvironmentData = {
  id: string;
  name: string;
  description?: string;

  variables: UserInput[];
  variablesFilePath?: string;
  variablesAutoRefresh: boolean;
};
