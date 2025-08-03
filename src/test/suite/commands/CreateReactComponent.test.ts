import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { CreateReactComponent } from "../../../commands/CreateReactComponent";

suite("CreateReactComponent Command Test Suite", () => {
  suite("Basic Functionality", () => {
    test("CreateReactComponent should be defined", () => {
      assert.ok(CreateReactComponent);
      assert.strictEqual(typeof CreateReactComponent.create, "function");
    });
  });

  suite("Error Handling", () => {
    test("CreateReactComponent.create should handle no workspace folder", async () => {
      // Create a mock URI that doesn't have a workspace folder
      const mockUri = vscode.Uri.file("/test/path");

      // Mock the workspace.workspaceFolders to return undefined
      const originalWorkspaceFolders = vscode.workspace.workspaceFolders;

      // Use Object.defineProperty to mock the getter
      Object.defineProperty(vscode.workspace, "workspaceFolders", {
        get: () => undefined,
        configurable: true,
      });

      // Mock showErrorMessage to capture the error
      let capturedError = "";
      const originalShowErrorMessage = vscode.window.showErrorMessage;
      vscode.window.showErrorMessage = async (message: string) => {
        capturedError = message;
        return undefined;
      };

      try {
        await CreateReactComponent.create(mockUri);
        assert.strictEqual(capturedError, "No workspace folder found");
      } finally {
        // Restore original workspace folders
        Object.defineProperty(vscode.workspace, "workspaceFolders", {
          get: () => originalWorkspaceFolders,
          configurable: true,
        });
        // Restore original showErrorMessage
        vscode.window.showErrorMessage = originalShowErrorMessage;
      }
    });

    test("CreateReactComponent.create should handle no input", async () => {
      // Create a temporary workspace
      const tempWorkspace = path.join(
        os.tmpdir(),
        "test-workspace-" + Date.now(),
      );
      fs.mkdirSync(tempWorkspace, { recursive: true });

      // Mock the workspace.workspaceFolders to return our temp workspace
      const originalWorkspaceFolders = vscode.workspace.workspaceFolders;
      Object.defineProperty(vscode.workspace, "workspaceFolders", {
        get: () => [
          {
            uri: vscode.Uri.file(tempWorkspace),
          },
        ],
        configurable: true,
      });

      // Mock showInputBox to return undefined (no input)
      const originalShowInputBox = vscode.window.showInputBox;
      vscode.window.showInputBox = async () => undefined;

      // Mock showErrorMessage to capture the error
      let capturedError = "";
      const originalShowErrorMessage = vscode.window.showErrorMessage;
      vscode.window.showErrorMessage = async (message: string) => {
        capturedError = message;
        return undefined;
      };

      try {
        await CreateReactComponent.create(
          vscode.Uri.file(path.join(tempWorkspace, "test.tsx")),
        );
        assert.strictEqual(capturedError, "No input provided");
      } finally {
        // Restore original workspace folders
        Object.defineProperty(vscode.workspace, "workspaceFolders", {
          get: () => originalWorkspaceFolders,
          configurable: true,
        });
        // Restore original functions
        vscode.window.showInputBox = originalShowInputBox;
        vscode.window.showErrorMessage = originalShowErrorMessage;
        // Cleanup
        fs.rmSync(tempWorkspace, { recursive: true, force: true });
      }
    });
  });

  suite("Integration Tests", () => {
    let tempWorkspace: string;
    let originalWorkspaceFolders: readonly vscode.WorkspaceFolder[] | undefined;

    suiteSetup(() => {
      // Create temporary workspace for testing
      tempWorkspace = path.join(os.tmpdir(), "test-workspace-" + Date.now());
      fs.mkdirSync(tempWorkspace, { recursive: true });

      // Mock workspace folders
      originalWorkspaceFolders = vscode.workspace.workspaceFolders;
      Object.defineProperty(vscode.workspace, "workspaceFolders", {
        get: () => [
          {
            uri: vscode.Uri.file(tempWorkspace),
          },
        ],
        configurable: true,
      });
    });

    suiteTeardown(() => {
      // Restore workspace folders and cleanup
      Object.defineProperty(vscode.workspace, "workspaceFolders", {
        get: () => originalWorkspaceFolders,
        configurable: true,
      });
      if (fs.existsSync(tempWorkspace)) {
        fs.rmSync(tempWorkspace, { recursive: true, force: true });
      }
    });

    test("CreateReactComponent should create component files successfully", async () => {
      const componentName = "TestComponent";
      const componentPath = path.join(tempWorkspace, "src", "components");

      // Mock configuration to return templates
      const originalGetConfiguration = vscode.workspace.getConfiguration;
      vscode.workspace.getConfiguration = (section?: string) =>
        ({
          get: (key: string) => {
            if (section === "reactNextjsGenerator.templates") {
              switch (key) {
                case "reactComponent":
                  return `import React from 'react';
import styles from './{fileName}.module.css';

interface {fileName}Props {
  // Add your props here
}

export const {fileName}: React.FC<{fileName}Props> = () => {
  return (
    <div className={styles.container}>
      <h1>{fileName}</h1>
    </div>
  );
};`;
                case "reactComponentCss":
                  return `.container {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}`;
                case "reactComponentTest":
                  return `import React from 'react';
import { render, screen } from '@testing-library/react';
import { {fileName} } from '../{fileName}';

describe('{fileName}', () => {
  it('renders without crashing', () => {
    render(<{fileName} />);
    expect(screen.getByText('{fileName}')).toBeInTheDocument();
  });
});`;
                default:
                  return "";
              }
            }
            return "";
          },
        } as vscode.WorkspaceConfiguration);

      // Mock showInputBox to return component path
      const originalShowInputBox = vscode.window.showInputBox;
      vscode.window.showInputBox = async () => `>${componentName}`;

      // Mock showInformationMessage to capture success message
      let successMessage = "";
      const originalShowInformationMessage =
        vscode.window.showInformationMessage;
      vscode.window.showInformationMessage = async (message: string) => {
        successMessage = message;
        return undefined;
      };

      // Mock showTextDocument to prevent opening files
      const originalShowTextDocument = vscode.window.showTextDocument;
      vscode.window.showTextDocument = async () => undefined as any;

      // Mock openTextDocument to prevent opening files
      const originalOpenTextDocument = vscode.workspace.openTextDocument;
      vscode.workspace.openTextDocument = async () => undefined as any;

      try {
        // Create component
        await CreateReactComponent.create(
          vscode.Uri.file(path.join(componentPath, "dummy.tsx")),
        );

        // Verify success message
        assert.strictEqual(
          successMessage,
          `React component ${componentName} created successfully!`,
        );

        // Verify files were created
        const expectedFiles = [
          path.join(tempWorkspace, `${componentName}.tsx`),
          path.join(tempWorkspace, `${componentName}.module.css`),
          path.join(tempWorkspace, "__tests__", `${componentName}.spec.tsx`),
        ];

        for (const file of expectedFiles) {
          assert.strictEqual(
            fs.existsSync(file),
            true,
            `File ${file} should exist`,
          );
        }

        // Verify component file content
        const componentContent = fs.readFileSync(expectedFiles[0], "utf8");
        assert.ok(
          componentContent.includes(
            `export const ${componentName}: React.FC<${componentName}Props>`,
          ),
        );
        assert.ok(componentContent.includes(`<h1>${componentName}</h1>`));
      } finally {
        // Restore mocks
        vscode.workspace.getConfiguration = originalGetConfiguration;
        vscode.window.showInputBox = originalShowInputBox;
        vscode.window.showInformationMessage = originalShowInformationMessage;
        vscode.window.showTextDocument = originalShowTextDocument;
        vscode.workspace.openTextDocument = originalOpenTextDocument;
      }
    });
  });
});
