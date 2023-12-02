import { readFileSync, rmSync, writeFileSync } from "fs";
import EnvironmentTreeItem from "../views/trees/environments/items/EnvironmentTreeItem";
import { EnvironmentData } from "~interfaces/entities/EnvironmentData";
import { ExtensionContext, commands } from "vscode";
import { EnvironmentWebviewPanel } from "../views/webviews/environments/EnvironmentWebviewPanel";
import Scripts from "../Scripts";

export default class Environment {
  public data: EnvironmentData;

  public requestWebviewPanel?: EnvironmentWebviewPanel;
  public treeDataViewItem?: EnvironmentTreeItem;

  constructor(public filePath: string) {
    this.data = JSON.parse(
      readFileSync(this.filePath, {
        encoding: "utf-8"
      })
    );
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

  async getParsedVariables(abortController: AbortController) {
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

      for(let header of this.data.variables) {
        try {
          const value = await Scripts.evaluateUserInput(header);

          variables.push({
            key: header.key,
            value
          });
        }
        catch(error) {
          reject(error);
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
		
    commands.executeCommand("integrationWorkbench.openEnvironment", this);
  }

  deleteWebviewPanel() {
    delete this.requestWebviewPanel;
  }

  disposeWebviewPanel() {
    this.requestWebviewPanel?.dispose();
  }
}
