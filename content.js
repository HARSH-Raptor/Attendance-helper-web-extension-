(async () => {
  let buttons = document.querySelectorAll("a[ng-click^='getAttendanceData']");
  let courseIds = Array.from(buttons).map(btn => {
    let match = btn.getAttribute("ng-click").match(/'([^']+)'/);
    return match ? match[1].replace(",", "") : null;
  }).filter(Boolean);

  let roll = document.body.innerText.match(/\b\d{5}\b/);
  roll = roll ? roll[0] : null;

  let results = [];

  for (let cid of courseIds) {
    try {
      let resp = await fetch("/secure/studentMyCourseAttendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: cid + ",", roll: roll })
      });

      let data = await resp.json();
      let present = data.presentClasses || 0;
      let total = data.totalClasses || 0;
      let percent = total > 0 ? ((present / total) * 100).toFixed(2) : "0.00";
      let leaves = total > 0 ? Math.floor((present / 0.75) - total) : 0;

      results.push({ cid, present, total, percent, leaves });
    } catch (e) {
      console.error("Error fetching attendance for", cid, e);
    }
  }

  return results;
})();
