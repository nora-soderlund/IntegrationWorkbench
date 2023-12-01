import { VSCodeLink, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import ScriptInput from "./ScriptInput";

export type InputProps = {
  type: "raw" | "typescript";
  value: string;
  secret?: boolean;

  onChange: (value: string) => void;
  onChangeType: (type: "raw" | "typescript") => void;
};

export default function Input({ type, value, onChange, onChangeType, secret }: InputProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.5em"
    }}>
      {(type === "raw")?(
        <VSCodeTextField type={(secret)?("password"):("text")} placeholder="Enter a value..." value={value} onChange={(event) =>
          onChange((event.target as HTMLInputElement).value)
        }/>
      ):(
        <ScriptInput value={value} onChange={(value) =>
          onChange(value)
        }/>
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