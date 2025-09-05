document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["content.js"]
    },
    (injectionResults) => {
      if (chrome.runtime.lastError) {
        document.getElementById("results").innerText =
          "⚠️ Error: " + chrome.runtime.lastError.message;
        return;
      }

      if (injectionResults && injectionResults[0].result) {
        let results = injectionResults[0].result;
        renderResults(results);
      } else {
        document.getElementById("results").innerText =
          "No data received. Make sure you're on My Courses page.";
      }
    }
  );
});

function renderResults(results) {
  if (!results.length) {
    document.getElementById("results").innerText =
      "⚠️ No attendance data found.";
    return;
  }

  let html = `
    <table>
      <tr>
        <th>Course</th>
        <th>Attended</th>
        <th>Total</th>
        <th>%</th>
        <th>Leaves</th>
      </tr>
  `;

  results.forEach((row) => {
    html += `
      <tr>
        <td>${row.cid}</td>
        <td>${row.present}</td>
        <td>${row.total}</td>
        <td>${row.percent}</td>
        <td>${row.leaves}</td>
      </tr>
    `;
  });

  html += `</table>`;
  document.getElementById("results").innerHTML = html;
}
