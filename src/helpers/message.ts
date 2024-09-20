import * as vscode from "vscode";

export function showInformationMessage(message: string): void {
  vscode.window.showInformationMessage(message);
}

export function showErrorMessage(message: string): void {
  vscode.window.showErrorMessage(message);
}

export async function promptExportType(): Promise<string | undefined> {
  return await vscode.window.showInputBox({
    prompt: "Enter export type",
    placeHolder: "class, interface, type, enum",
    validateInput: (input) => {
      if (
        input !== "class" &&
        input !== "interface" &&
        input !== "type" &&
        input !== "enum"
      ) {
        return 'Please enter "class", "interface", "type", or "enum"';
      }
      return null;
    },
  });
}

export async function promptClassName(): Promise<string | undefined> {
  return await vscode.window.showInputBox({
    prompt: "Enter class name",
    placeHolder: "ClassName",
    validateInput: (input) => {
      if (!/^[A-Z][A-Za-z]{2,}$/.test(input)) {
        return "Invalid format! Entity names MUST be declared in PascalCase.";
      }
      return null;
    },
  });
}
