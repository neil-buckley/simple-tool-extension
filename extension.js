// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const PORT = 3000

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

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

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'simple-tool.simpleTool',
    function () {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage('Hello World VS code!')
    }
  )

  context.subscriptions.push(disposable)
}

// taken from: https://github.com/microsoft/vscode-extension-samples/blob/main/webview-view-sample/ and converted from TS

var SimpleTooleViewProvider = /** @class */ (function () {
  function SimpleTooleViewProvider(_extensionUri) {
    this._extensionUri = _extensionUri
  }
  SimpleTooleViewProvider.prototype.resolveWebviewView = function (
    webviewView,
    context,
    _token
  ) {
    this._view = webviewView
    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
      // This maps localhost:3000 in the webview to the express server port on the remote host.
      portMapping: [{ webviewPort: PORT, extensionHostPort: PORT }],
    }
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)
  }

  SimpleTooleViewProvider.prototype._getHtmlForWebview = function (webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    // var scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
    // // Do the same for the stylesheet.
    // var styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
    // var styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
    // var styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

    return `<!DOCTYPE html>
            <html lang="en"">
            <head>
                <meta charset="UTF-8">
                <title>Preview</title>
                <style>
                    html { width: 100%; height: 100%; min-height: 100%; display: flex; }
                    body { flex: 1; display: flex; }
                    iframe { flex: 1; border: none; background: white; }
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
