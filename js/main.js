/* Christina Holly Juarez Realty — homepage behavior
   Menu, quiz, contact form, and a few small conveniences. No dependencies. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     SETTINGS — fill these in when they exist. Leave '' to keep defaults.
     ------------------------------------------------------------------ */
  var SETTINGS = {
    // Scheduling page (Calendly, etc). When set, every "Book a Seller Call"
    // button opens it. When empty, the buttons jump to the contact form.
    BOOKING_URL: 'https://tr.ee/ZnY98KdBWk',

    // Form service endpoint (Formspree, Basin, etc) that accepts a JSON POST.
    FORM_ENDPOINT: '',

    // Google Form connection. The site's own form quietly submits into the
    // Google Form, so visitors never leave the page.
    //   GOOGLE_FORM_ACTION: https://docs.google.com/forms/d/e/<FORM_ID>/formResponse
    //   GOOGLE_FORM_FIELDS: the "entry.123456" id of each question, taken
    //   from the form's "Get pre-filled link".
    // When neither this nor FORM_ENDPOINT is set, the form builds a
    // ready-to-send text message instead.
    GOOGLE_FORM_ACTION: '',
    GOOGLE_FORM_FIELDS: { topic: '', name: '', phone: '', property: '', message: '' },

    // Link to the Google Business reviews page. When set, the
    // "Read all reviews on Google" link appears under the reviews.
    GOOGLE_REVIEWS_URL: 'https://share.google/TVTxQz5ULJQaNZOAh',

    PHONE_E164: '+17609192548',
    PHONE_DISPLAY: '(760) 919-2548'
  };

  var doc = document;
  doc.documentElement.classList.add('js');

  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }

  function smsLink(body) {
    var base = 'sms:' + SETTINGS.PHONE_E164;
    return body ? base + '?&body=' + encodeURIComponent(body) : base;
  }

  /* ---------- Mobile menu ---------- */
  var toggle = $('.nav-toggle');
  var nav = $('#site-nav');
  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    $('.nav-toggle__label', toggle).textContent = open ? 'Close' : 'Menu';
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Contact form: topic prefill ---------- */
  var form = $('[data-contact-form]');
  var topic = form ? form.elements.topic : null;
  var messageField = form ? form.elements.message : null;

  function setTopic(value) {
    if (!topic) return;
    for (var i = 0; i < topic.options.length; i++) {
      if (topic.options[i].value === value) { topic.value = value; return; }
    }
  }

  // "Book a Seller Call" buttons
  $$('[data-book]').forEach(function (el) {
    if (SETTINGS.BOOKING_URL) {
      el.href = SETTINGS.BOOKING_URL;
      el.target = '_blank';
      el.rel = 'noopener';
    } else {
      el.addEventListener('click', function () { setTopic('seller-call'); });
    }
  });

  // Doors, browse tiles, and hub links that carry an interest
  $$('[data-interest]').forEach(function (el) {
    el.addEventListener('click', function () { setTopic(el.getAttribute('data-interest')); });
  });

  /* ---------- Google reviews link ---------- */
  if (SETTINGS.GOOGLE_REVIEWS_URL) {
    $$('[data-google-reviews]').forEach(function (a) {
      a.href = SETTINGS.GOOGLE_REVIEWS_URL;
      var holder = a.closest('[hidden]');
      if (holder) holder.hidden = false;
    });
  }

  /* ---------- Locals Guide quiz ---------- */
  var quiz = $('[data-quiz]');
  if (quiz) {
    var steps = $$('[data-quiz-step]', quiz);
    var bar = $('[data-quiz-bar]', quiz);
    var result = $('[data-quiz-result]', quiz);
    var backBtn = $('[data-quiz-back]', quiz);
    var answers = [];
    var current = 0;

    var LABELS = {
      sell: 'thinking about selling', buy: 'looking for a home',
      land: 'looking for land', explore: 'getting to know Valley Center',
      now: 'ready now', months: 'in the next few months',
      someday: 'someday, no date yet', curious: 'just curious',
      logistics: 'wells, septic, and country logistics',
      acreage: 'acreage, animals, and usable land',
      events: 'events and things to do',
      spots: 'where the locals eat and shop'
    };

    var STARTS = {
      sell: {
        title: 'Start with a Seller Call.',
        text: 'It\u2019s a conversation, not a commitment. We talk about your property and your timing, and you decide what happens next.',
        cta: 'Book a Seller Call', topic: 'seller-call'
      },
      buy: {
        title: 'Start with the Country Property Files.',
        text: 'Real addresses, prices, and specs up front. Tell me what you want a property to offer and I\u2019ll send you what\u2019s actually available.',
        cta: 'Tell me what you want', topic: 'homes'
      },
      land: {
        title: 'Start with a land conversation.',
        text: 'Land comes down to water, access, and zoning. Tell me what you want the land to do and we\u2019ll work backward from there.',
        cta: 'Talk land', topic: 'land'
      },
      explore: {
        title: 'Start with the Locals Guide.',
        text: 'The best way to get to know Valley Center is the way the people who live here know it.',
        cta: 'Send me the Locals Guide', topic: 'guide'
      }
    };

    var TIMING = {
      now: 'Since you\u2019re ready now, the fastest route is a call or text to ' + SETTINGS.PHONE_DISPLAY + '.',
      months: 'A few months out is a good time to start. It leaves room to plan instead of rush.',
      someday: 'No date is fine. Reach out whenever the timing gets real.',
      curious: 'Curious is welcome here. No follow-up pressure from me.'
    };

    function show(index) {
      current = index;
      steps.forEach(function (s, i) { s.hidden = i !== index; });
      result.hidden = true;
      backBtn.hidden = index === 0;
      bar.style.width = (index / steps.length * 100) + '%';
    }

    function finish() {
      var start = STARTS[answers[0]];
      steps.forEach(function (s) { s.hidden = true; });
      backBtn.hidden = true;
      bar.style.width = '100%';
      $('[data-quiz-title]', result).textContent = start.title;
      $('[data-quiz-text]', result).textContent =
        start.text + ' ' + TIMING[answers[1]] +
        ' I\u2019ll also keep in mind that you want to know about ' + LABELS[answers[2]] + '.';
      var cta = $('[data-quiz-cta]', result);
      cta.textContent = start.cta;
      cta.setAttribute('data-topic', start.topic);
      result.hidden = false;
      result.focus({ preventScroll: true });
    }

    quiz.addEventListener('click', function (e) {
      var option = e.target.closest('.quiz__options button');
      if (option) {
        answers[current] = option.getAttribute('data-value');
        if (current < steps.length - 1) {
          show(current + 1);
          var next = $('button', steps[current]);
          if (next) next.focus({ preventScroll: true });
        } else {
          finish();
        }
        return;
      }
      if (e.target.closest('[data-quiz-back]')) { show(Math.max(0, current - 1)); return; }
      if (e.target.closest('[data-quiz-reset]')) { answers = []; show(0); return; }
      var cta = e.target.closest('[data-quiz-cta]');
      if (cta) {
        setTopic(cta.getAttribute('data-topic'));
        if (messageField && !messageField.value) {
          messageField.value = 'From the Locals Guide quiz: I\u2019m ' + LABELS[answers[0]] +
            ', timing is ' + LABELS[answers[1]] +
            ', and I most want to know about ' + LABELS[answers[2]] + '.';
        }
      }
    });

    show(0);
  }

  /* ---------- Contact form submit ---------- */
  if (form) {
    var errorBox = $('[data-form-error]', form);
    var ready = $('[data-form-ready]', form);
    var sent = $('[data-form-sent]', form);
    var submitBtn = $('[data-form-submit]', form);

    function fail(msg, field) {
      errorBox.textContent = msg;
      errorBox.hidden = false;
      if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
    }

    function buildNote(data) {
      var lines = ['Hi Christina, this is ' + data.name + '.'];
      lines.push('Request: ' + data.topicLabel);
      if (data.property) lines.push('Property/area: ' + data.property);
      if (data.message) lines.push(data.message);
      lines.push('Best number: ' + data.phone);
      return lines.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorBox.hidden = true;
      ready.hidden = true;
      sent.hidden = true;
      $$('[aria-invalid]', form).forEach(function (f) { f.removeAttribute('aria-invalid'); });

      var data = {
        topic: form.elements.topic.value,
        topicLabel: form.elements.topic.options[form.elements.topic.selectedIndex].text,
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        property: form.elements.property.value.trim(),
        message: form.elements.message.value.trim()
      };

      if (!data.name) return fail('Please add your name.', form.elements.name);
      if (data.phone.replace(/\D/g, '').length < 10) {
        return fail('Please add a phone number with area code.', form.elements.phone);
      }

      var request = null;
      if (SETTINGS.FORM_ENDPOINT) {
        request = fetch(SETTINGS.FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });
      } else if (SETTINGS.GOOGLE_FORM_ACTION) {
        // Google Forms does not send a readable reply to other websites, so
        // this request is "no-cors": it only fails if the network does.
        var params = new URLSearchParams();
        var ids = SETTINGS.GOOGLE_FORM_FIELDS;
        var values = { topic: data.topicLabel, name: data.name, phone: data.phone, property: data.property, message: data.message };
        Object.keys(ids).forEach(function (key) {
          if (ids[key]) params.append(ids[key], values[key] || '');
        });
        request = fetch(SETTINGS.GOOGLE_FORM_ACTION, { method: 'POST', mode: 'no-cors', body: params });
      }

      if (request) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        request.then(function (res) {
          if (res.type !== 'opaque' && !res.ok) throw new Error('Request failed');
          form.reset();
          sent.hidden = false;
          sent.focus();
        }).catch(function () {
          fail('That did not go through. Please call or text ' + SETTINGS.PHONE_DISPLAY + '.');
        }).then(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send my request';
        });
        return;
      }

      // No form service connected: hand the visitor a ready-to-send text.
      var note = buildNote(data);
      $('[data-form-preview]', form).textContent = note;
      $('[data-form-sms]', form).href = smsLink(note);
      ready.hidden = false;
      ready.focus();
      ready.scrollIntoView({ block: 'nearest' });
    });

    var copyBtn = $('[data-form-copy]', form);
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var text = $('[data-form-preview]', form).textContent;
        function done() {
          copyBtn.textContent = 'Copied';
          setTimeout(function () { copyBtn.textContent = 'Copy note'; }, 2000);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () {});
        } else {
          var range = doc.createRange();
          range.selectNodeContents($('[data-form-preview]', form));
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          try { doc.execCommand('copy'); done(); } catch (err) { /* selection stays for manual copy */ }
        }
      });
    }
  }

  /* ---------- Gentle scroll reveal ---------- */
  var revealables = $$('.section__head, .door, .step, .hub__card, .file, .intent, .review, .sold__card, .meet__copy, .quiz, .contact');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealables.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
