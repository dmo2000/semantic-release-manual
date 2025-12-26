module.exports = {
  analyzeCommits: async (_, context) => {
    const pipelineBump = process.env.SEMANTIC_RELEASE_PIPELINE_BUMP;
    const majorVersion = process.env.SEMANTIC_RELEASE_MAJOR_VERSION == null ? null : Number(process.env.SEMANTIC_RELEASE_MAJOR_VERSION;
    const minorVersion = process.env.SEMANTIC_RELEASE_MINOR_VERSION == null ? null : Number(process.env.SEMANTIC_RELEASE_MINOR_VERSION);

    if (context.branch.name !== "main") {
      console.warn("Releases are only performed from the main branch");
      return false;
    }

    if (context.commits.length === 0) {
      console.warn("No new commits to analyze");
      return false;
    }

    if (pipelineBump !== "true") {
      return "patch";
    }

    if (!majorVersion || !Number.isInteger(majorVersion)) {
      throw new Error("SEMANTIC_RELEASE_MAJOR_VERSION is not set or is not an integer");
    }

    if (!minorVersion || !Number.isInteger(minorVersion)) {
      throw new Error("SEMANTIC_RELEASE_MINOR_VERSION is not set or is not an integer");
    }

    const lastRelease = context.lastRelease.gitTag;

    const match = lastRelease.match(/^v(\d+)\.(\d+)\.\d+$/);

    if (!match) {
      throw new Error(`Invalid tag format: ${lastRelease}`);
    }

    const currentMajor = Number(match[1]);
    const currentMinor = Number(match[2]);

    if (currentMajor == majorVersion) {

    }
    else if (currentMajor + 1 != majorVersion) {
      throw new Error(`Invalid major version bump current major is ${currentMajor} and next major is ${majorVersion}`);
    }  
    
    if (currentMajor == majorVersion || currentMajor + 1 == majorVersion) {
      throw new Error(`Invalid major version bump current major is ${currentMajor} and next major is ${majorVersion}`);
    }

    console.log(`Using manual release type: ${type}`);
    return "patch";
  }
};
