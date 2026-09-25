/* =========================================================
   ARCADIA AT LAVILA – LANDING PAGE SCRIPT
   ========================================================= */

/* ---------------------------------------------------------
   CẤU HÌNH – chỉ cần sửa ở đây
   --------------------------------------------------------- */
const CONFIG = {
  // Hotline hiển thị trên trang (nút gọi, footer, thanh dưới mobile)
  HOTLINE: "0900 000 000",

  // Số Zalo (thường trùng hotline)
  ZALO: "0900000000",

  // Email liên hệ (để trống "" nếu không muốn hiện)
  EMAIL: "",

  // Tên đơn vị phân phối/môi giới, hiện ở cuối footer (để trống "" nếu không cần)
  AGENCY_NAME: "",

  // Link Web App của Google Apps Script (xem hướng dẫn trong README.md)
  SHEET_URL: "",
};

/* Danh sách ảnh slider (ảnh + chú thích) */
const GALLERY = [
  ["01.jpg", "Đường đi bộ"],
  ["02.jpg", "Khán đài bên hồ"],
  ["03.jpg", "Sảnh đón biểu tượng"],
  ["04.jpg", "Trung tâm mua sắm"],
  ["05.jpg", "Trung tâm mua sắm"],
  ["06.jpg", "Tuyến phố thương mại Arcade"],
  ["07.jpg", "Tuyến phố thương mại Arcade"],
  ["08.jpg", "Hồ bơi biểu tượng"],
  ["09.jpg", "Sàn yoga trên cao"],
  ["10.jpg", "Không gian tập trên cao"],
  ["11.jpg", "Phòng khách cộng đồng"],
  ["12.jpg", "Không gian vui chơi trẻ em"],
  ["13.png", "Khu vui chơi trẻ em"],
  ["14.jpg", "Phòng giải trí đa phương tiện"],
  ["15.jpg", "Phòng khách – Căn hộ điển hình"],
  ["16.jpg", "Phòng ngủ chính – Căn hộ điển hình"],
  ["17.jpg", "Phòng ngủ chính – Căn hộ điển hình"],
  ["18.jpg", "Phòng bếp – Căn hộ điển hình"],
  ["19.jpg", "Phòng bếp – Căn hộ điển hình"],
  ["20.jpg", "Phòng ngủ trẻ em – Căn hộ điển hình"],
  ["21.jpg", "Ban công – Căn hộ điển hình"],
];

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initHeader();
  initMobileMenu();
  initReveal();
  initCounters();
  initValues();
  initTabs();
  initSlider();
  initLightbox();
  initForm();
  initToTop();
});

/* ---------- Điền hotline / zalo / email từ CONFIG ---------- */
function applyConfig() {
  const tel = "tel:" + CONFIG.HOTLINE.replace(/\s+/g, "");
  document.querySelectorAll(".js-hotline").forEach((el) => (el.textContent = CONFIG.HOTLINE));
  document.querySelectorAll(".js-hotline-link").forEach((el) => (el.href = tel));
  document.querySelectorAll(".js-zalo-link").forEach((el) => (el.href = "https://zalo.me/" + CONFIG.ZALO));

  document.querySelectorAll(".js-email").forEach((el) => {
    if (CONFIG.EMAIL) {
      el.textContent = CONFIG.EMAIL;
      el.href = "mailto:" + CONFIG.EMAIL;
    } else {
      el.remove();
    }
  });
  document.querySelectorAll(".js-agency").forEach((el) => {
    el.textContent = CONFIG.AGENCY_NAME ? " Trang thông tin do " + CONFIG.AGENCY_NAME + " thực hiện." : "";
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------- Header: đổi nền khi cuộn + tô sáng menu ---------- */
function initHeader() {
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 60);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const links = [...document.querySelectorAll(".nav a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
}

/* ---------- Menu mobile ---------- */
function initMobileMenu() {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  const header = document.getElementById("header");

  const toggle = (open) => {
    burger.classList.toggle("is-open", open);
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.classList.toggle("no-scroll", open);
    // Khi menu mở, header dùng màu trắng cho nổi trên nền navy
    if (open) header.classList.remove("is-scrolled");
    else header.classList.toggle("is-scrolled", window.scrollY > 60);
  };

  burger.addEventListener("click", () => toggle(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggle(false)));
}

/* ---------- Hiệu ứng hiện dần khi cuộn tới ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- Số chạy (counter) ở phần Tổng quan ---------- */
function initCounters() {
  const nums = document.querySelectorAll("[data-count]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.count;
        const pad = +(el.dataset.pad || 0);
        const start = performance.now();
        const duration = 1400;
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const val = Math.round(target * (1 - Math.pow(1 - p, 3)));
          el.textContent = String(val).padStart(pad, "0");
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  nums.forEach((n) => io.observe(n));
}

/* ---------- Chuẩn sống 6A+ (accordion + đổi ảnh) ---------- */
function initValues() {
  const items = document.querySelectorAll(".value-item");
  const imgs = document.querySelectorAll("#valuesMedia img");

  items.forEach((item) => {
    item.querySelector(".value-item__head").addEventListener("click", () => {
      items.forEach((i) => {
        const active = i === item;
        i.classList.toggle("is-active", active);
        i.querySelector(".value-item__head").setAttribute("aria-expanded", active);
      });
      imgs.forEach((img, idx) => img.classList.toggle("is-active", idx === +item.dataset.img));
    });
  });
}

/* ---------- Tabs dùng chung (Vị trí, Tiện ích, Mặt bằng) ---------- */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((tabBar) => {
    const group = tabBar.dataset.tabs;
    const buttons = tabBar.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(`[data-panel="${group}"]`);

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = +btn.dataset.target;
        buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
        panels.forEach((p, i) => p.classList.toggle("is-active", i === idx));
      });
    });
  });
}

