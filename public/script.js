const createUserForm = document.getElementById("createUserForm");
const getUserForm = document.getElementById("getUserForm");
const deleteUserForm = document.getElementById("deleteUserForm");
const usersList = document.getElementById("usersList");
const singleUserOutput = document.getElementById("singleUserOutput");
const refreshUsersBtn = document.getElementById("refreshUsersBtn");
const refreshReportBtn = document.getElementById("refreshReportBtn");
const reportSummary = document.getElementById("reportSummary");
const suiteReport = document.getElementById("suiteReport");
const testCatalog = document.getElementById("testCatalog");
const reportMeta = document.getElementById("reportMeta");
const message = document.getElementById("message");

function showMessage(text, type = "success") {
  message.textContent = text;
  message.className = `message ${type}`;
}

function renderUsers(users) {
  if (!users.length) {
    usersList.innerHTML = "<p>No users available.</p>";
    return;
  }

  usersList.innerHTML = users
    .map(
      (user) => `
      <article class="user-item">
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
      </article>
    `
    )
    .join("");
}

function renderReportSummary(report) {
  const numericCoverage = [
    Number(report.coverage.lines),
    Number(report.coverage.branches),
    Number(report.coverage.functions),
    Number(report.coverage.statements)
  ];
  const overallCoverage =
    (numericCoverage.reduce((acc, value) => acc + value, 0) / numericCoverage.length).toFixed(2);

  const createCards = (items) =>
    items
      .map(
        (stat) => `
        <article class="report-stat ${stat.tone ? `coverage-${stat.tone}` : ""}">
          <p class="label">${stat.label}</p>
          <p class="value">${stat.value}</p>
          ${stat.note ? `<p class="coverage-note">${stat.note}</p>` : ""}
        </article>
      `
      )
      .join("");

  const testsBlock = createCards([{ label: "Total Tests", value: report.summary.totalTests }]);
  const testTypesBlock = createCards([
    { label: "Unit Tests", value: report.summary.unitTests ?? 0 },
    { label: "Integration Tests", value: report.summary.integrationTests ?? 0 },
    { label: "API Tests", value: report.summary.apiTests ?? 0 },
    { label: "Database Tests", value: report.summary.databaseTests ?? 0 }
  ]);
  const testResultBlock = createCards([
    { label: "Passed Tests", value: report.summary.passedTests },
    { label: "Failed Tests", value: report.summary.failedTests },
    { label: "Test Suites", value: `${report.summary.passedSuites}/${report.summary.totalSuites}` }
  ]);
  const coverageBlock = createCards([{ label: "Overall Coverage", value: `${overallCoverage}%` }]);
  const detailedCoverageBlock = createCards([
    {
      label: "Line Coverage",
      value: `${report.coverage.lines}%`,
      note: "Lines executed",
      tone: "line"
    },
    {
      label: "Branch Coverage",
      value: `${report.coverage.branches}%`,
      note: "Conditions tested",
      tone: "branch"
    },
    {
      label: "Function Coverage",
      value: `${report.coverage.functions}%`,
      note: "Functions called",
      tone: "function"
    },
    {
      label: "Statement Coverage",
      value: `${report.coverage.statements}%`,
      note: "Statements executed",
      tone: "statement"
    }
  ]);

  reportSummary.innerHTML = `
    <section class="summary-block">
      <h3>Tests</h3>
      <div class="report-grid report-grid-single">${testsBlock}</div>
    </section>
    <section class="summary-block">
      <h3>Test Types</h3>
      <div class="report-grid">${testTypesBlock}</div>
    </section>
    <section class="summary-block">
      <h3>Test Result</h3>
      <div class="report-grid report-grid-compact">${testResultBlock}</div>
    </section>
    <section class="summary-block">
      <h3>Coverage</h3>
      <div class="report-grid report-grid-single">${coverageBlock}</div>
    </section>
    <section class="summary-block">
      <h3>Detailed Coverage</h3>
      <div class="report-grid report-grid-detailed">${detailedCoverageBlock}</div>
    </section>
  `;
}
function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString();
}

