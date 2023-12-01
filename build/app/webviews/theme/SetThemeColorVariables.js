"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setThemeColorVariables() {
    document.documentElement.style.setProperty('--shiki-color-text', 'var(--vscode-editor-foreground)');
    document.documentElement.style.setProperty('--shiki-color-background', 'var(--vscode-editor-background)');
    document.documentElement.style.setProperty('--shiki-token-constant', 'var(--vscode-symbolIcon-constantForeground)');
    document.documentElement.style.setProperty('--shiki-token-string', 'var(--vscode-symbolIcon-stringForeground)');
    document.documentElement.style.setProperty('--shiki-token-comment', 'var(--vscode-editorOverviewRuler-currentContentForeground)');
    document.documentElement.style.setProperty('--shiki-token-keyword', 'var(--vscode-symbolIcon-keywordForeground)');
    document.documentElement.style.setProperty('--shiki-token-parameter', 'var(--vscode-symbolIcon-typeParameterForeground)');
    document.documentElement.style.setProperty('--shiki-token-function', 'var(--vscode-symbolIcon-functionForeground)');
    document.documentElement.style.setProperty('--shiki-token-string-expression', 'var(--vscode-debugTokenExpression-string)');
    document.documentElement.style.setProperty('--shiki-token-punctuation', 'var(--vscode-symbolIcon-unitForeground)');
    document.documentElement.style.setProperty('--shiki-token-link', 'var(--vscode-editorLink-activeForeground)');
}
exports.default = setThemeColorVariables;
//# sourceMappingURL=SetThemeColorVariables.js.map