const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const toast = document.querySelector('.toast');
const themeButton = document.querySelector('.theme-toggle');
const themeIcon = themeButton.querySelector('[data-theme-icon]');
const contactWrap = document.querySelector('.contact-wrap');
const contactButton = document.querySelector('.contact-pill');
const contactPanel = document.querySelector('.contact-panel');
let toastTimer;

try {
  localStorage.removeItem('assembly-learning-progress-v1');
  localStorage.removeItem('assembly-lab-assessment-v1');
} catch { /* Storage may be unavailable for local files. */ }

function applyTheme(theme, save = false) {
  const isLight = theme === 'light';
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
  themeIcon.textContent = isLight ? '🌙' : '☀️';
  const nextMode = isLight ? 'الليلي' : 'النهاري';
  const label = `التبديل إلى الوضع ${nextMode}`;
  themeButton.setAttribute('aria-label', label);
  themeButton.setAttribute('title', label);
  themeButton.setAttribute('aria-pressed', String(isLight));
  if (save) {
    try { localStorage.setItem('assembly-theme', isLight ? 'light' : 'dark'); } catch { /* Storage may be unavailable for local files. */ }
  }
}

applyTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
themeButton.addEventListener('click', () => {
  const currentTheme = document.documentElement.dataset.theme;
  applyTheme(currentTheme === 'light' ? 'dark' : 'light', true);
});

function showMessage(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'فتح القائمة');
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', (event) => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'فتح القائمة');

    const target = link.getAttribute('href');
    if (target === '#home' || target === '#learning' || target === '#about') {
      event.preventDefault();
      showMainPage(target);
    }
  });
});

function setContactPanelOpen(isOpen) {
  contactPanel.hidden = !isOpen;
  contactButton.setAttribute('aria-expanded', String(isOpen));
}

contactButton.addEventListener('click', () => {
  setContactPanelOpen(contactPanel.hidden);
});

document.addEventListener('click', (event) => {
  if (!contactWrap.contains(event.target)) setContactPanelOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setContactPanelOpen(false);
});

const fundamentalsSection = document.querySelector('#fundamentals');
const learningSection = document.querySelector('#learning');
const aboutSection = document.querySelector('#about');
const heroSection = document.querySelector('#hero');
const unitList = document.querySelector('#unit-list');
const lessonView = document.querySelector('#lesson-view');
const lecturesSection = document.querySelector('#lectures');
const lectureList = document.querySelector('#lecture-list');
const lectureDetail = document.querySelector('#lecture-detail');

function setActiveNav(target) {
  nav.querySelectorAll('.nav-link').forEach((link) => link.classList.toggle('active', link.getAttribute('href') === target));
}

document.querySelectorAll('a[href="#learning"]').forEach((link) => {
  if (link.closest('.main-nav') || link.matches('[data-back]')) return;
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showMainPage('#learning');
  });
});

function renderLectureList() {
  const lectures = window.AssemblyLectureData ?? [];
  lectureList.innerHTML = lectures.map((lecture) => `
    <article class="lecture-card">
      <span class="unit-number">${lecture.number}</span>
      <div class="unit-content">
        <h3>${lecture.title}<span>${lecture.arabicTitle}</span></h3>
        <p>${lecture.description}</p>
        <div class="unit-topic-list"><span>شرح PDF</span><span>أسئلة نظرية وعملية</span><span>مختبر Assembly</span></div>
      </div>
      <div class="unit-card-side"><span class="unit-format">شرح · تدريب · محاكاة</span><button type="button" class="unit-open" data-open-lecture="${lecture.id}">افتح المحاضرة <span>←</span></button></div>
    </article>
  `).join('');

  lectureList.querySelectorAll('[data-open-lecture]').forEach((button) => {
    button.addEventListener('click', () => {
      const lecture = lectures.find((item) => item.id === button.dataset.openLecture);
      if (lecture) openLecture(lecture);
    });
  });
}

