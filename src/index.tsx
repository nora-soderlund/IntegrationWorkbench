import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Request from './webview/entities/requests/Request';
import Response from './webview/entities/responses/Response';
import Environment from './webview/entities/environment/Environment';

const rootElement = document.getElementById('root') as HTMLElement;

switch(window.type) {
  case "request": {
    ReactDOM.render(<Request/>, rootElement);

    break;
  }

  case "response": {
    ReactDOM.render(<Response/>, rootElement);

    break;
  }

  case "environment": {
    ReactDOM.render(<Environment/>, rootElement);

    break;
  }
}

