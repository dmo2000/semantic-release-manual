#!/usr/bin/env node

/**
 * Script to check for open pull requests in the repository.
 * This can be used in CI/CD pipelines to verify PR status.
 */

const https = require('https');

// Get repository information from environment or package.json
function getRepoInfo() {
  const owner = process.env.GITHUB_REPOSITORY_OWNER;
  const name = process.env.GITHUB_REPOSITORY_NAME;
  
  if (!owner || !name) {
    // Try to read from package.json
    try {
      const pkg = require('./package.json');
      const repoUrl = pkg.repository?.url || '';
      const match = repoUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
      if (match) {
        return { owner: match[1], name: match[2] };
      }
    } catch (e) {
      // package.json not found or invalid
    }
    
    throw new Error('Repository information not found. Set GITHUB_REPOSITORY_OWNER and GITHUB_REPOSITORY_NAME environment variables.');
  }
  
  return { owner, name };
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const TEST_MODE = process.env.TEST_MODE === 'true';

function checkOpenPRs(owner, name) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${name}/pulls?state=open`,
      method: 'GET',
      headers: {
        'User-Agent': 'check-open-prs-script',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    if (GITHUB_TOKEN) {
      options.headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
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
  try {
    const { owner, name } = getRepoInfo();
    console.log(`Checking open pull requests for ${owner}/${name}...`);
    
    let prs;
    
    if (TEST_MODE) {
      // In test mode, return mock data
      console.log('(Running in TEST_MODE with mock data)');
      prs = [];
    } else {
      prs = await checkOpenPRs(owner, name);
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
