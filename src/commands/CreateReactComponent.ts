import * as vscode from "vscode";
import * as path from "path";
import {
  createDirectoryIfNotExists,
  getConfiguration,
  writeFile,
  showInformationMessage,
  showErrorMessage,
} from "../helpers";

export class CreateReactComponent {
  public static async create(uri: vscode.Uri): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      showErrorMessage("No workspace folder found");
      return;
    }

    const workspaceRoot = workspaceFolder.uri.fsPath;
    const absoluteFilePath = uri.fsPath;
    const relativeFilePath = path.relative(workspaceRoot, absoluteFilePath);

    const initialFileName = path.basename(
      relativeFilePath,
      path.extname(relativeFilePath),
    );
    let initialDirPath = path.join(
      path.dirname(relativeFilePath),
      initialFileName,
    );

    // Replace backslashes with forward slashes
    initialDirPath = initialDirPath.replace(/\\/g, "/");

    const input = await vscode.window.showInputBox({
      prompt: "Confirm/Edit the file path and name",
      value: ">" + initialDirPath,
      valueSelection: [
        (">" + initialDirPath).length,
        (">" + initialDirPath).length,
      ],
    });

    if (!input) {
      showErrorMessage("No input provided");
      return;
    }

    // Replace backslashes with forward slashes
    const sanitizedInput = input
      .replace(/[^a-zA-Z0-9/_-]/g, "")
      .replace(/\\/g, "/");

    const dirPath = path.join(workspaceRoot, path.dirname(sanitizedInput));
    const fileName = path.basename(sanitizedInput);

    createDirectoryIfNotExists(dirPath);

    const config = getConfiguration("reactNextjsGenerator.templates");

    const componentTemplate = config.get<string>("reactComponent", "");
    const cssModuleTemplate = config.get<string>("reactComponentCss", "");
    const testTemplate = config.get<string>("reactComponentTest", "");

    const componentContent = componentTemplate.replace(/{fileName}/g, fileName);
    const cssModuleContent = cssModuleTemplate.replace(/{fileName}/g, fileName);
    const testContent = testTemplate.replace(/{fileName}/g, fileName);
    const filePath = path.join(dirPath, `${fileName}.tsx`);

    writeFile(filePath, componentContent);
    writeFile(path.join(dirPath, `${fileName}.module.css`), cssModuleContent);

    const testDirPath = path.join(dirPath, "__tests__");
    createDirectoryIfNotExists(testDirPath);

    writeFile(path.join(testDirPath, `${fileName}.spec.tsx`), testContent);

    showInformationMessage(`React component ${fileName} created successfully!`);
    const document = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(document);
  }
}
