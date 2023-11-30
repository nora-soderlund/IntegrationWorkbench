import { ExtensionContext, commands, window } from "vscode";
import path from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import Script from "../../scripts/Script";
import Scripts from "../../Scripts";
import getRootPath from "../../utils/GetRootPath";

export default class CreateScriptCommand {
  constructor(private readonly context: ExtensionContext) {
    context.subscriptions.push(
      commands.registerCommand('integrationWorkbench.createScript', this.handle.bind(this))
    );
  }
  
  async handle() {
    const rootPath = getRootPath();

    if(!rootPath) {
      window.showErrorMessage("You must be in a workspace to create a script!");

      return;
    }
  
    const scriptsPath = path.join(rootPath, ".workbench/", "scripts/");

    try {
      if(!existsSync(scriptsPath)) {
        mkdirSync(scriptsPath, {
          recursive: true
        });
      }

      const scriptGitignoreFile = path.join(rootPath, ".workbench/", "scripts/", ".gitignore");

      if(!existsSync(scriptGitignoreFile)) {
        writeFileSync(scriptGitignoreFile, "# This is an automatically created file, do not make permanent changes here.\nbuild/", {
          encoding: "utf-8"
        });
      }
    }
    catch(error) {
      window.showErrorMessage("Failed to create workbenches folder: " + error);

      return;
    }

    const name = await window.showInputBox({
      placeHolder: "Enter the name of this script:",
  
      validateInput(value) {
        if(!value.length) {
          return "You must enter a name for this script!";
        }

        if(/[^A-Za-z0-9_-]/.test(value)) {
          return "You must only enter a generic file name.";
        }

        if(existsSync(path.join(scriptsPath, value + ".ts"))) {
          return "There already exists a script with this name in this folder!";
        }
  
        return null;
      },
    });
  
    if(!name) {
      return;
    }

    const filePath = path.join(scriptsPath, name + ".ts");

    const script = new Script(rootPath, {
      name,
      description: "",
      type: "typescript",
      dependencies: []
    });

    script.setContent(`function ${name}(): string {\n  // Your code goes here...\n\n  return "Hello world!";\n}\n`);

    Scripts.loadedScripts.push(script);

    commands.executeCommand("integrationWorkbench.refreshScripts");
  };
}
