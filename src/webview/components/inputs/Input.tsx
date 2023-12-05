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

  maxHeight?: string;
};

export default function Input({ rawType = "raw", type, value, onChange, onChangeType, secret, maxHeight = "100%" }: InputProps) {
  const { theme } = useMonacoUserTheme();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.5em",
      height: "100%",
      width: "100%"
    }}>
      {(type === "raw")?(
        (rawType === "raw")?(
          <div>
            <VSCodeTextField type={(secret)?("password"):("text")} placeholder="Enter a value..." value={value} onChange={(event) =>
              onChange((event.target as HTMLInputElement).value)
            } style={{
              width: "100%"
            }}/>
          </div>
        ):(
          <div style={{
            border: "1px solid var(--vscode-editorWidget-border)",
            boxSizing: "border-box",
            flex: 1,
            height: maxHeight
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
        <div style={{
          height: maxHeight
        }}>
          <ScriptInput value={value} onChange={(value) =>
            onChange(value)
          }/>
        </div>
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