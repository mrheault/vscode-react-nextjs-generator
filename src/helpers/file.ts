import * as vscode from "vscode";
import * as fs from "fs";

export function createDirectoryIfNotExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function getConfiguration(
  section: string,
): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration(section);
}

export function writeFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content);
}
