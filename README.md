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
