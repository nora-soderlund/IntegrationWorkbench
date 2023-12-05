import { VSCodeButton, VSCodeDivider, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { EnvironmentProps } from "./Environment";
import React from "react";
import Input from "../../components/inputs/Input";
import { EnvironmentUserData } from "../../../interfaces/entities/EnvironmentUserData";
import { UserInput } from "../../../interfaces/UserInput";

export default function EnvironmentIntegrations({ environmentData, environmentUserData }: EnvironmentProps) {
  return (
    <div>
      <p>External integrations for this environment. These settings are only kept locally and connected to this environment, but is not saved to the workspace itself.</p>

      <VSCodeDivider style={{
        margin: "1em 0"
      }}/>

      <div>
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}>
          <div>
            <p><b>AWS Integration</b></p>
            <p>Configure your AWS credentials to send EventBridge events and SNS messages via requests.</p>
          </div>

          {(environmentUserData.integrations.aws) && (
            <div style={{
              marginLeft: "auto",
              marginTop: "auto",
              marginBottom: "auto"
            }}>
              <VSCodeButton appearance="secondary" onClick={() => {
                delete environmentUserData.integrations.aws;

                window.vscode.postMessage({
                  command: "norasoderlund.integrationworkbench.updateEnvironmentUserData",
                  arguments: [ environmentUserData ]
                });
              }}>
                Disable AWS Integration
              </VSCodeButton>
            </div>
          )}
        </div>

        {(environmentUserData.integrations.aws)?(
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em"
          }}>
            <div>
              <VSCodeDropdown value={environmentUserData.integrations.aws.configuration} onChange={(event) => {
                const value = (event.target as HTMLInputElement).value;

                switch(value) {
                  case "sharedCredentialsFile": {
                    environmentUserData.integrations.aws = {
                      configuration: "sharedCredentialsFile",
                      profile: "default"
                    };

                    break;
                  }

                  case "environmentVariables": {
                    const emptyUserInput: UserInput = {
                      key: "",
                      value: "",
                      type: "typescript"
                    };

                    environmentUserData.integrations.aws = {
                      configuration: "environmentVariables",
                      environmentVariables: {
                        accessKeyId: {
                          ...emptyUserInput
                        },
                        secretAccessKey: {
                          ...emptyUserInput
                        },
                        sessionToken: {
                          ...emptyUserInput
                        }
                      }
                    };

                    break;
                  }

                  case "jsonFile": {
                    environmentUserData.integrations.aws = {
                      configuration: "jsonFile",
                      filePath: ""
                    };

                    break;
                  }
                }

                window.vscode.postMessage({
                  command: "norasoderlund.integrationworkbench.updateEnvironmentUserData",
                  arguments: [ environmentUserData ]
                });
              }}>
                <VSCodeOption value="sharedCredentialsFile">Credentials from the Shared Credentials File</VSCodeOption>
                <VSCodeOption value="environmentVariables">Credentials from Environment Variables</VSCodeOption>
                <VSCodeOption value="jsonFile">Credentials from a JSON File</VSCodeOption>
              </VSCodeDropdown>
            </div>

            {
              (() => {
                switch(environmentUserData.integrations.aws.configuration) {
                  case "sharedCredentialsFile": {
                    return (
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5em"
                      }}>
                        <div>
                          <VSCodeTextField type="text" placeholder="Enter a profile name..." value={environmentUserData.integrations.aws.profile} onChange={(event) => {
                            if(environmentUserData.integrations.aws?.configuration !== "sharedCredentialsFile") {
                              return;
                            }

                            environmentUserData.integrations.aws.profile = (event.target as HTMLInputElement).value;

                            window.vscode.postMessage({
                              command: "norasoderlund.integrationworkbench.updateEnvironmentUserData",
                              arguments: [ environmentUserData ]
                            });
                          }}/>
                        </div>

                        <small>Name of the profile in the shared credentials file</small>
                      </div>
                    );
                  }

                  case "environmentVariables": {
                    return (
                      <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: "2em"
                      }}>
                        <div style={{
                          flex: "1 1 0"
                        }}>
                          <p><b>AWS_ACCESS_KEY_ID</b></p>

                          <Input
                            type={environmentUserData.integrations.aws.environmentVariables.accessKeyId.type}
                            value={environmentUserData.integrations.aws.environmentVariables.accessKeyId.value}
                            onChange={(value) => {
                              if(environmentUserData.integrations.aws?.configuration !== "environmentVariables") {
                                return;
                              }

                              environmentUserData.integrations.aws.environmentVariables.accessKeyId.value = value;

                              window.vscode.postMessage({
                                command: "norasoderlund.integrationworkbench.updateEnvironmentUserData",
                                arguments: [ environmentUserData ]
                              });
                            }} onChangeType={(type) => {
                              if(environmentUserData.integrations.aws?.configuration !== "environmentVariables") {
                                return;
                              }

                              environmentUserData.integrations.aws.environmentVariables.accessKeyId.type = type;

                              window.vscode.postMessage({
                                command: "norasoderlund.integrationworkbench.updateEnvironmentUserData",
                                arguments: [ environmentUserData ]
                              });
                            }}/>
                        </div>

                        <div style={{
                          flex: "1 1 0"
                        }}>
                        <p><b>AWS_SECRET_ACCESS_KEY</b></p>

                        <Input
                          type={environmentUserData.integrations.aws.environmentVariables.secretAccessKey.type}
                          value={environmentUserData.integrations.aws.environmentVariables.secretAccessKey.value}
                          onChange={(value) => {
                            if(environmentUserData.integrations.aws?.configuration !== "environmentVariables") {
                              return;
                            }

                            environmentUserData.integrations.aws.environmentVariables.secretAccessKey.value = value;

                            window.vscode.postMessage({
                              command: "norasoderlund.integrationworkbench.updateEnvironmentUserData",
                              arguments: [ environmentUserData ]
                            });
                          }} onChangeType={(type) => {
                            if(environmentUserData.integrations.aws?.configuration !== "environmentVariables") {
                              return;
                            }

                            environmentUserData.integrations.aws.environmentVariables.secretAccessKey.type = type;

                            window.vscode.postMessage({
                              command: "norasoderlund.integrationworkbench.updateEnvironmentUserData",
                              arguments: [ environmentUserData ]
                            });
                          }}/>
                        </div>

                        <div style={{
                          flex: "1 1 0"
                        }}>
                        <p><b>AWS_SESSION_TOKEN</b></p>

                        <Input
                          type={environmentUserData.integrations.aws.environmentVariables.sessionToken.type}
                          value={environmentUserData.integrations.aws.environmentVariables.sessionToken.value}
                          onChange={(value) => {
                            if(environmentUserData.integrations.aws?.configuration !== "environmentVariables") {
                              return;
                            }

                            environmentUserData.integrations.aws.environmentVariables.sessionToken.value = value;

                            window.vscode.postMessage({
                              command: "norasoderlund.integrationworkbench.updateEnvironmentUserData",
                              arguments: [ environmentUserData ]
                            });
                          }} onChangeType={(type) => {
                              if(environmentUserData.integrations.aws?.configuration !== "environmentVariables") {
                                return;
                              }

                            environmentUserData.integrations.aws.environmentVariables.sessionToken.type = type;

                            window.vscode.postMessage({
                              command: "norasoderlund.integrationworkbench.updateEnvironmentUserData",
                              arguments: [ environmentUserData ]
                            });
                          }}/>
                        </div>
                      </div>
                    );
                  }

                  case "jsonFile": {
                    if(environmentUserData.integrations.aws.filePath?.length) {
                      <div>
                        <VSCodeButton style={{ margin: "auto 0" }} appearance="secondary" onClick={() => {
                          if(environmentUserData.integrations.aws?.configuration !== "jsonFile") {
                            return;
                          }

                          environmentUserData.integrations.aws.filePath = "";

                          window.vscode.postMessage({
                            command: "norasoderlund.integrationworkbench.updateEnvironmentUserData",
                            arguments: [ environmentUserData ]
                          });
                        }}>
                          Remove file
                        </VSCodeButton>

                        Selected file:{" "}
                        
                        <VSCodeLink onClick={() => 
                          window.vscode.postMessage({
                            command: "norasoderlund.integrationworkbench.openEnvironmentUserDataAwsIntegrationJsonFile",
                            arguments: []
                          })
                        }>
                          {environmentUserData.integrations.aws.filePath.substring(environmentUserData.integrations.aws.filePath.lastIndexOf('/') + 1)}
                        </VSCodeLink>
                      </div>
                    }

                    return (
                      <div>
                        <VSCodeButton onClick={() => 
                          window.vscode.postMessage({
                            command: "norasoderlund.integrationworkbench.updateEnvironmentUserDataAwsIntegrationJsonFile",
                            arguments: []
                          })
                        }>
                          Select file
                        </VSCodeButton>
                      
                        No file selected
                      </div>
                    );
                  }
                }
              })()
            }
          </div>
        ):(
          <VSCodeButton appearance="primary" onClick={() => {
            environmentUserData.integrations.aws = {
              configuration: "sharedCredentialsFile",
              profile: "default"
            };

            window.vscode.postMessage({
              command: "norasoderlund.integrationworkbench.updateEnvironmentUserData",
              arguments: [ environmentUserData ]
            });
          }}>
            Enable AWS Integration
          </VSCodeButton>
        )}
      </div>
    </div>
  );
}
