# Landing page Arcadia at Lavila

Landing page một trang (HTML/CSS/JS thuần). Bố cục và nội dung dựng theo arcadia.com.vn.

## Cấu trúc thư mục

```
arcadia-landing/
├── index.html              ← nội dung trang
├── css/style.css           ← giao diện (màu, font, bố cục)
├── js/main.js              ← tương tác + CẤU HÌNH hotline / Google Sheet
├── google-apps-script.gs   ← code dán vào Google Sheet để nhận lead
└── assets/                 ← logo, icon, ảnh (đã nén)
```

## Các section (theo thứ tự)

1. Hero: ảnh lớn đầu trang, tên dự án, logo chủ đầu tư, giải thưởng
2. Lavila Township: khu đô thị 60 ha và các chỉ số
3. Tổng quan dự án: thông tin chung, số liệu có hiệu ứng số chạy
4. Chuẩn sống 6A+: accordion (bấm từng mục để mở, ảnh bên phải đổi theo)
5. Vị trí & kết nối: tab 5/15/30/40 phút, bản đồ bấm để phóng to
6. Thư viện ảnh: slider 21 ảnh, tự chạy, vuốt được trên điện thoại
7. Tiện ích: tab theo tầng (1, 3, 4, 5, 21) kèm danh sách tiện ích
8. Mặt bằng căn hộ: tab 1PN / 2PN Harmonie / 2PN Libre / 2PN Góc / 3PN
9. Trích dẫn, chủ đầu tư (PierreVal và Kiến Á), đối tác
10. Form đăng ký tư vấn: gửi về Google Sheet
11. Footer, nút gọi và Zalo nổi, thanh "Gọi ngay / Nhận bảng giá" trên mobile

## 1. Cấu hình (bắt buộc trước khi chạy quảng cáo)

Mở `js/main.js` và sửa khối `CONFIG` ở đầu file:

| Mục | Ý nghĩa |
|---|---|
| `HOTLINE` | Số hiện trên nút gọi, footer, thanh mobile |
| `ZALO` | Số Zalo cho nút chat |
| `EMAIL` | Email liên hệ, để `""` thì ẩn |
| `AGENCY_NAME` | Tên đơn vị phân phối, hiện ở cuối footer |
| `SHEET_URL` | Link Web app của Google Apps Script (xem bước 2) |

Trong `index.html`, thay `https://ten-mien-cua-ban.com` (thẻ `og:url` và `og:image`) bằng tên miền thật. Nếu không thay, ảnh thumbnail sẽ không hiện khi share link lên Facebook hoặc Zalo.

## 2. Nối form với Google Sheet

1. Tạo một Google Sheet mới, ví dụ đặt tên "Lead Arcadia".
2. Vào menu **Tiện ích mở rộng → Apps Script**.
3. Xóa code mẫu, dán toàn bộ nội dung file `google-apps-script.gs`, rồi bấm Lưu.
4. Bấm **Triển khai (Deploy) → Tùy chọn triển khai mới**:
   - Loại: **Ứng dụng web**
   - Thực thi với tư cách: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**
5. Google sẽ hỏi cấp quyền. Chọn tài khoản của bạn → Nâng cao → Đi tới (không an toàn) → Cho phép. Đây là script do chính bạn tạo nên cấp quyền là an toàn.
6. Copy **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`), dán vào `SHEET_URL`.
7. Gửi thử form một lần. Sheet sẽ tự tạo tab "Leads" với dòng tiêu đề.

Muốn nhận email mỗi khi có lead: điền email vào `NOTIFY_EMAIL` trong Apps Script, rồi **Deploy lại** (Quản lý triển khai → Chỉnh sửa → Phiên bản mới).

Form tự lưu kèm các tham số **UTM** của link quảng cáo, ví dụ `?utm_source=facebook&utm_campaign=arcadia-t10`. Nhờ vậy bạn biết lead đến từ chiến dịch nào.

## 3. Xem thử trên máy

Mở file `index.html` bằng Chrome là xem được. Riêng form chỉ gửi được khi trang chạy trên web thật, hoặc trên server local như extension "Live Server" của VS Code.

## 4. Đưa lên web

- **WordPress stareal.com.vn**: dùng template Elementor Canvas (trang trắng), rồi upload ảnh và dán code. Có sẵn skill "đăng landing page lên WordPress" để làm tự động.
- **Hosting riêng hoặc Netlify / Vercel**: upload nguyên thư mục `arcadia-landing`.

## Lưu ý

- Ảnh, logo và nội dung là tài sản của chủ đầu tư (liên doanh PierreVal và Kiến Á). Chỉ dùng khi bạn có quyền phân phối hoặc được chủ đầu tư cho phép.
- Font dùng Google Fonts miễn phí thay cho font trả phí của trang gốc: **Cormorant Garamond** (tiêu đề) và **Be Vietnam Pro** (nội dung).
