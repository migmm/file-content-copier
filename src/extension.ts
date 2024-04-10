// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.copyFilesContent', async (...cmdArgs: [vscode.Uri, vscode.Uri[]]) => {
        const [contextSelection, allSelections] = cmdArgs;

        if (!allSelections || allSelections.length === 0) {
            vscode.window.showWarningMessage('No files selected.');
            return;
        }

        try {
            const fileContents = await Promise.all(
                allSelections.map(async (uri) => {
                    try {
                        const fileContent = await vscode.workspace.fs.readFile(uri);
                        const fileName = vscode.workspace.asRelativePath(uri);
                        const content = Buffer.from(fileContent).toString();
                        return `File: ${fileName}\n\n${content}`;
                    } catch (error) {
                        console.error(`Error reading file ${uri.fsPath}: ${error}`);
                        return '';
                    }
                })
            );

            const formattedContent = fileContents.join('\n\n');
            if (formattedContent !== '') {
                vscode.env.clipboard.writeText(formattedContent);
                vscode.window.showInformationMessage('Content copied to clipboard!');
            } else {
                vscode.window.showWarningMessage('No content to copy!');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(error.message);
            } else {
                console.error('Unexpected error:', error);
                vscode.window.showErrorMessage('An unexpected error occurred.');
            }
        }
    });

    context.subscriptions.push(disposable);
}


// This method is called when your extension is deactivated
export function deactivate() {}
