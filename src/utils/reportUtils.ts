/**
 * reportUtils.ts
 * Premium Excel report generator using ExcelJS.
 * Data is formatted as a proper Excel Table (filter dropdowns on every column).
 * Branded header block, status colour-coding, ₹ currency formatting, frozen panes.
 */
import ExcelJS from "exceljs";
import type {
  StudentResponse,
  Profile,
  FeeAccountResponse,
  FeeDueResponse,
  PaymentResponse,
  FeePlanResponse,
} from "@/apis/api-client";

// ─── Brand Colours ────────────────────────────────────────────────────────────
const BRAND = {
  darkGreen: "1D4E1A",
  midGreen: "2E7D32",
  lightGreen: "E8F5E9",
  white: "FFFFFF",
  nearWhite: "F9FBF9",
  borderGray: "D0D7CE",
  textDark: "1A2F18",
  textMid: "4A5E48",
  textLight: "7A8F78",
  statusPaid: { bg: "E8F5E9", font: "1B5E20" },
  statusPending: { bg: "FFF8E1", font: "E65100" },
  statusPartial: { bg: "E3F2FD", font: "0D47A1" },
  statusOverdue: { bg: "FFEBEE", font: "B71C1C" },
  statusFailed: { bg: "FFEBEE", font: "B71C1C" },
  statusActive: { bg: "E8F5E9", font: "1B5E20" },
  statusInactive: { bg: "FAFAFA", font: "757575" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(raw: string | null | undefined): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function fmtAmt(raw: string | null | undefined): number {
  const n = parseFloat(raw ?? "0");
  return isNaN(n) ? 0 : Math.round(n * 100) / 100;
}

function todayStr(): string {
  return fmtDate(new Date().toISOString());
}

async function triggerDownload(wb: ExcelJS.Workbook, filename: string) {
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─── Column definition ────────────────────────────────────────────────────────

interface ColDef {
  header: string;
  key: string;
  width: number;
  type?: "text" | "number" | "date" | "status" | "currency" | "badge";
  align?: "left" | "center" | "right";
}

// ─── Shared sheet helpers ─────────────────────────────────────────────────────

/** Rows 1-4: branded school header block */
function addBrandHeader(ws: ExcelJS.Worksheet, reportTitle: string, totalCols: number) {
  // Row 1 — school banner
  ws.addRow(["ASPEN MONTESSORI HOUSE"]);
  const r1 = ws.lastRow!;
  ws.mergeCells(r1.number, 1, r1.number, totalCols);
  const c1 = r1.getCell(1);
  c1.font = { name: "Calibri", bold: true, size: 18, color: { argb: "FF" + BRAND.darkGreen } };
  c1.alignment = { horizontal: "center", vertical: "middle" };
  c1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + BRAND.lightGreen } };
  r1.height = 38;

  // Row 2 — report title
  ws.addRow([reportTitle]);
  const r2 = ws.lastRow!;
  ws.mergeCells(r2.number, 1, r2.number, totalCols);
  const c2 = r2.getCell(1);
  c2.font = { name: "Calibri", size: 12, color: { argb: "FF" + BRAND.textMid } };
  c2.alignment = { horizontal: "center", vertical: "middle" };
  c2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5FAF5" } };
  r2.height = 22;

  // Row 3 — generated date
  ws.addRow([`Generated on: ${todayStr()}   |   Aspen Montessori House — Confidential`]);
  const r3 = ws.lastRow!;
  ws.mergeCells(r3.number, 1, r3.number, totalCols);
  const c3 = r3.getCell(1);
  c3.font = { name: "Calibri", size: 9, italic: true, color: { argb: "FF" + BRAND.textLight } };
  c3.alignment = { horizontal: "center" };
  c3.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5FAF5" } };
  r3.height = 16;

  // Row 4 — blank separator
  ws.addRow([]);
  ws.lastRow!.height = 8;
}

/**
 * Adds data as a proper Excel Table (filter dropdowns on every column header),
 * then applies brand styling on the header row and type-aware formatting on
 * data rows (status badges, currency, etc.).
 *
 * Returns the row number of the table header for use with ws.views freeze.
 */
function buildTable(
  ws: ExcelJS.Worksheet,
  cols: ColDef[],
  dataRows: (string | number | null)[][],
  tableName: string
): number {
  const startRow = ws.rowCount + 1; // right after brand header block
  const endCol = String.fromCharCode(64 + cols.length); // e.g. 'J' for 10 cols
  const ref = `A${startRow}`;

  ws.addTable({
    name: tableName,
    ref,
    headerRow: true,
    totalsRow: false,
    style: {
      theme: "TableStyleMedium21", // closest built-in green
      showRowStripes: true,
      showFirstColumn: false,
      showLastColumn: false,
    },
    columns: cols.map((c) => ({ name: c.header, filterButton: true })),
    rows: dataRows,
  });

  // ── Override header row with brand dark green ──────────────────────────────
  const headerRow = ws.getRow(startRow);
  headerRow.height = 28;
  headerRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.font = { name: "Calibri", bold: true, size: 10, color: { argb: "FF" + BRAND.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + BRAND.darkGreen } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      bottom: { style: "medium", color: { argb: "FF" + BRAND.midGreen } },
    };
  });

  // ── Style data rows ────────────────────────────────────────────────────────
  dataRows.forEach((_, rowIdx) => {
    const rowNum = startRow + 1 + rowIdx;
    const row = ws.getRow(rowNum);
    row.height = 20;

    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      const col = cols[colNum - 1];
      if (!col) return;

      cell.font = { name: "Calibri", size: 10, color: { argb: "FF" + BRAND.textDark } };

      switch (col.type) {
        case "currency":
          cell.numFmt = '₹#,##0.00';
          cell.alignment = { horizontal: "right", vertical: "middle" };
          break;
        case "number":
          cell.numFmt = '#,##0';
          cell.alignment = { horizontal: "right", vertical: "middle" };
          break;
        case "date":
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.font = { ...cell.font, color: { argb: "FF" + BRAND.textMid } };
          break;
        case "badge":
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.font = { ...cell.font, bold: true, color: { argb: "FF" + BRAND.midGreen } };
          break;
        case "status": {
          const val = String(cell.value ?? "").toLowerCase();
          const p =
            val === "active" || val === "paid" ? BRAND.statusPaid :
              val === "pending" ? BRAND.statusPending :
                val === "partial" ? BRAND.statusPartial :
                  val === "overdue" ? BRAND.statusOverdue :
                    val === "failed" ? BRAND.statusFailed :
                      val === "inactive" ? BRAND.statusInactive :
                        null;
          if (p) {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + p.bg } };
            cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF" + p.font } };
          }
          cell.alignment = { horizontal: "center", vertical: "middle" };
          break;
        }
        default:
          cell.alignment = { horizontal: col.align ?? "left", vertical: "middle" };
      }
    });
  });

  // ── Auto column widths ────────────────────────────────────────────────────
  // Measure max content length per column across header + all data rows
  const colWidths = cols.map((c, colIdx) => {
    const headerLen = c.header.length;
    const maxDataLen = dataRows.reduce((max, row) => {
      const val = row[colIdx];
      const len = val == null ? 0 : String(val).length;
      return Math.max(max, len);
    }, 0);
    const raw = Math.max(headerLen, maxDataLen) + 2; // +2 char breathing room
    return Math.min(Math.max(raw, 8), 60);            // clamp 8–60
  });
  colWidths.forEach((w, i) => {
    ws.getColumn(i + 1).width = w;
  });

  // ── Freeze pane below header row ───────────────────────────────────────────
  ws.views = [{ state: "frozen", xSplit: 0, ySplit: startRow }];

  // suppress the unused endCol var warning
  void endCol;

  return startRow;
}

