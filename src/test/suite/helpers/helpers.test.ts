import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import {
  createDirectoryIfNotExists,
  getConfiguration,
  writeFile,
  showInformationMessage,
  showErrorMessage,
  promptExportType,
  promptClassName,
} from "../../../helpers";

suite("Helper Functions Test Suite", () => {
  vscode.window.showInformationMessage("Start helper functions tests.");

  suite("File System Helpers", () => {
    test("createDirectoryIfNotExists should create directory", () => {
      const tempDir = path.join(os.tmpdir(), "test-dir-" + Date.now());

      // Directory should not exist initially
      assert.strictEqual(fs.existsSync(tempDir), false);

      // Create directory
      createDirectoryIfNotExists(tempDir);

      // Directory should exist after creation
      assert.strictEqual(fs.existsSync(tempDir), true);

      // Cleanup
      fs.rmdirSync(tempDir);
    });

    test("createDirectoryIfNotExists should not fail if directory exists", () => {
      const tempDir = path.join(os.tmpdir(), "test-dir-" + Date.now());

      // Create directory first
      fs.mkdirSync(tempDir, { recursive: true });

      // Should not throw when directory already exists
      assert.doesNotThrow(() => createDirectoryIfNotExists(tempDir));

      // Cleanup
      fs.rmdirSync(tempDir);
    });

    test("writeFile should create file with content", () => {
      const tempFile = path.join(
        os.tmpdir(),
        "test-file-" + Date.now() + ".txt",
      );
      const testContent = "Test content";

      // File should not exist initially
      assert.strictEqual(fs.existsSync(tempFile), false);

      // Write file
      writeFile(tempFile, testContent);

      // File should exist and contain correct content
      assert.strictEqual(fs.existsSync(tempFile), true);
      assert.strictEqual(fs.readFileSync(tempFile, "utf8"), testContent);

      // Cleanup
      fs.unlinkSync(tempFile);
    });
  });

  suite("Configuration Helpers", () => {
    test("getConfiguration should return workspace configuration", () => {
      const config = getConfiguration("reactNextjsGenerator.templates");
      assert.ok(config);
      assert.strictEqual(typeof config.get, "function");
    });
  });

  suite("Message Helpers", () => {
    test("showInformationMessage should not throw", () => {
      assert.doesNotThrow(() => showInformationMessage("Test message"));
    });

    test("showErrorMessage should not throw", () => {
      assert.doesNotThrow(() => showErrorMessage("Test error"));
    });
  });

  suite("Input Validation Helpers", () => {
    test("promptExportType should validate input correctly", async () => {
      // Mock vscode.window.showInputBox
      const originalShowInputBox = vscode.window.showInputBox;

      // Test valid input
      vscode.window.showInputBox = async (options: any) => {
        if (options.validateInput) {
          assert.strictEqual(options.validateInput("class"), null);
          assert.strictEqual(options.validateInput("interface"), null);
          assert.strictEqual(options.validateInput("type"), null);
          assert.strictEqual(options.validateInput("enum"), null);

          // Test invalid input
          assert.strictEqual(
            options.validateInput("invalid"),
            'Please enter "class", "interface", "type", or "enum"',
          );
        }
        return "class";
      };

      const result = await promptExportType();
      assert.strictEqual(result, "class");

      // Restore original function
      vscode.window.showInputBox = originalShowInputBox;
    });

    test("promptClassName should validate input correctly", async () => {
      // Mock vscode.window.showInputBox
      const originalShowInputBox = vscode.window.showInputBox;

      // Test valid input
      vscode.window.showInputBox = async (options: any) => {
        if (options.validateInput) {
          assert.strictEqual(options.validateInput("MyClass"), null);
          assert.strictEqual(options.validateInput("ComponentName"), null);

          // Test invalid input
          assert.strictEqual(
            options.validateInput("myclass"),
            "Invalid format! Entity names MUST be declared in PascalCase.",
          );
          assert.strictEqual(
            options.validateInput("A"),
            "Invalid format! Entity names MUST be declared in PascalCase.",
          );
          assert.strictEqual(
            options.validateInput(""),
            "Invalid format! Entity names MUST be declared in PascalCase.",
          );
        }
        return "MyClass";
      };

      const result = await promptClassName();
      assert.strictEqual(result, "MyClass");

      // Restore original function
      vscode.window.showInputBox = originalShowInputBox;
    });
  });
});
