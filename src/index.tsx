import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Request from './webview/requests/Request';
import Response from './webview/responses/Response';

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
}

