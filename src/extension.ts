import * as vscode from "vscode";
import { CreateReactComponent, CreateNextJSFile } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  const createReactComponent = vscode.commands.registerCommand(
    "extension.createReactComponent",
    async (uri: vscode.Uri) => {
      if (!uri) {
        vscode.window.showErrorMessage("No file selected");
        return;
      } else {
        await CreateReactComponent.create(uri);
      }
    },
  );

  const createNextJsPage = vscode.commands.registerCommand(
    "extension.createNextJsPage",
    async (uri: vscode.Uri) => {
      await CreateNextJSFile.create(uri, "page");
    },
  );

  const createNextJsLayout = vscode.commands.registerCommand(
    "extension.createNextJsLayout",
    async (uri: vscode.Uri) => {
      await CreateNextJSFile.create(uri, "layout");
    },
  );

  const createNextJsError = vscode.commands.registerCommand(
    "extension.createNextJsError",
    async (uri: vscode.Uri) => {
      await CreateNextJSFile.create(uri, "error");
    },
  );

  const createNextJsLoading = vscode.commands.registerCommand(
    "extension.createNextJsLoading",
    async (uri: vscode.Uri) => {
      await CreateNextJSFile.create(uri, "loading");
    },
  );
  const createClass = vscode.commands.registerCommand(
    "extension.createClass",
    async (uri: vscode.Uri) => {
      await CreateNextJSFile.createClass(uri);
    },
  );

  context.subscriptions.push(
    createClass,
    createReactComponent,
    createNextJsPage,
    createNextJsLayout,
    createNextJsError,
    createNextJsLoading,
  );
}

export function deactivate() {}