/** Appends a totals summary row below the table */
function addTotalsRow(
  ws: ExcelJS.Worksheet,
  cols: ColDef[],
  values: (string | number)[],
) {
  ws.addRow([]);
  ws.addRow(values);
  const row = ws.lastRow!;
  row.height = 22;
  row.eachCell({ includeEmpty: true }, (cell, colNum) => {
    const col = cols[colNum - 1];
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + BRAND.darkGreen } };
    cell.font = { name: "Calibri", bold: true, size: 10, color: { argb: "FFFFFFFF" } };
    if (col?.type === "currency") {
      cell.numFmt = '₹#,##0.00';
      cell.alignment = { horizontal: "right", vertical: "middle" };
    }
    if (colNum === 2) {
      cell.alignment = { horizontal: "left", vertical: "middle" };
    }
  });
}

function newWorkbook(): ExcelJS.Workbook {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Aspen Montessori House";
  wb.created = new Date();
  wb.modified = new Date();
  return wb;
}

// ─── 1. Students Report ───────────────────────────────────────────────────────

export interface StudentsReportFilters {
  status: "all" | "active" | "inactive";
  className: string;
  academicYear: string;
  joiningFrom: string;
  joiningTo: string;
}

export async function downloadStudentsReport(
  students: StudentResponse[],
  filters: StudentsReportFilters
) {
  let data = [...students];
  if (filters.status === "active") data = data.filter((s) => s.is_active);
  if (filters.status === "inactive") data = data.filter((s) => !s.is_active);
  if (filters.className) data = data.filter((s) => s.class_name === filters.className);
  if (filters.academicYear) data = data.filter((s) => s.academic_year === filters.academicYear);
  if (filters.joiningFrom) data = data.filter((s) => s.joining_date >= filters.joiningFrom);
  if (filters.joiningTo) data = data.filter((s) => s.joining_date <= filters.joiningTo);

  const cols: ColDef[] = [
    { key: "sno", header: "S.No.", width: 7, type: "number", align: "center" },
    { key: "admno", header: "Admission No.", width: 18, type: "badge", align: "center" },
    { key: "name", header: "Student Name", width: 28 },
    { key: "dob", header: "Date of Birth", width: 14, type: "date" },
    { key: "class", header: "Class", width: 14, align: "center" },
    { key: "year", header: "Academic Year", width: 15, align: "center" },
    { key: "joining", header: "Joining Date", width: 14, type: "date" },
    { key: "status", header: "Status", width: 12, type: "status" },
    { key: "remarks", header: "Remarks", width: 30 },
    { key: "createdAt", header: "Enrolled On", width: 14, type: "date" },
  ];

  const rows = data.map((s, i) => [
    i + 1, s.admission_number, s.student_name,
    fmtDate(s.date_of_birth), s.class_name, s.academic_year,
    fmtDate(s.joining_date), s.is_active ? "Active" : "Inactive",
    s.remarks ?? "", fmtDate(s.created_at),
  ]);

  const wb = newWorkbook();
  const ws = wb.addWorksheet("Students", {
    pageSetup: { fitToPage: true, fitToWidth: 1, orientation: "landscape" },
  });

  addBrandHeader(ws, "Student Directory Report", cols.length);
  buildTable(ws, cols, rows, "StudentsTable");

  // record count footer
  ws.addRow([]);
  ws.addRow([`Total Records: ${data.length}`]);
  const fr = ws.lastRow!;
  fr.getCell(1).font = { name: "Calibri", bold: true, size: 10, color: { argb: "FF" + BRAND.darkGreen } };
  fr.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + BRAND.lightGreen } };

  await triggerDownload(wb, "students_report.xlsx");
}

