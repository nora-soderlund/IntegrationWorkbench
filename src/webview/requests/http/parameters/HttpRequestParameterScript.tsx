import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useEffect, useState } from "react";
import { ScriptDeclarationData } from "../../../../interfaces/scripts/ScriptDeclarationData";
import { VSCodeDropdown, VSCodeLink, VSCodePanelTab, VSCodePanelView, VSCodePanels, VSCodeTag } from "@vscode/webview-ui-toolkit/react";
import { ScriptData } from "../../../../interfaces/scripts/ScriptData";
import { WorkbenchHttpRequestParameterData } from "../../../../interfaces/workbenches/requests/WorkbenchHttpRequestData";
import { WorkbenchRequestData } from "../../../../interfaces/workbenches/requests/WorkbenchRequestData";

export type HttpRequestParameterScriptProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function HttpRequestParameterScript({ value, onChange }: HttpRequestParameterScriptProps) {
  const monaco = useMonaco();

  const [ scriptDeclarations, setScriptDeclarations ] = useState<ScriptDeclarationData[] | null>(null);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      console.log(event.data);

      switch (command) {
        case 'integrationWorkbench.updateScriptDeclarations': {
          const [ scriptDeclarations ] = event.data.arguments;

          setScriptDeclarations(scriptDeclarations);
  
          break;
        }
      }
    });

    window.vscode.postMessage({
      command: "integrationWorkbench.getScriptDeclarations",
      arguments: []
    });
  }, []);

  useEffect(() => {
    if(!monaco || !scriptDeclarations) {
      return;
    }

    scriptDeclarations.forEach((scriptLibrary) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        scriptLibrary.declaration,
        scriptLibrary.name
      );
    });
  }, [ monaco, scriptDeclarations ]);

  return (
    <div style={{
      border: "1px solid var(--vscode-editorWidget-border)",
      boxSizing: "border-box",
      height: "5em"
    }}>
      <Editor language="typescript" value={value} theme="vs-dark" options={{
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false
        }
      }} onChange={(value) => {
        onChange(value ?? "");
      }}/>
    </div>
  );
};
