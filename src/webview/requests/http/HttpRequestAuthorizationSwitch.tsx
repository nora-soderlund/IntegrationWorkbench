import React from "react";
import { HttpRequestProps } from "./HttpRequest";
import HttpRequesBasicAuthorization from "./HttpRequestBasicAuthorization";

export default function HttpRequestAuthorizationSwitch({ requestData }: HttpRequestProps) {
  switch(requestData.data.authorization.type) {
    case "none": {
      return (
        <React.Fragment>
          <p>This request has no authorization.</p>
        </React.Fragment>
      );
    }

    case "basic": {
      return (
        <HttpRequesBasicAuthorization requestData={requestData} authorizationData={requestData.data.authorization}/>
      );
    }
  }
};