/* ---------- Slider hình ảnh ---------- */
function initSlider() {
  const track = document.getElementById("sliderTrack");
  const thumbs = document.getElementById("sliderThumbs");
  const count = document.getElementById("slideCount");
  const slider = document.getElementById("slider");
  if (!track) return;

  GALLERY.forEach(([file, caption], i) => {
    const src = "assets/images/slideshow/" + file;
    track.insertAdjacentHTML(
      "beforeend",
      `<figure class="slide" style="margin:0"><img src="${src}" alt="${caption}" loading="${i === 0 ? "eager" : "lazy"}" draggable="false"><figcaption>${caption}</figcaption></figure>`
    );
    thumbs.insertAdjacentHTML(
      "beforeend",
      `<button aria-label="${caption}"><img src="${src}" alt="" loading="lazy"></button>`
    );
  });

  const thumbBtns = thumbs.querySelectorAll("button");
  let current = 0;
  let timer;

  const go = (i) => {
    current = (i + GALLERY.length) % GALLERY.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    count.textContent = `${String(current + 1).padStart(2, "0")} / ${GALLERY.length}`;
    thumbBtns.forEach((b, idx) => b.classList.toggle("is-active", idx === current));
    const t = thumbBtns[current];
    thumbs.scrollTo({ left: t.offsetLeft - thumbs.clientWidth / 2 + t.clientWidth / 2, behavior: "smooth" });
  };

  const autoplay = () => {
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), 5000);
  };

  document.getElementById("slidePrev").addEventListener("click", () => { go(current - 1); autoplay(); });
  document.getElementById("slideNext").addEventListener("click", () => { go(current + 1); autoplay(); });
  thumbBtns.forEach((b, i) => b.addEventListener("click", () => { go(i); autoplay(); }));

  // Vuốt trên điện thoại
  let startX = 0;
  let dx = 0;
  track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; dx = 0; }, { passive: true });
  track.addEventListener("touchmove", (e) => { dx = e.touches[0].clientX - startX; }, { passive: true });
  track.addEventListener("touchend", () => {
    if (Math.abs(dx) > 50) { go(dx < 0 ? current + 1 : current - 1); autoplay(); }
  });

  // Dừng tự chạy khi rê chuột vào
  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", autoplay);

  go(0);
  autoplay();
}

