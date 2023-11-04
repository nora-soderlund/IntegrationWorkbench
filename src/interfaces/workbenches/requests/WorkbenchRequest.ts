import { WebviewPanel } from "vscode";
import { RequestWebviewPanel } from "../../../panels/RequestWebviewPanel";

export type WorkbenchHttpRequest = {
    type: "HTTP";
    details: {
        method: string;
    };
};

export type WorkbenchRequest = {
    id: string;
    name: string;
    webviewPanel?: RequestWebviewPanel;
} & (
    | WorkbenchHttpRequest
    | {
        type: null;
    }
);
