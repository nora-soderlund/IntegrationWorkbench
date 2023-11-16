import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useEffect, useState } from "react";
import { ScriptDeclarationData } from "../../../../interfaces/scripts/ScriptDeclarationData";

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

    /*monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),

      module: languages.typescript.ModuleKind.ESNext
    });*/

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      lib: ["ESNext"],
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      esModuleInterop: true
    });

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
        lineNumbers: "off",
        glyphMargin: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
        minimap: {
          enabled: false
        }
      }} onChange={(value) => {
        onChange(value ?? "");
      }}/>
    </div>
  );
};
