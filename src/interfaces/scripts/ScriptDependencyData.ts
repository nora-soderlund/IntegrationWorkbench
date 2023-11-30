export type ScriptDependencyData = {
  name: string;
  type: "dependency" | "devDependency";
  version: string;
  used: boolean;
};
