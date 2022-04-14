// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const PORT = vscode.workspace.getConfiguration('simple').get('port', 11011)

//TODO: run the viewer here directly from published package

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  const provider = new SimpleTooleViewProvider(context.extensionUri)
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SimpleTooleViewProvider.viewType,
      provider
    )
  )
}

// taken from: https://github.com/microsoft/vscode-extension-samples/blob/main/webview-view-sample/ and converted from TS
var SimpleTooleViewProvider = /** @class */ (function () {
  function SimpleTooleViewProvider(_extensionUri) {
    this._extensionUri = _extensionUri
  }
  SimpleTooleViewProvider.prototype.resolveWebviewView = function (
    webviewView
  ) {
    this._view = webviewView
    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [this._extensionUri],
      // This maps localhost:3000 in the webview to a server port on the remote/external host.
      portMapping: [{ webviewPort: PORT, extensionHostPort: PORT }],
    }
    webviewView.webview.html = this._getHtmlForWebview()
  }

  SimpleTooleViewProvider.prototype._getHtmlForWebview = function () {
    return `<!DOCTYPE html>
            <html lang="en"">
            <head>
                <meta charset="UTF-8">
                <title>Preview</title>
                <style>
                    html { width: 100%; height: 100%; min-height: 100%; display: flex; }
                    body { flex: 1; display: flex; }
                    iframe { flex: 1; border: none; background: black; }
                </style>
            </head>
            <body>
                <iframe src="http://localhost:${PORT}"></iframe>
            </body>
            </html>`
  }
  SimpleTooleViewProvider.viewType = 'simple-tool.simpleToolView'
  return SimpleTooleViewProvider
})()

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
}