function renderSuiteReport(report) {
  if (!report.suites.length) {
    suiteReport.innerHTML = "<p>No suite details found.</p>";
    return;
  }

  suiteReport.innerHTML = report.suites
    .map((suite) => {
      const badgeClass = suite.status === "passed" ? "pass" : "fail";
      return `
        <article class="suite-card">
          <h3>
            ${suite.file}
            <span class="badge ${suite.type || "other"}">
              ${(suite.type || "other").toUpperCase()}
            </span>
            <span class="badge ${badgeClass}">${suite.status.toUpperCase()}</span>
          </h3>
          <p>Passing: ${suite.passing} | Failing: ${suite.failing} | Pending: ${suite.pending}</p>
          <ul>
            ${suite.tests
              .map((test) => {
                const isPassed = test.status === "passed";
                const icon = isPassed ? "&#10003;" : "&#10007;";
                const iconClass = isPassed ? "pass" : "fail";
                return `<li class="test-line"><span class="tick ${iconClass}">${icon}</span> ${test.name}</li>`;
              })
              .join("")}
          </ul>
        </article>
      `;
    })
    .join("");
}

function toTitleCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function cleanTestName(name) {
  return String(name)
    .replace(/\s+/g, " ")
    .trim();
}

function renderTestCatalog(report) {
  const order = ["unit", "integration", "api", "database", "other"];
  const grouped = order
    .map((type) => ({
      type,
      suites: report.suites.filter((suite) => suite.type === type)
    }))
    .filter((group) => group.suites.length > 0);

  if (!grouped.length) {
    testCatalog.innerHTML = "<p>No test cases available.</p>";
    return;
  }

  testCatalog.innerHTML = grouped
    .map((group) => {
      const testItems = group.suites
        .flatMap((suite) => suite.tests)
        .map(
          (test) => `
            <li class="test-line">
              <span class="tick ${test.status === "passed" ? "pass" : "fail"}">
                ${test.status === "passed" ? "&#10003;" : "&#10007;"}
              </span>
              ${cleanTestName(test.name)}
            </li>
          `
        )
        .join("");

      return `
        <article class="suite-card">
          <h3>${toTitleCase(group.type)} Test Cases</h3>
          <ul>${testItems}</ul>
        </article>
      `;
    })
    .join("");
}

async function loadTestReport() {
  try {
    const response = await fetch(`/test-report.json?t=${Date.now()}`);
    if (!response.ok) {
      throw new Error("Report missing");
    }

    const report = await response.json();
    renderReportSummary(report);
    renderSuiteReport(report);
    renderTestCatalog(report);
    reportMeta.textContent = `Last updated: ${formatTimestamp(report.generatedAt)}`;
  } catch (error) {
    reportSummary.innerHTML = "";
    suiteReport.innerHTML =
      "<p>Test report not found. Run <code>npm test</code>, then open/refresh this page while server is running.</p>";
    testCatalog.innerHTML =
      "<p>Test case catalog will appear after <code>npm test</code> generates <code>public/test-report.json</code>.</p>";
    reportMeta.textContent = "No report found yet.";
  }
}

async function loadUsers() {
  try {
    const response = await fetch("/users");
    const users = await response.json();
    renderUsers(users);
  } catch (error) {
    showMessage("Failed to load users.", "error");
  }
}

createUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(createUserForm);
  const payload = {
    name: formData.get("name"),
    email: formData.get("email")
  };

  try {
    const response = await fetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Failed to create user.", "error");
      return;
    }

    showMessage(`User created successfully (ID: ${data.id}).`, "success");
    createUserForm.reset();
    await loadUsers();
  } catch (error) {
    showMessage("Network error while creating user.", "error");
  }
});

getUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = document.getElementById("getUserId").value.trim();

  if (!id) {
    showMessage("Please enter a user ID.", "error");
    return;
  }

  try {
    const response = await fetch(`/users/${id}`);
    const data = await response.json();

    if (!response.ok) {
      singleUserOutput.textContent = data.message || "User not found.";
      showMessage("User search failed.", "error");
      return;
    }

    singleUserOutput.textContent = JSON.stringify(data, null, 2);
    showMessage("User loaded successfully.", "success");
  } catch (error) {
    showMessage("Network error while searching user.", "error");
  }
});

deleteUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = document.getElementById("deleteUserId").value.trim();

  if (!id) {
    showMessage("Please enter a user ID to delete.", "error");
    return;
  }

  try {
    const response = await fetch(`/users/${id}`, { method: "DELETE" });

    if (response.status === 204) {
      showMessage(`User ${id} deleted successfully.`, "success");
      deleteUserForm.reset();
      singleUserOutput.textContent = "No user searched yet.";
      await loadUsers();
      return;
    }

    const data = await response.json();
    showMessage(data.message || "Failed to delete user.", "error");
  } catch (error) {
    showMessage("Network error while deleting user.", "error");
  }
});

refreshUsersBtn.addEventListener("click", loadUsers);
refreshReportBtn.addEventListener("click", loadTestReport);

loadUsers();
loadTestReport();
setInterval(loadTestReport, 5000);

