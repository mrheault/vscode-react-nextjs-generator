import * as vscode from "vscode";
import * as path from "path";
import {
  createDirectoryIfNotExists,
  getConfiguration,
  writeFile,
  showInformationMessage,
  showErrorMessage,
} from "../helpers";

export class CreateNextJSFile {
  public static async create(uri: vscode.Uri, type: string): Promise<void> {
    if (!uri) {
      showErrorMessage("No file selected");
      return;
    }

    const dirPath = uri.fsPath;

    createDirectoryIfNotExists(dirPath);

    const config = getConfiguration("reactNextjsGenerator.templates");
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
      showErrorMessage(`Template for type "${type}" not found`);
      return;
    }

    writeFile(path.join(dirPath, fileName), fileContent);
    showInformationMessage(
      `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } file ${fileName} created successfully!`,
    );
  }
}