/* ---------- Lightbox: bấm ảnh để phóng to ---------- */
function initLightbox() {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const cap = document.getElementById("lightboxCaption");

  document.querySelectorAll("[data-lightbox]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target.closest("a")) return; // để link Google Map hoạt động bình thường
      img.src = el.dataset.lightbox;
      img.alt = el.dataset.caption || "";
      cap.textContent = el.dataset.caption || "";
      openLayer(box);
    });
  });

  document.querySelectorAll(".lightbox, .modal").forEach((layer) => {
    layer.addEventListener("click", (e) => {
      if (e.target === layer || e.target.closest("[data-close]")) closeLayer(layer);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") document.querySelectorAll(".lightbox.is-open, .modal.is-open").forEach(closeLayer);
  });
}

function openLayer(layer) {
  layer.classList.add("is-open");
  layer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}
function closeLayer(layer) {
  layer.classList.remove("is-open");
  layer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

/* ---------- Form đăng ký → Google Sheet ---------- */
function initForm() {
  const form = document.getElementById("leadForm");
  const btn = document.getElementById("submitBtn");
  const status = document.getElementById("formStatus");
  const consentWrap = document.getElementById("consentWrap");
  const productSelect = document.getElementById("f-product");

  // Nút "Nhận giá căn này" tự chọn sẵn loại sản phẩm trong form
  document.querySelectorAll("[data-product]").forEach((el) => {
    el.addEventListener("click", () => { productSelect.value = el.dataset.product; });
  });

  const phoneRe = /^(0|\+?84)(3|5|7|8|9)\d{8}$/; // số di động Việt Nam
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const setError = (input, hasError) => input.closest(".field").classList.toggle("has-error", hasError);

  const validate = () => {
    let ok = true;
    const name = form.name.value.trim();
    const phone = form.phone.value.replace(/[\s.-]/g, "");
    const email = form.email.value.trim();

    setError(form.name, !name);
    if (!name) ok = false;

    const phoneBad = !phoneRe.test(phone);
    setError(form.phone, phoneBad);
    if (phoneBad) ok = false;

    const emailBad = email !== "" && !emailRe.test(email);
    setError(form.email, emailBad);
    if (emailBad) ok = false;

    consentWrap.classList.toggle("has-error", !form.consent.checked);
    if (!form.consent.checked) ok = false;

    return ok;
  };

  form.querySelectorAll("input, select").forEach((el) =>
    el.addEventListener("input", () => {
      const field = el.closest(".field");
      if (field) field.classList.remove("has-error");
      if (el.name === "consent") consentWrap.classList.remove("has-error");
    })
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.classList.remove("is-error");

    if (!validate()) {
      status.textContent = "Vui lòng kiểm tra lại các thông tin được đánh dấu.";
      status.classList.add("is-error");
      return;
    }

    // Bot điền vào ô honeypot → giả vờ thành công, không gửi
    if (form.website.value) {
      form.reset();
      openLayer(document.getElementById("thankModal"));
      return;
    }

    const params = new URLSearchParams(location.search);
    const data = new URLSearchParams({
      name: form.name.value.trim(),
      phone: form.phone.value.replace(/[\s.-]/g, ""),
      email: form.email.value.trim(),
      product: form.product.value,
      page: location.href.split("?")[0],
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
    });

    btn.disabled = true;
    btn.textContent = "Đang gửi...";

    try {
      if (!CONFIG.SHEET_URL) {
        console.warn("[Arcadia] Chưa cấu hình CONFIG.SHEET_URL – dữ liệu form chưa được lưu:", Object.fromEntries(data));
      } else {
        // mode "no-cors": Google Apps Script không trả header CORS, nên không đọc được phản hồi,
        // nhưng dữ liệu vẫn được ghi vào Sheet.
        await fetch(CONFIG.SHEET_URL, { method: "POST", mode: "no-cors", body: data });
      }

      // Bắn sự kiện chuyển đổi (nếu đã gắn Facebook Pixel / Google Tag Manager)
      if (typeof window.fbq === "function") window.fbq("track", "Lead");
      if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: "form_submit_lead" });

      form.reset();
      openLayer(document.getElementById("thankModal"));
    } catch (err) {
      status.textContent = "Gửi chưa thành công, vui lòng thử lại hoặc gọi hotline " + CONFIG.HOTLINE + ".";
      status.classList.add("is-error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Gửi thông tin";
    }
  });
}

/* ---------- Nút lên đầu trang ---------- */
function initToTop() {
  const btn = document.getElementById("toTop");
  window.addEventListener("scroll", () => btn.classList.toggle("is-visible", window.scrollY > 800), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
