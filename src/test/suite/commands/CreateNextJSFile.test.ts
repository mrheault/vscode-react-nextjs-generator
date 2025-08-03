import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { CreateNextJSFile } from "../../../commands/CreateNextJSFile";

suite("CreateNextJSFile Command Test Suite", () => {
  suite("Basic Functionality", () => {
    test("CreateNextJSFile should be defined", () => {
      assert.ok(CreateNextJSFile);
      assert.strictEqual(typeof CreateNextJSFile.create, "function");
      assert.strictEqual(typeof CreateNextJSFile.createClass, "function");
    });
  });

  suite("Error Handling", () => {
    test("CreateNextJSFile.create should handle no URI", async () => {
      // Mock showErrorMessage to capture the error
      let capturedError = "";
      const originalShowErrorMessage = vscode.window.showErrorMessage;
      vscode.window.showErrorMessage = async (message: string) => {
        capturedError = message;
        return undefined;
      };

      try {
        await CreateNextJSFile.create(null as any, "page");
        assert.strictEqual(capturedError, "No file selected");
      } finally {
        // Restore original showErrorMessage
        vscode.window.showErrorMessage = originalShowErrorMessage;
      }
    });

    test("CreateNextJSFile.create should handle invalid type", async () => {
      const tempDir = path.join(os.tmpdir(), "test-dir-" + Date.now());
      fs.mkdirSync(tempDir, { recursive: true });

      // Mock getConfiguration to return empty content
      const originalGetConfiguration = vscode.workspace.getConfiguration;
      vscode.workspace.getConfiguration = (section?: string) =>
        ({
          get: (key: string) => "",
        } as vscode.WorkspaceConfiguration);

      // Mock showErrorMessage to capture the error
      let capturedError = "";
      const originalShowErrorMessage = vscode.window.showErrorMessage;
      vscode.window.showErrorMessage = async (message: string) => {
        capturedError = message;
        return undefined;
      };

      try {
        await CreateNextJSFile.create(vscode.Uri.file(tempDir), "invalid");
        assert.strictEqual(
          capturedError,
          'Template for type "invalid" not found',
        );
      } finally {
        // Restore mocks and cleanup
        vscode.workspace.getConfiguration = originalGetConfiguration;
        vscode.window.showErrorMessage = originalShowErrorMessage;
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    test("CreateNextJSFile.createClass should handle no URI", async () => {
      // Mock showErrorMessage to capture the error
      let capturedError = "";
      const originalShowErrorMessage = vscode.window.showErrorMessage;
      vscode.window.showErrorMessage = async (message: string) => {
        capturedError = message;
        return undefined;
      };

      try {
        await CreateNextJSFile.createClass(null as any);
        assert.strictEqual(capturedError, "No file selected");
      } finally {
        // Restore original showErrorMessage
        vscode.window.showErrorMessage = originalShowErrorMessage;
      }
    });

    test("CreateNextJSFile.createClass should handle no export type", async () => {
      const tempDir = path.join(os.tmpdir(), "test-dir-" + Date.now());
      fs.mkdirSync(tempDir, { recursive: true });

      // Mock showInputBox to return undefined for export type
      const originalShowInputBox = vscode.window.showInputBox;
      vscode.window.showInputBox = async (options: any) => {
        if (options.prompt === "Enter export type") {
          return undefined;
        }
        return "class";
      };

      // Mock showErrorMessage to capture the error
      let capturedError = "";
      const originalShowErrorMessage = vscode.window.showErrorMessage;
      vscode.window.showErrorMessage = async (message: string) => {
        capturedError = message;
        return undefined;
      };

      try {
        await CreateNextJSFile.createClass(vscode.Uri.file(tempDir));
        assert.strictEqual(capturedError, "No export type provided");
      } finally {
        // Restore mocks and cleanup
        vscode.window.showInputBox = originalShowInputBox;
        vscode.window.showErrorMessage = originalShowErrorMessage;
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    });

    test("CreateNextJSFile.createClass should handle no class name", async () => {
      const tempDir = path.join(os.tmpdir(), "test-dir-" + Date.now());
      fs.mkdirSync(tempDir, { recursive: true });

      // Mock showInputBox to return valid export type but undefined class name
      const originalShowInputBox = vscode.window.showInputBox;
      vscode.window.showInputBox = async (options: any) => {
        if (options.prompt === "Enter export type") {
          return "class";
        }
        if (options.prompt === "Enter class name") {
          return undefined;
        }
        return "TestClass";
      };

      // Mock showErrorMessage to capture the error
      let capturedError = "";
      const originalShowErrorMessage = vscode.window.showErrorMessage;
      vscode.window.showErrorMessage = async (message: string) => {
        capturedError = message;
        return undefined;
      };

      try {
        await CreateNextJSFile.createClass(vscode.Uri.file(tempDir));
        assert.strictEqual(capturedError, "No class name provided");
      } finally {
        // Restore mocks and cleanup
        vscode.window.showInputBox = originalShowInputBox;
        vscode.window.showErrorMessage = originalShowErrorMessage;
        fs.rmSync(tempDir, { recursive: true, force: true });
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

    suite("File Creation Tests", () => {
      test("CreateNextJSFile should create page file successfully", async () => {
        const pageDir = path.join(tempWorkspace, "app", "test-page");
        fs.mkdirSync(pageDir, { recursive: true });

        // Mock configuration to return page template
        const originalGetConfiguration = vscode.workspace.getConfiguration;
        vscode.workspace.getConfiguration = (section?: string) =>
          ({
            get: (key: string) => {
              if (
                section === "reactNextjsGenerator.templates" &&
                key === "page"
              ) {
                return `import React from 'react';

export default function Page() {
  return (
    <div>
      <h1>Test Page</h1>
    </div>
  );
}`;
              }
              return "";
            },
          } as vscode.WorkspaceConfiguration);

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
          // Create page
          await CreateNextJSFile.create(vscode.Uri.file(pageDir), "page");

          // Verify success message
          assert.strictEqual(
            successMessage,
            "Page file page.tsx created successfully!",
          );

          // Verify file was created
          const pageFile = path.join(pageDir, "page.tsx");
          assert.strictEqual(fs.existsSync(pageFile), true);

          // Verify file content
          const pageContent = fs.readFileSync(pageFile, "utf8");
          assert.ok(pageContent.includes("export default function Page()"));
          assert.ok(pageContent.includes("<h1>Test Page</h1>"));
        } finally {
          // Restore mocks
          vscode.workspace.getConfiguration = originalGetConfiguration;
          vscode.window.showInformationMessage = originalShowInformationMessage;
          vscode.window.showTextDocument = originalShowTextDocument;
          vscode.workspace.openTextDocument = originalOpenTextDocument;
        }
      });

      test("CreateNextJSFile should create layout file successfully", async () => {
        const layoutDir = path.join(tempWorkspace, "app");
        fs.mkdirSync(layoutDir, { recursive: true });

        // Mock configuration to return layout template
        const originalGetConfiguration = vscode.workspace.getConfiguration;
        vscode.workspace.getConfiguration = (section?: string) =>
          ({
            get: (key: string) => {
              if (
                section === "reactNextjsGenerator.templates" &&
                key === "layout"
              ) {
                return `import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`;
              }
              return "";
            },
          } as vscode.WorkspaceConfiguration);

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
          // Create layout
          await CreateNextJSFile.create(vscode.Uri.file(layoutDir), "layout");

          // Verify success message
          assert.strictEqual(
            successMessage,
            "Layout file layout.tsx created successfully!",
          );

          // Verify file was created
          const layoutFile = path.join(layoutDir, "layout.tsx");
          assert.strictEqual(fs.existsSync(layoutFile), true);

          // Verify file content
          const layoutContent = fs.readFileSync(layoutFile, "utf8");
          assert.ok(
            layoutContent.includes("export default function RootLayout"),
          );
          assert.ok(layoutContent.includes('<html lang="en">'));
        } finally {
          // Restore mocks
          vscode.workspace.getConfiguration = originalGetConfiguration;
          vscode.window.showInformationMessage = originalShowInformationMessage;
          vscode.window.showTextDocument = originalShowTextDocument;
          vscode.workspace.openTextDocument = originalOpenTextDocument;
        }
      });
    });

    suite("Class Creation Tests", () => {
      test("CreateNextJSFile.createClass should create class file successfully", async () => {
        const classDir = path.join(tempWorkspace, "src", "classes");
        fs.mkdirSync(classDir, { recursive: true });

        // Mock showInputBox to return "class" for export type and "TestClass" for class name
        const originalShowInputBox = vscode.window.showInputBox;
        vscode.window.showInputBox = async (options: any) => {
          if (options.prompt === "Enter export type") {
            return "class";
          }
          if (options.prompt === "Enter class name") {
            return "TestClass";
          }
          return undefined;
        };

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
          // Create class
          await CreateNextJSFile.createClass(vscode.Uri.file(classDir));

          // Verify success message
          assert.strictEqual(
            successMessage,
            "TestClass class created successfully!",
          );

          // Verify file was created
          const classFile = path.join(classDir, "TestClass.tsx");
          assert.strictEqual(fs.existsSync(classFile), true);

          // Verify file content
          const classContent = fs.readFileSync(classFile, "utf8");
          assert.ok(classContent.includes("export class TestClass"));
          assert.ok(
            classContent.includes(
              "// Add your class properties and/or methods here",
            ),
          );
        } finally {
          // Restore mocks
          vscode.window.showInputBox = originalShowInputBox;
          vscode.window.showInformationMessage = originalShowInformationMessage;
          vscode.window.showTextDocument = originalShowTextDocument;
          vscode.workspace.openTextDocument = originalOpenTextDocument;
        }
      });

      test("CreateNextJSFile.createClass should create interface file successfully", async () => {
        const interfaceDir = path.join(tempWorkspace, "src", "interfaces");
        fs.mkdirSync(interfaceDir, { recursive: true });

        // Mock showInputBox to return "interface" for export type and "TestInterface" for class name
        const originalShowInputBox = vscode.window.showInputBox;
        vscode.window.showInputBox = async (options: any) => {
          if (options.prompt === "Enter export type") {
            return "interface";
          }
          if (options.prompt === "Enter class name") {
            return "TestInterface";
          }
          return undefined;
        };

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
          // Create interface
          await CreateNextJSFile.createClass(vscode.Uri.file(interfaceDir));

          // Verify success message
          assert.strictEqual(
            successMessage,
            "TestInterface interface created successfully!",
          );

          // Verify file was created
          const interfaceFile = path.join(interfaceDir, "TestInterface.tsx");
          assert.strictEqual(fs.existsSync(interfaceFile), true);

          // Verify file content
          const interfaceContent = fs.readFileSync(interfaceFile, "utf8");
          assert.ok(
            interfaceContent.includes("export interface TestInterface"),
          );
          assert.ok(
            interfaceContent.includes(
              "// Add your interface properties and/or methods here",
            ),
          );
        } finally {
          // Restore mocks
          vscode.window.showInputBox = originalShowInputBox;
          vscode.window.showInformationMessage = originalShowInformationMessage;
          vscode.window.showTextDocument = originalShowTextDocument;
          vscode.workspace.openTextDocument = originalOpenTextDocument;
        }
      });
    });
  });
});
