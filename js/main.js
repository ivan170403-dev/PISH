(function () {
  const header = document.querySelector(".header");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const form = document.getElementById("application-form");
  const formError = document.getElementById("form-error");
  const toast = document.getElementById("toast");

  /* Scroll: header shadow */
  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  /* Toast */
  function showToast() {
    if (!toast) return;
    toast.hidden = false;
    requestAnimationFrame(function () {
      toast.classList.add("is-visible");
    });
    setTimeout(function () {
      toast.classList.remove("is-visible");
      setTimeout(function () {
        toast.hidden = true;
      }, 400);
    }, 5000);
  }

  /* Form validation & submit */
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (formError) {
        formError.hidden = true;
        formError.textContent = "";
      }

      form.querySelectorAll(".is-invalid").forEach(function (el) {
        el.classList.remove("is-invalid");
      });

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const about = form.about.value.trim();
      const consent = form.consent.checked;

      if (!name || !email || !about || !consent) {
        if (formError) {
          formError.hidden = false;
          formError.textContent = "Заполните обязательные поля и отметьте согласие.";
        }
        if (!name) form.name.classList.add("is-invalid");
        if (!email) form.email.classList.add("is-invalid");
        if (!about) form.about.classList.add("is-invalid");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (formError) {
          formError.hidden = false;
          formError.textContent = "Укажите корректный email.";
        }
        form.email.classList.add("is-invalid");
        return;
      }

      /* Данные заявки — для подключения backend / Formspree / Telegram-бота */
      const payload = {
        name: name,
        email: email,
        phone: form.phone.value.trim(),
        faculty: form.faculty.value.trim(),
        interest: form.interest.value,
        about: about,
        submittedAt: new Date().toISOString(),
      };

      console.info("[ПИШ] Заявка (демо, без сервера):", payload);

      /*
       * Подключение отправки на сервер (раскомментировать и указать URL):
       *
       * fetch("https://formspree.io/f/YOUR_ID", {
       *   method: "POST",
       *   headers: { "Content-Type": "application/json", Accept: "application/json" },
       *   body: JSON.stringify(payload),
       * }).then(function (r) { if (!r.ok) throw new Error(); return r; })
       *   .then(function () { form.reset(); showToast(); })
       *   .catch(function () { ... });
       */

      form.reset();
      showToast();
    });
  }
})();
