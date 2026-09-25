/**
 * NHẬN LEAD TỪ LANDING PAGE ARCADIA → GHI VÀO GOOGLE SHEET
 *
 * Cách dùng (chi tiết trong README.md):
 * 1. Mở Google Sheet → Tiện ích mở rộng (Extensions) → Apps Script
 * 2. Xóa code mẫu, dán toàn bộ file này vào, bấm Lưu
 * 3. Triển khai (Deploy) → Tùy chọn triển khai mới → Loại: Ứng dụng web (Web app)
 *    - Thực thi với tư cách: Tôi (Me)
 *    - Người có quyền truy cập: Bất kỳ ai (Anyone)
 * 4. Copy link Web app, dán vào CONFIG.SHEET_URL trong js/main.js
 */

const SHEET_NAME = "Leads";

// (Không bắt buộc) Nhận email báo khi có lead mới – điền email vào, để "" nếu không cần
const NOTIFY_EMAIL = "";

const HEADERS = [
  "Thời gian", "Họ và tên", "Số điện thoại", "Email", "Sản phẩm quan tâm",
  "Trang", "utm_source", "utm_medium", "utm_campaign", "utm_content",
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const p = (e && e.parameter) || {};
    const sheet = getSheet_();

    // Thêm dấu ' trước số điện thoại để Google Sheet không làm mất số 0 đầu
    const row = [
      new Date(),
      p.name || "",
      p.phone ? "'" + p.phone : "",
      p.email || "",
      p.product || "",
      p.page || "",
      p.utm_source || "",
      p.utm_medium || "",
      p.utm_campaign || "",
      p.utm_content || "",
    ];
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "[Arcadia] Lead mới: " + (p.name || "") + " - " + (p.phone || ""),
        "Họ tên: " + p.name + "\nSĐT: " + p.phone + "\nEmail: " + p.email +
          "\nQuan tâm: " + p.product + "\nNguồn: " + (p.utm_source || "trực tiếp") +
          " / " + (p.utm_campaign || "")
      );
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#283e80").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}
