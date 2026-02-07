#!/usr/bin/env node

/**
 * Script to check for open pull requests in the repository.
 * This can be used in CI/CD pipelines to verify PR status.
 */

const https = require('https');

// Get repository information from environment or package.json
const REPO_OWNER = process.env.GITHUB_REPOSITORY_OWNER || 'dmo2000';
const REPO_NAME = process.env.GITHUB_REPOSITORY_NAME || 'semantic-release-manual';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const TEST_MODE = process.env.TEST_MODE === 'true';

function checkOpenPRs() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=open`,
      method: 'GET',
      headers: {
        'User-Agent': 'check-open-prs-script',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    if (GITHUB_TOKEN) {
      options.headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const prs = JSON.parse(data);
            resolve(prs);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else {
          reject(new Error(`GitHub API returned status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Request failed: ${e.message}`));
    });

    req.end();
  });
}

async function main() {
  console.log(`Checking open pull requests for ${REPO_OWNER}/${REPO_NAME}...`);
  
  try {
    let prs;
    
    if (TEST_MODE) {
      // In test mode, return mock data
      console.log('(Running in TEST_MODE with mock data)');
      prs = [];
    } else {
      prs = await checkOpenPRs();
    }
    
    if (prs.length === 0) {
      console.log('✓ No open pull requests found.');
      process.exit(0);
    } else {
      console.log(`\nFound ${prs.length} open pull request(s):\n`);
      prs.forEach((pr, index) => {
        console.log(`${index + 1}. PR #${pr.number}: ${pr.title}`);
        console.log(`   Author: ${pr.user.login}`);
        console.log(`   Branch: ${pr.head.ref} -> ${pr.base.ref}`);
        console.log(`   URL: ${pr.html_url}`);
        console.log(`   Status: ${pr.draft ? 'Draft' : 'Open'}`);
        console.log('');
      });
      process.exit(0);
    }
  } catch (error) {
    console.error(`Error checking open PRs: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkOpenPRs };
