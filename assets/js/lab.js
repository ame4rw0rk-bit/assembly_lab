(function () {
  const registerParts = {
    EAX: { root: 'EAX', bits: 32, shift: 0 }, AX: { root: 'EAX', bits: 16, shift: 0 },
    AH: { root: 'EAX', bits: 8, shift: 8 }, AL: { root: 'EAX', bits: 8, shift: 0 },
    EBX: { root: 'EBX', bits: 32, shift: 0 }, BX: { root: 'EBX', bits: 16, shift: 0 },
    BH: { root: 'EBX', bits: 8, shift: 8 }, BL: { root: 'EBX', bits: 8, shift: 0 },
    ECX: { root: 'ECX', bits: 32, shift: 0 }, CX: { root: 'ECX', bits: 16, shift: 0 },
    CH: { root: 'ECX', bits: 8, shift: 8 }, CL: { root: 'ECX', bits: 8, shift: 0 },
    EDX: { root: 'EDX', bits: 32, shift: 0 }, DX: { root: 'EDX', bits: 16, shift: 0 },
    DH: { root: 'EDX', bits: 8, shift: 8 }, DL: { root: 'EDX', bits: 8, shift: 0 },
    ESI: { root: 'ESI', bits: 32, shift: 0 }, SI: { root: 'ESI', bits: 16, shift: 0 },
    EDI: { root: 'EDI', bits: 32, shift: 0 }, DI: { root: 'EDI', bits: 16, shift: 0 },
    EBP: { root: 'EBP', bits: 32, shift: 0 }, BP: { root: 'EBP', bits: 16, shift: 0 },
    ESP: { root: 'ESP', bits: 32, shift: 0 }, SP: { root: 'ESP', bits: 16, shift: 0 }
  };
  const rootRegisters = ['EAX', 'EBX', 'ECX', 'EDX', 'ESI', 'EDI', 'EBP', 'ESP'];
  const dataSizes = { BYTE: 8, SBYTE: 8, WORD: 16, SWORD: 16, DWORD: 32, SDWORD: 32 };
  function parseNumber(text) {
    const value = text.trim().replace(/_/g, '');
    if (/^-?(?:0x[\da-f]+|[\da-f]+h)$/i.test(value)) {
      const negative = value.startsWith('-');
      const digits = value.replace(/^-/, '').replace(/^0x/i, '').replace(/h$/i, '');
      const number = Number.parseInt(digits, 16);
      if (!Number.isFinite(number)) throw new Error(`قيمة غير مفهومة: ${text}`);
      return negative ? -number : number;
    }
    if (/^-?[01]+b$/i.test(value)) return (value.startsWith('-') ? -1 : 1) * Number.parseInt(value.replace(/^-/, '').slice(0, -1), 2);
    if (/^-?\d+$/.test(value)) return Number.parseInt(value, 10);
    const character = text.trim().match(/^'(.)'$|^"(.)"$/);
    if (character) return (character[1] ?? character[2]).codePointAt(0);
    throw new Error(`قيمة غير مدعومة: ${text}`);
  }

  function stripComment(raw) {
    let quoted = false;
    for (let index = 0; index < raw.length; index += 1) {
      if (raw[index] === '"') quoted = !quoted;
      else if (raw[index] === ';' && !quoted) return raw.slice(0, index);
    }
    return raw;
  }

  function parseProgram(source) {
    const lines = source.split(/\r?\n/);
    const memory = {};
    const instructions = [];
    const labels = {};
    let inData = false;
    let inCode = false;
    let nextAddress = 0x00400000;

    lines.forEach((raw, index) => {
      let line = stripComment(raw).trim();
      if (!line) return;
      if (/^\.data$/i.test(line)) { inData = true; inCode = false; return; }
      if (/^\.code$/i.test(line)) { inData = false; inCode = true; return; }
      if (inData) {
        const declaration = line.match(/^([a-z_]\w*)\s+(s?byte|s?word|s?dword)\s+(.+)$/i);
        if (!declaration) throw new Error(`تعريف بيانات غير مدعوم في السطر ${index + 1}: ${line}`);
        const name = declaration[1].toLowerCase();
        const type = declaration[2].toUpperCase();
        const stringValue = declaration[3].match(/^"([^"]*)"(?:\s*,\s*(.*))?$/);
        const duplicateValue = declaration[3].match(/^(\d+)\s+DUP\((.+)\)$/i);
        let values;
        let text = null;
        if (stringValue) {
          text = stringValue[1];
          values = [...text].map((character) => {
            const code = character.codePointAt(0);
            if (code > 255) throw new Error(`النص في ${name} لازم يكون ASCII ضمن المحاكي.`);
            return code;
          });
          if (stringValue[2]) values.push(...stringValue[2].split(',').map((value) => value.trim() === '?' ? null : parseNumber(value.trim())));
        } else if (duplicateValue) {
          const count = Number(duplicateValue[1]);
          if (!Number.isInteger(count) || count < 1 || count > 4096) throw new Error(`حجم DUP غير مدعوم في ${name}.`);
          const value = duplicateValue[2].trim() === '?' ? null : parseNumber(duplicateValue[2]);
          values = Array(count).fill(value);
        } else {
          const valueTexts = declaration[3].split(',').map((value) => value.trim());
          values = valueTexts.map((value) => value === '?' ? null : parseNumber(value));
        }
        const bits = dataSizes[type];
        if (Object.hasOwn(memory, name)) throw new Error(`المتغير ${declaration[1]} معرّف أكثر من مرة (السطر ${index + 1}).`);
        const isSigned = type.startsWith('S');
        const minimum = -(2 ** (bits - 1));
        const maximum = isSigned ? 2 ** (bits - 1) - 1 : 2 ** bits - 1;
        values.forEach((value) => {
          if (value !== null && (value < minimum || value > maximum)) throw new Error(`القيمة ${value} لا تلائم النوع ${type} في المتغير ${declaration[1]} (السطر ${index + 1}): المدى المسموح ${minimum} إلى ${maximum}.`);
        });
        memory[name] = { name, bits, signed: type.startsWith('S'), values, value: values[0], address: nextAddress, text, nullTerminated: Boolean(stringValue && values.at(-1) === 0) };
        nextAddress += values.length * (bits / 8);
        return;
      }
      if (inCode) {
        const labelMatch = line.match(/^([a-z_@$?][\w@$?]*)\s*:\s*(.*)$/i);
        if (labelMatch) {
          const labelName = labelMatch[1].toLowerCase();
          if (Object.hasOwn(labels, labelName)) throw new Error(`العلامة ${labelMatch[1]} معرّفة أكثر من مرة (السطر ${index + 1}).`);
          labels[labelName] = instructions.length;
          line = labelMatch[2].trim();
          if (!line) return;
        }
      }
      if (!inCode || /^INCLUDE\b/i.test(line) || /^(?:[a-z_]\w*\s+)?(?:PROC|ENDP)\b/i.test(line) || /^END\b/i.test(line)) return;
      instructions.push({ sourceLine: index + 1, text: line });
    });
    return { instructions, memory, labels };
  }

  function mask(bits) { return bits === 32 ? 0xffffffff : (2 ** bits) - 1; }
  function unsigned(value, bits) {
    const integer = Math.trunc(value);
    return bits === 32 ? integer >>> 0 : integer & mask(bits);
  }
  function signed(value, bits) {
    const n = unsigned(value, bits);
    const signBit = 2 ** (bits - 1);
    return n >= signBit ? n - (2 ** bits) : n;
  }
  function hex(value, bits) { return `0x${unsigned(value, bits).toString(16).toUpperCase().padStart(bits / 4, '0')}`; }

  function inputText(state) { return String(state.input ?? '').replace(/\r\n?/g, '\n'); }
  function readLine(state) {
    const text = inputText(state);
    if (state.inputPos >= text.length) return null;
    const end = text.indexOf('\n', state.inputPos);
    const line = end === -1 ? text.slice(state.inputPos) : text.slice(state.inputPos, end);
    state.inputPos = end === -1 ? text.length : end + 1;
    return line;
  }
  function write(state, text) {
    if (state.lineOpen && state.output.length) state.output[state.output.length - 1] += text;
    else { state.output.push(text); state.lineOpen = true; }
  }
  function crlf(state) { if (state.lineOpen) state.lineOpen = false; else state.output.push(''); }
  function block(state, text) { state.lineOpen = false; state.output.push(text); }
  function formatSigned(value) { return (value >= 0 ? '+' : '') + value; }

  function newState(program) {
    const registers = Object.fromEntries(rootRegisters.map((name) => [name, 0]));
    registers.ESP = 0x0019ff00;
    Object.values(program.memory).forEach((item) => {
      item.values = item.values.map((value) => value === null ? null : unsigned(value, item.bits));
      item.value = item.values[0];
    });
    return {
      registers, memory: program.memory, labels: program.labels || {}, stack: [], flags: { CF: 0, OF: 0, SF: 0, ZF: 0 }, mulInputs: [], memoryReads: [],
      flagsNote: 'حالة ابتدائية مبسطة؛ الأعلام الحسابية ستتحدث مع التعليمات.', output: [],
      executedOps: [], executedCalls: [], dialogAnswer: 6, pc: 0, input: '', inputPos: 0,
      interactive: false, pendingDialog: null, pendingInput: null, dialogs: [], lineOpen: false,
      current: 'جاهز للتنفيذ', halted: false, error: ''
    };
  }

  function updateArithmeticFlags(operation, first, second, result, bits, state) {
    const a = unsigned(first, bits), b = unsigned(second, bits), r = unsigned(result, bits);
    const sign = 2 ** (bits - 1);
    const carryMask = mask(bits);
    const aSign = (a & sign) !== 0;
    const bSign = (b & sign) !== 0;
    const resultSign = (r & sign) !== 0;
    state.flags.ZF = r === 0 ? 1 : 0;
    state.flags.SF = resultSign ? 1 : 0;
    if (operation === 'add') {
      state.flags.CF = a + b > carryMask ? 1 : 0;
      state.flags.OF = aSign === bSign && resultSign !== aSign ? 1 : 0;
    } else {
      state.flags.CF = a < b ? 1 : 0;
      state.flags.OF = aSign !== bSign && resultSign !== aSign ? 1 : 0;
    }
    state.flagsNote = 'محاكاة أعلام CF وOF وSF وZF للعمليات الحسابية.';
  }

  function updateIncDecFlags(operation, previous, result, bits, state) {
    const value = unsigned(previous, bits), sign = 2 ** (bits - 1), updated = unsigned(result, bits);
    state.flags.ZF = updated === 0 ? 1 : 0;
    state.flags.SF = (updated & sign) !== 0 ? 1 : 0;
    state.flags.OF = operation === 'inc' ? (value === sign - 1 ? 1 : 0) : (value === sign ? 1 : 0);
    state.flagsNote = 'INC وDEC تحدثان OF وSF وZF، وتتركان CF كما هو.';
  }

  function badOperandMessage(token, opcode) {
    const name = token.trim();
    if (/^(eip|ip)$/i.test(name)) return `لا يمكن استخدام ${name.toUpperCase()} معاملًا في ${opcode.toUpperCase()}؛ هذا السجل يحدد عنوان التعليمة التالية.`;
    if (/^(cs|ds|es|ss|fs|gs)$/i.test(name)) return `سجل المقطع ${name.toUpperCase()} له قيود خاصة ولا يُستخدم هنا في المختبر.`;
    if (/^(OFFSET|LENGTHOF|TYPE|SIZEOF)\s+/i.test(name)) return `المتغير في "${name}" غير معرّف في قسم .data.`;
    if (/^[a-z_]\w*$/i.test(name)) return `الاسم "${name}" غير معرّف: عرّفه في قسم .data أو تأكد من كتابة اسم السجل بصورة صحيحة.`;
    return `المعامل "${name}" غير مدعوم في ${opcode.toUpperCase()}.`;
  }

  function withLine(message, instruction) {
    if (!instruction || /السطر\s*\d+/.test(message)) return message;
    return `${message} (السطر ${instruction.sourceLine})`;
  }

  function operandInfo(token, state) {
    const name = token.trim().toUpperCase();
    if (registerParts[name]) return { kind: 'register', name, bits: registerParts[name].bits };
    const operator = token.trim().match(/^(OFFSET|LENGTHOF|TYPE|SIZEOF)\s+([a-z_]\w*)$/i);
    if (operator) {
      const variable = state.memory[operator[2].toLowerCase()];
      if (!variable) return null;
      const operation = operator[1].toUpperCase();
      const value = operation === 'OFFSET' ? variable.address
        : operation === 'LENGTHOF' ? variable.values.length
          : operation === 'SIZEOF' ? variable.values.length * (variable.bits / 8)
            : variable.bits / 8;
      return { kind: 'immediate', value, bits: null };
    }
    const memoryOperand = token.trim().match(/^([a-z_]\w*)\s*(?:\+\s*(\d+))?$/i);
    if (memoryOperand) {
      const memoryName = memoryOperand[1].toLowerCase();
      const variable = state.memory[memoryName];
      if (variable) {
        const byteOffset = Number(memoryOperand[2] ?? 0);
        const elementBytes = variable.bits / 8;
        const index = byteOffset / elementBytes;
        if (!Number.isInteger(index) || index < 0 || index >= variable.values.length) throw new Error(`الإزاحة في ${token} لا تشير إلى عنصر صالح من المصفوفة.`);
        return { kind: 'memory', name: memoryName, bits: variable.bits, index };
      }
    }
    try { return { kind: 'immediate', value: parseNumber(token), bits: null }; } catch { return null; }
  }

  function readOperand(info, state) {
    if (info.kind === 'immediate') return info.value;
    if (info.kind === 'memory') {
      const index = info.index ?? 0;
      state.memoryReads.push({ name: info.name, index });
      const value = state.memory[info.name].values[index];
      if (value === null) throw new Error(`المتغير ${info.name} غير مهيأ بقيمة؛ عرّف له قيمة قبل قراءته.`);
      return value;
    }
    const part = registerParts[info.name];
    return unsigned(state.registers[part.root] >>> part.shift, part.bits);
  }

  function writeOperand(info, value, state) {
    if (info.kind === 'memory') {
      const index = info.index ?? 0;
      state.memory[info.name].values[index] = unsigned(value, info.bits);
      if (index === 0) state.memory[info.name].value = state.memory[info.name].values[0];
      return;
    }
    if (info.kind !== 'register') throw new Error('لا يمكن وضع النتيجة في قيمة ثابتة.');
    const part = registerParts[info.name];
    if (part.bits === 32) {
      state.registers[part.root] = unsigned(value, 32);
      return;
    }
    const partMask = mask(part.bits) << part.shift;
    const oldValue = state.registers[part.root] >>> 0;
    state.registers[part.root] = unsigned((oldValue & ~partMask) | (unsigned(value, part.bits) << part.shift), 32);
  }

  function dumpMemory(state) {
    const address = state.registers.ESI >>> 0;
    const count = state.registers.ECX >>> 0;
    const elementBytes = state.registers.EBX >>> 0;
    const variables = Object.values(state.memory).sort((first, second) => first.address - second.address);
    const startIndex = variables.findIndex((item) => item.address === address);
    if (startIndex < 0) throw new Error('DumpMem يحتاج ESI أن يشير إلى بداية متغير معروف في البرنامج.');
    const variable = variables[startIndex];
    if (elementBytes !== variable.bits / 8) throw new Error('قيمة EBX لا تطابق حجم عناصر المتغير المعروض.');
    // المتغيرات المتتالية من النوع نفسه تبقى متجاورة في الذاكرة، كما في MASM الحقيقي.
    const values = [];
    let cursor = startIndex;
    let expectedAddress = variable.address;
    while (values.length < count && cursor < variables.length) {
      const current = variables[cursor];
      if (current.bits !== variable.bits || current.address !== expectedAddress) break;
      current.values.forEach((value) => values.push(value));
      expectedAddress = current.address + current.values.length * (current.bits / 8);
      cursor += 1;
    }
    if (!count || count > values.length) throw new Error('قيمة ECX يجب أن تكون عدد عناصر موجودًا في الذاكرة المتتالية بدءًا من ESI.');
    const shown = values.slice(0, count).map((value) => value === null ? '??' : hex(value, variable.bits));
    block(state, `DumpMem ${variable.name} @ ${hex(address, 32)}: ${shown.join('  ')}`);
  }

  function readStringAtAddress(address, state) {
    const variable = Object.values(state.memory).find((item) => item.address === (address >>> 0));
    if (!variable || variable.text === null) throw new Error('الإجراء يحتاج عنوان متغير نصي معروف في البرنامج.');
    if (!variable.nullTerminated) throw new Error(`النص ${variable.name} لازم ينتهي بصفر.`);
    return variable.text;
  }

  function execute(instruction, state) {
    const { sourceLine, text } = instruction;
    const lower = text.toLowerCase();
    state.current = `السطر ${sourceLine}: ${text}`;
    const mnemonic = (lower.match(/^([a-z_]\w*)/) || [])[1];
    if (['mov', 'movsx', 'movzx', 'xchg', 'add', 'sub', 'inc', 'dec', 'mul', 'loop'].includes(mnemonic)) state.executedOps.push(mnemonic);
    if (/^exit\b/.test(lower)) { state.halted = true; return; }
    const call = lower.match(/^call\s+([a-z_]\w*)$/i);
    if (call) state.executedCalls.push(call[1].toLowerCase());
    if (call && call[1].toLowerCase() === 'dumpregs') {
      block(state, `${rootRegisters.map((name) => `${name}=${hex(state.registers[name], 32)}`).join('   ')}   CF=${state.flags.CF} OF=${state.flags.OF} SF=${state.flags.SF} ZF=${state.flags.ZF}`);
      return;
    }
    if (call && call[1].toLowerCase() === 'dumpmem') {
      dumpMemory(state);
      return;
    }
    if (call && call[1].toLowerCase() === 'writeint') {
      write(state, formatSigned(signed(state.registers.EAX, 32)));
      return;
    }
    if (call && call[1].toLowerCase() === 'writedec') {
      write(state, String(unsigned(state.registers.EAX, 32)));
      return;
    }
    if (call && call[1].toLowerCase() === 'writechar') {
      write(state, String.fromCharCode(state.registers.EAX & 0xff));
      return;
    }
    if (call && call[1].toLowerCase() === 'writestring') {
      write(state, readStringAtAddress(state.registers.EDX, state));
      return;
    }
    if (call && call[1].toLowerCase() === 'readchar') {
      const line = readLine(state);
      if (line === null) {
        if (state.interactive) { state.pendingInput = { procedure: 'ReadChar' }; return; }
        throw new Error('ReadChar يحتاج إدخالًا من لوحة المفاتيح.');
      }
      const character = [...line][0] ?? '\0';
      state.registers.EAX = unsigned((state.registers.EAX & 0xffffff00) | (character.codePointAt(0) & 0xff), 32);
      return;
    }
    if (call && ['readdec', 'readint'].includes(call[1].toLowerCase())) {
      const procedure = call[1].toLowerCase();
      const line = readLine(state);
      if (line === null) {
        if (state.interactive) { state.pendingInput = { procedure: procedure === 'readint' ? 'ReadInt' : 'ReadDec' }; return; }
        throw new Error(`${call[1]} يحتاج إدخالًا من لوحة المفاتيح.`);
      }
      const entered = line.trim();
      if (!/^[+-]?\d+$/.test(entered) || (procedure === 'readdec' && entered.startsWith('-'))) {
        throw new Error(`${call[1]} يحتاج إدخالًا ${procedure === 'readdec' ? 'عشريًا غير سالب' : 'صحيحًا'}.`);
      }
      const number = Number(entered);
      const minimum = procedure === 'readint' ? -2147483648 : 0;
      const maximum = procedure === 'readint' ? 2147483647 : 4294967295;
      if (!Number.isSafeInteger(number) || number < minimum || number > maximum) throw new Error('العدد المدخل خارج مجال الإجراء في 32-bit.');
      state.registers.EAX = unsigned(number, 32);
      return;
    }
    if (call && call[1].toLowerCase() === 'readstring') {
      const address = state.registers.EDX >>> 0;
      const variable = Object.values(state.memory).find((item) => item.address === address);
      const maximumCharacters = state.registers.ECX >>> 0;
      if (!variable || variable.bits !== 8 || !maximumCharacters || maximumCharacters >= variable.values.length) {
        throw new Error('ReadString يحتاج EDX إلى مخزن BYTE معروف، وECX إلى حد أحرف أصغر من حجم المخزن لترك مكان لصفر النهاية.');
      }
      const line = readLine(state);
      if (line === null) {
        if (state.interactive) { state.pendingInput = { procedure: 'ReadString', maximumCharacters }; return; }
        throw new Error('ReadString يحتاج إدخالًا من لوحة المفاتيح.');
      }
      const characters = [...line].slice(0, maximumCharacters);
      variable.values = Array(variable.values.length).fill(0);
      characters.forEach((character, index) => { variable.values[index] = character.codePointAt(0) & 0xff; });
      variable.value = variable.values[0];
      variable.text = characters.map((character) => String.fromCharCode(character.codePointAt(0) & 0xff)).join('');
      variable.nullTerminated = true;
      state.registers.EAX = characters.length;
      return;
    }
    if (call && call[1].toLowerCase() === 'crlf') {
      crlf(state);
      return;
    }
    if (call && (call[1].toLowerCase() === 'msgbox' || call[1].toLowerCase() === 'msgboxask')) {
      const message = readStringAtAddress(state.registers.EDX, state);
      const title = state.registers.EBX === 0 ? '' : readStringAtAddress(state.registers.EBX, state);
      const procedure = call[1].toLowerCase();
      if (state.interactive) {
        state.pendingDialog = { procedure, title, message };
      } else if (procedure === 'msgboxask') {
        state.registers.EAX = state.dialogAnswer === 7 ? 7 : 6;
        state.dialogs.push({ procedure, title, message, answer: state.registers.EAX });
      } else {
        state.dialogs.push({ procedure, title, message, answer: 1 });
      }
      return;
    }
    if (call) throw new Error(`الإجراء ${call[1]} غير مدعوم في المختبر حاليًا.`);

    const loopMatch = text.match(/^loop\s+([a-z_@$?][\w@$?]*)$/i);
    if (loopMatch) {
      const target = state.labels[loopMatch[1].toLowerCase()];
      if (target === undefined) throw new Error(`العلامة ${loopMatch[1]} غير معرّفة في البرنامج.`);
      state.registers.ECX = unsigned((state.registers.ECX >>> 0) - 1, 32);
      if (state.registers.ECX !== 0) state.pc = target - 1;
      return;
    }
    if (/^loop\b/i.test(text)) throw new Error('صيغة LOOP: loop اسم_العلامة');

    const unary = text.match(/^(inc|dec|mul)\s+(.+)$/i);
    if (unary) {
      const opcode = unary[1].toLowerCase();
      const operand = operandInfo(unary[2], state);
      if (!operand || operand.kind === 'immediate') throw new Error(`${opcode.toUpperCase()} تحتاج سجلًا أو متغيرًا كمصدر.`);
      const value = readOperand(operand, state);
      if (opcode === 'mul') {
        const accumulator = operand.bits === 8 ? { kind: 'register', name: 'AL', bits: 8 }
          : operand.bits === 16 ? { kind: 'register', name: 'AX', bits: 16 }
            : { kind: 'register', name: 'EAX', bits: 32 };
        const accumulatorValue = readOperand(accumulator, state);
        state.mulInputs.push({ accumulator: accumulator.name, operand: unary[2].trim().toUpperCase(), accumulatorValue, operandValue: value });
        const result = BigInt(accumulatorValue) * BigInt(value);
        if (operand.bits === 8) {
          writeOperand({ kind: 'register', name: 'AX', bits: 16 }, Number(result & 0xffffn), state);
          state.flags.CF = result > 0xffn ? 1 : 0;
          state.flags.OF = state.flags.CF;
        } else if (operand.bits === 16) {
          writeOperand({ kind: 'register', name: 'AX', bits: 16 }, Number(result & 0xffffn), state);
          writeOperand({ kind: 'register', name: 'DX', bits: 16 }, Number((result >> 16n) & 0xffffn), state);
          state.flags.CF = result > 0xffffn ? 1 : 0;
          state.flags.OF = state.flags.CF;
        } else {
          writeOperand({ kind: 'register', name: 'EAX', bits: 32 }, Number(result & 0xffffffffn), state);
          writeOperand({ kind: 'register', name: 'EDX', bits: 32 }, Number((result >> 32n) & 0xffffffffn), state);
          state.flags.CF = state.flags.OF = (state.registers.EDX !== 0 ? 1 : 0);
        }
        state.flags.SF = null;
        state.flags.ZF = null;
        state.flagsNote = 'MUL غير الموقّعة: CF وOF يبيّنان إن كان الجزء الأعلى من الناتج غير صفر.';
        return;
      }
      const next = unsigned(value + (opcode === 'inc' ? 1 : -1), operand.bits);
      writeOperand(operand, next, state);
      updateIncDecFlags(opcode, value, next, operand.bits, state);
      return;
    }

    const parts = text.match(/^(movsx|movzx|mov|xchg|add|sub)\s+([^,]+),\s*(.+)$/i);
    if (!parts) throw new Error(`تعليمة غير مدعومة في السطر ${sourceLine}: ${text}`);
    const opcode = parts[1].toLowerCase();
    const destination = operandInfo(parts[2], state);
    const source = operandInfo(parts[3], state);
    if (!destination || !source) throw new Error(badOperandMessage(!destination ? parts[2] : parts[3], opcode));

    if (opcode === 'mov') {
      if (destination.kind === 'immediate') throw new Error('الوجهة لا يمكن أن تكون قيمة ثابتة.');
      if (destination.kind === 'memory' && source.kind === 'memory') throw new Error('MOV لا تنقل مباشرةً بين موقعي ذاكرة؛ استخدم سجلًا وسيطًا.');
      if (source.kind !== 'immediate' && destination.bits !== source.bits) throw new Error('حجم المصدر والوجهة لازم يكون متوافقًا في MOV.');
      if (source.kind === 'immediate') {
        const min = -(2 ** (destination.bits - 1));
        const max = mask(destination.bits);
        if (source.value < min || source.value > max) throw new Error('القيمة الثابتة لا تلائم حجم الوجهة.');
      }
      writeOperand(destination, readOperand(source, state), state);
      return;
    }

    if (opcode === 'add' || opcode === 'sub') {
      if (destination.kind === 'immediate') throw new Error('الوجهة لا يمكن أن تكون قيمة ثابتة.');
      if (destination.kind === 'memory' && source.kind === 'memory') throw new Error('العملية لا تعمل مباشرةً بين موقعي ذاكرة؛ استخدم سجلًا وسيطًا.');
      if (source.kind !== 'immediate' && destination.bits !== source.bits) throw new Error('حجم المصدر والوجهة لازم يكون متوافقًا.');
      const first = readOperand(destination, state);
      const second = unsigned(readOperand(source, state), destination.bits);
      const result = unsigned(opcode === 'add' ? first + second : first - second, destination.bits);
      writeOperand(destination, result, state);
      updateArithmeticFlags(opcode, first, second, result, destination.bits, state);
      return;
    }

    if (opcode === 'movsx' || opcode === 'movzx') {
      if (destination.kind !== 'register' || source.kind === 'immediate') throw new Error(`${opcode.toUpperCase()} تحتاج سجلًا كوجهة وسجلًا أو متغيرًا كمصدر.`);
      if (destination.bits <= source.bits) throw new Error('حجم وجهة التوسيع لازم يكون أكبر من حجم المصدر.');
      const raw = readOperand(source, state);
      const value = opcode === 'movsx' ? signed(raw, source.bits) : unsigned(raw, source.bits);
      writeOperand(destination, value, state);
      return;
    }

    if (opcode === 'xchg') {
      if (destination.kind === 'immediate' || source.kind === 'immediate') throw new Error('XCHG لا تبدّل قيمة ثابتة.');
      if (destination.kind === 'memory' && source.kind === 'memory') throw new Error('XCHG تحتاج سجلًا عند تبديل قيمة ذاكرة.');
      if (destination.bits !== source.bits) throw new Error('حجم طرفي XCHG لازم يكون متساويًا.');
      const first = readOperand(destination, state);
      const second = readOperand(source, state);
      writeOperand(destination, second, state);
      writeOperand(source, first, state);
    }
  }

  function createLabMarkup(code) {
    return `
      <section class="assembly-lab" aria-labelledby="lab-title">
        <div class="lab-heading">
          <div><span class="lab-kicker">مختبر المحاضرة</span><h3 id="lab-title">جرّب التعليمات بنفسك</h3><p>اكتب البرنامج وشغّله دفعة واحدة أو خطوة خطوة لمتابعة تغيّر الحالة.</p></div>
          <span class="lab-scope">يدعم MOV وADD وSUB وINC وDEC وMUL وLOOP مع العلامات والوصول المباشر للمصفوفات وإجراءات Irvine32 المستخدمة هنا</span>
        </div>
        <label class="lab-editor-label" for="lab-editor">كود MASM</label>
        <textarea class="lab-editor" id="lab-editor" dir="ltr" spellcheck="false" autocapitalize="off">${code}</textarea>
        <div class="lab-actions">
          <button type="button" class="button button-primary" data-lab-action="run">تشغيل الكل</button>
          <button type="button" class="button button-outline" data-lab-action="step">الخطوة التالية</button>
          <button type="button" class="button button-outline" data-lab-action="reset">إعادة ضبط</button>
        </div>
        <dialog class="lab-runtime-dialog" data-runtime-dialog aria-labelledby="runtime-dialog-title">
          <div data-dialog-message hidden><h4 id="runtime-dialog-title" data-runtime-title></h4><p data-runtime-message></p><div class="lab-runtime-actions"><button type="button" class="button button-primary" data-dialog-ok>موافق</button><button type="button" class="button button-primary" data-dialog-yes>نعم</button><button type="button" class="button button-outline" data-dialog-no>لا</button></div></div>
          <form data-dialog-input-form hidden><h4 id="runtime-input-title">إدخال البرنامج</h4><label data-runtime-input-label for="runtime-input"></label><input id="runtime-input" data-runtime-input type="text" autocomplete="off"><p class="lab-runtime-error" data-runtime-error aria-live="polite"></p><div class="lab-runtime-actions"><button type="submit" class="button button-primary">إرسال</button><button type="button" class="button button-outline" data-dialog-cancel>إلغاء</button></div></form>
        </dialog>
        <p class="lab-status" role="status" aria-live="polite">جاهز للتنفيذ.</p>
        <div class="lab-current"><span>التعليمة الحالية</span><code data-lab-current>لم يبدأ التنفيذ</code></div>
        <div class="lab-state-grid">
          <section class="lab-state-card"><h4>السجلات</h4><div class="lab-registers" data-lab-registers></div></section>
          <section class="lab-state-card"><h4>الذاكرة</h4><div class="lab-memory" data-lab-memory>ماكو متغيرات معرّفة.</div></section>
          <section class="lab-state-card"><h4>المكدس Stack</h4><div class="lab-memory" data-lab-stack>فارغ — تعليمات هذه المحاكاة ما تغيّر المكدس.</div></section>
          <section class="lab-state-card"><h4>الأعلام EFLAGS</h4><div class="lab-memory" data-lab-flags>لم تتغير بعد.</div></section>
          <section class="lab-state-card lab-output-card"><h4>مخرجات Irvine32</h4><pre data-lab-output>لا توجد مخرجات بعد.</pre></section>
        </div>
        <p class="lab-disclaimer">هذا مختبر تعليمي محدود بالتعليمات والإجراءات المذكورة أعلاه، وليس مترجم MASM كاملًا. أي تعليمة غير مدعومة ستظهر برسالة واضحة.</p>
      </section>`;
  }

  function initializeLab(container, code) {
    container.innerHTML = createLabMarkup(code);
    const editor = container.querySelector('#lab-editor');
    const status = container.querySelector('.lab-status');
    const current = container.querySelector('[data-lab-current]');
    const registersView = container.querySelector('[data-lab-registers]');
    const memoryView = container.querySelector('[data-lab-memory]');
    const stackView = container.querySelector('[data-lab-stack]');
    const flagsView = container.querySelector('[data-lab-flags]');
    const outputView = container.querySelector('[data-lab-output]');
    const runtimeDialog = container.querySelector('[data-runtime-dialog]');
    let program;
    let state;
    let dirty = false;
    let autoRun = false;
    let runSteps = 0;
    let previousSnapshot = null;

    function draw() {
      const prior = previousSnapshot;
      const snapshot = {
        registers: { ...state.registers },
        memory: Object.fromEntries(Object.entries(state.memory).map(([name, item]) => [name, [...item.values]])),
        stack: [...state.stack]
      };
      registersView.innerHTML = rootRegisters.map((name) => {
        const changed = prior && prior.registers[name] !== snapshot.registers[name];
        return `<div class="lab-register"><span>${name}</span><code class="lab-value${changed ? ' lab-value-changed' : ''}">${hex(state.registers[name], 32)}</code></div>`;
      }).join('');
      const memoryEntries = Object.entries(state.memory);
      memoryView.innerHTML = memoryEntries.length ? memoryEntries.map(([name, value]) => `<div class="lab-memory-row"><span>${name} · ${value.bits}-bit × ${value.values.length} · ${hex(value.address, 32)}</span><code>${value.values.map((item, index) => {
        const changed = prior && prior.memory[name]?.[index] !== snapshot.memory[name]?.[index];
        return `<span class="lab-value${changed ? ' lab-value-changed' : ''}">${item === null ? '??' : hex(item, value.bits)}</span>`;
      }).join(' ')}</code></div>`).join('') : 'ماكو متغيرات معرّفة.';
      stackView.innerHTML = state.stack.length ? state.stack.map((value, index) => {
        const changed = prior && prior.stack[index] !== snapshot.stack[index];
        return `<span class="lab-stack-value${changed ? ' lab-value-changed' : ''}">${hex(value, 32)}</span>`;
      }).join(' · ') : 'فارغ — تعليمات هذه المحاكاة ما تغيّر المكدس.';
      flagsView.innerHTML = `<div class="lab-flags-grid">${Object.entries(state.flags).map(([name, value]) => `<div><span>${name}</span><b>${value ?? '—'}</b></div>`).join('')}</div><small>${state.flagsNote}</small>`;
      outputView.textContent = state.output.length ? state.output.join('\n') : 'لا توجد مخرجات بعد.';
      current.textContent = state.current;
      status.textContent = state.error || (state.pendingDialog ? 'التنفيذ متوقف بانتظار اختيارك.' : state.pendingInput ? 'التنفيذ متوقف بانتظار إدخالك.' : state.halted ? 'انتهى تنفيذ البرنامج.' : state.pc === 0 ? 'جاهز للتنفيذ.' : 'التنفيذ متوقف بعد آخر خطوة.');
      status.classList.toggle('error', Boolean(state.error));
      previousSnapshot = snapshot;
    }

    function reset() {
      autoRun = false;
      runSteps = 0;
      if (runtimeDialog.open) runtimeDialog.close();
      previousSnapshot = null;
      try {
        program = parseProgram(editor.value);
        state = newState(program);
        state.input = '';
        state.inputPos = 0;
        state.interactive = true;
        dirty = false;
        draw();
      } catch (error) {
        state = newState({ memory: {}, instructions: [] });
        state.error = error.message;
        draw();
      }
    }

    function openPendingInteraction() {
      if (state.pendingDialog) {
        const pending = state.pendingDialog;
        const messageView = runtimeDialog.querySelector('[data-dialog-message]');
        const inputForm = runtimeDialog.querySelector('[data-dialog-input-form]');
        messageView.hidden = false;
        inputForm.hidden = true;
        runtimeDialog.setAttribute('aria-labelledby', 'runtime-dialog-title');
        runtimeDialog.querySelector('[data-runtime-title]').textContent = pending.title || (pending.procedure === 'msgboxask' ? 'تأكيد' : 'رسالة البرنامج');
        runtimeDialog.querySelector('[data-runtime-message]').textContent = pending.message;
        const isAsk = pending.procedure === 'msgboxask';
        runtimeDialog.querySelector('[data-dialog-ok]').hidden = isAsk;
        runtimeDialog.querySelector('[data-dialog-yes]').hidden = !isAsk;
        runtimeDialog.querySelector('[data-dialog-no]').hidden = !isAsk;
        runtimeDialog.showModal();
        (isAsk ? runtimeDialog.querySelector('[data-dialog-yes]') : runtimeDialog.querySelector('[data-dialog-ok]')).focus();
        return;
      }
      if (state.pendingInput) {
        const pending = state.pendingInput;
        const messageView = runtimeDialog.querySelector('[data-dialog-message]');
        const inputForm = runtimeDialog.querySelector('[data-dialog-input-form]');
        messageView.hidden = true;
        inputForm.hidden = false;
        runtimeDialog.setAttribute('aria-labelledby', 'runtime-input-title');
        runtimeDialog.querySelector('[data-runtime-input-label]').textContent = pending.procedure === 'ReadString'
          ? `أدخل نصًا (حد أقصى ${pending.maximumCharacters} حرفًا)`
          : pending.procedure === 'ReadChar' ? 'أدخل حرفًا واحدًا' : `أدخل قيمة لـ ${pending.procedure}`;
        const field = runtimeDialog.querySelector('[data-runtime-input]');
        field.value = '';
        field.maxLength = pending.procedure === 'ReadString' ? pending.maximumCharacters : pending.procedure === 'ReadChar' ? 1 : 64;
        field.inputMode = ['ReadInt', 'ReadDec'].includes(pending.procedure) ? 'numeric' : 'text';
        runtimeDialog.querySelector('[data-runtime-error]').textContent = '';
        runtimeDialog.showModal();
        field.focus();
      }
    }

    function advance() {
      if (dirty) reset();
      if (state.error || state.halted || state.pendingDialog || state.pendingInput) return false;
      if (state.pc >= program.instructions.length) {
        state.halted = true;
        state.current = 'اكتمل البرنامج.';
        draw();
        return false;
      }
      try {
        execute(program.instructions[state.pc], state);
        if (state.pendingDialog || state.pendingInput) {
          draw();
          openPendingInteraction();
          return false;
        }
        state.pc += 1;
        runSteps += 1;
      } catch (error) {
        state.error = withLine(error.message, program.instructions[state.pc]);
      }
      draw();
      return !state.error && !state.halted;
    }

    function continueRun() {
      while (!state.error && !state.halted && !state.pendingDialog && !state.pendingInput && runSteps < 20000) {
        if (!advance()) break;
      }
      if (runSteps >= 20000 && !state.error && !state.halted && !state.pendingDialog && !state.pendingInput) {
        state.error = 'تجاوز البرنامج حد 20000 خطوة؛ أوقفناه لاحتمال وجود حلقة لا تنتهي. تأكد أن ECX يبدأ بقيمة أكبر من صفر وأنك لا تعيد تعيينه داخل الحلقة.';
      }
      if (!state.pendingDialog && !state.pendingInput) autoRun = false;
      draw();
    }

    function step() { autoRun = false; advance(); }

    container.querySelector('[data-lab-action="run"]').addEventListener('click', () => {
      if (dirty || (state.pc === 0 && !state.error)) reset();
      autoRun = true;
      continueRun();
    });
    container.querySelector('[data-lab-action="step"]').addEventListener('click', step);
    container.querySelector('[data-lab-action="reset"]').addEventListener('click', reset);
    function resolveDialog(answer) {
      const pending = state.pendingDialog;
      if (!pending) return;
      if (pending.procedure === 'msgboxask') {
        state.registers.EAX = answer === 7 ? 7 : 6;
        state.dialogs.push({ ...pending, answer: state.registers.EAX });
      } else {
        state.dialogs.push({ ...pending, answer: 1 });
      }
      state.pendingDialog = null;
      state.pc += 1;
      runSteps += 1;
      runtimeDialog.close();
      draw();
      if (autoRun) continueRun();
    }

    runtimeDialog.querySelector('[data-dialog-ok]').addEventListener('click', () => resolveDialog(1));
    runtimeDialog.querySelector('[data-dialog-yes]').addEventListener('click', () => resolveDialog(6));
    runtimeDialog.querySelector('[data-dialog-no]').addEventListener('click', () => resolveDialog(7));
    runtimeDialog.addEventListener('cancel', (event) => event.preventDefault());
    runtimeDialog.querySelector('[data-dialog-input-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const pending = state.pendingInput;
      const field = runtimeDialog.querySelector('[data-runtime-input]');
      const message = runtimeDialog.querySelector('[data-runtime-error]');
      const value = field.value;
      if (pending.procedure === 'ReadChar' && !value.length) { message.textContent = 'أدخل حرفًا للمتابعة.'; field.focus(); return; }
      if (['ReadInt', 'ReadDec'].includes(pending.procedure)) {
        const number = Number(value);
        const validFormat = /^[+-]?\d+$/.test(value) && !(pending.procedure === 'ReadDec' && value.startsWith('-'));
        const min = pending.procedure === 'ReadInt' ? -2147483648 : 0;
        const max = pending.procedure === 'ReadInt' ? 2147483647 : 4294967295;
        if (!validFormat || !Number.isSafeInteger(number) || number < min || number > max) {
          message.textContent = `${pending.procedure} يحتاج عددًا صحيحًا ضمن مجال 32-bit.`;
          field.focus();
          return;
        }
      }
      state.input += `${value}\n`;
      state.pendingInput = null;
      runtimeDialog.close();
      advance();
      if (autoRun) continueRun();
    });
    runtimeDialog.querySelector('[data-dialog-cancel]').addEventListener('click', () => {
      state.pendingInput = null;
      state.error = 'أُلغي إدخال البرنامج؛ أعد التشغيل للبدء من جديد.';
      autoRun = false;
      runtimeDialog.close();
      draw();
    });
    editor.addEventListener('input', () => {
      dirty = true;
      previousSnapshot = null;
      state = newState({ memory: {}, instructions: [] });
      state.current = 'تغيّر الكود — اضغط إعادة ضبط لبدء التنفيذ.';
      state.error = '';
      draw();
    });
    reset();
  }

  function evaluate(source, options = {}) {
    let state;
    let current = null;
    try {
      const program = parseProgram(source);
      state = newState(program);
      state.dialogAnswer = options.dialogAnswer === 7 ? 7 : 6;
      state.input = options.input ?? 'Noor';
      state.inputPos = 0;
      let steps = 0;
      while (!state.error && !state.halted && state.pc < program.instructions.length && steps < 20000) {
        current = program.instructions[state.pc];
        execute(current, state);
        state.pc += 1;
        steps += 1;
      }
      if (!state.error && !state.halted && state.pc >= program.instructions.length) state.halted = true;
      if (!state.error && !state.halted) state.error = 'تجاوز البرنامج حد الخطوات؛ يبدو أن هناك حلقة لا تنتهي.';
    } catch (error) {
      state = newState({ memory: {}, instructions: [] });
      state.error = withLine(error.message, current);
    }
    return { state, error: state.error };
  }

  function readRegister(state, name) {
    const part = registerParts[String(name).toUpperCase()];
    if (!part) return null;
    return { root: part.root, bits: part.bits, value: unsigned(state.registers[part.root] >>> part.shift, part.bits) };
  }
  function screenText(state) { return state.output.join('\n'); }

  window.AssemblyLab = { initialize: initializeLab, evaluate, parse: parseProgram, readRegister, normalize: unsigned, screenText };
})();
