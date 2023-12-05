import { UserInput } from "../UserInput";

export type EnvironmentUserDataAwsSharedCredentialsFile = {
  configuration: "sharedCredentialsFile";
  profile: string;
};

export type EnvironmentUserDataAwsEnvironmentVariables = {
  configuration: "environmentVariables";
  environmentVariables: {
    accessKeyId: UserInput;
    secretAccessKey: UserInput;
    sessionToken: UserInput;
  };
};

export type EnvironmentUserDataAwsJsonFile = {
  configuration: "jsonFile";
  filePath: string;
};

export type EnvironmentUserData = {
  integrations: {
    aws?: 
      | EnvironmentUserDataAwsSharedCredentialsFile
      | EnvironmentUserDataAwsEnvironmentVariables
      | EnvironmentUserDataAwsJsonFile;
  };
};
