# Branch in Window Title VS Code Extension

**Branch in Window Title** is a simple Visual Studio Code extension that looks for a Git repository in the currently open workspace. If a Git repository is detected, the current branch name is appended to the VS Code window title.

This can be used to automate time allocation to issue tracking systems via [WiseTime](https://wisetime.com). Here is an example developement workflow.

## WiseTime Jira Workflow

I have been assigned a new ticket. I read the issue description, and then create a new branch via Jira.

![Jira Issue](doc/resources/jira-issue.png)

I select the relevant repository, choose to branch from master.

![Create Git Branch from Jira](doc/resources/jira-create-branch.png)

Next, I checkout the branch and open the project in VS Code.

![Git Branch in VS Code Window Title](doc/resources/vscode-branch-in-window-title.png)

Since I am running the **Branch in Window Title** extension, WiseTime is able to automatically tag my activity with the relevant Jira issue number.

![Time Automatically Tagged in WiseTime Console](doc/resources/wisetime-console.png)

This means that I can go about my day without worring about time keeping. WiseTime automatically handles that for me. At the end of the day (or week), I quickly review my timeline and post time to the team. Our [Jira Connector](https://wisetime.com/jira/) then creates a worklog entry against the Jira issue.

![Time Posted to Jira Worklog](doc/resources/jira-worklog.png)

The Jira Connector watches Jira for new issues and automatically syncs them to WiseTime as tags for automatic activity tagging.

## Using an IntelliJ-based IDE?

We also have you covered if you use a JetBrains IDE. You can grab our **Branch in Window Title** plugin for IntelliJ, Websorm & friends [here](https://plugins.jetbrains.com/plugin/9675-branch-in-window-title).
