/* Full-program validation and behavior-based grading for the teaching lab. */
(function () {
  'use strict';
  const Lab = window.AssemblyLab;
  if (!Lab?.parse || !Lab?.evaluate) throw new Error('حمّل lab.js قبل lab-grader.js.');

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

  function cleanLine(line) {
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      if (line[index] === '"') quoted = !quoted;
      else if (line[index] === ';' && !quoted) return line.slice(0, index).trim();
    }
    return line.trim();
  }

  function validateStructure(source, question) {
    const lines = source.split(/\r?\n/);
    const clean = lines.map(cleanLine).filter(Boolean);
    const codeSections = clean.map((line, index) => /^\.code$/i.test(line) ? index : -1).filter((index) => index >= 0);
    const dataSections = clean.map((line, index) => /^\.data$/i.test(line) ? index : -1).filter((index) => index >= 0);
    const declarations = clean.map((line, index) => ({ line, index })).filter(({ line }) => /^[a-z_]\w*\s+(?:s?byte|s?word|s?dword)\b/i.test(line));
    const errors = [];
    if (!codeSections.length) errors.push('البرنامج الكامل يحتاج قسم .code.');
    if (codeSections.length > 1) errors.push('استخدم قسم .code واحدًا فقط.');
    const codeIndex = codeSections[0] ?? -1;
    const dataIndex = dataSections[0] ?? -1;
    if (declarations.length && dataIndex < 0) errors.push('عرّفت متغيرات، لذلك لازم تضعها داخل قسم .data.');
    if (dataIndex >= 0 && codeIndex >= 0 && dataIndex > codeIndex) errors.push('قسم .data لازم يسبق قسم .code.');
    if (dataSections.length > 1) errors.push('استخدم قسم .data واحدًا فقط.');
    if (dataIndex >= 0 && codeIndex >= 0) {
      declarations.forEach(({ index }) => {
        if (index < dataIndex || index > codeIndex) errors.push(`تعريف البيانات في السطر ${index + 1} خارج قسم .data.`);
      });
    }
    if (question.requireFullProgram) {
      const procIndex = clean.findIndex((line) => /^main\s+PROC\b/i.test(line));
      const endpIndex = clean.findIndex((line) => /^main\s+ENDP\b/i.test(line));
      const endIndex = clean.findIndex((line) => /^END\s+main\s*$/i.test(line));
      if (procIndex < 0) errors.push('البرنامج الكامل يحتاج main PROC داخل قسم .code.');
      else if (codeIndex < 0 || procIndex <= codeIndex) errors.push('ضع main PROC داخل قسم .code.');
      if (endpIndex < 0) errors.push('البرنامج الكامل يحتاج main ENDP.');
      else if (procIndex >= 0 && endpIndex <= procIndex) errors.push('يجب أن يأتي main ENDP بعد main PROC.');
      if (endIndex < 0) errors.push('اختم البرنامج بالتوجيه END main.');
      else if (endIndex !== clean.length - 1) errors.push('END main لازم يكون آخر سطر فعلي في البرنامج.');
      if (procIndex >= 0 && endpIndex > procIndex && !clean.slice(procIndex + 1, endpIndex).some((line) => /^exit\s*$/i.test(line))) errors.push('أضف exit داخل main لإنهاء البرنامج بصورة صحيحة.');
    }
    if (question.requireIrvineInclude && !/^\s*INCLUDE\s+Irvine32\.inc\s*$/im.test(source)) errors.push('هذا السؤال يتطلب INCLUDE Irvine32.inc.');
    return errors;
  }

  function formatValue(value, bits, signedDisplay = false) {
    if (value === null || value === undefined) return 'غير مهيأ';
    const normalized = Lab.normalize(value, bits);
    const displayed = signedDisplay && normalized >= 2 ** (bits - 1) ? normalized - 2 ** bits : normalized;
    return `${displayed} (0x${normalized.toString(16).toUpperCase().padStart(bits / 4, '0')})`;
  }

  function compareExpected(expected, state) {
    const rows = [];
    Object.entries(expected.registers || {}).forEach(([name, wanted]) => {
      const actual = Lab.readRegister(state, name);
      rows.push({ label: `السجل ${name.toUpperCase()}`, expected: actual ? formatValue(wanted, actual.bits, Number(wanted) < 0) : String(wanted), actual: actual ? formatValue(actual.value, actual.bits, Number(wanted) < 0) : 'سجل غير معروف', ok: Boolean(actual && Lab.normalize(wanted, actual.bits) === actual.value) });
    });
    Object.entries(expected.memory || {}).forEach(([name, wanted]) => {
      const variable = state.memory[name.toLowerCase()];
      if (!variable) { rows.push({ label: `المتغير ${name}`, expected: 'معرّف في .data', actual: 'غير موجود', ok: false }); return; }
      if (typeof wanted === 'string') {
        const actual = variable.text ?? '';
        rows.push({ label: `النص ${name}`, expected: JSON.stringify(wanted), actual: JSON.stringify(actual), ok: actual === wanted });
        return;
      }
      const values = Array.isArray(wanted) ? wanted : [wanted];
      values.forEach((value, index) => {
        const actual = variable.values[index] ?? null;
        rows.push({ label: values.length > 1 ? `${name}[${index}]` : name, expected: formatValue(value, variable.bits, variable.signed), actual: formatValue(actual, variable.bits, variable.signed), ok: actual === Lab.normalize(value, variable.bits) });
      });
      if (Array.isArray(wanted) && wanted.length !== variable.values.length) rows.push({ label: `حجم ${name}`, expected: `${wanted.length} عناصر`, actual: `${variable.values.length} عناصر`, ok: false });
    });
    Object.entries(expected.flags || {}).forEach(([name, wanted]) => {
      const actual = state.flags[name.toUpperCase()];
      rows.push({ label: `العلم ${name.toUpperCase()}`, expected: String(wanted), actual: actual == null ? 'غير معروف' : String(actual), ok: actual === wanted });
    });
    (expected.memoryReads || []).forEach((wanted, index) => {
      const found = state.memoryReads.some((actual) => actual.name === wanted.name.toLowerCase() && actual.index === wanted.index);
      rows.push({ label: `قراءة الذاكرة ${index + 1}`, expected: `${wanted.name}[${wanted.index}]`, actual: found ? 'تمت القراءة' : 'لم تتم القراءة', ok: found });
    });
    (expected.mulInputs || []).forEach((wanted, index) => {
      const found = state.mulInputs.some((actual) => Object.entries(wanted).every(([field, value]) => actual[field] === value));
      rows.push({ label: `معاملات MUL ${index + 1}`, expected: Object.entries(wanted).map(([key, value]) => `${key}=${value}`).join(', '), actual: found ? 'مطابقة' : 'غير مطابقة', ok: found });
    });
    (expected.dialogs || []).forEach((wanted, index) => {
      const actual = state.dialogs[index];
      const fields = ['procedure', 'title', 'message', 'answer'].filter((field) => Object.hasOwn(wanted, field));
      const ok = Boolean(actual && fields.every((field) => actual[field] === wanted[field]));
      const expectedText = fields.map((field) => `${field}=${wanted[field]}`).join(', ');
      const actualText = actual ? fields.map((field) => `${field}=${actual[field]}`).join(', ') : 'لم تظهر نافذة';
      rows.push({ label: `نافذة تفاعل ${index + 1}`, expected: expectedText, actual: actualText, ok });
    });
    if (Array.isArray(expected.dialogs) && state.dialogs.length !== expected.dialogs.length) rows.push({ label: 'عدد نوافذ التفاعل', expected: String(expected.dialogs.length), actual: String(state.dialogs.length), ok: false });
    (expected.anyVariable || []).forEach((spec) => {
      const excluded = (spec.exclude || []).map((name) => name.toLowerCase());
      const found = Object.values(state.memory).find((variable) => {
        if (excluded.includes(variable.name)) return false;
        if (spec.bits && variable.bits !== spec.bits) return false;
        if (spec.exactLength && variable.values.length !== spec.exactLength) return false;
        if (spec.minLength && variable.values.length < spec.minLength) return false;
        if (spec.text !== undefined) return variable.text === spec.text;
        if (Array.isArray(spec.values)) return spec.values.length === variable.values.length && spec.values.every((value, index) => variable.values[index] === Lab.normalize(value, variable.bits));
        return variable.values[0] === Lab.normalize(spec.value, variable.bits);
      });
      const wantedText = spec.text !== undefined ? JSON.stringify(spec.text) : Array.isArray(spec.values) ? spec.values.join(', ') : String(spec.value);
      rows.push({ label: spec.label || 'متغير يحمل النتيجة', expected: `${wantedText}${spec.bits ? ` (${spec.bits}-bit)` : ''}`, actual: found ? `موجود في ${found.name}` : 'لا يوجد متغير مطابق', ok: Boolean(found) });
    });
    const output = Lab.screenText(state).replace(/\s+$/, '');
    if (typeof expected.output === 'string') rows.push({ label: 'مخرجات الشاشة', expected: JSON.stringify(expected.output), actual: JSON.stringify(output), ok: output === expected.output.replace(/\s+$/, '') });
    const outputLines = output.split('\n').map((line) => line.trimEnd());
    while (outputLines.length && outputLines[outputLines.length - 1] === '') outputLines.pop();
    if (Array.isArray(expected.outputLines)) rows.push({ label: 'أسطر الشاشة', expected: JSON.stringify(expected.outputLines), actual: JSON.stringify(outputLines), ok: outputLines.length === expected.outputLines.length && outputLines.every((line, index) => line === expected.outputLines[index]) });
    if (Array.isArray(expected.outputNumbers)) {
      const actualNumbers = outputLines.map((line) => (/^[+-]?\d+$/.test(line.trim()) ? Number(line.trim()) : null));
      rows.push({ label: 'الأرقام الظاهرة (كل رقم في سطر)', expected: expected.outputNumbers.join(' | '), actual: outputLines.length ? actualNumbers.map((value, index) => (value === null ? outputLines[index] : value)).join(' | ') : 'لا مخرجات', ok: actualNumbers.length === expected.outputNumbers.length && actualNumbers.every((value, index) => value === expected.outputNumbers[index]) });
    }
    (expected.outputContains || []).forEach((part) => rows.push({ label: 'النص الظاهر', expected: JSON.stringify(part), actual: output.includes(part) ? 'موجود' : 'غير موجود', ok: output.includes(part) }));
    return rows;
  }

  const mnemonicList = (program) => program.instructions.map((instruction) => (instruction.text.match(/^([a-z_]\w*)/i) || [''])[0].toLowerCase());
  function validateRules(question, program, source = '') {
    const rules = question.rules || {};
    const instructions = mnemonicList(program);
    const calls = program.instructions.map((instruction) => instruction.text.match(/^call\s+([a-z_]\w*)/i)).filter(Boolean).map((match) => match[1].toLowerCase());
    const issues = [];
    (rules.mustUse || []).forEach((name) => { if (!instructions.includes(name.toLowerCase())) issues.push(`الحل يحتاج استخدام ${name.toUpperCase()}.`); });
    (rules.forbid || []).forEach((name) => { if (instructions.includes(name.toLowerCase())) issues.push(`لا تستخدم ${name.toUpperCase()} في هذا السؤال.`); });
    (rules.mustCall || []).forEach((name) => { if (!calls.includes(name.toLowerCase())) issues.push(`الحل يحتاج استدعاء ${name}.`); });
    const codeText = source.split(/\r?\n/).map(cleanLine).join('\n').toLowerCase();
    Object.entries(rules.minUse || {}).forEach(([name, count]) => {
      const used = instructions.filter((item) => item === name.toLowerCase()).length;
      if (used < count) issues.push(`الحل يحتاج استخدام ${name.toUpperCase()} ${count} مرات على الأقل (استخدمتها ${used}).`);
    });
    (rules.mustContain || []).forEach((item) => { if (!codeText.includes(item.text.toLowerCase())) issues.push(item.message || `الحل يحتاج استخدام ${item.text}.`); });
    if (rules.maxInstructions && instructions.length > rules.maxInstructions) issues.push(`عدد التعليمات يتجاوز الحد ${rules.maxInstructions}.`);
    return issues;
  }


  const typeBits = { BYTE: 8, SBYTE: 8, WORD: 16, SWORD: 16, DWORD: 32, SDWORD: 32 };
  function checkDeclarations(question, program) {
    const rows = [];
    Object.entries(question.dataTypes || {}).forEach(([name, type]) => {
      const variable = program.memory[name.toLowerCase()];
      const bits = typeBits[String(type).toUpperCase()];
      rows.push({ label: `نوع ${name}`, expected: `${String(type).toUpperCase()} (${bits}-bit)`, actual: variable ? `${variable.bits}-bit` : 'غير معرّف', ok: Boolean(variable && variable.bits === bits) });
    });
    Object.entries(question.initial || {}).forEach(([name, wanted]) => {
      const variable = program.memory[name.toLowerCase()];
      if (!variable) { rows.push({ label: `القيمة الابتدائية لـ${name}`, expected: 'معرّف في .data', actual: 'غير موجود', ok: false }); return; }
      const values = variable.values;
      if (wanted && typeof wanted === 'object' && !Array.isArray(wanted) && wanted.blank) {
        const ok = values.length === wanted.length && values.every((value) => value === null || Lab.normalize(value, variable.bits) === 0);
        rows.push({ label: `القيمة الابتدائية لـ${name}`, expected: `${wanted.length} عناصر بلا قيم جاهزة (? أو 0)`, actual: `${values.length} عناصر: ${values.map((value) => (value === null ? '?' : Lab.normalize(value, variable.bits))).join(', ')}`, ok });
        return;
      }
      const list = Array.isArray(wanted) ? wanted : [wanted];
      const ok = values.length === list.length && list.every((value, index) => values[index] !== null && Lab.normalize(values[index], variable.bits) === Lab.normalize(value, variable.bits));
      rows.push({ label: `القيمة الابتدائية لـ${name}`, expected: list.join(', '), actual: values.map((value) => (value === null ? '?' : Lab.normalize(value, variable.bits))).join(', '), ok });
    });
    return rows;
  }

  function grade(question, source) {
    const report = { id: question.id, verdict: 'pass', structureErrors: [], syntaxError: '', ruleIssues: [], tests: [], diagnoses: [] };
    report.structureErrors = validateStructure(source, question);
    if (report.structureErrors.length) { report.verdict = 'error'; return report; }
    let program;
    try { program = Lab.parse(source); }
    catch (error) { report.verdict = 'error'; report.syntaxError = error.message; return report; }
    report.ruleIssues = validateRules(question, program, source);
    const declarationRows = checkDeclarations(question, program);
    const cases = question.tests?.length ? question.tests : [{ name: 'تنفيذ البرنامج', expect: {} }];
    report.tests = cases.map((test, index) => {
      const result = Lab.evaluate(source, { input: test.input ?? '', dialogAnswer: test.dialogAnswer });
      const rows = result.error ? [] : compareExpected(test.expect || {}, result.state);
      if (!result.error && !rows.length) rows.push({ label: 'معايير التصحيح', expected: 'حالة سجل أو ذاكرة أو مخرجات محددة', actual: 'لا توجد نتيجة متوقعة لهذا الاختبار', ok: false });
      return { name: test.name || `حالة ${index + 1}`, input: test.input ?? '', error: result.error || '', rows, ok: !result.error && rows.every((row) => row.ok) };
    });
    if (declarationRows.length) report.tests.unshift({ name: 'تعريف البيانات', input: '', error: '', rows: declarationRows, ok: declarationRows.every((row) => row.ok) });
    if (report.tests.some((test) => test.error)) report.verdict = 'error';
    else if (report.tests.some((test) => !test.ok)) report.verdict = 'fail';
    else if (report.ruleIssues.length) report.verdict = 'rule';
    if (report.verdict !== 'pass') {
      const error = report.tests.find((test) => test.error)?.error || '';
      if (/MUL/i.test(source) && /EDX/.test(error)) report.diagnoses.push('ناتج MUL بحجم 64-bit موزع على EDX:EAX.');
      if (/حجم المصدر والوجهة/.test(error) && /mov\s+\w+\s*,\s*(?!offset\b)[a-z_]\w*/i.test(source)) report.diagnoses.push('تأكد هل تحتاج قيمة المتغير أم عنوانه؛ OFFSET يعطي العنوان.');
    }
    return report;
  }

  const verdicts = { pass: 'إجابة صحيحة', fail: 'النتيجة تحتاج مراجعة', error: 'تعذّر إكمال البرنامج', rule: 'النتيجة صحيحة لكن شرط السؤال غير متحقق' };
  function renderReport(report) {
    const content = [`<div class="lab-report lab-report-${escapeHtml(report.verdict)}" role="status"><strong>${verdicts[report.verdict]}</strong>`];
    report.structureErrors.forEach((error) => content.push(`<p>${escapeHtml(error)}</p>`));
    if (report.syntaxError) content.push(`<p>${escapeHtml(report.syntaxError)}</p>`);
    report.ruleIssues.forEach((issue) => content.push(`<p>${escapeHtml(issue)}</p>`));
    report.tests.forEach((test) => {
      content.push(`<h5>${escapeHtml(test.name)}</h5>`);
      if (test.input) content.push(`<p class="lab-input-used">الإدخال المستخدم: <bdi dir="ltr">${escapeHtml(String(test.input).split(/\r?\n/).join(' ، '))}</bdi></p>`);
      if (test.error) { content.push(`<p>${escapeHtml(test.error)}</p>`); return; }
      if (!test.rows.length) { content.push('<p>لم تُعرّف نتيجة متوقعة لهذه الحالة.</p>'); return; }
      content.push(`<table class="lab-diff"><thead><tr><th>العنصر</th><th>المطلوب</th><th>نتيجتك</th></tr></thead><tbody>${test.rows.map((row) => `<tr class="${row.ok ? 'ok' : 'bad'}"><th>${escapeHtml(row.label)}</th><td dir="ltr">${escapeHtml(row.expected)}</td><td dir="ltr">${escapeHtml(row.actual)}</td></tr>`).join('')}</tbody></table>`);
    });
    report.diagnoses.forEach((diagnosis) => content.push(`<p class="lab-diagnosis">تلميح: ${escapeHtml(diagnosis)}</p>`));
    content.push('</div>');
    return content.join('');
  }

  function createSession(question) {
    const record = { attempts: 0, failed: 0, hintsUsed: 0, solutionShown: false };
    return {
      record,
      submit(source) {
        const result = grade(question, source);
        record.attempts += 1;
        if (result.verdict !== 'pass') record.failed += 1;
        return result;
      },
      hint() { const value = (question.hints || [])[record.hintsUsed]; if (value === undefined) return null; record.hintsUsed += 1; return value; },
      canShowSolution() { return record.failed >= 2; },
      solution() { if (!this.canShowSolution()) return null; record.solutionShown = true; return question.solution || null; }
    };
  }

  function fromPractical(lectureId, item, index) {
    const validation = item.validation || {};
    const baseMemory = { ...(validation.memory || {}), ...(validation.memoryArrays || {}) };
    const extra = {
      ...(validation.outputLines ? { outputLines: validation.outputLines } : {}),
      ...(validation.outputNumbers ? { outputNumbers: validation.outputNumbers } : {}),
      ...(validation.anyVariable ? { anyVariable: validation.anyVariable } : {})
    };
    const expected = {
      ...(validation.registers ? { registers: validation.registers } : {}),
      ...(Object.keys(baseMemory).length ? { memory: baseMemory } : {}),
      ...(validation.memoryReads ? { memoryReads: validation.memoryReads } : {}),
      ...(validation.mulInputs ? { mulInputs: validation.mulInputs } : {}),
      ...(validation.outputIncludes ? { outputContains: [validation.outputIncludes] } : {}),
      ...extra
    };
    let tests;
    if (Array.isArray(validation.cases) && validation.cases.length) {
      tests = validation.cases.map((testCase, caseIndex) => {
        const own = testCase.expect || {};
        const { memoryArrays, ...rest } = own;
        const memory = { ...(Object.keys(own.memory || {}).length || memoryArrays ? {} : baseMemory), ...(own.memory || {}), ...(memoryArrays || {}) };
        return {
          name: testCase.name || `حالة ${caseIndex + 1}`,
          input: testCase.input ?? '',
          dialogAnswer: testCase.dialogAnswer ?? 6,
          expect: { ...(validation.memoryReads ? { memoryReads: validation.memoryReads } : {}), ...(validation.mulInputs ? { mulInputs: validation.mulInputs } : {}), ...rest, ...(Object.keys(memory).length ? { memory } : {}) }
        };
      });
    } else {
      const answers = validation.dialogResponses ? [6, 7] : [6];
      tests = answers.map((dialogAnswer) => ({
        name: validation.dialogResponses ? `اختيار ${dialogAnswer === 6 ? 'Yes' : 'No'}` : 'النتيجة المطلوبة',
        input: validation.input ?? '',
        dialogAnswer,
        expect: validation.dialogResponses ? { ...expected, memory: { ...baseMemory, answer: dialogAnswer } } : expected
      }));
    }
    return {
      id: `practical-${lectureId}-${index}`,
      topic: item.title,
      prompt: item.task,
      requireFullProgram: true,
      requireIrvineInclude: true,
      rules: { mustUse: validation.requiredOperations || [], forbid: validation.forbid || [], mustCall: validation.requiredCalls || [], mustContain: validation.requiredText || [], minUse: validation.minUse || {} },
      initial: validation.initial || null,
      dataTypes: validation.dataTypes || null,
      tests,
      hints: item.hints || [],
      solution: item.solution || item.answer || ''
    };
  }

  window.AssemblyGrader = { validateStructure, grade, renderReport, createSession, fromPractical };
})();
