const verifyRelease = {
      verifyRelease: async (pluginConfig, context) => {
        const { lastRelease = {}, nextRelease = {}, logger = console } = context;
        const bumpType = process.env.SEMANTIC_RELEASE_BUMP_TYPE;
        const bumpNumber = process.env.SEMANTIC_RELEASE_BUMP_NUMBER;
        if (!bumpType) {
          logger.log('SEMANTIC_RELEASE_BUMP_TYPE not set — skipping version verification.');
          return;
        }
        if (bumpType == 'patch') {
          logger.log('Bump type set to patch. Nothing to verify.');
          return;
        }
        const actual = nextRelease && nextRelease.version;
        const match = actual.match(/^(\d+)\.(\d+)\.\d+$/);

        if (!match) {
          throw new Error(`Invalid tag format: ${lastRelease}`);
        }

        const actualMajor = Number(match[1]);
        const actualMinor = Number(match[2]);
        if (bumpType == 'major' && actualMajor != bumpNumber) {
          logger.error(`Major version mismatch: expected ${bumpNumber} but will publish ${actualMajor}`);
          throw new Error(`Version verification failed: expected major version ${bumpNumber}, got ${actualMajor}`);
        }
        if (bumpType == 'minor' && actualMajor != bumpNumber) {
          logger.error(`Minor version mismatch: expected ${bumpNumber} but will publish ${actualMajor}`);
          throw new Error(`Version verification failed: expected minor version ${bumpNumber}, got ${actualMajor}`);
        }
        logger.log(`Version verification passed: ${actual}`);
      }
    }


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
    verifyRelease
  ],
  verifyConditions: [
  ],
  prepare: [
    '@semantic-release/changelog'
  ]
};
