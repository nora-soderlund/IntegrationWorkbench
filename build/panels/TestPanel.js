"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPanel = void 0;
const vscode_1 = require("vscode");
class TestPanel {
    static currentPanel;
    _panel;
    _disposables = [];
    constructor(panel) {
        this._panel = panel;
    }
    static render() {
        if (TestPanel.currentPanel) {
            TestPanel.currentPanel._panel.reveal(vscode_1.ViewColumn.One);
        }
        else {
            const panel = vscode_1.window.createWebviewPanel("hello-world", "Hello World", vscode_1.ViewColumn.One, {
            // Empty for now
            });
            TestPanel.currentPanel = new TestPanel(panel);
        }
    }
}
exports.TestPanel = TestPanel;
//# sourceMappingURL=TestPanel.js.map