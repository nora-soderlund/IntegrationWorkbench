import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { window } from "vscode";

export default class Script {
  public readonly name: string;
  private readonly directory: string;

  constructor(
    private readonly filePath: string
  ) {
    const parsedPath = path.parse(filePath);

    this.name = parsedPath.base;
    this.directory = parsedPath.dir;
  }

  save(script: string) {
    try {
      if (!existsSync(this.directory)) {
        mkdirSync(this.directory, {
          recursive: true
        });
      }
    }
    catch (error) {
      window.showErrorMessage("VS Code may not have permissions to create files in the current workspace folder:\n\n" + error);
    }

    try {
      writeFileSync(this.filePath, script);
    }
    catch (error) {
      window.showErrorMessage(`Failed to save workbench '${this.name}':\n\n` + error);
    }
  }
}