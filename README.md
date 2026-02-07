# Sample semantic-release + Azure DevOps

This repository demonstrates:

- semantic-release without commit message analysis
- Manual release type selection in Azure DevOps
- Version and tag validation before publishing

## How releases work

1. Run pipeline manually
2. Select release type (major / minor / patch)
3. semantic-release calculates next version
4. Version is validated
5. Tag + changelog are created

If validation fails, no tag is created.

## Additional Scripts

### Check Open Pull Requests

Run `npm run check-prs` to check for open pull requests in the repository.

This script can be used locally or in CI/CD pipelines to verify PR status. It requires a `GITHUB_TOKEN` environment variable for authentication when accessing the GitHub API.

For testing without API access, use: `TEST_MODE=true npm run check-prs`
