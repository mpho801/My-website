/* Shared client-side JS for all pages */
(function () {
  'use strict';

  function initAboutTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    if (!tabButtons.length) return;

    const tabContents = document.querySelectorAll('.tab-content');

    function setActive(tabKey) {
      tabButtons.forEach((btn) => {
        const isActive = btn.getAttribute('data-tab') === tabKey;
        btn.classList.toggle('active', isActive);
      });

      tabContents.forEach((c) => {
        const shouldShow = c.id === tabKey;
        c.classList.toggle('active', shouldShow);
        c.style.display = shouldShow ? 'block' : 'none';
      });
    }

    // Ensure only the active tab is visible on load
    tabContents.forEach((c) => {
      if (c.classList.contains('active')) c.style.display = 'block';
      else c.style.display = 'none';
    });

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabKey = btn.getAttribute('data-tab');
        if (!tabKey) return;
        setActive(tabKey);
      });
    });
  }

  function initProductChooseButtons() {
    const chooseButtons = document.querySelectorAll('.choose-btn');
    if (!chooseButtons.length) return;

    const enquirySelect = document.getElementById('enquiry-product');
    const designInfos = document.querySelectorAll('.design-info');
    const enquirySection = document.getElementById('enquiry-section');

    function hideAllInfos() {
      designInfos.forEach((info) => {
        info.style.display = 'none';
      });
    }

    function showInfo(designKey) {
      const info = document.getElementById(`info-${designKey}`);
      if (info) info.style.display = 'block';
    }

    function scrollToEnquiry() {
      if (!enquirySection) return;
      enquirySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    chooseButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const designKey = btn.getAttribute('data-design');
        if (!designKey) return;
        if (enquirySelect) enquirySelect.value = designKey;

        hideAllInfos();
        showInfo(designKey);
        scrollToEnquiry();
      });
    });

    hideAllInfos();
  }

  function initContactFormModal() {
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('modal-close');

    if (!form || !modal) return;

    modal.style.display = 'none';

    function openModal() {
      modal.style.display = 'block';
    }

    function closeModal() {
      modal.style.display = 'none';
    }

    closeBtn?.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      openModal();
      form.reset?.();
    });
  }

  function initEnquiryValidation() {
    const enquiryForm = document.getElementById('enquiryForm');
    if (!enquiryForm) return;

    const successBox = document.getElementById('enquiry-success');
    const dateInput = document.getElementById('enquiry-date');

    if (successBox) successBox.style.display = 'none';

    const today = new Date().toISOString().split('T')[0];
    if (dateInput) dateInput.min = today;

    function updateDateTime() {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      const formatted = now.toLocaleString('en-ZA', options);

      const autoDateEl = document.getElementById('autoDateTime');
      if (autoDateEl) autoDateEl.textContent = formatted;

      const contactDateEl = document.getElementById('contactDateTime');
      if (contactDateEl) contactDateEl.textContent = formatted;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    function validateField(field, errorElement, validationFn) {
      if (!field) return false;
      const isValid = validationFn(field.value);

      if (!isValid) {
        field.style.borderColor = 'var(--error-color)' || '#e74c3c';
        if (errorElement) errorElement.style.display = 'block';
        return false;
      }

      field.style.borderColor = '#ddd';
      if (errorElement) errorElement.style.display = 'none';
      return true;
    }

    const validations = {
      name: (value) => value.trim().length >= 2,
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      phone: (value) => value.replace(/\D/g, '').length >= 10,
      service: (value) => value !== '',
      message: (value) => value.trim().length >= 10,
    };

    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameField = document.getElementById('enquiry-name');
      const emailField = document.getElementById('enquiry-email');
      const phoneField = document.getElementById('enquiry-phone');
      const serviceField = document.getElementById('enquiry-service');
      const messageField = document.getElementById('enquiry-message');

      const nameValid = validateField(
        nameField,
        document.getElementById('enquiry-name-error'),
        validations.name
      );
      const emailValid = validateField(
        emailField,
        document.getElementById('enquiry-email-error'),
        validations.email
      );
      const phoneValid = validateField(
        phoneField,
        document.getElementById('enquiry-phone-error'),
        validations.phone
      );
      const serviceValid = validateField(
        serviceField,
        document.getElementById('enquiry-service-error'),
        validations.service
      );
      const messageValid = validateField(
        messageField,
        document.getElementById('enquiry-message-error'),
        validations.message
      );

      if (nameValid && emailValid && phoneValid && serviceValid && messageValid) {
        if (successBox) successBox.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
          const form = document.getElementById('enquiryForm');
          form?.reset?.();

          setTimeout(() => {
            if (successBox) successBox.style.display = 'none';
          }, 2500);
        }, 1000);
      } else {
        if (!nameValid) nameField?.focus();
        else if (!emailValid) emailField?.focus();
        else if (!phoneValid) phoneField?.focus();
        else if (!serviceValid) serviceField?.focus();
        else if (!messageValid) messageField?.focus();
      }
    });

    document.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('blur', function () {
        const fieldName = this.name;
        const errorElement = document.getElementById(`enquiry-${fieldName}-error`);
        if (!errorElement) return;

        let isValid = true;
        switch (fieldName) {
          case 'name':
            isValid = validations.name(this.value);
            break;
          case 'email':
            isValid = validations.email(this.value);
            break;
          case 'phone':
            isValid = validations.phone(this.value);
            break;
          case 'service':
            isValid = validations.service(this.value);
            break;
          case 'message':
            isValid = validations.message(this.value);
            break;
          default:
            isValid = true;
        }

        if (!isValid && this.value.trim() !== '') {
          this.style.borderColor = '#e74c3c';
          errorElement.style.display = 'block';
        } else {
          this.style.borderColor = '#ddd';
          errorElement.style.display = 'none';
        }
      });
    });
  }

  function initLiveContactDateTime() {
    const contactDateEl = document.getElementById('contactDateTime');
    if (!contactDateEl) return;

    function updateDateTime() {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      contactDateEl.textContent = now.toLocaleString('en-ZA', options);
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  function initEnquiryFormFallbackUX() {
    const enquiryForm = document.getElementById('enquiryForm');
    if (!enquiryForm) return;

    const successBox = document.getElementById('enquiry-success');
    const modal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('modal-close');

    if (!modal) return;

    modal.style.display = 'none';

    function openModal() {
      modal.style.display = 'block';
    }

    function closeModal() {
      modal.style.display = 'none';
    }

    closeBtn?.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    enquiryForm.addEventListener('submit', (e) => {
      if (successBox) successBox.style.display = 'none';

      setTimeout(() => {
        if (modal.style.display !== 'block') openModal();
      }, 0);
    });
  }

  function initContactFormValidationAndEmailPreview() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const modal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('modal-close');
    const messageEl = document.getElementById('modal-message');

    function setModalMessage(text) {
      if (messageEl) messageEl.textContent = text;
    }

    closeBtn?.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });

    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity?.();
        return;
      }

      e.preventDefault();

      const name = (form.querySelector('#name')?.value || '').trim();
      const email = (form.querySelector('#email')?.value || '').trim();
      const phone = (form.querySelector('#phone')?.value || '').trim();
      const messageType = (form.querySelector('#contact-type')?.value || '').trim();
      const message = (form.querySelector('#message')?.value || '').trim();

      const recipient = 'infor@urbanthreadsboutique.com';
      const subject = `Urban Threads Boutique - Contact (${messageType || 'General'})`;
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        `Type: ${messageType || 'General'}`,
        '',
        message,
        '',
        `Sent: ${new Date().toLocaleString('en-ZA')}`,
      ]
        .filter(Boolean)
        .join('\n');

      const mailto = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      setModalMessage('Thanks! Preparing your email for sending...');

      window.location.href = mailto;

      if (modal) modal.style.display = 'block';
      form.reset?.();
    });
  }

  function initPageAnimations() {
    const nodes = document.querySelectorAll('.reveal-on-load');
    if (!nodes.length) return;

    requestAnimationFrame(() => {
      setTimeout(() => {
        nodes.forEach((n) => n.classList.add('is-visible'));
      }, 50);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initAboutTabs();
    initProductChooseButtons();
    initContactFormModal();
    initEnquiryValidation();
    initEnquiryFormFallbackUX();
    initContactFormValidationAndEmailPreview();
    initLiveContactDateTime();
    initPageAnimations();
  });
})();

