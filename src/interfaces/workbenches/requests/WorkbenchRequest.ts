import { WebviewPanel } from "vscode";

export type WorkbenchHttpRequest = {
    type: "HTTP";
    details: {
        method: string;
    };
};

export type WorkbenchRequest = {
    id: string;
    name: string;
    webviewPanel?: WebviewPanel;
} & (
    | WorkbenchHttpRequest
    | {
        type: null;
    }
);
