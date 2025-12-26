const semver = require('semver');

module.exports = {
  verifyRelease: async (_, context) => {
    const expectedType = process.env.SEMANTIC_RELEASE_TYPE;
    const previous = context.lastRelease.version;
    const next = context.nextRelease.version;

    if (!previous) {
      console.log('First release, skipping verification');
      return;
    }

    const diff = semver.diff(previous, next);

    if (diff !== expectedType) {
      throw new Error(
        `Version validation failed:
Expected bump: ${expectedType}
Previous: ${previous}
Next: ${next}
Actual bump: ${diff}`
      );
    }

    console.log(`Version validated: ${previous} → ${next}`);
  }
};
