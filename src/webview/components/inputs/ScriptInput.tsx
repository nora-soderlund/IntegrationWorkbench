import { Editor, useMonaco } from "@monaco-editor/react";
import React, { CSSProperties, useEffect, useState } from "react";
import { ScriptDeclarationData } from "../../../interfaces/scripts/ScriptDeclarationData";
import useMonacoUserTheme from "../../hooks/useMonacoUserTheme";

export type ScriptInputProps = {
  value: string;
  onChange: (value: string) => void;
  style?: CSSProperties;
};

export default function ScriptInput({ value, onChange, style }: ScriptInputProps) {
  const monaco = useMonaco();
  const { theme } = useMonacoUserTheme();

  const [ scriptDeclarations, setScriptDeclarations ] = useState<ScriptDeclarationData[] | null>(null);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      console.log(event.data);

      switch (command) {
        case 'norasoderlund.integrationworkbench.updateScriptDeclarations': {
          const [ scriptDeclarations ] = event.data.arguments;

          console.log("Setting script declarations", scriptDeclarations);

          setScriptDeclarations(scriptDeclarations);
  
          break;
        }
      }
    });

    window.vscode.postMessage({
      command: "norasoderlund.integrationworkbench.getScriptDeclarations",
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

    console.log("using script decl", scriptDeclarations);

    /*monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      lib: ["ESNext"],
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      esModuleInterop: true
    });*/

    scriptDeclarations.forEach((scriptLibrary) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        scriptLibrary.declaration.replaceAll("export", ""),
        scriptLibrary.name
      );
    });
  }, [ monaco, scriptDeclarations ]);

  return (
    <div style={{
      border: "1px solid var(--vscode-editorWidget-border)",
      boxSizing: "border-box",
      height: "100%",
      ...style
    }}>
      <Editor language="typescript" value={value} theme={theme} options={{
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
