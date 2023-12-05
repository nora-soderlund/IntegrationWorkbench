import { useEffect, useState } from "react";
import { isHttpRequestData } from "../../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import { WorkbenchRequestData } from "../../../interfaces/workbenches/requests/WorkbenchRequestData";
import { EnvironmentData } from "../../../interfaces/entities/EnvironmentData";
import { VSCodeBadge, VSCodePanelTab, VSCodePanelView, VSCodePanels } from "@vscode/webview-ui-toolkit/react";
import EnvironmentVariables from "./variables/EnvironmentVariables";
import EnvironmentIntegrations from "./EnvironmentIntegrations";
import { EnvironmentUserData } from "../../../interfaces/entities/EnvironmentUserData";

export type EnvironmentProps = {
  environmentData: EnvironmentData;
  environmentUserData: EnvironmentUserData;
};

export default function Environment() {
  const [ environmentData, setEnvironmentData ] = useState<EnvironmentData | null>(null);
  const [ environmentUserData, setEnvironmentUserData ] = useState<EnvironmentUserData | null>(null);

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

        case 'norasoderlund.integrationworkbench.updateEnvironmentUserData': {
          const [ environmentUserData ] = event.data.arguments;

          setEnvironmentUserData(environmentUserData);
  
          break;
        }
      }
    });

    window.vscode.postMessage({
      command: "norasoderlund.integrationworkbench.getEnvironment",
      arguments: []
    });

    window.vscode.postMessage({
      command: "norasoderlund.integrationworkbench.getEnvironmentUserData",
      arguments: []
    });
  }, []);

  if(!environmentData || !environmentUserData) {
    return (
      <p style={{ padding: "0 20px" }}>Loading environment...</p>
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

        <VSCodePanelTab>
          INTEGRATIONS
        </VSCodePanelTab>

        <VSCodePanelView style={{
          flexDirection: "column"
        }}>
          <EnvironmentVariables environmentData={environmentData} environmentUserData={environmentUserData}/>
        </VSCodePanelView>

        <VSCodePanelView style={{
          flexDirection: "column"
        }}>
          <EnvironmentIntegrations environmentData={environmentData} environmentUserData={environmentUserData}/>
        </VSCodePanelView>
      </VSCodePanels>
    </div>
  );
};