function renderLectureQuestions(lecture) {
  const theory = lecture.theory.map((question, index) => `
    <article class="quiz-question" data-question="${index}">
      <h4><span>${String(index + 1).padStart(2, '0')}</span>${question.prompt}</h4>
      <fieldset>
        <legend class="sr-only">اختر إجابة واحدة</legend>
        ${question.options.map((option, optionIndex) => `<label class="quiz-option"><input type="radio" name="theory-${lecture.id}-${index}" value="${optionIndex}"><span>${option}</span></label>`).join('')}
      </fieldset>
      <button type="button" class="button button-outline quiz-check" data-check-question="${index}">تحقق من الإجابة</button>
      <p class="quiz-feedback" data-question-feedback="${index}" aria-live="polite"></p>
    </article>
  `).join('');
  const practical = lecture.practical.map((item, index) => `
    <article class="practical-question">
      <h4><span>${String(index + 1).padStart(2, '0')}</span>${item.title}</h4>
      <p>${item.task}</p>
      <label class="practical-input-label" for="practical-answer-${lecture.id}-${index}">${item.answerType === 'program' ? 'اكتب برنامج MASM كاملًا؛ عرّف البيانات داخل .data عند الحاجة' : 'اكتب إجابتك'}</label>
      <textarea class="practical-input${item.answerType === 'program' ? ' practical-program-input' : ''}" id="practical-answer-${lecture.id}-${index}" data-practical-input="${index}" rows="${item.answerType === 'program' ? 12 : 2}" dir="${item.answerType === 'code' || item.answerType === 'program' ? 'ltr' : 'auto'}" spellcheck="false" placeholder="${item.placeholder}"></textarea>
      <div class="practical-actions"><button type="button" class="button button-outline practical-check" data-check-practical="${index}">${item.answerType === 'program' ? 'تحقق من البرنامج كاملًا' : 'تحقق من الإجابة'}</button>${item.answerType === 'program' ? `<button type="button" class="button button-outline practical-run" data-run-practical="${index}">شغّل هذا الحل في المختبر</button><button type="button" class="practical-reveal" data-reveal-practical="${index}" disabled>إظهار شرح الإجابة بعد محاولتين</button>` : ''}</div>
      <p class="practical-feedback" data-practical-feedback="${index}" aria-live="polite"></p>
      <div class="practical-report" data-practical-report="${index}" aria-live="polite"></div>
      <p class="practical-answer" data-practical-answer="${index}" hidden>${item.answer}</p>
      ${item.solution ? `<pre class="practical-solution" data-practical-solution="${index}" dir="ltr" hidden>${item.solution.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>` : ''}
    </article>
  `).join('');
  return `
    <section class="lecture-questions-panel" aria-labelledby="lecture-questions-heading">
      <div class="questions-heading"><span class="questions-mark">?</span><div><h3 id="lecture-questions-heading">ما الذي ينبغي أن تعرفه بعد هذه المحاضرة؟</h3><p>ثلاثة أسئلة نظرية لمراجعة أفكار المحاضرة.</p></div></div>
      <div class="quiz-list">${theory}</div>
    </section>
    <section class="lecture-practice" aria-labelledby="lecture-practice-heading">
      <div class="questions-heading"><span class="questions-mark practice-mark">↗</span><div><h3 id="lecture-practice-heading">أسئلة وتطبيقات عملية</h3><p>حلّ التمرين أولًا، ثم اكشف الإجابة لتراجع خطواتك.</p></div></div>
      <div class="practical-list">${practical}</div>
    </section>
    <div class="lab-host"></div>`;
}

function checkPracticalAnswer(item, value) {
  if (item.answerType === 'code') {
    const normalizeCode = (source) => source.split(/\r?\n/).map((line) => line.split(';')[0].replace(/\s+/g, '').toLowerCase()).join('');
    const normalized = normalizeCode(value);
    return item.accepted.some((answer) => normalizeCode(answer) === normalized);
  }

  if (item.answerType === 'text') {
    const normalizeText = (source) => source.trim().toUpperCase().replace(/،/g, ',').replace(/\s+/g, '');
    return item.accepted.some((answer) => normalizeText(answer) === normalizeText(value));
  }

  if (item.answerType === 'hex') {
    const normalized = value.trim().replace(/_/g, '').replace(/^0x/i, '').replace(/h$/i, '');
    const actual = Number.parseInt(normalized, 16);
    return Number.isFinite(actual) && item.accepted.some((answer) => (Number.parseInt(answer.replace(/^0x/i, '').replace(/h$/i, ''), 16) >>> 0) === (actual >>> 0));
  }

  if (item.answerType === 'registers' || item.answerType === 'state') {
    const assignments = [...value.toUpperCase().replace(/،/g, ',').matchAll(/\b([A-Z_]\w*)\s*=\s*(-?(?:0X)?[0-9A-F]+H?)/g)];
    const actual = Object.fromEntries(assignments.map(([, register, raw]) => {
      const hasHexPrefix = /^-?0X/i.test(raw);
      const digits = raw.replace(/^-/, '').replace(/^0X/i, '').replace(/H$/i, '');
      const isHex = hasHexPrefix || /[A-F]/i.test(digits);
      const number = Number.parseInt(digits, isHex ? 16 : 10) * (raw.startsWith('-') ? -1 : 1);
      return [register, String(number)];
    }));
    return Object.entries(item.expected).every(([register, expected]) => actual[register] === expected);
  }

  return false;
}

function openLecture(lecture) {
  const orderedLectures = window.AssemblyLectureData ?? [];
  const lectureIndex = orderedLectures.findIndex((item) => item.id === lecture.id);
  lectureList.hidden = true;
  lectureDetail.hidden = false;
  lectureDetail.innerHTML = `
    <div class="lecture-detail-topline">
      <button class="back-link lecture-back" type="button" data-back-to-lectures>← <span>قائمة المحاضرات</span></button>
      <div class="lecture-detail-tools"><span class="section-kicker">المحاضرة ${lecture.number} · x86 32-bit · MASM</span><div class="lecture-navigation" role="group" aria-label="التنقل بين المحاضرات"><button type="button" class="lecture-nav-button" data-lecture-previous ${lectureIndex <= 0 ? 'disabled' : ''}>السابق</button><span>${lectureIndex + 1} / ${orderedLectures.length}</span><button type="button" class="lecture-nav-button" data-lecture-next ${lectureIndex < 0 || lectureIndex >= orderedLectures.length - 1 ? 'disabled' : ''}>التالي</button></div></div>
    </div>
    <h2 class="lecture-title">${lecture.title}<span>${lecture.arabicTitle}</span></h2>
    <p class="lecture-lead">${lecture.description}</p>
    <div class="lecture-tabs" role="tablist" aria-label="أقسام المحاضرة">
      <button type="button" role="tab" aria-selected="true" class="lecture-tab active" data-lecture-tab="explanation">شرح المحاضرة PDF</button>
      <button type="button" role="tab" aria-selected="false" class="lecture-tab" data-lecture-tab="practice">الأسئلة والمختبر</button>
    </div>
    <section class="lecture-pane pdf-pane" role="tabpanel" data-lecture-pane="explanation">
      <div class="pdf-heading"><div><h3>شرح المحاضرة</h3><p>شرح عربي منظّم مع المصطلحات التقنية والأمثلة.</p></div><a class="button button-outline" href="${lecture.pdf}" target="_blank" rel="noreferrer">فتح PDF بصفحة مستقلة ↗</a></div>
      <iframe class="lecture-pdf" src="${lecture.pdf}#view=FitH" title="شرح ${lecture.arabicTitle} بصيغة PDF"></iframe>
      <p class="pdf-fallback">إذا لم يظهر الملف داخل الصفحة، <a href="${lecture.pdf}" target="_blank" rel="noreferrer">افتح شرح المحاضرة PDF</a>.</p>
    </section>
    <section class="lecture-pane practice-pane" role="tabpanel" data-lecture-pane="practice" hidden>
      ${renderLectureQuestions(lecture)}
    </section>`;

  lectureDetail.querySelector('[data-back-to-lectures]').addEventListener('click', () => {
    lectureDetail.hidden = true;
    lectureList.hidden = false;
    lecturesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  lectureDetail.querySelector('[data-lecture-previous]').addEventListener('click', () => {
    if (lectureIndex > 0) openLecture(orderedLectures[lectureIndex - 1]);
  });
  lectureDetail.querySelector('[data-lecture-next]').addEventListener('click', () => {
    if (lectureIndex >= 0 && lectureIndex < orderedLectures.length - 1) openLecture(orderedLectures[lectureIndex + 1]);
  });
  const tabs = [...lectureDetail.querySelectorAll('[data-lecture-tab]')];
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    const selected = tab.dataset.lectureTab;
    tabs.forEach((item) => {
      const active = item.dataset.lectureTab === selected;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    lectureDetail.querySelectorAll('[data-lecture-pane]').forEach((pane) => {
      pane.hidden = pane.dataset.lecturePane !== selected;
    });
    if (selected === 'practice' && !lectureDetail.querySelector('.assembly-lab')) {
      const labHost = lectureDetail.querySelector('.lab-host');
      window.AssemblyLab?.initialize(labHost, lecture.labCode);
    }
  }));

  const practicalSessions = new Map();
  lecture.practical.forEach((item, index) => {
    if (item.answerType === 'program' && window.AssemblyGrader) {
      practicalSessions.set(index, window.AssemblyGrader.createSession(window.AssemblyGrader.fromPractical(lecture.id, item, index)));
    }
  });
  lectureDetail.querySelectorAll('[data-check-question]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.checkQuestion);
      const question = lecture.theory[index];
      const selected = lectureDetail.querySelector(`input[name="theory-${lecture.id}-${index}"]:checked`);
      const feedback = lectureDetail.querySelector(`[data-question-feedback="${index}"]`);
      if (!selected) {
        feedback.textContent = 'اختار إجابة أولًا، وبعدها تحقق منها.';
        feedback.className = 'quiz-feedback';
        return;
      }
      const correct = Number(selected.value) === question.answer;
      feedback.textContent = `${correct ? 'إجابة صحيحة.' : 'الإجابة غير صحيحة.'} ${question.explanation}`;
      feedback.className = `quiz-feedback ${correct ? 'correct' : 'incorrect'}`;
    });
  });
  lectureDetail.querySelectorAll('[data-check-practical]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.checkPractical);
      const item = lecture.practical[index];
      const input = lectureDetail.querySelector(`[data-practical-input="${index}"]`);
      const feedback = lectureDetail.querySelector(`[data-practical-feedback="${index}"]`);
      const answer = lectureDetail.querySelector(`[data-practical-answer="${index}"]`);
      const value = input.value.trim();
      if (!value) {
        feedback.textContent = 'اكتب إجابتك أولًا، وبعدها تحقق منها.';
        feedback.className = 'practical-feedback';
        return;
      }
      let correct;
      if (item.answerType === 'program') {
        const session = practicalSessions.get(index);
        const result = session.submit(value);
        correct = result.verdict === 'pass';
        const report = lectureDetail.querySelector(`[data-practical-report="${index}"]`);
        report.innerHTML = window.AssemblyGrader.renderReport(result);
        const reveal = lectureDetail.querySelector(`[data-reveal-practical="${index}"]`);
        reveal.disabled = !session.canShowSolution();
        feedback.textContent = correct ? 'إجابة صحيحة؛ البرنامج اجتاز كل حالات التصحيح.' : `المحاولة ${session.record.attempts}: راجع التقرير وأكمل البرنامج ثم أعد التحقق.`;
      } else {
        correct = checkPracticalAnswer(item, value);
        feedback.textContent = correct ? 'إجابة صحيحة.' : 'الإجابة تحتاج مراجعة.';
        answer.hidden = false;
      }
      feedback.className = `practical-feedback ${correct ? 'correct' : 'incorrect'}`;
    });
  });
  lectureDetail.querySelectorAll('[data-reveal-practical]').forEach((button) => {
    const session = practicalSessions.get(Number(button.dataset.revealPractical));
    button.disabled = !session?.canShowSolution();
    button.addEventListener('click', () => {
      const index = Number(button.dataset.revealPractical);
      const session = practicalSessions.get(index);
      if (!session?.canShowSolution()) return;
      lectureDetail.querySelector(`[data-practical-answer="${index}"]`).hidden = false;
      const solution = lectureDetail.querySelector(`[data-practical-solution="${index}"]`);
      if (solution) solution.hidden = false;
      button.disabled = true;
      button.textContent = 'ظهر شرح الإجابة';
    });
  });
  lectureDetail.querySelectorAll('[data-run-practical]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.runPractical);
      const source = lectureDetail.querySelector(`[data-practical-input="${index}"]`).value;
      if (!source.trim()) { showMessage('اكتب البرنامج أولًا، ثم شغّله في المختبر.'); return; }
      const labHost = lectureDetail.querySelector('.lab-host');
      if (!labHost.querySelector('.assembly-lab')) window.AssemblyLab?.initialize(labHost, lecture.labCode);
      const editor = labHost.querySelector('.lab-editor');
      if (!editor) return;
      editor.value = source;
      editor.dispatchEvent(new Event('input', { bubbles: true }));
      labHost.scrollIntoView({ behavior: 'smooth', block: 'start' });
      editor.focus();
    });
  });
  lectureDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openLectures() {
  renderLectureList();
  lectureDetail.hidden = true;
  lectureList.hidden = false;
  heroSection.hidden = true;
  learningSection.hidden = true;
  aboutSection.hidden = true;
  fundamentalsSection.hidden = true;
  lecturesSection.hidden = false;
  setActiveNav('#learning');
  lecturesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderFundamentals() {
  const units = window.AssemblyCourseData?.fundamentals ?? [];
  unitList.innerHTML = units.map((unit) => `
    <article class="unit-card">
      <span class="unit-number">${unit.number}</span>
      <div class="unit-content">
        <h3>${unit.title}<span>${unit.arabicTitle}</span></h3>
        <p>${unit.description}</p>
        <div class="unit-topic-list">${unit.topics.map((topic) => `<span>${topic}</span>`).join('')}</div>
      </div>
      <div class="unit-card-side"><span class="unit-format">شرح + أسئلة نظرية</span><button type="button" class="unit-open" data-unit="${unit.id}">تفاصيل الوحدة <span>←</span></button></div>
    </article>
  `).join('');

  unitList.querySelectorAll('[data-unit]').forEach((button) => {
    button.addEventListener('click', () => {
      const unit = units.find((item) => item.id === button.dataset.unit);
      const lesson = window.AssemblyLessons?.[unit.id];
      if (!lesson) {
        showMessage('محتوى هذه الوحدة نجهّزه لاحقًا.');
        return;
      }
      unitList.hidden = true;
      lessonView.innerHTML = lesson;
      lessonView.hidden = false;
      lessonView.querySelector('[data-back-to-units]').addEventListener('click', () => {
        lessonView.hidden = true;
        renderFundamentals();
        unitList.hidden = false;
        fundamentalsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      lessonView.querySelectorAll('.lesson-outline a').forEach((link) => {
        link.addEventListener('click', () => {
          const target = lessonView.querySelector(link.getAttribute('href'));
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      lessonView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function openFundamentals() {
  renderFundamentals();
  lectureDetail.hidden = true;
  lectureList.hidden = false;
  lecturesSection.hidden = true;
  lessonView.hidden = true;
  unitList.hidden = false;
  heroSection.hidden = true;
  learningSection.hidden = true;
  aboutSection.hidden = true;
  fundamentalsSection.hidden = false;
  setActiveNav('#learning');
  fundamentalsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showMainPage(target = '#learning') {
  lecturesSection.hidden = true;
  lectureDetail.hidden = true;
  lectureList.hidden = false;
  fundamentalsSection.hidden = true;
  lessonView.hidden = true;
  unitList.hidden = false;
  heroSection.hidden = false;
  learningSection.hidden = false;
  aboutSection.hidden = false;
  setActiveNav(target === '#home' || target === '#about' ? target : '#learning');

  if (target === '#home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('.brand[href="#home"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showMainPage('#home');
  });
});

document.querySelectorAll('[data-path]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    if (link.dataset.path === 'fundamentals') {
      openFundamentals();
      return;
    }
    if (link.dataset.path === 'lectures') openLectures();
  });
});

document.querySelectorAll('[data-back]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showMainPage('#learning');
  });
});
