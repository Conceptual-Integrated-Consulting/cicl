document.addEventListener("DOMContentLoaded", function () {
  // Scroll-to-top button
  const backToTopButton = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      backToTopButton.style.display = "flex";
    } else {
      backToTopButton.style.display = "none";
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  (function () {
    const body = document.body;
    const menuBtn = document.getElementById('menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.getElementById('close-btn'); // inside panel (kept)

    function openMobile() {
      mobileNav.classList.add('active');
      body.classList.add('no-scroll');
      mobileNav.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Close menu');
      menuBtn.classList.add('is-open');
    }

    function closeMobile() {
      mobileNav.classList.remove('active');
      body.classList.remove('no-scroll');
      mobileNav.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
      menuBtn.classList.remove('is-open');
    }

    // Toggle via the same button (morphs bars ↔ times)
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('active');
      isOpen ? closeMobile() : openMobile();
    });

    // Panel's internal close button still works
    if (closeBtn) closeBtn.addEventListener('click', closeMobile);

    // Close after selecting any link in the panel
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));

    // ESC to close
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobile(); });

    // Accordion toggle functionality
    const accordionToggle = document.getElementById('m-services-toggle');
    const accordionItem = document.getElementById('m-services-item');
    const accordionPanel = document.getElementById('m-services-panel');

    if (accordionToggle && accordionItem && accordionPanel) {
      accordionToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = accordionItem.classList.contains('open');
        
        if (isOpen) {
          accordionItem.classList.remove('open');
          accordionToggle.classList.remove('is-open');
          accordionToggle.setAttribute('aria-expanded', 'false');
          accordionPanel.setAttribute('aria-hidden', 'true');
        } else {
          accordionItem.classList.add('open');
          accordionToggle.classList.add('is-open');
          accordionToggle.setAttribute('aria-expanded', 'true');
          accordionPanel.setAttribute('aria-hidden', 'false');
        }
      });
    }

    // Section toggle functionality
    const sectionToggles = document.querySelectorAll('.section-toggle');
    sectionToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const sectionListId = toggle.getAttribute('aria-controls');
        const sectionList = document.getElementById(sectionListId);
        const isOpen = toggle.classList.contains('is-open');
        
        if (isOpen) {
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          if (sectionList) {
            sectionList.classList.remove('open');
            sectionList.setAttribute('aria-hidden', 'true');
          }
        } else {
          toggle.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
          if (sectionList) {
            sectionList.classList.add('open');
            sectionList.setAttribute('aria-hidden', 'false');
          }
        }
      });
    });
  })();
});

// TODO: replace with your real EmailJS values
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY_HERE";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID_HERE";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID_HERE";

(function () {
  // Initialise EmailJS
  if (window.emailjs) {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });
  }

  const form = document.getElementById("proposalForm");
  const statusEl = document.getElementById("proposalStatusMessage");

  if (!form) return;

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.hidden = false;
    statusEl.classList.remove("is-success", "is-error", "is-info");
    if (type) statusEl.classList.add(`is-${type}`);
  }

  function clearStatus() {
    if (!statusEl) return;
    statusEl.hidden = true;
    statusEl.textContent = "";
    statusEl.classList.remove("is-success", "is-error", "is-info");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearStatus();

    if (!window.emailjs) {
      setStatus(
        "We could not initialise the email service. Please try again later or email info@ciconsult.com.ng.",
        "error"
      );
      return;
    }

    // Disable button while sending
    const submitBtn = form.querySelector(".proposal-submit");
    const originalText = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    // Optional: build a friendly summary of selected services
    const serviceCheckboxes = form.querySelectorAll('input[name="services[]"], input[name="services"]');
    const selectedServices = [];
    serviceCheckboxes.forEach((cb) => {
      if (cb.checked) {
        const label = form.querySelector(`label[for="${cb.id}"]`);
        selectedServices.push(label ? label.textContent.trim() : cb.value);
      }
    });

    // Create a FormData to send with extra fields if needed
    const formData = new FormData(form);
    // Add a combined services summary for the template
    formData.set("services_summary", selectedServices.join(", ") || "Not specified");

    emailjs
      .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      .then(
        () => {
          setStatus(
            "Thank you. Your request has been submitted. We’ll review it and get back to you within 2–3 business days.",
            "success"
          );
          form.reset();
        },
        (error) => {
          console.error("EmailJS error", error);
          setStatus(
            "We couldn’t submit your request at the moment. Please try again or email info@ciconsult.com.ng.",
            "error"
          );
        }
      )
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText || "Submit request";
        }
      });
  });
})();


document.addEventListener("DOMContentLoaded", function () {
  const bookingForm = document.getElementById("bookingForm");

  if (!bookingForm) return;

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // HTML5 validation first
    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Collect form data
    const formData = new FormData(bookingForm);

    // Handle checkbox group: interestAreas[]
    const interestAreas = formData.getAll("interestAreas").join(", ");

    const templateParams = {
      // About you
      firstName: formData.get("firstName") || "",
      lastName: formData.get("lastName") || "",
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      jobTitle: formData.get("jobTitle") || "",
      companyName: formData.get("companyName") || "",

      // Org & service focus
      orgType: formData.get("orgType") || "",
      industry: formData.get("industry") || "",
      orgSize: formData.get("orgSize") || "",
      country: formData.get("country") || "",
      primaryPillar: formData.get("primaryPillar") || "",
      engagementType: formData.get("engagementType") || "",
      interestAreas: interestAreas || "",
      budgetRange: formData.get("budgetRange") || "",
      referral: formData.get("referral") || "",

      // Timing & logistics
      meetingMode: formData.get("meetingMode") || "",
      timeZone: formData.get("timeZone") || "",
      preferredDates: formData.get("preferredDates") || "",
      participants: formData.get("participants") || "",
      context: formData.get("context") || "",

      // You can add extra meta if your template expects it
      submitted_from: "CICL Services Booking Page",
    };

    // Replace with your own IDs from EmailJS dashboard
    const SERVICE_ID = "YOUR_SERVICE_ID";
    const TEMPLATE_ID = "YOUR_TEMPLATE_ID";

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then(function () {
        alert(
          "Thank you. Your booking request has been sent successfully. A CICL consultant will contact you shortly."
        );
        bookingForm.reset();
      })
      .catch(function (error) {
        console.error("EmailJS error:", error);
        alert(
          "Sorry, something went wrong while sending your request. Please try again, or contact us using the email/phone on this page."
        );
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  });
});

