import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class CreateNextJSFile {
  public static async create(uri: vscode.Uri, type: string): Promise<void> {
    if (!uri) {
      vscode.window.showErrorMessage("No file selected");
      return;
    }

    const dirPath = uri.fsPath;

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const config = vscode.workspace.getConfiguration(
      "reactNextjsGenerator.templates",
    );
    let fileName = "";
    let fileContent = "";

    switch (type) {
      case "page":
        fileName = "page.tsx";
        fileContent = config.get("page", "");
        break;
      case "layout":
        fileName = "layout.tsx";
        fileContent = config.get("layout", "");
        break;
      case "error":
        fileName = "error.tsx";
        fileContent = config.get("error", "");
        break;
      case "loading":
        fileName = "loading.tsx";
        fileContent = config.get("loading", "");
        break;
    }

    if (!fileContent) {
      vscode.window.showErrorMessage(`Template for type "${type}" not found`);
      return;
    }

    fs.writeFileSync(path.join(dirPath, fileName), fileContent);
    vscode.window.showInformationMessage(
      `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } file ${fileName} created successfully!`,
    );
  }
}
