import { UserInput } from "../UserInput";

export type EnvironmentData = {
  name: string;
  description?: string;
  
  variables: UserInput[];
  variablesAutoRefresh: boolean;
};