// ─── 2. Parents Report ────────────────────────────────────────────────────────

export interface ParentsReportFilters {
  status: "all" | "active" | "inactive";
}

export async function downloadParentsReport(
  parents: Profile[],
  filters: ParentsReportFilters
) {
  let data = [...parents];
  if (filters.status === "active") data = data.filter((p) => p.is_active);
  if (filters.status === "inactive") data = data.filter((p) => !p.is_active);

  const cols: ColDef[] = [
    { key: "sno", header: "S.No.", width: 7, type: "number", align: "center" },
    { key: "name", header: "Full Name", width: 28 },
    { key: "email", header: "Email", width: 34 },
    { key: "status", header: "Status", width: 12, type: "status" },
    { key: "roles", header: "Roles", width: 20, align: "center" },
    { key: "createdAt", header: "Joined On", width: 14, type: "date" },
  ];

  const rows = data.map((p, i) => [
    i + 1, p.full_name, p.email,
    p.is_active ? "Active" : "Inactive",
    ((p as any).roles ?? []).join(", "),
    fmtDate(p.created_at),
  ]);

  const wb = newWorkbook();
  const ws = wb.addWorksheet("Parents", {
    pageSetup: { fitToPage: true, fitToWidth: 1, orientation: "landscape" },
  });

  addBrandHeader(ws, "Parent Directory Report", cols.length);
  buildTable(ws, cols, rows, "ParentsTable");

  ws.addRow([]);
  ws.addRow([`Total Records: ${data.length}`]);
  const fr = ws.lastRow!;
  fr.getCell(1).font = { name: "Calibri", bold: true, size: 10, color: { argb: "FF" + BRAND.darkGreen } };
  fr.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + BRAND.lightGreen } };

  await triggerDownload(wb, "parents_report.xlsx");
}

