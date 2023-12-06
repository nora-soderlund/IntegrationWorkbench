import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import Input from "./inputs/Input";
import { UserInput } from "../../interfaces/UserInput";
import { UserInputType } from "../../interfaces/UserInputType";
import useDynamicChangeHandler from "../hooks/useDynamicChangeHandler";

export type ValueListProps = {
  items: UserInput[];

  onAdd: () => void;
  onChange: (item: UserInput) => void;
  onDelete: (item: UserInput) => void;
};

export default function ValueList({ items, onAdd, onChange, onDelete }: ValueListProps) {
  return (
    <VSCodeDataGrid className="data-grid-unfocusable data-grid-unhoverable">
      <VSCodeDataGridRow rowType="header" className="data-grid-variables-row" style={{
        alignItems: "center"
      }}>
        <VSCodeDataGridCell cellType="columnheader" gridColumn="1">
          Value
        </VSCodeDataGridCell>

        <VSCodeDataGridCell cellType="columnheader" gridColumn="2">
          <VSCodeButton appearance="icon" aria-label="Add" onClick={() => onAdd()}>
            <span className="codicon codicon-add"/>
          </VSCodeButton>
        </VSCodeDataGridCell>
      </VSCodeDataGridRow>

      {items.map((item, index) => (
        <VSCodeDataGridRow key={index} className="data-grid-buttons-hoverable data-grid-variables-row">
          <VSCodeDataGridCell gridColumn="1">
            <Input maxHeight="8em" type={item.type} value={item.value} onChange={useDynamicChangeHandler((value) => {
              item.value = value;
              
              onChange(item);
            })}
            onChangeType={(type) => {
              item.type = type;

              onChange(item);
            }}/>
          </VSCodeDataGridCell>

          <VSCodeDataGridCell gridColumn="2">
            <VSCodeButton appearance="icon" aria-label="Delete" onClick={() => onDelete(item)}>
              <span className="codicon codicon-trashcan"/>
            </VSCodeButton>
          </VSCodeDataGridCell>
        </VSCodeDataGridRow>
      ))}
    </VSCodeDataGrid>
  );
}
