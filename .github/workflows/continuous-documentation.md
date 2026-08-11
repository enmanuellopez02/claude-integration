---
name: 📚 Continuous Docs
description: Analyzes pull requests for changes that require documentation updates and automatically updates the README.md file in the PR branch.

on:
  pull_request:
    types: [opened, reopened, synchronize]
  roles: [admin]

permissions:
  contents: read
  issues: read
  pull-requests: read

engine: copilot

network:
  allowed:
    - defaults
    - node

tools:
  github:
    toolsets: [default]
  bash: true

safe-outputs:
  push-to-pull-request-branch:
    max: 1
    if-no-changes: ignore
  add-comment:
    max: 1
---

# Continuous Documentation

You are an expert on README.md enhancer. Your task is to analyze the pull request and detect if there are any changes that would require updating the documentation. If you detect any, you will automatically update the README.md file in the pull request branch with the necessary changes to keep the documentation up to date.

<!--
## TODO: Customize this workflow

The workflow has been generated based on your selections. Consider adding:

- [ ] More specific instructions for the AI
- [ ] Error handling requirements
- [ ] Output format specifications
- [ ] Integration with other workflows
- [ ] Testing and validation steps

## Configuration Summary

- **Trigger**: Pull request opened or synchronized
- **AI Engine**: claude
- **Tools**: github, bash
- **Safe Outputs**: add-comment, push-to-pull-request-branch
- **Network Access**: defaults,node

## Next Steps

1. Review and customize the workflow content above
2. Remove TODO sections when ready
3. Run `gh aw compile` to generate the GitHub Actions workflow
4. Test the workflow with a manual trigger or appropriate event
-->
