// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const PORT = vscode.workspace.getConfiguration('simple').get('port', 11011)

//TODO: run the viewer here directly from published package
function activate(context) {
  const provider = new SimpleToolViewProvider(context.extensionUri)
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SimpleToolViewProvider.viewType,
      provider,
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  )
}

// console.log(getProjectRootPath())
// function getProjectRootPath() {
//   let workspace = vscode.workspace

//   //Note: Doesn't cater for multiple open workspaces, default to the first
//   return workspace.workspaceFolders
//     ? workspace.workspaceFolders[0].uri.fsPath
//     : workspace.rootPath
// }

// TODO: open a file a file etc. we may need to relay from the iframe to the holding page and up
// e.g. vscode.workspace.openTextDocument(Uri.file(path))
// webviewView.webview.onDidReceiveMessage(data => {
// 	console.log({data})
// });

// taken from: https://github.com/microsoft/vscode-extension-samples/blob/main/webview-view-sample/
var SimpleToolViewProvider = /** @class */ (function () {
  function SimpleToolViewProvider(_extensionUri) {
    this._extensionUri = _extensionUri
  }
  SimpleToolViewProvider.prototype.resolveWebviewView = function (webviewView) {
    this._webview = webviewView
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
      portMapping: [{ webviewPort: PORT, extensionHostPort: PORT }],
    }

    webviewView.webview.html = this._getHtmlForWebview()
  }

  SimpleToolViewProvider.prototype._getHtmlForWebview = function () {
    return `<!DOCTYPE html>
            <html lang="en">
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

  SimpleToolViewProvider.viewType = 'simple-tool.simpleToolView'
  return SimpleToolViewProvider
})()

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
}