// ─── 3. Fee Report — 2 sheets ─────────────────────────────────────────────────

export interface FeeReportFilters {
  studentId: string;
  className: string;
  academicYear: string;
  paymentCycle: string;
  subscriptionStatus: "all" | "active" | "inactive";
  dueStatuses: Array<"pending" | "partial" | "paid" | "overdue">;
  dueDateFrom: string;
  dueDateTo: string;
}

export async function downloadFeeReport(
  accounts: FeeAccountResponse[],
  dues: FeeDueResponse[],
  students: StudentResponse[],
  plans: FeePlanResponse[],
  filters: FeeReportFilters
) {
  const studentById = Object.fromEntries(students.map((s) => [String(s.id), s]));
  const planById = Object.fromEntries(plans.map((p) => [String(p.id), p]));

  const wb = newWorkbook();

  // ── Sheet 1: Fee Subscriptions ─────────────────────────────────────────────
  let accs = [...accounts];
  if (filters.studentId) accs = accs.filter((a) => String(a.student_id) === filters.studentId);
  if (filters.className) accs = accs.filter((a) => studentById[String(a.student_id)]?.class_name === filters.className);
  if (filters.academicYear) accs = accs.filter((a) => studentById[String(a.student_id)]?.academic_year === filters.academicYear);
  if (filters.paymentCycle) accs = accs.filter((a) => a.payment_cycle === filters.paymentCycle);
  if (filters.subscriptionStatus === "active") accs = accs.filter((a) => a.is_active);
  if (filters.subscriptionStatus === "inactive") accs = accs.filter((a) => !a.is_active);

  const subCols: ColDef[] = [
    { key: "sno", header: "S.No.", width: 7, type: "number", align: "center" },
    { key: "subId", header: "Sub. ID", width: 9, type: "badge", align: "center" },
    { key: "student", header: "Student Name", width: 26 },
    { key: "admno", header: "Admission No.", width: 16, type: "badge", align: "center" },
    { key: "class", header: "Class", width: 14, align: "center" },
    { key: "year", header: "Academic Year", width: 15, align: "center" },
    { key: "plan", header: "Fee Plan", width: 24 },
    { key: "cycle", header: "Payment Cycle", width: 15, align: "center" },
    { key: "installs", header: "Installments", width: 13, type: "number", align: "center" },
    { key: "discType", header: "Discount Type", width: 14, align: "center" },
    { key: "discVal", header: "Discount (₹/%)", width: 14, type: "number", align: "right" },
    { key: "effective", header: "Effective From", width: 14, type: "date" },
    { key: "status", header: "Status", width: 12, type: "status" },
    { key: "notes", header: "Notes", width: 28 },
  ];

  const subRows = accs.map((a, i) => {
    const s = studentById[String(a.student_id)];
    const p = planById[String(a.fee_plan_id)];
    return [
      i + 1, a.id,
      s?.student_name ?? "—", s?.admission_number ?? "—",
      s?.class_name ?? "—", s?.academic_year ?? "—",
      p ? `${p.class_name} — ${p.program_type}` : `Plan #${a.fee_plan_id}`,
      a.payment_cycle.charAt(0).toUpperCase() + a.payment_cycle.slice(1),
      a.installments, a.discount_type ?? "None",
      a.discount_value ? fmtAmt(a.discount_value) : 0,
      fmtDate(a.effective_from),
      a.is_active ? "Active" : "Inactive",
      a.notes ?? "",
    ];
  });

  const ws1 = wb.addWorksheet("Fee Subscriptions", {
    pageSetup: { fitToPage: true, fitToWidth: 1, orientation: "landscape" },
  });
  addBrandHeader(ws1, "Fee Subscriptions Report", subCols.length);
  buildTable(ws1, subCols, subRows, "FeeSubscriptionsTable");
  ws1.addRow([]);
  ws1.addRow([`Total Subscriptions: ${accs.length}`]);
  const s1fr = ws1.lastRow!;
  s1fr.getCell(1).font = { name: "Calibri", bold: true, size: 10, color: { argb: "FF" + BRAND.darkGreen } };
  s1fr.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + BRAND.lightGreen } };

  // ── Sheet 2: Installments ──────────────────────────────────────────────────
  let dueData = [...dues];
  if (filters.studentId) dueData = dueData.filter((d) => String(d.student_id) === filters.studentId);
  if (filters.className) dueData = dueData.filter((d) => studentById[String(d.student_id)]?.class_name === filters.className);
  if (filters.academicYear) dueData = dueData.filter((d) => studentById[String(d.student_id)]?.academic_year === filters.academicYear);
  if (filters.dueStatuses.length) dueData = dueData.filter((d) => filters.dueStatuses.includes(d.status));
  if (filters.dueDateFrom) dueData = dueData.filter((d) => d.due_date >= filters.dueDateFrom);
  if (filters.dueDateTo) dueData = dueData.filter((d) => d.due_date <= filters.dueDateTo);

  const dueCols: ColDef[] = [
    { key: "sno", header: "S.No.", width: 7, type: "number", align: "center" },
    { key: "dueId", header: "Due ID", width: 9, type: "badge", align: "center" },
    { key: "student", header: "Student Name", width: 26 },
    { key: "admno", header: "Admission No.", width: 16, type: "badge", align: "center" },
    { key: "title", header: "Due Title", width: 24 },
    { key: "tuition", header: "Tuition Fee (₹)", width: 16, type: "currency", align: "right" },
    { key: "resource", header: "Resource Fee (₹)", width: 16, type: "currency", align: "right" },
    { key: "admission", header: "Admission Fee (₹)", width: 16, type: "currency", align: "right" },
    { key: "discount", header: "Discount (₹)", width: 14, type: "currency", align: "right" },
    { key: "final", header: "Final Amount (₹)", width: 16, type: "currency", align: "right" },
    { key: "paid", header: "Paid (₹)", width: 14, type: "currency", align: "right" },
    { key: "balance", header: "Balance (₹)", width: 14, type: "currency", align: "right" },
    { key: "dueDate", header: "Due Date", width: 13, type: "date" },
    { key: "status", header: "Status", width: 12, type: "status" },
    { key: "remarks", header: "Remarks", width: 28 },
  ];

  let totalFinal = 0, totalPaid = 0, totalBalance = 0;
  const dueRows = dueData.map((d, i) => {
    const s = studentById[String(d.student_id)];
    const final = fmtAmt(d.final_amount);
    const paid = fmtAmt(d.paid_amount);
    const balance = fmtAmt(d.balance);
    totalFinal += final; totalPaid += paid; totalBalance += balance;
    return [
      i + 1, d.id,
      s?.student_name ?? "—", s?.admission_number ?? "—",
      d.due_title,
      fmtAmt(d.tuition_fee), fmtAmt(d.resource_fee), fmtAmt(d.admission_fee),
      fmtAmt(d.discount_applied), final, paid, balance,
      fmtDate(d.due_date),
      d.status.charAt(0).toUpperCase() + d.status.slice(1),
      d.remarks ?? "",
    ];
  });

  const ws2 = wb.addWorksheet("Installments", {
    pageSetup: { fitToPage: true, fitToWidth: 1, orientation: "landscape" },
  });
  addBrandHeader(ws2, "Installments / Dues Report", dueCols.length);
  buildTable(ws2, dueCols, dueRows, "InstallmentsTable");
  addTotalsRow(ws2, dueCols, [
    "", "TOTALS", "", "", "", "", "", "", "", totalFinal, totalPaid, totalBalance, "", "", "",
  ]);

  await triggerDownload(wb, "fee_report.xlsx");
}

