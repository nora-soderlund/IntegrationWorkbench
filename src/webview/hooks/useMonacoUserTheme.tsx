import { useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";

const monacoColorKeys = [
  "foreground",
  "disabledForeground",
  "errorForeground",
  "descriptionForeground",
  "icon.foreground",
  "focusBorder",
  "contrastBorder",
  "contrastActiveBorder",
  "selection.background",
  "textSeparator.foreground",
  "textLink.foreground",
  "textLink.activeForeground",
  "textPreformat.foreground",
  "textBlockQuote.background",
  "textBlockQuote.border",
  "textCodeBlock.background",
  "widget.shadow",
  "widget.border",
  "input.background",
  "input.foreground",
  "input.border",
  "inputOption.activeBorder",
  "inputOption.hoverBackground",
  "inputOption.activeBackground",
  "inputOption.activeForeground",
  "input.placeholderForeground",
  "inputValidation.infoBackground",
  "inputValidation.infoForeground",
  "inputValidation.infoBorder",
  "inputValidation.warningBackground",
  "inputValidation.warningForeground",
  "inputValidation.warningBorder",
  "inputValidation.errorBackground",
  "inputValidation.errorForeground",
  "inputValidation.errorBorder",
  "dropdown.background",
  "dropdown.listBackground",
  "dropdown.foreground",
  "dropdown.border",
  "button.foreground",
  "button.separator",
  "button.background",
  "button.hoverBackground",
  "button.border",
  "button.secondaryForeground",
  "button.secondaryBackground",
  "button.secondaryHoverBackground",
  "badge.background",
  "badge.foreground",
  "scrollbar.shadow",
  "scrollbarSlider.background",
  "scrollbarSlider.hoverBackground",
  "scrollbarSlider.activeBackground",
  "progressBar.background",
  "editorError.background",
  "editorError.foreground",
  "editorError.border",
  "editorWarning.background",
  "editorWarning.foreground",
  "editorWarning.border",
  "editorInfo.background",
  "editorInfo.foreground",
  "editorInfo.border",
  "editorHint.foreground",
  "editorHint.border",
  "sash.hoverBorder",
  "editor.background",
  "editor.foreground",
  "editorStickyScroll.background",
  "editorStickyScrollHover.background",
  "editorWidget.background",
  "editorWidget.foreground",
  "editorWidget.border",
  "editorWidget.resizeBorder",
  "quickInput.background",
  "quickInput.foreground",
  "quickInputTitle.background",
  "pickerGroup.foreground",
  "pickerGroup.border",
  "keybindingLabel.background",
  "keybindingLabel.foreground",
  "keybindingLabel.border",
  "keybindingLabel.bottomBorder",
  "editor.selectionBackground",
  "editor.selectionForeground",
  "editor.inactiveSelectionBackground",
  "editor.selectionHighlightBackground",
  "editor.selectionHighlightBorder",
  "editor.findMatchBackground",
  "editor.findMatchHighlightBackground",
  "editor.findRangeHighlightBackground",
  "editor.findMatchBorder",
  "editor.findMatchHighlightBorder",
  "editor.findRangeHighlightBorder",
  "searchEditor.findMatchBackground",
  "searchEditor.findMatchBorder",
  "search.resultsInfoForeground",
  "editor.hoverHighlightBackground",
  "editorHoverWidget.background",
  "editorHoverWidget.foreground",
  "editorHoverWidget.border",
  "editorHoverWidget.statusBarBackground",
  "editorLink.activeForeground",
  "editorInlayHint.foreground",
  "editorInlayHint.background",
  "editorInlayHint.typeForeground",
  "editorInlayHint.typeBackground",
  "editorInlayHint.parameterForeground",
  "editorInlayHint.parameterBackground",
  "editorLightBulb.foreground",
  "editorLightBulbAutoFix.foreground",
  "diffEditor.insertedTextBackground",
  "diffEditor.removedTextBackground",
  "diffEditor.insertedLineBackground",
  "diffEditor.removedLineBackground",
  "diffEditorGutter.insertedLineBackground",
  "diffEditorGutter.removedLineBackground",
  "diffEditorOverview.insertedForeground",
  "diffEditorOverview.removedForeground",
  "diffEditor.insertedTextBorder",
  "diffEditor.removedTextBorder",
  "diffEditor.border",
  "diffEditor.diagonalFill",
  "diffEditor.unchangedRegionBackground",
  "diffEditor.unchangedRegionForeground",
  "diffEditor.unchangedCodeBackground",
  "list.focusBackground",
  "list.focusForeground",
  "list.focusOutline",
  "list.focusAndSelectionOutline",
  "list.activeSelectionBackground",
  "list.activeSelectionForeground",
  "list.activeSelectionIconForeground",
  "list.inactiveSelectionBackground",
  "list.inactiveSelectionForeground",
  "list.inactiveSelectionIconForeground",
  "list.inactiveFocusBackground",
  "list.inactiveFocusOutline",
  "list.hoverBackground",
  "list.hoverForeground",
  "list.dropBackground",
  "list.highlightForeground",
  "list.focusHighlightForeground",
  "list.invalidItemForeground",
  "list.errorForeground",
  "list.warningForeground",
  "listFilterWidget.background",
  "listFilterWidget.outline",
  "listFilterWidget.noMatchesOutline",
  "listFilterWidget.shadow",
  "list.filterMatchBackground",
  "list.filterMatchBorder",
  "tree.indentGuidesStroke",
  "tree.inactiveIndentGuidesStroke",
  "tree.tableColumnsBorder",
  "tree.tableOddRowsBackground",
  "list.deemphasizedForeground",
  "checkbox.background",
  "checkbox.selectBackground",
  "checkbox.foreground",
  "checkbox.border",
  "checkbox.selectBorder",
  "quickInput.list.focusBackground",
  "quickInputList.focusForeground",
  "quickInputList.focusIconForeground",
  "quickInputList.focusBackground",
  "menu.border",
  "menu.foreground",
  "menu.background",
  "menu.selectionForeground",
  "menu.selectionBackground",
  "menu.selectionBorder",
  "menu.separatorBackground",
  "toolbar.hoverBackground",
  "toolbar.hoverOutline",
  "toolbar.activeBackground",
  "editor.snippetTabstopHighlightBackground",
  "editor.snippetTabstopHighlightBorder",
  "editor.snippetFinalTabstopHighlightBackground",
  "editor.snippetFinalTabstopHighlightBorder",
  "breadcrumb.foreground",
  "breadcrumb.background",
  "breadcrumb.focusForeground",
  "breadcrumb.activeSelectionForeground",
  "breadcrumbPicker.background",
  "merge.currentHeaderBackground",
  "merge.currentContentBackground",
  "merge.incomingHeaderBackground",
  "merge.incomingContentBackground",
  "merge.commonHeaderBackground",
  "merge.commonContentBackground",
  "merge.border",
  "editorOverviewRuler.currentContentForeground",
  "editorOverviewRuler.incomingContentForeground",
  "editorOverviewRuler.commonContentForeground",
  "editorOverviewRuler.findMatchForeground",
  "editorOverviewRuler.selectionHighlightForeground",
  "minimap.findMatchHighlight",
  "minimap.selectionOccurrenceHighlight",
  "minimap.selectionHighlight",
  "minimap.infoHighlight",
  "minimap.warningHighlight",
  "minimap.errorHighlight",
  "minimap.background",
  "minimap.foregroundOpacity",
  "minimapSlider.background",
  "minimapSlider.hoverBackground",
  "minimapSlider.activeBackground",
  "problemsErrorIcon.foreground",
  "problemsWarningIcon.foreground",
  "problemsInfoIcon.foreground",
  "charts.foreground",
  "charts.lines",
  "charts.red",
  "charts.blue",
  "charts.yellow",
  "charts.orange",
  "charts.green",
  "charts.purple",
  "diffEditor.move.border",
  "diffEditor.moveActive.border",
  "symbolIcon.arrayForeground",
  "symbolIcon.booleanForeground",
  "symbolIcon.classForeground",
  "symbolIcon.colorForeground",
  "symbolIcon.constantForeground",
  "symbolIcon.constructorForeground",
  "symbolIcon.enumeratorForeground",
  "symbolIcon.enumeratorMemberForeground",
  "symbolIcon.eventForeground",
  "symbolIcon.fieldForeground",
  "symbolIcon.fileForeground",
  "symbolIcon.folderForeground",
  "symbolIcon.functionForeground",
  "symbolIcon.interfaceForeground",
  "symbolIcon.keyForeground",
  "symbolIcon.keywordForeground",
  "symbolIcon.methodForeground",
  "symbolIcon.moduleForeground",
  "symbolIcon.namespaceForeground",
  "symbolIcon.nullForeground",
  "symbolIcon.numberForeground",
  "symbolIcon.objectForeground",
  "symbolIcon.operatorForeground",
  "symbolIcon.packageForeground",
  "symbolIcon.propertyForeground",
  "symbolIcon.referenceForeground",
  "symbolIcon.snippetForeground",
  "symbolIcon.stringForeground",
  "symbolIcon.structForeground",
  "symbolIcon.textForeground",
  "symbolIcon.typeParameterForeground",
  "symbolIcon.unitForeground",
  "symbolIcon.variableForeground",
  "actionBar.toggledBackground",
  "editor.lineHighlightBackground",
  "editor.lineHighlightBorder",
  "editor.rangeHighlightBackground",
  "editor.rangeHighlightBorder",
  "editor.symbolHighlightBackground",
  "editor.symbolHighlightBorder",
  "editorCursor.foreground",
  "editorCursor.background",
  "editorWhitespace.foreground",
  "editorLineNumber.foreground",
  "editorIndentGuide.background",
  "editorIndentGuide.activeBackground",
  "editorIndentGuide.background1",
  "editorIndentGuide.background2",
  "editorIndentGuide.background3",
  "editorIndentGuide.background4",
  "editorIndentGuide.background5",
  "editorIndentGuide.background6",
  "editorIndentGuide.activeBackground1",
  "editorIndentGuide.activeBackground2",
  "editorIndentGuide.activeBackground3",
  "editorIndentGuide.activeBackground4",
  "editorIndentGuide.activeBackground5",
  "editorIndentGuide.activeBackground6",
  "editorActiveLineNumber.foreground",
  "editorLineNumber.activeForeground",
  "editorLineNumber.dimmedForeground",
  "editorRuler.foreground",
  "editorCodeLens.foreground",
  "editorBracketMatch.background",
  "editorBracketMatch.border",
  "editorOverviewRuler.border",
  "editorOverviewRuler.background",
  "editorGutter.background",
  "editorUnnecessaryCode.border",
  "editorUnnecessaryCode.opacity",
  "editorGhostText.border",
  "editorGhostText.foreground",
  "editorGhostText.background",
  "editorOverviewRuler.rangeHighlightForeground",
  "editorOverviewRuler.errorForeground",
  "editorOverviewRuler.warningForeground",
  "editorOverviewRuler.infoForeground",
  "editorBracketHighlight.foreground1",
  "editorBracketHighlight.foreground2",
  "editorBracketHighlight.foreground3",
  "editorBracketHighlight.foreground4",
  "editorBracketHighlight.foreground5",
  "editorBracketHighlight.foreground6",
  "editorBracketHighlight.unexpectedBracket.foreground",
  "editorBracketPairGuide.background1",
  "editorBracketPairGuide.background2",
  "editorBracketPairGuide.background3",
  "editorBracketPairGuide.background4",
  "editorBracketPairGuide.background5",
  "editorBracketPairGuide.background6",
  "editorBracketPairGuide.activeBackground1",
  "editorBracketPairGuide.activeBackground2",
  "editorBracketPairGuide.activeBackground3",
  "editorBracketPairGuide.activeBackground4",
  "editorBracketPairGuide.activeBackground5",
  "editorBracketPairGuide.activeBackground6",
  "editorUnicodeHighlight.border",
  "editorUnicodeHighlight.background",
  "editorOverviewRuler.bracketMatchForeground",
  "editor.linkedEditingBackground",
  "editor.wordHighlightBackground",
  "editor.wordHighlightStrongBackground",
  "editor.wordHighlightTextBackground",
  "editor.wordHighlightBorder",
  "editor.wordHighlightStrongBorder",
  "editor.wordHighlightTextBorder",
  "editorOverviewRuler.wordHighlightForeground",
  "editorOverviewRuler.wordHighlightStrongForeground",
  "editorOverviewRuler.wordHighlightTextForeground",
  "peekViewTitle.background",
  "peekViewTitleLabel.foreground",
  "peekViewTitleDescription.foreground",
  "peekView.border",
  "peekViewResult.background",
  "peekViewResult.lineForeground",
  "peekViewResult.fileForeground",
  "peekViewResult.selectionBackground",
  "peekViewResult.selectionForeground",
  "peekViewEditor.background",
  "peekViewEditorGutter.background",
  "peekViewEditorStickyScroll.background",
  "peekViewResult.matchHighlightBackground",
  "peekViewEditor.matchHighlightBackground",
  "peekViewEditor.matchHighlightBorder",
  "editorMarkerNavigationError.background",
  "editorMarkerNavigationError.headerBackground",
  "editorMarkerNavigationWarning.background",
  "editorMarkerNavigationWarning.headerBackground",
  "editorMarkerNavigationInfo.background",
  "editorMarkerNavigationInfo.headerBackground",
  "editorMarkerNavigation.background",
  "editorHoverWidget.highlightForeground",
  "editorSuggestWidget.background",
  "editorSuggestWidget.border",
  "editorSuggestWidget.foreground",
  "editorSuggestWidget.selectedForeground",
  "editorSuggestWidget.selectedIconForeground",
  "editorSuggestWidget.selectedBackground",
  "editorSuggestWidget.highlightForeground",
  "editorSuggestWidget.focusHighlightForeground",
  "editorSuggestWidgetStatus.foreground",
  "editor.foldBackground",
  "editorGutter.foldingControlForeground"
];

function getHexFromRGBA(rgba: string, forceRemoveAlpha = false) {
  return "#" + rgba.replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
    .split(',') // splits them at ","
    .filter((string, index) => !forceRemoveAlpha || index !== 3)
    .map(string => parseFloat(string)) // Converts them to numbers
    .map((number, index) => index === 3 ? Math.round(number * 255) : number) // Converts alpha to 255 number
    .map(number => number.toString(16)) // Converts numbers to hex
    .map(string => string.length === 1 ? "0" + string : string) // Adds 0 when length of one number is 1
    .join("") // Puts the array to togehter to a string
}

export default function useMonacoUserTheme() {
  const monaco = useMonaco();

  const [ theme, setTheme ] = useState("vs-dark");
  const [ backgroundColor, setBackgroundColor ] = useState<string>("");

  useEffect(() => {
    const styleObserver = new MutationObserver((mutations) => {
      if(!mutations.length) {
        return;
      }

      const mutation = mutations[0];

      if(mutation.target instanceof HTMLElement) {
        const currentBackgroundColor = mutation.target.style.getPropertyValue('--vscode-editor-background');
      
        if (currentBackgroundColor !== backgroundColor) {
          setBackgroundColor(currentBackgroundColor);
        }
      }
    });
    
    styleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    });
  }, []);

  useEffect(() => {
    if(monaco) {
      const computedStyle = window.getComputedStyle(document.body);
     
      const colors = Object.fromEntries(
        monacoColorKeys.filter((key) => key.toLowerCase().includes('editor')).map((key) => {
          const color = computedStyle.getPropertyValue(`--vscode-${key.split('.').join('-')}`);

          return [
            key,
            (color.startsWith("rgba")?(getHexFromRGBA(color)):(color))
          ];
        }).filter((entry) => entry[1].length)
      );

      monaco.editor.defineTheme("userTheme", {
        base: "vs-dark",
        colors,
        inherit: false,
        rules: []
      });

      setTheme("userTheme");
    }
  }, [ monaco, backgroundColor ]);

  return { theme };
};