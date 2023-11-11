import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useEffect, useState } from "react";
import { ScriptDeclarationData } from "../../interfaces/scripts/ScriptDeclarationData";
import { VSCodeDropdown, VSCodeLink, VSCodePanelTab, VSCodePanelView, VSCodePanels, VSCodeTag } from "@vscode/webview-ui-toolkit/react";
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
      command: "integrationWorkbench.getScript",
      arguments: []
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
    <React.Fragment>
      <VSCodePanels style={{
        flex: 1,
        padding: "6px 20px"
      }}>
        <VSCodePanelTab>
          SCRIPT
        </VSCodePanelTab>

        <VSCodePanelView style={{
          height: "100%",
          flexDirection: "column"
        }}>
          <div style={{
            flex: 1,
            border: "1px solid var(--vscode-editorWidget-border)",
            boxSizing: "border-box"
          }}>
            <Editor language="typescript" value={scriptData?.content ?? ""} theme="vs-dark" options={{
              scrollBeyondLastLine: false,
              minimap: {
                enabled: false
              },
              readOnly: scriptData === null
            }} onChange={(value) => (
              window.vscode.postMessage({
                command: "integrationWorkbench.changeScriptContent",
                arguments: [ value ]
              })
            )}/>
          </div>
        </VSCodePanelView>
      </VSCodePanels>
    </React.Fragment>
  );
};
