import { useEffect, useState } from "react";
import { isHttpRequestData } from "../../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import { WorkbenchRequestData } from "../../../interfaces/workbenches/requests/WorkbenchRequestData";
import { EnvironmentData } from "../../../interfaces/entities/EnvironmentData";
import { VSCodeBadge, VSCodePanelTab, VSCodePanelView, VSCodePanels } from "@vscode/webview-ui-toolkit/react";
import EnvironmentVariables from "./variables/EnvironmentVariables";

export type EnvironmentProps = {
  environmentData: EnvironmentData;
};

export default function Environment() {
  const [ environmentData, setEnvironmentData ] = useState<EnvironmentData | null>(null);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      switch (command) {
        case 'norasoderlund.integrationworkbench.updateEnvironment': {
          const [ environmentData ] = event.data.arguments;

          console.log("set environment", environmentData);

          setEnvironmentData(environmentData);
  
          break;
        }
      }
    });

    window.vscode.postMessage({
      command: "norasoderlund.integrationworkbench.getEnvironment",
      arguments: []
    });
  }, []);

  if(!environmentData) {
    return (
      <h1>TBD</h1>
    );
  }

  return (
    <div style={{
      flex: 1,

      display: "flex",
      flexDirection: "column",
      padding: "0 20px"
    }}>
      <VSCodePanels style={{
        flex: 1
      }}>
        <VSCodePanelTab>
          VARIABLES

          {(environmentData.variables.length > 0) && (
            <VSCodeBadge>{environmentData.variables.length}</VSCodeBadge>
          )}
        </VSCodePanelTab>

        <VSCodePanelView style={{
          flexDirection: "column"
        }}>
          <EnvironmentVariables environmentData={environmentData}/>
        </VSCodePanelView>
      </VSCodePanels>
    </div>
  );
};
