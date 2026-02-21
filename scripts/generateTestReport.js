const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const jestReportPath = path.join(rootDir, "coverage", "jest-report.json");
const coverageSummaryPath = path.join(rootDir, "coverage", "coverage-summary.json");
const outputPath = path.join(rootDir, "public", "test-report.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function toTwo(num) {
  return Number(num || 0).toFixed(2);
}

function detectSuiteType(filePath) {
  const file = filePath.toLowerCase();
  if (file.includes(".db.")) {
    return "database";
  }
  if (file.includes(".api.")) {
    return "api";
  }
  if (file.includes(".unit.")) {
    return "unit";
  }
  if (file.includes(".integration.") || file.includes("routes")) {
    return "integration";
  }
  return "other";
}

function buildReport() {
  const jestReport = readJson(jestReportPath);
  const coverageSummary = readJson(coverageSummaryPath);
  const totalCoverage = coverageSummary.total || {};
  const suites = jestReport.testResults.map((suite) => {
    const relativeFile = suite.name.replace(rootDir + path.sep, "");
    return {
      file: relativeFile,
      type: detectSuiteType(relativeFile),
      status: suite.status,
      passing: suite.assertionResults.filter((a) => a.status === "passed").length,
      failing: suite.assertionResults.filter((a) => a.status === "failed").length,
      pending: suite.assertionResults.filter((a) => a.status === "pending").length,
      tests: suite.assertionResults.map((test) => ({
        name: test.fullName,
        status: test.status
      }))
    };
  });

  const unitTests = suites
    .filter((s) => s.type === "unit")
    .reduce((acc, s) => acc + s.passing + s.failing + s.pending, 0);
  const integrationTests = suites
    .filter((s) => s.type === "integration")
    .reduce((acc, s) => acc + s.passing + s.failing + s.pending, 0);
  const apiTests = suites
    .filter((s) => s.type === "api")
    .reduce((acc, s) => acc + s.passing + s.failing + s.pending, 0);
  const databaseTests = suites
    .filter((s) => s.type === "database")
    .reduce((acc, s) => acc + s.passing + s.failing + s.pending, 0);

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalSuites: jestReport.numTotalTestSuites,
      passedSuites: jestReport.numPassedTestSuites,
      failedSuites: jestReport.numFailedTestSuites,
      totalTests: jestReport.numTotalTests,
      passedTests: jestReport.numPassedTests,
      failedTests: jestReport.numFailedTests,
      pendingTests: jestReport.numPendingTests,
      testSuccess: jestReport.success,
      unitTests,
      integrationTests,
      apiTests,
      databaseTests
    },
    coverage: {
      statements: toTwo(totalCoverage.statements && totalCoverage.statements.pct),
      branches: toTwo(totalCoverage.branches && totalCoverage.branches.pct),
      functions: toTwo(totalCoverage.functions && totalCoverage.functions.pct),
      lines: toTwo(totalCoverage.lines && totalCoverage.lines.pct)
    },
    suites
  };
}

function main() {
  if (!fs.existsSync(jestReportPath) || !fs.existsSync(coverageSummaryPath)) {
    console.error("Missing report files. Run npm test first.");
    process.exit(1);
  }

  const report = buildReport();
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`Frontend test report created at ${outputPath}`);
}

main();
