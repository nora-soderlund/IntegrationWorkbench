import { useEffect, useState } from "react";
import { isHttpRequestData } from "../../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import { WorkbenchRequestData } from "../../../interfaces/workbenches/requests/WorkbenchRequestData";
import { WorkbenchResponseData } from "../../../interfaces/workbenches/responses/WorkbenchResponseData";
import { isHttpResponseData } from "../../../interfaces/workbenches/responses/utils/WorkbenchResponseTypeValidations";
import HttpResponse from "./http/HttpResponse";

export default function Response() {
  const [ responseData, setResponseData ] = useState<WorkbenchResponseData | null>(null);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      switch (command) {
        case 'integrationWorkbench.showResponse': {
          const [ responseData ] = event.data.arguments;

          setResponseData(responseData);
  
          break;
        }
      }
    });
  }, []);

  if(responseData) {
    if(isHttpResponseData(responseData)) {
      return (
        <HttpResponse responseData={responseData}/>
      );
    }
  }

  return (
    <div style={{
      padding: "0 20px"
    }}>
      <p>No response is selected.</p>
    </div>
  );
};
