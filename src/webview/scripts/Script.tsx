import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useEffect, useState } from "react";
import { ScriptDeclarationData } from "../../interfaces/scripts/ScriptDeclarationData";
import { VSCodeDropdown, VSCodeLink, VSCodeTag } from "@vscode/webview-ui-toolkit/react";
import { ScriptData } from "../../interfaces/scripts/ScriptData";

export default function Scripts() {
  const monaco = useMonaco();

  const [ scriptData, setScriptData ] = useState<ScriptData | null>(null);
  const [ scriptDeclarations, setScriptDeclarations ] = useState<ScriptDeclarationData[] | null>(null);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      switch (command) {
        case 'integrationWorkbench.updateScriptDeclarations': {
          const [ scriptDeclarations ] = event.data.arguments;

          setScriptDeclarations(scriptDeclarations);
  
          break;
        }

        case 'integrationWorkbench.updateScript': {
          const [ scriptData ] = event.data.arguments;

          setScriptData(scriptData);
  
          break;
        }
      }
    });

    window.vscode.postMessage({
      command: "integrationWorkbench.getScriptDeclarations",
      arguments: []
    });

    window.vscode.postMessage({
      command: "integrationWorkbench.getScript",
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

  if(!scriptData) {
    return (
      <React.Fragment>
        <p>No script selected! Select a script in the sidebar or <VSCodeLink>create a script</VSCodeLink>.</p>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div style={{
        height: "100%",

        display: "flex",
        flexDirection: "column",
        gap: "1em"
      }}>
        <div>
          {scriptData.name}
        </div>

        <div style={{
          flex: 1,
          border: "1px solid var(--vscode-editorWidget-border)",
          boxSizing: "border-box"
        }}>
          <Editor language="typescript" value={scriptData.content} theme="vs-dark" options={{
            scrollBeyondLastLine: false,
            minimap: {
              enabled: false
            }
          }} onChange={(value) => (
            window.vscode.postMessage({
              command: "integrationWorkbench.changeScriptContent",
              arguments: [ value ]
            })
          )}/>
        </div>
      </div>
    </React.Fragment>
  );
};
