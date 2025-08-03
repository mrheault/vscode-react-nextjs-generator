import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  test("Extension should be present", () => {
    assert.ok(
      vscode.extensions.getExtension(
        "mikerheault.vscode-react-nextjs-generator",
      ),
    );
  });

  test("Extension should activate", async () => {
    const extension = vscode.extensions.getExtension(
      "mikerheault.vscode-react-nextjs-generator",
    );
    await extension?.activate();
    assert.ok(extension?.isActive);
  });
});
