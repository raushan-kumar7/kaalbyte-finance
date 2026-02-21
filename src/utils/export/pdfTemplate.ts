import { ExportData } from "@/src/types/export-data";
import { BucketType } from "@/src/types/finance";

const LOGO_BASE64 =
  "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";

export function buildPdfHtml(
  data: ExportData,
  userName: string,
  userEmail: string,
): string {
  const surplus = data.totalIncome - data.grandTotal;
  const isOverBudget = surplus < 0;
  const surplusColor = isOverBudget ? "#C8004A" : "#059669";

  const generatedOn = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const generatedTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const statementId = `KBF-${Date.now().toString(36).toUpperCase()}`;

  const spentPct =
    data.totalIncome > 0
      ? Math.min((data.grandTotal / data.totalIncome) * 100, 100).toFixed(1)
      : "0";

  // ── Bucket rows ────────────────────────────────────────────────────────────
  const BUCKETS = [
    { label: "Needs", key: BucketType.NEEDS, ideal: 50 },
    { label: "Wants", key: BucketType.WANTS, ideal: 30 },
    { label: "Savings", key: BucketType.SAVINGS, ideal: 20 },
  ];

  const bucketRowsHTML = BUCKETS.map((b, i) => {
    const amount = data.bucketTotals[b.key] ?? 0;
    const pctIncome =
      data.totalIncome > 0
        ? ((amount / data.totalIncome) * 100).toFixed(1)
        : "0.0";
    const pctSpend =
      data.grandTotal > 0
        ? ((amount / data.grandTotal) * 100).toFixed(1)
        : "0.0";
    const diff =
      data.totalIncome > 0 ? (parseFloat(pctIncome) - b.ideal).toFixed(1) : "—";
    const diffNum = parseFloat(diff);
    const diffStr = diff === "—" ? "—" : diffNum > 0 ? `+${diff}%` : `${diff}%`;
    const diffColor =
      diff === "—"
        ? "#6B7280"
        : diffNum > 5
          ? "#C8004A"
          : diffNum < -5
            ? "#059669"
            : "#9CA3AF";
    return `
      <tr class="${i % 2 === 0 ? "even" : ""}">
        <td class="fw6">${b.label}</td>
        <td class="center">${b.ideal}%</td>
        <td class="right mono">₹${amount.toLocaleString("en-IN")}</td>
        <td class="center mono">${pctIncome}%</td>
        <td class="center mono">${pctSpend}%</td>
        <td class="center mono fw6" style="color:${diffColor}">${diffStr}</td>
      </tr>`;
  }).join("");

  // ── Expense detail rows — individual daily entries (page 2 table) ──────────
  const expenseRows = (data.entries ?? [])
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((entry, i) => {
      const pctSpend =
        data.grandTotal > 0
          ? ((entry.amount / data.grandTotal) * 100).toFixed(1)
          : "—";
      return `
        <tr class="${i % 2 === 0 ? "even" : ""}">
          <td class="center muted mono">${String(i + 1).padStart(2, "0")}</td>
          <td class="center mono">${entry.date}</td>
          <td class="fw6">${entry.category}</td>
          <td class="muted">${entry.description || "—"}</td>
          <td class="center mono muted" style="text-transform:capitalize">${entry.bucket}</td>
          <td class="right mono">₹${entry.amount.toLocaleString("en-IN")}</td>
          <td class="center mono">${pctSpend}%</td>
        </tr>`;
    })
    .join("");

  // ── Shared header HTML ─────────────────────────────────────────────────────
  const headerHTML = `
  <div class="bank-header">
    <div class="logo-wrap">
      <img class="logo-img" src="data:image/png;base64,${LOGO_BASE64}" alt="KaalByte Finance Logo"/>
      <div>
        <div class="app-name">KaalByte Finance</div>
        <div class="app-tag">Personal Finance Statement</div>
      </div>
    </div>
    <div class="hdr-right">
      <div class="doc-lbl">Statement ID</div>
      <div class="doc-id">${statementId}</div>
      <div class="doc-dt">${generatedOn} · ${generatedTime}</div>
    </div>
  </div>
  <div class="accent-bar"></div>`;

  // ── Reusable footer (page number injected per page) ─────────────────────────
  const buildFooterHTML = (page: string) => `
  <div class="doc-footer">
    <div class="footer-brand">KaalByte <span>Finance</span></div>
    <div class="footer-note">Auto-generated · ${generatedOn} · ${generatedTime} IST<br/>For personal use only · Not an official document</div>
    <div class="footer-page">${page}</div>
  </div>
  <div class="wm">
    <span>KAALBYTE FINANCE</span>
    <span>${statementId}</span>
    <span>PERSONAL EXPENSE STATEMENT</span>
  </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap" rel="stylesheet"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#fff; color:#0F172A; font-family:'Inter',sans-serif; font-size:12px; line-height:1.5; }
    .mono  { font-family:'Fira Code',monospace; }
    .serif { font-family:'Lora',serif; }
    .muted { color:#6B7280; }
    .right  { text-align:right; }
    .center { text-align:center; }
    .fw6 { font-weight:600; }
    .fw7 { font-weight:700; }

    /* ── Page break ── */
    .page-break { page-break-before: always; break-before: page; }

    /* ── Header ── */
    .bank-header { background:#010528; padding:24px 40px; display:flex; justify-content:space-between; align-items:center; }
    .logo-wrap { display:flex; align-items:center; gap:14px; }
    .logo-img  { width:56px; height:56px; object-fit:contain; }
    .app-name  { font-family:'Lora',serif; font-size:22px; font-weight:700; color:#B3945B; }
    .app-tag   { font-family:'Fira Code',monospace; font-size:9px; color:#6B7280; text-transform:uppercase; letter-spacing:2px; margin-top:2px; }
    .hdr-right { text-align:right; }
    .hdr-right .doc-lbl { font-family:'Fira Code',monospace; font-size:9px; color:#6B7280; text-transform:uppercase; letter-spacing:2px; margin-bottom:3px; }
    .hdr-right .doc-id  { font-family:'Fira Code',monospace; font-size:13px; font-weight:600; color:#fff; }
    .hdr-right .doc-dt  { font-family:'Fira Code',monospace; font-size:10px; color:#9CA3AF; margin-top:3px; }

    /* ── Gold bar ── */
    .accent-bar { height:3px; background:linear-gradient(90deg,#B3945B 0%,#9C814F 55%,#010528 100%); }

    /* ── Account strip ── */
    .acct-strip { background:#F8FAFC; border-bottom:1px solid #E2E8F0; padding:14px 40px; display:flex; justify-content:space-between; align-items:center; }
    .acct-blocks { display:flex; gap:44px; }
    .acct-block .lbl { font-family:'Fira Code',monospace; font-size:9px; color:#6B7280; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:3px; }
    .acct-block .val { font-size:13px; font-weight:600; color:#0F172A; }
    .acct-block .sub { font-family:'Fira Code',monospace; font-size:10px; color:#9CA3AF; margin-top:1px; }
    .period-badge { background:#010528; border-radius:6px; padding:8px 16px; text-align:center; }
    .period-badge .pb-lbl { font-family:'Fira Code',monospace; font-size:9px; color:#9CA3AF; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:2px; }
    .period-badge .pb-val { font-family:'Lora',serif; font-size:15px; font-weight:700; color:#B3945B; }

    /* ── User info card ── */
    .user-card { margin:24px 40px 0; border:1px solid #E2E8F0; border-radius:10px; overflow:hidden; }
    .user-card-header { background:#010528; padding:12px 20px; }
    .user-card-header span { font-family:'Fira Code',monospace; font-size:9px; color:#9CA3AF; text-transform:uppercase; letter-spacing:2px; }
    .user-card-body { display:flex; gap:0; }
    .user-field { flex:1; padding:14px 20px; border-right:1px solid #E2E8F0; }
    .user-field:last-child { border-right:none; }
    .user-field .uf-lbl { font-family:'Fira Code',monospace; font-size:9px; color:#6B7280; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:5px; }
    .user-field .uf-val { font-size:14px; font-weight:600; color:#0F172A; }
    .user-field .uf-sub { font-family:'Fira Code',monospace; font-size:10px; color:#9CA3AF; margin-top:2px; }

    /* ── Body ── */
    .body { padding:26px 40px; }

    /* ── Section header ── */
    .sec-hdr { display:flex; align-items:center; gap:10px; margin-bottom:10px; margin-top:22px; }
    .sec-hdr:first-child { margin-top:0; }
    .sec-num { width:20px; height:20px; border-radius:4px; background:#010528; color:#B3945B; font-family:'Fira Code',monospace; font-size:10px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .sec-title { font-family:'Fira Code',monospace; font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:2px; color:#374151; }
    .sec-line { flex:1; height:1px; background:#E2E8F0; }

    /* ── Summary figures ── */
    .fig-row { display:flex; border:1px solid #E2E8F0; border-radius:8px; overflow:hidden; margin-bottom:20px; }
    .fig-cell { flex:1; padding:14px 16px; border-right:1px solid #E2E8F0; }
    .fig-cell:last-child { border-right:none; }
    .fc-lbl { font-family:'Fira Code',monospace; font-size:9px; color:#6B7280; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:5px; }
    .fc-val { font-family:'Lora',serif; font-size:19px; font-weight:700; line-height:1; color:#0F172A; }
    .fc-sub { font-family:'Fira Code',monospace; font-size:9px; color:#9CA3AF; margin-top:4px; }
    .fig-income .fc-val  { color:#004B8E; }
    .fig-surplus .fc-val { color:${surplusColor}; }

    /* ── Progress ── */
    .prog-row { display:flex; align-items:center; gap:12px; margin-bottom:20px; padding:10px 14px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; }
    .prog-lbl   { font-family:'Fira Code',monospace; font-size:9px; text-transform:uppercase; letter-spacing:1.5px; color:#6B7280; width:110px; flex-shrink:0; }
    .prog-track { flex:1; height:8px; background:#E2E8F0; border-radius:99px; overflow:hidden; }
    .prog-fill  { height:100%; border-radius:99px; background:${surplusColor}; width:${spentPct}%; }
    .prog-pct   { font-family:'Fira Code',monospace; font-size:11px; font-weight:600; color:${surplusColor}; width:48px; text-align:right; flex-shrink:0; }

    /* ── Tables ── */
    table { width:100%; border-collapse:collapse; font-size:12px; margin-bottom:20px; }
    thead tr { background:#010528; }
    thead th { font-family:'Fira Code',monospace; font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:1.2px; color:#9CA3AF; padding:9px 11px; text-align:left; white-space:nowrap; }
    thead th.right  { text-align:right; }
    thead th.center { text-align:center; }
    tbody td { padding:9px 11px; color:#1E293B; border-bottom:1px solid #F1F5F9; vertical-align:middle; }
    tbody tr.even td { background:#F8FAFC; }
    tfoot td { padding:9px 11px; font-weight:700; font-family:'Fira Code',monospace; border-top:2px solid #010528; background:#F8FAFC; color:#010528; }
    tfoot td.right  { text-align:right; }
    tfoot td.center { text-align:center; }

    /* ── Declaration ── */
    .decl { background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:13px 16px; }
    .decl p { font-size:11px; color:#6B7280; line-height:1.7; font-family:'Fira Code',monospace; }

    /* ── Footer ── */
    .doc-footer { border-top:1px solid #E2E8F0; padding:14px 40px; display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; margin-top: auto; }
    .footer-brand { font-family:'Lora',serif; font-size:12px; font-weight:700; color:#010528; }
    .footer-brand span { color:#B3945B; }
    .footer-note  { font-family:'Fira Code',monospace; font-size:9px; color:#9CA3AF; text-align:center; line-height:1.6; }
    .footer-page  { font-family:'Fira Code',monospace; font-size:9px; color:#9CA3AF; }

    /* ── Watermark ── */
    .wm { background:#010A3D; padding:5px 40px; display:flex; justify-content:space-between; }
    .wm span { font-family:'Fira Code',monospace; font-size:9px; color:#1E3A6E; letter-spacing:1px; }

    /* ── Page 2 header ── */
    .p2-header { background:#010528; padding:16px 40px; display:flex; justify-content:space-between; align-items:center; }
    .p2-title { font-family:'Lora',serif; font-size:16px; font-weight:700; color:#B3945B; }
    .p2-meta  { font-family:'Fira Code',monospace; font-size:10px; color:#9CA3AF; text-align:right; }
  </style>
</head>
<body>

  <!-- ═══════════════════════════════════════════════════════════ PAGE 1 ══ -->

  ${headerHTML}

  <!-- User Details Card -->
  <div class="user-card">
    <div class="user-card-header"><span>Account Details</span></div>
    <div class="user-card-body">
      <div class="user-field">
        <div class="uf-lbl">Account Holder</div>
        <div class="uf-val">${userName}</div>
        ${userEmail ? `<div class="uf-sub">${userEmail}</div>` : ""}
      </div>
      <div class="user-field">
        <div class="uf-lbl">Statement Period</div>
        <div class="uf-val">${data.month}</div>
        <div class="uf-sub">${data.month_range}</div>
      </div>
      <div class="user-field">
        <div class="uf-lbl">Generated On</div>
        <div class="uf-val">${generatedOn}</div>
        <div class="uf-sub">${generatedTime} IST</div>
      </div>
      <div class="user-field">
        <div class="uf-lbl">Statement ID</div>
        <div class="uf-val" style="font-family:'Fira Code',monospace;font-size:12px">${statementId}</div>
        <div class="uf-sub">Auto-generated</div>
      </div>
    </div>
  </div>

  <!-- BODY: Summary -->
  <div class="body">

    <!-- § 1 Financial Summary -->
    <div class="sec-hdr">
      <div class="sec-num">1</div>
      <div class="sec-title">Financial Summary</div>
      <div class="sec-line"></div>
    </div>
    <div class="fig-row">
      <div class="fig-cell fig-income">
        <div class="fc-lbl">Total Income</div>
        <div class="fc-val">₹${data.totalIncome > 0 ? data.totalIncome.toLocaleString("en-IN") : "—"}</div>
        <div class="fc-sub">credited this month</div>
      </div>
      <div class="fig-cell">
        <div class="fc-lbl">Total Expenses</div>
        <div class="fc-val">₹${data.grandTotal.toLocaleString("en-IN")}</div>
        <div class="fc-sub">${Object.values(data.categoryTotals).filter((v) => v > 0).length} categories</div>
      </div>
      <div class="fig-cell fig-surplus">
        <div class="fc-lbl">${isOverBudget ? "Deficit" : "Surplus"}</div>
        <div class="fc-val">${isOverBudget ? "−" : "+"}₹${Math.abs(surplus).toLocaleString("en-IN")}</div>
        <div class="fc-sub">${data.totalIncome > 0 ? Math.abs((surplus / data.totalIncome) * 100).toFixed(1) + "% of income" : "no income set"}</div>
      </div>
      <div class="fig-cell">
        <div class="fc-lbl">Utilization</div>
        <div class="fc-val" style="font-family:'Fira Code',monospace;font-size:19px;color:${surplusColor}">
          ${data.totalIncome > 0 ? spentPct + "%" : "—"}
        </div>
        <div class="fc-sub">${isOverBudget ? "over budget" : "budget used"}</div>
      </div>
    </div>
    ${
      data.totalIncome > 0
        ? `
    <div class="prog-row">
      <div class="prog-lbl">Spending Progress</div>
      <div class="prog-track"><div class="prog-fill"></div></div>
      <div class="prog-pct">${spentPct}%</div>
    </div>`
        : ""
    }

    <!-- § 2 Budget Allocation -->
    <div class="sec-hdr">
      <div class="sec-num">2</div>
      <div class="sec-title">Budget Allocation — 50 / 30 / 20 Rule</div>
      <div class="sec-line"></div>
    </div>
    <table>
      <thead><tr>
        <th>Bucket</th>
        <th class="center">Ideal %</th>
        <th class="right">Amount (₹)</th>
        <th class="center">% of Income</th>
        <th class="center">% of Spend</th>
        <th class="center">Variance</th>
      </tr></thead>
      <tbody>${bucketRowsHTML}</tbody>
      <tfoot><tr>
        <td>Total</td>
        <td class="center">100%</td>
        <td class="right">₹${data.grandTotal.toLocaleString("en-IN")}</td>
        <td></td>
        <td class="center">100%</td>
        <td></td>
      </tr></tfoot>
    </table>

    <!-- § 3 Declaration -->
    <div class="sec-hdr">
      <div class="sec-num">3</div>
      <div class="sec-title">Declaration</div>
      <div class="sec-line"></div>
    </div>
    <div class="decl">
      <p>This statement is auto-generated by KaalByte Finance and is for personal reference only.
      All figures are based on entries recorded by the account holder.
      This document does not constitute an official financial statement.
      Statement ID: <strong style="color:#0F172A">${statementId}</strong></p>
    </div>

  </div>

  <!-- Page 1 Footer -->
  ${buildFooterHTML("Page 1 of 2")}

  <!-- ═══════════════════════════════════════════════════════════ PAGE 2 ══ -->
  <div class="page-break"></div>

  <!-- Page 2 Header -->
  <div class="p2-header">
    <div>
      <div class="p2-title">KaalByte Finance</div>
      <div style="font-family:'Fira Code',monospace;font-size:9px;color:#6B7280;letter-spacing:2px;text-transform:uppercase;margin-top:2px">Expense Detail — ${data.month}</div>
    </div>
    <div class="p2-meta">
      <div>${userName}${userEmail ? ` · ${userEmail}` : ""}</div>
      <div>${data.month_range} · ${statementId}</div>
    </div>
  </div>
  <div class="accent-bar"></div>

  <!-- Expense Table -->
  <div class="body">
    <div class="sec-hdr">
      <div class="sec-num">4</div>
      <div class="sec-title">Category-wise Expense Breakdown</div>
      <div class="sec-line"></div>
    </div>
    <table>
      <thead><tr>
        <th class="center">#</th>
        <th class="center">Date</th>
        <th>Category</th>
        <th>Description</th>
        <th class="center">Bucket</th>
        <th class="right">Amount (₹)</th>
        <th class="center">% of Spend</th>
      </tr></thead>
      <tbody>
        ${expenseRows || `<tr><td colspan="7" style="text-align:center;color:#6B7280;padding:22px">No expenses recorded for this month</td></tr>`}
      </tbody>
      <tfoot><tr>
        <td></td>
        <td></td>
        <td>Grand Total</td>
        <td></td>
        <td></td>
        <td class="right">₹${data.grandTotal.toLocaleString("en-IN")}</td>
        <td class="center">100%</td>
      </tr></tfoot>
    </table>
  </div>

  <!-- Page 2 Footer -->
  ${buildFooterHTML("Page 2 of 2")}

</body>
</html>`;
}
