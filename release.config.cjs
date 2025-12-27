
module.exports = {
  branches: [
    { name: 'main' },
    { name: 'next', channel: 'next', prerelease: true }
  ],
  tagFormat: 'v${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', { releaseRules: [
        { release: process.env.SEMANTIC_RELEASE_BUMP_TYPE }
      ] }],
    ['@semantic-release/release-notes-generator', { preset: 'angular' }],
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    './verify-release.js'
  ],
  verifyConditions: [
  ],
  prepare: [
    '@semantic-release/changelog'
  ]
};
