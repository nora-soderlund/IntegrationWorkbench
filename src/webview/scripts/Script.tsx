import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useEffect, useState } from "react";
import { ScriptDeclarationData } from "../../interfaces/scripts/ScriptDeclarationData";
import { VSCodeBadge, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDropdown, VSCodeLink, VSCodePanelTab, VSCodePanelView, VSCodePanels, VSCodeTag, VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import { ScriptData } from "../../interfaces/scripts/ScriptData";
import { ScriptContentData } from "../../interfaces/scripts/ScriptContentData";
import ScriptDependents from "./dependents/ScriptDependents";
import { ScriptDependentData } from "../../interfaces/scripts/ScriptDependentData";

export default function Scripts() {
  const monaco = useMonaco();

  const [ scriptData, setScriptData ] = useState<ScriptContentData | null>(null);
  const [ scriptDeclarations, setScriptDeclarations ] = useState<ScriptDeclarationData[] | null>(null);
  const [ scriptDependentsData, setScriptDependentsData ] = useState<ScriptDependentData[]>([]);

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

        case 'integrationWorkbench.updateScriptDependents': {
          const [ scriptDependentsData ] = event.data.arguments;

          setScriptDependentsData(scriptDependentsData);

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

    window.vscode.postMessage({
      command: "integrationWorkbench.getScriptDependents",
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
        <VSCodePanelTab>SCRIPT</VSCodePanelTab>
        
        <VSCodePanelTab>
          DEPENDENTS

          {(scriptDependentsData.length > 0) && (
            <VSCodeBadge>{scriptDependentsData.length}</VSCodeBadge>  
          )}
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
            <Editor language="typescript" value={scriptData?.typescript ?? ""} theme="vs-dark" options={{
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

        <VSCodePanelView style={{
          height: "100%",
          flexDirection: "column"
        }}>
          <ScriptDependents scriptDependentsData={scriptDependentsData}/>
        </VSCodePanelView>
      </VSCodePanels>
    </React.Fragment>
  );
};
