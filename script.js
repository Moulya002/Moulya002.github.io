/**
 * Contact form — submissions via Formspree (emails your Formspree inbox).
 * Dashboard: https://formspree.io/forms/xwvwzpav
 */
(function () {
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvwzpav";

  const form = document.getElementById("portfolio-contact-form");
  const errEl = document.getElementById("contact-form-error");
  const successEl = document.getElementById("contact-form-success");
  const submitBtn = document.getElementById("contact-submit-btn");

  if (!form || !errEl) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    errEl.hidden = true;
    errEl.textContent = "";
    if (successEl) successEl.hidden = true;

    const name = (document.getElementById("contact-name").value || "").trim();
    const email = (document.getElementById("contact-email").value || "").trim();
    const message = (document.getElementById("contact-message").value || "").trim();

    if (!email) {
      errEl.textContent = "Please enter your email so I can reply.";
      errEl.hidden = false;
      document.getElementById("contact-email").focus();
      return;
    }

    if (!message) {
      errEl.textContent = "Please enter a message.";
      errEl.hidden = false;
      document.getElementById("contact-message").focus();
      return;
    }

    const fullMessage =
      "This person has reached out from your portfolio.\r\n\r\n" +
      "Name: " +
      (name || "Not provided") +
      "\r\n" +
      "Their email: " +
      email +
      "\r\n\r\n" +
      "Message:\r\n" +
      "---\r\n" +
      message +
      "\r\n---";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name || "Portfolio visitor",
          email: email,
          message: fullMessage,
          _subject: "Portfolio: Someone reached out from your site",
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON response */
      }

      if (res.ok) {
        form.reset();
        if (successEl) successEl.hidden = false;
      } else {
        const msg =
          (data && data.error) ||
          (data.errors && data.errors[0] && data.errors[0].message) ||
          "Could not send. Try again or email me directly.";
        errEl.textContent = typeof msg === "string" ? msg : "Could not send. Try again or email me directly.";
        errEl.hidden = false;
      }
    } catch {
      errEl.textContent = "Network error. Check your connection or email me directly.";
      errEl.hidden = false;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send message";
      }
    }
  });
})();
