import { readFileSync, rmSync, writeFileSync } from "fs";
import EnvironmentTreeItem from "../views/trees/environments/items/EnvironmentTreeItem";
import { EnvironmentData } from "~interfaces/entities/EnvironmentData";

export default class Environment {
  public treeDataViewItem?: EnvironmentTreeItem;
  public data: EnvironmentData;

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

  delete() {
    rmSync(this.filePath);
  }
}
