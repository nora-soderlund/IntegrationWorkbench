import { VSCodeLink, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import ScriptInput from "./ScriptInput";
import { Editor } from "@monaco-editor/react";
import useMonacoUserTheme from "../../hooks/useMonacoUserTheme";
import { CSSProperties } from "react";

export type InputProps = {
  rawType?: "raw" | "json";
  type: "raw" | "typescript";
  value: string;
  secret?: boolean;

  onChange: (value: string) => void;
  onChangeType: (type: "raw" | "typescript") => void;

  style?: CSSProperties;
};

export default function Input({ rawType = "raw", type, value, onChange, onChangeType, secret, style }: InputProps) {
  const { theme } = useMonacoUserTheme();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.5em",
      ...style
    }}>
      {(type === "raw")?(
        (rawType === "raw")?(
          <VSCodeTextField type={(secret)?("password"):("text")} placeholder="Enter a value..." value={value} onChange={(event) =>
            onChange((event.target as HTMLInputElement).value)
          }/>
        ):(
          <div style={{
            border: "1px solid var(--vscode-editorWidget-border)",
            boxSizing: "border-box",
            height: "100%"
          }}>
            <Editor value={value} theme={theme} options={{
              scrollBeyondLastLine: false,
              minimap: {
                enabled: false
              }
            }} onChange={(value) => onChange(value ?? "")}/>
          </div>
        )
      ):(
        <ScriptInput value={value} onChange={(value) =>
          onChange(value)
        } style={{
          flex: 1,
          height: "100%",
          minHeight: "5em"
        }}/>
      )}

      <VSCodeLink onClick={() => {
        switch(type) {
          case "raw": {
            onChangeType("typescript");

            break;
          }

          case "typescript": {
            onChangeType("raw");

            break;
          }
        }
      }}>
        Change to {(type === "raw")?("script"):("raw")}
      </VSCodeLink>
    </div>
  );
}