// ─── 4. Payments Report ───────────────────────────────────────────────────────

export interface PaymentsReportFilters {
  studentId: string;
  paymentModes: Array<"cash" | "upi" | "online_gateway" | "bank_transfer">;
  statuses: Array<"success" | "failed" | "pending">;
  dateFrom: string;
  dateTo: string;
}

export async function downloadPaymentsReport(
  payments: PaymentResponse[],
  students: StudentResponse[],
  dues: FeeDueResponse[],
  filters: PaymentsReportFilters
) {
  const studentById = Object.fromEntries(students.map((s) => [String(s.id), s]));
  const dueById = Object.fromEntries(dues.map((d) => [String(d.id), d]));

  let data = [...payments];
  if (filters.studentId) data = data.filter((p) => String(p.student_id) === filters.studentId);
  if (filters.paymentModes.length) data = data.filter((p) => filters.paymentModes.includes(p.payment_mode));
  if (filters.statuses.length) data = data.filter((p) => filters.statuses.includes(p.status));
  if (filters.dateFrom) data = data.filter((p) => (p.paid_at ?? p.created_at) >= filters.dateFrom);
  if (filters.dateTo) data = data.filter((p) => (p.paid_at ?? p.created_at) <= filters.dateTo);

  const cols: ColDef[] = [
    { key: "sno", header: "S.No.", width: 7, type: "number", align: "center" },
    { key: "receipt", header: "Receipt ID", width: 16, type: "badge", align: "center" },
    { key: "student", header: "Student Name", width: 26 },
    { key: "admno", header: "Admission No.", width: 16, type: "badge", align: "center" },
    { key: "due", header: "Due Title", width: 24 },
    { key: "amount", header: "Amount Paid (₹)", width: 16, type: "currency", align: "right" },
    { key: "charges", header: "Gateway Charges (₹)", width: 18, type: "currency", align: "right" },
    { key: "total", header: "Total Paid (₹)", width: 15, type: "currency", align: "right" },
    { key: "mode", header: "Payment Mode", width: 16, align: "center" },
    { key: "status", header: "Status", width: 12, type: "status" },
    { key: "collector", header: "Collected By", width: 16, align: "center" },
    { key: "date", header: "Date", width: 14, type: "date" },
    { key: "remarks", header: "Remarks", width: 28 },
  ];

  let totalAmount = 0, totalCharges = 0, totalTotal = 0;
  const rows = data.map((p, i) => {
    const s = studentById[String(p.student_id)];
    const d = dueById[String(p.fee_due_id)];
    const amount = fmtAmt(p.amount_paid);
    const charges = fmtAmt(p.gateway_charges) + fmtAmt(p.gateway_charges_gst);
    const total = fmtAmt(p.total_amount_paid || p.amount_paid);
    totalAmount += amount; totalCharges += charges; totalTotal += total;
    return [
      i + 1,
      `AMH-REC-${p.id}`,
      s?.student_name ?? "—",
      s?.admission_number ?? "—",
      d?.due_title ?? "—",
      amount, charges, total,
      p.payment_mode.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      p.status.charAt(0).toUpperCase() + p.status.slice(1),
      p.collected_by ?? "Online",
      fmtDate(p.paid_at ?? p.created_at),
      p.remarks ?? "",
    ];
  });

  const wb = newWorkbook();
  const ws = wb.addWorksheet("Payments", {
    pageSetup: { fitToPage: true, fitToWidth: 1, orientation: "landscape" },
  });

  addBrandHeader(ws, "Payments & Transactions Report", cols.length);
  buildTable(ws, cols, rows, "PaymentsTable");
  addTotalsRow(ws, cols, [
    "", "TOTALS", "", "", "", totalAmount, totalCharges, totalTotal, "", "", "", "", "",
  ]);

  ws.addRow([]);
  ws.addRow([`Total Records: ${data.length}`]);
  const fr = ws.lastRow!;
  fr.getCell(1).font = { name: "Calibri", bold: true, size: 10, color: { argb: "FF" + BRAND.darkGreen } };
  fr.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + BRAND.lightGreen } };

  await triggerDownload(wb, "payments_report.xlsx");
}
