import { existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import EnvironmentTreeItem from "../../views/trees/environments/items/EnvironmentTreeItem";
import { EnvironmentData } from "~interfaces/entities/EnvironmentData";
import { ExtensionContext, commands } from "vscode";
import { EnvironmentWebviewPanel } from "../../views/webviews/environments/EnvironmentWebviewPanel";
import Scripts from "../../instances/Scripts";
import { parse } from "dotenv";
import { EnvironmentUserData } from "~interfaces/entities/EnvironmentUserData";
import { randomUUID } from "crypto";
import Environments from "../../instances/Environments";

export default class Environment {
  public data: EnvironmentData;
  public userData: EnvironmentUserData;

  public requestWebviewPanel?: EnvironmentWebviewPanel;
  public treeDataViewItem?: EnvironmentTreeItem;

  constructor(public context: ExtensionContext, public filePath: string) {
    this.data = JSON.parse(
      readFileSync(this.filePath, {
        encoding: "utf-8"
      })
    );

    // Prior to 0.9.8, environments did not have an unique identifier.
    if(!this.data.id) {
      this.data.id = randomUUID();

      this.save();
    }

    this.userData = context.workspaceState.get(`environment-${this.data.id}`, {
      integrations: {}
    });
  }

  save() {
    writeFileSync(
      this.filePath,
      JSON.stringify(
        this.data,
        undefined,
        2
      ),
      { 
        encoding: "utf-8"
      }
    );
  }

  saveUserData(userData: EnvironmentUserData) {
    this.context.workspaceState.update(`environment-${this.data.id}`, userData);

    this.userData = userData;
  }

  getVariables() {
    const variables: string[] = [];

    if(this.data.variablesFilePath) {
      if(existsSync(this.data.variablesFilePath)) {
        const content = readFileSync(this.data.variablesFilePath, {
          encoding: "utf-8"
        });

        variables.push(...Object.keys(parse(content)));
      }
    }

    for(let header of this.data.variables) {
      variables.push(header.key);
    }
    
    return variables;
  }

  async getParsedVariables(abortController: AbortController, allowEnvironmentVariableUserInputs: boolean = true) {
    return new Promise<{
      key: string;
      value: string
    }[]>(async (resolve, reject) => {
      const abortListener = () => reject("Aborted.");
      abortController.signal.addEventListener("abort", abortListener);

      const variables: {
        key: string;
        value: string
      }[] = [];

      if(this.data.variablesFilePath) {
        if(existsSync(this.data.variablesFilePath)) {
          const content = readFileSync(this.data.variablesFilePath, {
            encoding: "utf-8"
          });

          const entries = Object.entries(parse(content));

          for(let entry of entries) {
            variables.push({
              key: entry[0],
              value: entry[1]
            });
          }
        }
      }

      if(allowEnvironmentVariableUserInputs) {
        for(let header of this.data.variables) {
          try {
            const value = await Scripts.evaluateUserInput(header, false);

            variables.push({
              key: header.key,
              value
            });
          }
          catch(error) {
            reject(error);
          }
        }
      }

      abortController.signal.removeEventListener("abort", abortListener);

      resolve(variables);
    });
  }

  delete() {
    rmSync(this.filePath);
  }

  showWebviewPanel(context: ExtensionContext) {
    if(!this.requestWebviewPanel) {
      this.requestWebviewPanel = new EnvironmentWebviewPanel(context, this);
    }
    else {
      this.requestWebviewPanel.reveal();
    }
		
    //commands.executeCommand("norasoderlund.integrationworkbench.openEnvironment", this);
  }

  deleteWebviewPanel() {
    delete this.requestWebviewPanel;
  }

  disposeWebviewPanel() {
    this.requestWebviewPanel?.dispose();
  }

  async getAwsCredentials() {
    if(!this.userData.integrations.aws) {
      throw new Error("The selected environment must have the AWS integration enabled and configured.");
    }

    switch(this.userData.integrations.aws.configuration) {
      case "environmentVariables": {
        return {
          accessKeyId: await Scripts.evaluateUserInput(this.userData.integrations.aws.environmentVariables.accessKeyId),
          secretAccessKey: await Scripts.evaluateUserInput(this.userData.integrations.aws.environmentVariables.secretAccessKey),
          sessionToken: await Scripts.evaluateUserInput(this.userData.integrations.aws.environmentVariables.sessionToken)
        }
      }

      default: {
        throw new Error("Invalid")
      }
    }
  }
}
