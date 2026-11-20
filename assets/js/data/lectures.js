window.AssemblyLectureData = [
  {
    id: 'data-transfer',
    number: '02',
    title: 'Data Transfer Instructions',
    arabicTitle: 'تعليمات نقل البيانات',
    description: 'تعليمات MOV وMOVSX وMOVZX وXCHG، مع هيكل البرنامج وقواعد نقل البيانات.',
    pdf: 'assets/pdfs/data-transfer-explained.pdf',
    theory: [
      {
        prompt: 'ما الذي يحدث لقيمة المصدر بعد تنفيذ MOV؟',
        options: ['تبقى كما هي؛ لأن MOV تنسخ القيمة', 'تُمسح دائمًا من المصدر', 'تنتقل إلى المكدس تلقائيًا'],
        answer: 0,
        explanation: 'MOV تنسخ القيمة إلى الوجهة ولا تمسحها من المصدر.'
      },
      {
        prompt: 'أي تعليمة تحافظ على إشارة العدد عند توسيعه؟',
        options: ['MOVZX', 'MOVSX', 'XCHG'],
        answer: 1,
        explanation: 'MOVSX تمدد بت الإشارة، لذلك تحافظ على معنى القيمة الموقعة.'
      },
      {
        prompt: 'ما نتيجة XCHG بين EAX وEBX؟',
        options: ['نسخ EBX إلى EAX فقط', 'تصفير السجلين', 'تبديل القيمتين بين السجلين'],
        answer: 2,
        explanation: 'XCHG تستبدل قيمة كل طرف بقيمة الطرف الآخر.'
      }
    ],
    practical: [
      {
        title: 'اكتب تعليمة التبديل',
        task: 'اكتب تعليمة MASM واحدة تبدّل محتوى السجل EAX مع محتوى السجل EBX من دون استخدام سجل ثالث.',
        answerType: 'code',
        placeholder: 'XCHG ...',
        accepted: ['xchg eax,ebx', 'xchg ebx,eax'],
        answer: 'XCHG EAX, EBX. تبدّل التعليمة القيمتين بين طرفيها في خطوة واحدة، ولا تحتاج إلى سجل وسيط.'
      },
      {
        title: 'تتبّع سلسلة تعليمات MOV',
        task: 'قبل التنفيذ EAX = 7 وEBX = 9 وECX = 0. نُفّذت التعليمات الآتية بالترتيب: mov ecx, eax ثم mov eax, ebx ثم mov ebx, ecx. اكتب القيم النهائية بالصيغة: EAX=... ، EBX=... ، ECX=...',
        answerType: 'registers',
        placeholder: 'EAX=... ، EBX=... ، ECX=...',
        expected: { EAX: '9', EBX: '7', ECX: '7' },
        answer: 'بعد الأولى ECX=7 (نسخة من EAX). بعد الثانية EAX=9 (نسخة من EBX). بعد الثالثة EBX=7 (نسخة من ECX). فتصبح القيم EAX=9 وEBX=7 وECX=7؛ لأن MOV تنسخ ولا تمسح المصدر، وهكذا بدّلنا EAX وEBX بمساعدة ECX.'
      },
      {
        title: 'احسب نتيجة MOVSX',
        task: 'القيمة الموجودة في السجل AL هي FBh. بعد تنفيذ movsx ecx, al اكتب قيمة ECX بالنظام الست عشري (Hex).',
        answerType: 'hex',
        placeholder: 'مثال: FFFFFFFF',
        accepted: ['FFFFFFFB', '0XFFFFFFFB', 'FFFFFFFBH'],
        answer: 'FBh تساوي 11111011 بالثنائي، وبت الإشارة فيها 1 (أي أنها -5). يمدد MOVSX هذا البت إلى كل الخانات العليا فتصبح ECX = FFFFFFFBh وتبقى القيمة -5.'
      },
      {
        title: 'دوّر قيم ثلاثة سجلات باستخدام XCHG',
        task: 'اكتب برنامج MASM كاملًا يضع القيم 10 و20 و30 في EAX وEBX وECX على الترتيب، ثم يعيد ترتيبها بحيث تصبح EAX=30 وEBX=10 وECX=20، ويعرض السجلات باستخدام DumpRegs. استخدم XCHG مرتين فقط ولا تستخدم سجلًا رابعًا. فكّر في ترتيب التبديلين.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredOperations: ['xchg'], minUse: { xchg: 2 }, requiredCalls: ['dumpregs'], registers: { EAX: 30, EBX: 10, ECX: 20 } },
        answer: 'تبديل واحد بين سجلين لا يكفي لثلاثة سجلات. بدّل EAX مع ECX أولًا فتصبح EAX=30 وECX=10، ثم بدّل EBX مع ECX فتصبح EBX=10 وECX=20.',
        solution: `INCLUDE Irvine32.inc

.code
main PROC
    mov eax, 10
    mov ebx, 20
    mov ecx, 30
    xchg eax, ecx
    xchg ebx, ecx
    call DumpRegs
    exit
main ENDP
END main`
      },
      {
        title: 'وسّع بايتًا موقّعًا وغير موقّع',
        task: 'اكتب برنامجًا كاملًا يضع القيمة F0h في السجل BL. ثم ضع في EAX نسخة 32-bit من BL تعاملها كعدد غير موقّع (القيمة 240)، وضع في ECX نسخة 32-bit تعاملها كعدد موقّع (القيمة -16). اعرض السجلات باستخدام DumpRegs.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredOperations: ['movzx', 'movsx'], requiredCalls: ['dumpregs'], registers: { BL: 240, EAX: 240, ECX: -16 } },
        answer: 'البتات نفسها (11110000) تُفسَّر بطريقتين. للعدد غير الموقّع استخدم MOVZX ليملأ الخانات العليا بأصفار، وللموقّع استخدم MOVSX ليكرر بت الإشارة فتصبح القيمة -16.',
        solution: `INCLUDE Irvine32.inc

.code
main PROC
    mov bl, 0F0h
    movzx eax, bl
    movsx ecx, bl
    call DumpRegs
    exit
main ENDP
END main`
      },
      {
        title: 'ركّب قيمة من أجزاء السجل',
        task: 'اكتب برنامجًا كاملًا يصفّر EAX أولًا، ثم يضع القيمة 12h في AH والقيمة 34h في AL، ثم يعرض السجلات باستخدام DumpRegs. بعد التنفيذ يجب أن يحتوي EAX على 00001234h. استخدم السجلين AH وAL فقط لوضع القيمتين.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredCalls: ['dumpregs'], requiredText: [{ text: 'mov ah', message: 'ضع القيمة الأولى في السجل AH.' }, { text: 'mov al', message: 'ضع القيمة الثانية في السجل AL.' }], registers: { EAX: 4660, AH: 18, AL: 52 } },
        answer: 'AH هو البايت الأعلى من AX وAL هو البايت الأدنى. لذلك AH=12h وAL=34h يعطيان AX=1234h، وإذا كان EAX مصفّرًا قبلها يصبح EAX=00001234h.',
        solution: `INCLUDE Irvine32.inc

.code
main PROC
    mov eax, 0
    mov ah, 12h
    mov al, 34h
    call DumpRegs
    exit
main ENDP
END main`
      },
      {
        title: 'انقل قيمة 16-bit إلى سجل 32-bit',
        task: 'اكتب برنامجًا كاملًا يضع القيمة 456h في السجل DX، ثم ينسخها إلى السجل EBX بحيث تبقى قيمتها 456h كاملة في EBX. اعرض السجلات باستخدام DumpRegs. تذكّر أن MOV تحتاج إلى سجلين متساويي الحجم.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredOperations: ['movzx'], requiredCalls: ['dumpregs'], registers: { DX: 1110, EBX: 1110 } },
        answer: 'لا يمكن كتابة mov ebx, dx لأن الحجمين مختلفان. استخدم MOVZX لأن 456h قيمة غير موقّعة، فتُملأ الخانات العليا من EBX بأصفار.',
        solution: `INCLUDE Irvine32.inc

.code
main PROC
    mov dx, 456h
    movzx ebx, dx
    call DumpRegs
    exit
main ENDP
END main`
      }
    ],
    labCode: `INCLUDE Irvine32.inc

.code
main PROC
    mov eax, 7
    mov ebx, 9
    xchg eax, ebx
    mov al, 0FBh
    movsx ecx, al
    call DumpRegs
    exit
main ENDP
END main`
  },
  {
    id: 'variables-memory',
    number: '03',
    title: 'Variables and Memory',
    arabicTitle: 'المتغيرات وعرض محتوى الذاكرة',
    description: 'تعريف المتغيرات في .data، أحجام BYTE وWORD وDWORD، ومعاملات OFFSET وLENGTHOF وTYPE، وفحص الذاكرة باستخدام DumpMem.',
    pdf: 'assets/pdfs/variables-memory-explained.pdf',
    theory: [
      {
        prompt: 'ماذا تعطي OFFSET values عند استخدامها في تعليمة MOV؟',
        options: ['عنوان بداية المتغير أو المجموعة في الذاكرة', 'عدد عناصر المجموعة', 'حجم العنصر الواحد بالبايت'],
        answer: 0,
        explanation: 'OFFSET تعطي عنوان البيانات في الذاكرة، ولا تعطي القيمة المخزنة فيها.'
      },
      {
        prompt: 'إذا عرّفنا items WORD 10, 20, 30، فما ناتج LENGTHOF وTYPE؟',
        options: ['LENGTHOF = 2 وTYPE = 3', 'LENGTHOF = 3 وTYPE = 2', 'LENGTHOF = 6 وTYPE = 3'],
        answer: 1,
        explanation: 'هناك ثلاثة عناصر، وكل عنصر WORD حجمه بايتان؛ لذلك LENGTHOF تساوي 3 وTYPE تساوي 2.'
      },
      {
        prompt: 'ماذا تعني علامة ? عند تعريف متغير في .data؟',
        options: ['أن المتغير يبدأ حتمًا بصفر', 'أن المتغير لا يحتاج مساحة', 'أن المساحة محجوزة لكن القيمة الابتدائية غير محددة'],
        answer: 2,
        explanation: 'علامة ? تحجز مساحة للمتغير من دون إعطائه قيمة ابتدائية محددة؛ لذا لا نفترض أنه يساوي صفرًا.'
      }
    ],
    practical: [
      {
        title: 'بدّل محتوى متغيرين من نوع WORD',
        task: 'اكتب برنامج MASM كاملًا يعرّف متغيرين من نوع WORD باسمي first وsecond: الأول قيمته 6 والثاني قيمته 8. بدّل محتواهما من دون استخدام XCHG، ثم اعرض المتغيرين باستخدام DumpMem.',
        answerType: 'program',
        placeholder: 'اكتب البرنامج كاملًا: INCLUDE و.data و.code وmain PROC…',
        validation: { requiredOperations: ['mov'], requiredCalls: ['dumpmem'], forbid: ['xchg'], initial: { first: 6, second: 8 }, dataTypes: { first: 'WORD', second: 'WORD' }, memory: { first: 8, second: 6 } },
        answer: 'استخدم AX وBX كسجلين وسيطين حتى لا تنقل مباشرةً من موقع ذاكرة إلى موقع ذاكرة. بعد التبديل اعرض عنصرين WORD ابتداءً من first.',
        solution: `INCLUDE Irvine32.inc

.data
first  WORD 6
second WORD 8

.code
main PROC
    mov ax, first
    mov bx, second
    mov first, bx
    mov second, ax

    mov esi, OFFSET first
    mov ecx, 2
    mov ebx, TYPE first
    call DumpMem
    exit
main ENDP
END main`
      },
      {
        title: 'بدّل محتويات سجلين من نوع BYTE',
        task: 'اكتب برنامجًا كاملًا يعرّف متغيرين BYTE باسمي first وsecond: الأول قيمته 8 والثاني قيمته 6. انقل قيمة المتغير الأول إلى DL والثاني إلى DH، ثم بدّل محتويات السجلين باستخدام XCHG واعرض حالة السجلات باستخدام DumpRegs.',
        answerType: 'program',
        placeholder: 'اكتب البرنامج الكامل بصيغة MASM مع Irvine32…',
        validation: { requiredOperations: ['xchg'], requiredCalls: ['dumpregs'], initial: { first: 8, second: 6 }, dataTypes: { first: 'BYTE', second: 'BYTE' }, registers: { DL: 6, DH: 8 } },
        answer: 'بعد النقل يكون DL=8 وDH=6. تعليمة XCHG DL,DH تبدّل القيمتين، فتصبح DL=6 وDH=8.',
        solution: `INCLUDE Irvine32.inc

.data
first  BYTE 8
second BYTE 6

.code
main PROC
    mov dl, first
    mov dh, second
    xchg dl, dh
    call DumpRegs
    exit
main ENDP
END main`
      },
      {
        title: 'اعرض قيمة متغير WORD على الشاشة',
        task: 'اكتب برنامجًا كاملًا يعرّف متغيرًا اسمه var من نوع WORD ويخزّن فيه القيمة 7، ثم ينقل القيمة إلى سجل مناسب ويطبعها على الشاشة باستخدام WriteDec.',
        answerType: 'program',
        placeholder: 'اكتب البرنامج الكامل بصيغة MASM مع Irvine32…',
        validation: { requiredCalls: ['writedec'], initial: { var: 7 }, dataTypes: { var: 'WORD' }, registers: { EAX: 7 }, outputIncludes: '7', memory: { var: 7 } },
        answer: 'لأن var من نوع WORD، انقل قيمته إلى AX ثم استدعِ WriteDec. الإجراء يقرأ العدد من EAX؛ وAX هو الجزء الأقل من EAX، لذلك تبقى القيمة 7 جاهزة للطباعة.',
        solution: `INCLUDE Irvine32.inc

.data
var WORD 7

.code
main PROC
    mov eax, 0
    mov ax, var
    call WriteDec
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'اقرأ عدد عناصر المصفوفة وحجم عنصرها',
        task: 'عرّف المتغير values من النوع WORD بالقيم 6, 8, 10. اكتب برنامجًا كاملًا يضع عدد عناصر values في EAX وحجم العنصر الواحد بالبايت في EBX، من دون كتابة الرقمين يدويًا، ثم يعرض السجلات باستخدام DumpRegs.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredCalls: ['dumpregs'], requiredText: [{ text: 'lengthof', message: 'استخدم المعامل LENGTHOF للحصول على عدد العناصر بدل كتابته يدويًا.' }, { text: 'type', message: 'استخدم المعامل TYPE للحصول على حجم العنصر بدل كتابته يدويًا.' }], initial: { values: [6, 8, 10] }, dataTypes: { values: 'WORD' }, registers: { EAX: 3, EBX: 2 } },
        answer: 'LENGTHOF values يعطي عدد العناصر (3) وTYPE values يعطي حجم العنصر الواحد بالبايت (2). ضع كل واحد منهما في السجل المطلوب باستخدام MOV.',
        solution: `INCLUDE Irvine32.inc

.data
values WORD 6, 8, 10

.code
main PROC
    mov eax, LENGTHOF values
    mov ebx, TYPE values
    call DumpRegs
    exit
main ENDP
END main`
      },
      {
        title: 'اعرض مصفوفة WORD في الذاكرة',
        task: 'عرّف items من النوع WORD بالقيم 6, 8, 10, 12. اكتب برنامجًا كاملًا يعرض محتوى المصفوفة كاملة باستخدام DumpMem، على أن يُحسب عنوان المصفوفة وعدد عناصرها وحجم العنصر من المتغير نفسه، لا بكتابة أرقام ثابتة.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredCalls: ['dumpmem'], requiredText: [{ text: 'offset', message: 'استخدم OFFSET للحصول على عنوان المصفوفة.' }, { text: 'lengthof', message: 'استخدم LENGTHOF للحصول على عدد العناصر.' }, { text: 'type', message: 'استخدم TYPE للحصول على حجم العنصر.' }], initial: { items: [6, 8, 10, 12] }, dataTypes: { items: 'WORD' }, registers: { ECX: 4, EBX: 2 }, outputIncludes: 'DumpMem items' },
        answer: 'جهّز ESI بعنوان المصفوفة باستخدام OFFSET، وECX بعدد عناصرها باستخدام LENGTHOF، وEBX بحجم العنصر باستخدام TYPE، ثم استدع DumpMem.',
        solution: `INCLUDE Irvine32.inc

.data
items WORD 6, 8, 10, 12

.code
main PROC
    mov esi, OFFSET items
    mov ecx, LENGTHOF items
    mov ebx, TYPE items
    call DumpMem
    exit
main ENDP
END main`
      }
    ],
    labCode: `INCLUDE Irvine32.inc

.data
values BYTE 6, 8, 10

.code
main PROC
    mov esi, OFFSET values
    mov ecx, LENGTHOF values
    mov ebx, TYPE values
    call DumpMem
    exit
main ENDP
END main`
  },
  {
    id: 'arithmetic-messages',
    number: '04',
    title: 'Arithmetic Instructions and Messages',
    arabicTitle: 'العمليات الحسابية والرسائل',
    description: 'الجمع والطرح والزيادة والنقصان والضرب، ثم عرض الرسائل وأسئلة التأكيد باستخدام Irvine32.',
    pdf: 'assets/pdfs/arithmetic-messages-explained.pdf',
    theory: [
      {
        prompt: 'في التعليمة ADD EAX, EBX، أين يُحفظ ناتج الجمع؟',
        options: ['في EAX، وهو المعامل الأول', 'في EBX فقط', 'في EDX:EAX دائمًا'],
        answer: 0,
        explanation: 'ADD تحفظ الناتج في الوجهة، وهي المعامل الأول EAX، وتبقي المصدر EBX دون تغيير.'
      },
      {
        prompt: 'عند تنفيذ MUL على معامل DWORD، ما السجلان اللذان يحتويان حاصل الضرب؟',
        options: ['EAX فقط', 'EBX:ECX', 'EDX:EAX'],
        answer: 2,
        explanation: 'في صيغة 32-bit تضرب MUL قيمة EAX بالمصدر، وتضع الجزء الأعلى في EDX والأدنى في EAX.'
      },
      {
        prompt: 'أين يرجع MsgBoxAsk نتيجة اختيار Yes أو No؟',
        options: ['في EAX', 'في EDX', 'في EBX'],
        answer: 0,
        explanation: 'يعيد MsgBoxAsk نتيجة الاختيار في EAX: القيمة 6 لـYes أو 7 لـNo.'
      }
    ],
    practical: [
      {
        title: 'احسب (var1 + var2) * var3',
        task: 'اكتب برنامج MASM كاملًا لحل المعادلة الآتية: var4 = (var1 + var2) * var3. المتغير الأول var1 يحتوي القيمة 2، والمتغير الثاني var2 يحتوي القيمة 3، والمتغير الثالث var3 يحتوي القيمة 5. خزّن الناتج في var4 واعرضه على الشاشة.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: {
          requiredOperations: ['add', 'mul'],
          initial: { var1: 2, var2: 3, var3: 5, var4: { blank: true, length: 1 } },
          dataTypes: { var1: 'DWORD', var2: 'DWORD', var3: 'DWORD', var4: 'DWORD' },
          memory: { var1: 2, var2: 3, var3: 5, var4: 25 },
          registers: { EAX: 25, EDX: 0 },
          outputIncludes: '25'
        },
        hints: [
          'عرّف var1 وvar2 وvar3 وvar4 داخل .data بنوع DWORD، ويمكن أن تكون قيمة var4 غير مهيأة باستخدام ?.',
          'اجمع أولًا: انقل var1 إلى EAX ثم نفّذ add eax, var2. بعدها يصبح EAX=5.',
          'MUL تضرب EAX تلقائيًا بالمعامل الذي تكتبه، فانقل var3 إلى EBX ثم نفّذ mul ebx، وبعدها خزّن EAX في var4.'
        ],
        solution: `INCLUDE Irvine32.inc

.data
var1 DWORD 2
var2 DWORD 3
var3 DWORD 5
var4 DWORD ?

.code
main PROC
    mov eax, var1
    add eax, var2
    mov ebx, var3
    mul ebx
    mov var4, eax
    call WriteDec
    call Crlf
    exit
main ENDP
END main`,
        answer: 'نجمع var1 وvar2 أولًا فيصبح EAX=5، ثم نضرب EAX في var3 باستخدام MUL فيصبح الناتج 25، ونخزّنه في var4 ثم نعرضه. تأكد أن الجمع يسبق الضرب لأن الأقواس تعني ذلك.'
      },
      {
        title: 'برمج عدّادًا باستخدام INC وDEC',
        task: 'اكتب برنامجًا يعرّف counter DWORD بقيمة 4، يزيده مرتين، ينقصه مرة، ثم ينقل النتيجة إلى EAX ويعرضها. الناتج المطلوب 5.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredOperations: ['inc', 'dec'], initial: { counter: 4 }, dataTypes: { counter: 'DWORD' }, memory: { counter: 5 }, registers: { EAX: 5 }, outputIncludes: '5' },
        answer: 'بعد تعريف counter DWORD 4، نفّذ inc counter مرتين وdec counter مرة. بعدها انقل القيمة إلى EAX واعرضها بـWriteInt. تصبح قيمة counter النهائية 5.',
        solution: `INCLUDE Irvine32.inc

.data
counter DWORD 4

.code
main PROC
    inc counter
    inc counter
    dec counter
    mov eax, counter
    call WriteDec
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'اضرب عددين باستخدام MUL',
        task: 'اكتب برنامجًا يضع 7 في EAX و6 في EBX، ينفّذ MUL، ثم يعرض الناتج. تحقق من أن EAX=42 وEDX=0.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredOperations: ['mul'], registers: { EAX: 42, EDX: 0 }, mulInputs: [{ accumulator: 'EAX', operand: 'EBX', accumulatorValue: 7, operandValue: 6 }], outputIncludes: '42' },
        answer: 'استخدم mov eax, 7 ثم mov ebx, 6 ثم mul ebx ثم call WriteInt. حاصل الضرب 42، ولذلك EAX=42 وEDX=0.',
        solution: `INCLUDE Irvine32.inc

.code
main PROC
    mov eax, 7
    mov ebx, 6
    mul ebx
    call WriteDec
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'اكتب برنامج تأكيد باستخدام MsgBoxAsk',
        task: 'اكتب برنامجًا كاملًا يعرّف عنوانًا وسؤالًا منتهيًا بصفر، ويمرر عنوان السؤال في EDX والعنوان في EBX، ثم يستدعي MsgBoxAsk ويحفظ EAX في متغير answer. المختبر يحاكي اختياري Yes وNo للتحقق من النتيجتين.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredCalls: ['msgboxask'], dialogResponses: true, memory: { answer: 6 } },
        answer: 'عرّف caption وquestion كسلاسل BYTE منتهية بصفر، وعرّف answer DWORD. ضع OFFSET caption في EBX وOFFSET question في EDX ثم call MsgBoxAsk وبعدها mov answer, eax. يرجع المختبر 6 عند Yes و7 عند No.',
        solution: `INCLUDE Irvine32.inc

.data
caption  BYTE "Confirm", 0
question BYTE "Are you sure?", 0
answer   DWORD ?

.code
main PROC
    mov ebx, OFFSET caption
    mov edx, OFFSET question
    call MsgBoxAsk
    mov answer, eax
    exit
main ENDP
END main`
      },
      {
        title: 'احسب مساحة ومحيط مستطيل',
        task: 'عرّف rectWidth من النوع DWORD بقيمة 7، وrectHeight من النوع DWORD بقيمة 3. اكتب برنامجًا كاملًا يحسب مساحة المستطيل (rectWidth * rectHeight) ويخزنها في area، ثم يحسب المحيط 2 * (rectWidth + rectHeight) ويخزنه في perimeter. اعرض المساحة ثم المحيط، كل قيمة في سطر. الناتج المطلوب: 21 ثم 20.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredOperations: ['mul', 'add'], requiredCalls: ['writedec'], initial: { rectWidth: 7, rectHeight: 3 }, dataTypes: { rectWidth: 'DWORD', rectHeight: 'DWORD', area: 'DWORD', perimeter: 'DWORD' }, memory: { area: 21, perimeter: 20 }, outputNumbers: [21, 20] },
        answer: 'المساحة: انقل rectWidth إلى EAX واضربها في rectHeight (MUL)، ثم خزّن EAX في area. المحيط: اجمع rectWidth وrectHeight في سجل، ثم أضف الناتج إلى نفسه ليتضاعف، وخزّنه في perimeter. اعرض كل قيمة بعد نقلها إلى EAX.',
        solution: `INCLUDE Irvine32.inc

.data
rectWidth     DWORD 7
rectHeight    DWORD 3
area      DWORD ?
perimeter DWORD ?

.code
main PROC
    mov eax, rectWidth
    mul rectHeight
    mov area, eax

    mov eax, rectWidth
    add eax, rectHeight
    add eax, eax
    mov perimeter, eax

    mov eax, area
    call WriteDec
    call Crlf
    mov eax, perimeter
    call WriteDec
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'احسب الباقي بعد خصم وإضافة',
        task: 'عرّف المتغيرات price وdiscount وtax من النوع WORD بالقيم 120 و45 و10 على الترتيب. اكتب برنامجًا كاملًا يحسب (price - discount + tax) في السجل AX ثم يعرض الناتج باستخدام WriteDec. يجب أن يكون الناتج 85، ولا تعدّل قيم المتغيرات الأصلية.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredOperations: ['sub', 'add'], requiredCalls: ['writedec'], initial: { price: 120, discount: 45, tax: 10 }, dataTypes: { price: 'WORD', discount: 'WORD', tax: 'WORD' }, memory: { price: 120, discount: 45, tax: 10 }, registers: { AX: 85 }, outputNumbers: [85] },
        answer: 'انقل price إلى AX (سجل WORD ليناسب حجم المتغير)، ثم اطرح discount وأضف tax. قبل WriteDec تأكد أن الجزء الأعلى من EAX صفر.',
        solution: `INCLUDE Irvine32.inc

.data
price    WORD 120
discount WORD 45
tax      WORD 10

.code
main PROC
    mov eax, 0
    mov ax, price
    sub ax, discount
    add ax, tax
    call WriteDec
    call Crlf
    exit
main ENDP
END main`
      }
    ],
    labCode: `INCLUDE Irvine32.inc

.data
factor DWORD 6
caption BYTE "Confirmation", 0
question BYTE "Are you sure?", 0
answer DWORD ?

.code
main PROC
    mov eax, 7
    mul factor
    inc eax
    dec eax
    call WriteInt
    call Crlf
    mov ebx, OFFSET caption
    mov edx, OFFSET question
    call MsgBoxAsk
    mov answer, eax
    call DumpRegs
    exit
main ENDP
END main`
  },
  {
    id: 'keyboard-input-procedures',
    number: '05',
    title: 'Keyboard Input Procedures',
    arabicTitle: 'قراءة المدخلات من لوحة المفاتيح',
    description: 'قراءة محرف واحد أو عدد عشري أو عدد صحيح أو نص من لوحة المفاتيح باستخدام إجراءات Irvine32.',
    pdf: 'assets/pdfs/keyboard-input-procedures-explained.pdf',
    theory: [
      {
        prompt: 'أين يضع ReadChar المحرف الذي يقرأه؟',
        options: ['في AL', 'في EDX', 'في ECX'],
        answer: 0,
        explanation: 'يعيد ReadChar رمز المحرف في AL، وهو الجزء الأدنى من السجل EAX.'
      },
      {
        prompt: 'ما الفرق بين ReadDec وReadInt؟',
        options: ['ReadDec للأعداد غير الموقعة وReadInt للأعداد الموقعة', 'ReadDec للنصوص وReadInt للمحارف', 'كلاهما يخزن النتيجة في الذاكرة عند EDX'],
        answer: 0,
        explanation: 'كلاهما يعيد القيمة العددية في EAX، لكن ReadDec يقرأ عددًا غير موقّع وReadInt يقرأ عددًا موقّعًا.'
      },
      {
        prompt: 'ما الذي يجب تجهيزه قبل استدعاء ReadString؟',
        options: ['عنوان مخزن النص في EDX وحد الأحرف في ECX', 'عنوان النص في EBX والنتيجة في EDX', 'قيمة النص في EAX فقط'],
        answer: 0,
        explanation: 'يمرر EDX عنوان بداية الـbuffer ويمرر ECX الحد الأقصى للأحرف، مع ترك بايت لصفر نهاية السلسلة.'
      }
    ],
    practical: [
      {
        title: 'اكتب برنامجًا يقرأ محرفًا ويعرضه',
        task: 'اكتب برنامج MASM كاملًا ينتظر المستخدم حتى يضغط مفتاحًا واحدًا، يحتفظ بالحرف في متغير بحجم بايت، ثم يعرضه على الشاشة. جرّب الإدخال A.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredCalls: ['readchar', 'writechar'], cases: [
          { name: 'الإدخال A', input: 'A', expect: { anyVariable: [{ label: 'متغير BYTE يحتفظ بالحرف', bits: 8, exactLength: 1, value: 65 }], outputLines: ['A'] } },
          { name: 'الإدخال z', input: 'z', expect: { anyVariable: [{ label: 'متغير BYTE يحتفظ بالحرف', bits: 8, exactLength: 1, value: 122 }], outputLines: ['z'] } }
        ] },
        answer: 'بعد call ReadChar تكون قيمة المحرف في AL. خزّنها في inputChar عند الحاجة، ثم أعدها إلى AL قبل call WriteChar.',
        solution: `INCLUDE Irvine32.inc

.data
inputChar BYTE ?

.code
main PROC
    call ReadChar
    mov inputChar, al
    mov al, inputChar
    call WriteChar
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'اكتب برنامجًا يقرأ عددًا عشريًا غير موقّع',
        task: 'اكتب برنامجًا كاملًا يقرأ عددًا موجبًا غير موقّع يدخله المستخدم ثم يعرضه كما هو. أدخل 503 في خانة الإدخال بالمختبر، وانتبه لنوع العدد المطلوب.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredCalls: ['readdec', 'writedec'], cases: [
          { name: 'الإدخال 503', input: '503', expect: { registers: { EAX: 503 }, outputLines: ['503'] } },
          { name: 'عدد كبير غير موقّع', input: '3000000000', expect: { registers: { EAX: 3000000000 }, outputLines: ['3000000000'] } }
        ] },
        answer: 'يعيد ReadDec العدد في EAX، ثم يستخدم WriteDec القيمة الموجودة في EAX لعرضها بصيغة عشرية غير موقعة.',
        solution: `INCLUDE Irvine32.inc

.data
number DWORD ?

.code
main PROC
    call ReadDec
    mov number, eax
    call WriteDec
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'اكتب برنامجًا يقرأ عددًا صحيحًا سالبًا',
        task: 'اكتب برنامجًا كاملًا يقرأ عددًا قد يكون سالبًا، ثم يعرضه بإشارته. أدخل -27 في خانة الإدخال بالمختبر. فكّر: ما الإجراء الذي يفهم الإشارة؟',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredCalls: ['readint', 'writeint'], cases: [
          { name: 'الإدخال -27', input: '-27', expect: { registers: { EAX: -27 }, outputNumbers: [-27] } },
          { name: 'الإدخال -1500', input: '-1500', expect: { registers: { EAX: -1500 }, outputNumbers: [-1500] } },
          { name: 'الإدخال 42', input: '42', expect: { registers: { EAX: 42 }, outputNumbers: [42] } }
        ] },
        answer: 'يقرأ ReadInt العدد الموقّع ويضع تمثيله 32-bit في EAX. يعرض WriteInt التمثيل نفسه كعدد عشري موقّع.',
        solution: `INCLUDE Irvine32.inc

.data
number SDWORD ?

.code
main PROC
    call ReadInt
    mov number, eax
    call WriteInt
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'اكتب برنامجًا يقرأ نصًا ثم يعرضه',
        task: 'اكتب برنامجًا كاملًا يقرأ اسمًا من المستخدم بحد أقصى 20 حرفًا، ثم يعرضه. حجّز مساحة مناسبة في الذاكرة، وانتبه إلى أن النص يحتاج بايتًا إضافيًا لنهايته. أدخل Noor في المختبر.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredCalls: ['readstring', 'writestring'], cases: [
          { name: 'الإدخال Noor', input: 'Noor', expect: { registers: { EAX: 4 }, anyVariable: [{ label: 'مخزن النص (21 بايت على الأقل)', bits: 8, minLength: 21, text: 'Noor' }], outputLines: ['Noor'] } },
          { name: 'اسم طويل (20 حرفًا)', input: 'Mohammed Abdulkareem', expect: { registers: { EAX: 20 }, anyVariable: [{ label: 'مخزن النص (21 بايت على الأقل)', bits: 8, minLength: 21, text: 'Mohammed Abdulkareem' }], outputLines: ['Mohammed Abdulkareem'] } }
        ] },
        answer: 'يكتب ReadString الأحرف في buffer ويضيف صفر النهاية، ويعيد عدد الأحرف في EAX. قبل WriteString ضع OFFSET buffer في EDX.',
        solution: `INCLUDE Irvine32.inc

.data
buffer BYTE 21 DUP(?)

.code
main PROC
    mov edx, OFFSET buffer
    mov ecx, 20
    call ReadString
    mov edx, OFFSET buffer
    call WriteString
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'اقرأ عددين واحسب تعبيرًا بدون تعليمة ضرب',
        task: 'اكتب برنامج MASM كاملًا ينفّذ الآتي بالترتيب: (1) يقرأ عددًا صحيحًا موقّعًا باستخدام ReadInt ويخزنه في متغير اسمه A من النوع DWORD. (2) يقرأ بعده عددًا صحيحًا غير موقّع باستخدام ReadDec ويخزنه في متغير اسمه B من النوع DWORD. (3) يحسب Result = (4 * A) + B - 5 ويخزن الناتج في متغير مستقل في الذاكرة. (4) يعرض الناتج باستخدام WriteInt. الشرط: نفّذ الضرب في 4 باستخدام تعليمة الجمع ADD، وليس تعليمة ضرب. للتجربة في المختبر: أدخل 3 ثم 10.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: {
          requiredOperations: ['add', 'sub'],
          requiredCalls: ['readint', 'readdec', 'writeint'],
          forbid: ['mul'],
          dataTypes: { A: 'DWORD', B: 'DWORD' },
          cases: [
            { name: 'A=3 وB=10', input: '3\n10', expect: { memory: { A: 3, B: 10 }, anyVariable: [{ label: 'متغير مستقل يحمل Result', bits: 32, value: 17, exclude: ['A', 'B'] }], outputNumbers: [17] } },
            { name: 'A سالب: A=-2 وB=7', input: '-2\n7', expect: { memory: { A: -2, B: 7 }, anyVariable: [{ label: 'متغير مستقل يحمل Result', bits: 32, value: -6, exclude: ['A', 'B'] }], outputNumbers: [-6] } },
            { name: 'A=25 وB=0', input: '25\n0', expect: { memory: { A: 25, B: 0 }, anyVariable: [{ label: 'متغير مستقل يحمل Result', bits: 32, value: 95, exclude: ['A', 'B'] }], outputNumbers: [95] } }
          ]
        },
        answer: 'اقرأ A بـReadInt ثم انقل EAX إلى A، واقرأ B بـReadDec وانقل EAX إلى B. لحساب 4*A اجمع A إلى EAX أربع مرات (أو ضاعف القيمة مرتين)، ثم أضف B واطرح 5 وخزّن النتيجة في متغير ثالث قبل WriteInt.',
        solution: `INCLUDE Irvine32.inc

.data
A      DWORD ?
B      DWORD ?
result DWORD ?

.code
main PROC
    call ReadInt
    mov A, eax
    call ReadDec
    mov B, eax

    mov eax, A
    add eax, A
    add eax, A
    add eax, A
    add eax, B
    sub eax, 5
    mov result, eax

    call WriteInt
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'اقرأ حرفًا واسمًا واعرض المعلومات',
        task: 'اكتب برنامج MASM كاملًا ينفّذ الآتي: (1) يقرأ حرفًا واحدًا باستخدام ReadChar ويخزنه في متغير من النوع BYTE. (2) يقرأ اسم طالب باستخدام ReadString بحد أقصى 20 حرفًا. (3) يخزن الاسم داخل مصفوفة أحرف مناسبة مع تخصيص مساحة لمحرف الإنهاء. (4) يخزن عدد الأحرف التي أُدخلت في متغير من النوع DWORD. (5) يعرض اسم الطالب، ثم الحرف المُدخل، ثم طول الاسم، كل قيمة في سطر مستقل. للتجربة: أدخل K ثم Noor.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: {
          requiredCalls: ['readchar', 'readstring', 'writestring', 'writechar'],
          cases: [
            { name: 'الحرف K والاسم Noor', input: 'K\nNoor', expect: { anyVariable: [
              { label: 'متغير BYTE يحتفظ بالحرف', bits: 8, exactLength: 1, value: 75 },
              { label: 'مصفوفة الاسم (21 بايت على الأقل)', bits: 8, minLength: 21, text: 'Noor' },
              { label: 'متغير DWORD يحمل طول الاسم', bits: 32, exactLength: 1, value: 4 }
            ], outputLines: ['Noor', 'K', '4'] } },
            { name: 'اسم بحد 20 حرفًا', input: 'Z\nMohammed Abdulkareem', expect: { anyVariable: [
              { label: 'متغير BYTE يحتفظ بالحرف', bits: 8, exactLength: 1, value: 90 },
              { label: 'مصفوفة الاسم (21 بايت على الأقل)', bits: 8, minLength: 21, text: 'Mohammed Abdulkareem' },
              { label: 'متغير DWORD يحمل طول الاسم', bits: 32, exactLength: 1, value: 20 }
            ], outputLines: ['Mohammed Abdulkareem', 'Z', '20'] } }
          ]
        },
        answer: 'يعيد ReadChar الحرف في AL فاحفظه فورًا لأن الإجراءات التالية قد تغيّر EAX. ReadString يعيد عدد الأحرف في EAX فاحفظه أيضًا. قبل عرض الحرف أعده إلى AL، وقبل عرض الطول أعده إلى EAX، واستخدم Crlf بعد كل قيمة.',
        solution: `INCLUDE Irvine32.inc

.data
letter  BYTE ?
student BYTE 21 DUP(?)
length1 DWORD ?

.code
main PROC
    call ReadChar
    mov letter, al

    mov edx, OFFSET student
    mov ecx, 20
    call ReadString
    mov length1, eax

    mov edx, OFFSET student
    call WriteString
    call Crlf

    mov al, letter
    call WriteChar
    call Crlf

    mov eax, length1
    call WriteDec
    call Crlf
    exit
main ENDP
END main`
      }
    ],
    labCode: `INCLUDE Irvine32.inc

.data
buffer BYTE 21 DUP(?)

.code
main PROC
    mov edx, OFFSET buffer
    mov ecx, 20
    call ReadString
    mov edx, OFFSET buffer
    call WriteString
    call Crlf
    call DumpRegs
    exit
main ENDP
END main`
  },
  {
    id: 'direct-offset-arrays',
    number: '06',
    title: 'Accessing Array Elements with Direct Offsets',
    arabicTitle: 'الوصول إلى عناصر المصفوفة بالإزاحة المباشرة',
    description: 'استخدام الإزاحة المباشرة للوصول إلى عناصر BYTE وWORD وDWORD، ثم تبديل عناصر WORD ومشاهدة الذاكرة بواسطة DumpMem.',
    pdf: 'assets/pdfs/direct-offset-arrays-explained.pdf',
    theory: [
      {
        prompt: 'في مصفوفة WORD، كم بايتًا نضيف للانتقال من عنصر إلى العنصر الذي يليه؟',
        options: ['بايت واحد', 'بايتان', 'أربعة بايتات'],
        answer: 1,
        explanation: 'كل عنصر WORD حجمه بايتان، لذلك تكون إزاحات العناصر المتتالية 0 ثم 2 ثم 4 وهكذا.'
      },
      {
        prompt: 'إذا كانت ArrayA مصفوفة DWORD، فما العنصر الذي تشير إليه ArrayA+8؟',
        options: ['العنصر الثاني', 'العنصر الثالث', 'العنصر الثامن'],
        answer: 1,
        explanation: 'حجم DWORD أربعة بايتات؛ الإزاحة 8 تعني تجاوز عنصرين للوصول إلى العنصر الثالث.'
      },
      {
        prompt: 'ما السجلات التي يجهزها البرنامج لاستدعاء DumpMem؟',
        options: ['ESI للبداية، ECX للعدد، EBX لحجم العنصر', 'EAX للبداية، EDX للعدد، ECX لحجم العنصر', 'EBX للبداية، ESI للعدد، EAX لحجم العنصر'],
        answer: 0,
        explanation: 'يستقبل DumpMem عنوان البداية في ESI، وعدد العناصر في ECX، وحجم كل عنصر بالبايت في EBX.'
      }
    ],
    practical: [
      {
        title: 'اقرأ العنصر الثاني من مصفوفة BYTE',
        task: 'اكتب برنامج MASM كاملًا يعرّف values BYTE 10h, 20h, 30h، ثم يقرأ العنصر الثاني باستخدام الإزاحة المباشرة ويضعه في AL. اعرض حالة السجلات باستخدام DumpRegs.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredCalls: ['dumpregs'], initial: { values: [16, 32, 48] }, dataTypes: { values: 'BYTE' }, memoryReads: [{ name: 'values', index: 1 }], registers: { EAX: 32 } },
        answer: 'استخدم mov al, values+1؛ لأن العنصر BYTE حجمه بايت واحد، فالعنصر الثاني يبدأ عند الإزاحة +1.',
        solution: `INCLUDE Irvine32.inc

.data
values BYTE 10h, 20h, 30h

.code
main PROC
    mov al, values+1
    call DumpRegs
    exit
main ENDP
END main`
      },
      {
        title: 'اقرأ العنصر الثالث من مصفوفة WORD',
        task: 'عرّف values WORD 10h, 20h, 30h، واكتب برنامجًا يقرأ العنصر الثالث إلى AX باستخدام الإزاحة المباشرة ثم يعرض السجلات.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredCalls: ['dumpregs'], initial: { values: [16, 32, 48] }, dataTypes: { values: 'WORD' }, memoryReads: [{ name: 'values', index: 2 }], registers: { EAX: 48 } },
        answer: 'استخدم mov ax, values+4؛ لأن كل عنصر WORD حجمه بايتان، وإزاحة العنصر الثالث هي 2 × 2 = 4 بايتات.',
        solution: `INCLUDE Irvine32.inc

.data
values WORD 10h, 20h, 30h

.code
main PROC
    mov ax, values+4
    call DumpRegs
    exit
main ENDP
END main`
      },
      {
        title: 'اعرض مصفوفة DWORD باستخدام DumpMem',
        task: 'اكتب برنامجًا يعرّف values DWORD 10h, 20h, 30h، ثم يعرض محتوى المصفوفة كاملة في الذاكرة باستخدام إجراء Irvine32 المخصص لذلك. جهّز كل ما يحتاجه الإجراء بنفسك اعتمادًا على المصفوفة.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredCalls: ['dumpmem'], initial: { values: [16, 32, 48] }, dataTypes: { values: 'DWORD' }, memoryArrays: { values: [16, 32, 48] } },
        answer: 'جهّز السجلات بـmov esi, OFFSET values وmov ecx, 3 وmov ebx, 4، ثم استدعِ DumpMem. حجم عنصر DWORD أربعة بايتات.',
        solution: `INCLUDE Irvine32.inc

.data
values DWORD 10h, 20h, 30h

.code
main PROC
    mov esi, OFFSET values
    mov ecx, LENGTHOF values
    mov ebx, TYPE values
    call DumpMem
    exit
main ENDP
END main`
      },
      {
        title: 'بدّل كل عنصرين متجاورين في مصفوفة WORD',
        task: 'اكتب برنامجًا يبدّل أزواج العناصر في ArrayA WORD 1, 2, 3, 4, 5, 6 باستخدام الإزاحة المباشرة وXCHG، ثم يعرض المصفوفة باستخدام DumpMem. النتيجة المطلوبة: 2, 1, 4, 3, 6, 5.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredOperations: ['xchg'], requiredCalls: ['dumpmem'], initial: { arraya: [1, 2, 3, 4, 5, 6] }, dataTypes: { arraya: 'WORD' }, memoryArrays: { arraya: [2, 1, 4, 3, 6, 5] } },
        answer: 'لكل زوج، انقل العنصر الأول إلى AX، ثم استخدم XCHG مع العنصر التالي، وبعدها أعد القيمة الموجودة في AX إلى العنصر الأول. إزاحات عناصر WORD هي 0 و2 و4 و6 و8 و10.',
        solution: `INCLUDE Irvine32.inc

.data
ArrayA WORD 1, 2, 3, 4, 5, 6

.code
main PROC
    mov ax, ArrayA
    xchg ArrayA+2, ax
    mov ArrayA, ax

    mov ax, ArrayA+4
    xchg ArrayA+6, ax
    mov ArrayA+4, ax

    mov ax, ArrayA+8
    xchg ArrayA+10, ax
    mov ArrayA+8, ax

    mov esi, OFFSET ArrayA
    mov ecx, LENGTHOF ArrayA
    mov ebx, TYPE ArrayA
    call DumpMem
    exit
main ENDP
END main`
      },
      {
        title: 'ضاعف عناصر مصفوفة وخزّنها في مصفوفة ثانية',
        task: 'عرّف المصفوفة A WORD 4, 9, 12, 15, 20 ثم اكتب برنامجًا كاملًا ينفّذ الآتي: (1) ينشئ مصفوفة ثانية باسم B من النوع WORD وبالحجم نفسه. (2) يقرأ كل عنصر من A عن طريق عنوانه في الذاكرة (الإزاحة المباشرة). (3) يضرب كل عنصر في 2 ويخزن الناتج في الموضع المقابل داخل B. (4) يعرض عناصر B، كل عنصر في سطر مستقل.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: {
          requiredCalls: ['writedec'],
          initial: { a: [4, 9, 12, 15, 20], b: { blank: true, length: 5 } },
          dataTypes: { A: 'WORD', B: 'WORD' },
          memoryReads: [0, 1, 2, 3, 4].map((index) => ({ name: 'a', index })),
          memoryArrays: { a: [4, 9, 12, 15, 20], b: [8, 18, 24, 30, 40] },
          outputNumbers: [8, 18, 24, 30, 40]
        },
        answer: 'كل عنصر WORD يبعد بايتين عن الذي قبله: A+0 وA+2 وA+4 وA+6 وA+8. انقل العنصر إلى AX وضاعفه ثم خزّنه في الإزاحة نفسها داخل B. قبل WriteDec تأكد أن EAX لا يحمل بقايا قيمة سابقة في جزئه الأعلى.',
        solution: `INCLUDE Irvine32.inc

.data
A WORD 4, 9, 12, 15, 20
B WORD 5 DUP(?)

.code
main PROC
    mov ax, A+0
    add ax, ax
    mov B+0, ax
    mov ax, A+2
    add ax, ax
    mov B+2, ax
    mov ax, A+4
    add ax, ax
    mov B+4, ax
    mov ax, A+6
    add ax, ax
    mov B+6, ax
    mov ax, A+8
    add ax, ax
    mov B+8, ax

    mov eax, 0
    mov ax, B+0
    call WriteDec
    call Crlf
    mov ax, B+2
    call WriteDec
    call Crlf
    mov ax, B+4
    call WriteDec
    call Crlf
    mov ax, B+6
    call WriteDec
    call Crlf
    mov ax, B+8
    call WriteDec
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'مبيعات أربعة أيام وتقرير مشتق',
        task: 'اكتب برنامج MASM كاملًا يقرأ مبيعات 4 أيام باستخدام ReadDec ويخزنها في مصفوفة sales من النوع DWORD، وينشئ مصفوفة ثانية اسمها report من النوع DWORD، ثم: (1) في report+0 خزّن مجموع اليوم الأول واليوم الرابع. (2) في report+4 خزّن مجموع اليوم الثاني واليوم الثالث. (3) في report+8 خزّن مجموع القيمتين report+0 وreport+4. (4) في report+12 خزّن الفرق report+0 - report+4. (5) اعرض مبيعات الأيام الأربعة، ثم عناصر report الأربعة، كل قيمة في سطر، واستخدم WriteInt لعرض الفرق. مثال: sales = 12, 25, 15, 40 يعطي report = 52, 40, 92, 12.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: {
          requiredCalls: ['readdec', 'writeint'],
          requiredOperations: ['add', 'sub'],
          initial: { sales: { blank: true, length: 4 }, report: { blank: true, length: 4 } },
          dataTypes: { sales: 'DWORD', report: 'DWORD' },
          cases: [
            { name: 'المثال: 12, 25, 15, 40', input: '12\n25\n15\n40', expect: { memoryArrays: { sales: [12, 25, 15, 40], report: [52, 40, 92, 12] }, outputNumbers: [12, 25, 15, 40, 52, 40, 92, 12] } },
            { name: 'فرق سالب: 5, 30, 20, 6', input: '5\n30\n20\n6', expect: { memoryArrays: { sales: [5, 30, 20, 6], report: [11, 50, 61, -39] }, outputNumbers: [5, 30, 20, 6, 11, 50, 61, -39] } },
            { name: 'قيم متساوية: 7, 7, 7, 7', input: '7\n7\n7\n7', expect: { memoryArrays: { sales: [7, 7, 7, 7], report: [14, 14, 28, 0] }, outputNumbers: [7, 7, 7, 7, 14, 14, 28, 0] } }
          ]
        },
        answer: 'اقرأ كل قيمة بـReadDec وخزّنها عند sales+0 وsales+4 وsales+8 وsales+12 (عناصر DWORD تبعد 4 بايتات). لا يمكن الجمع مباشرة بين موقعي ذاكرة، لذلك انقل أحد الطرفين إلى EAX ثم أضف الآخر. الفرق قد يكون سالبًا؛ لهذا يُعرض بـWriteInt.',
        solution: `INCLUDE Irvine32.inc

.data
sales  DWORD 4 DUP(?)
report DWORD 4 DUP(?)

.code
main PROC
    call ReadDec
    mov sales+0, eax
    call ReadDec
    mov sales+4, eax
    call ReadDec
    mov sales+8, eax
    call ReadDec
    mov sales+12, eax

    mov eax, sales
    add eax, sales+12
    mov report, eax

    mov eax, sales+4
    add eax, sales+8
    mov report+4, eax

    mov eax, report
    add eax, report+4
    mov report+8, eax

    mov eax, report
    sub eax, report+4
    mov report+12, eax

    mov eax, sales+0
    call WriteDec
    call Crlf
    mov eax, sales+4
    call WriteDec
    call Crlf
    mov eax, sales+8
    call WriteDec
    call Crlf
    mov eax, sales+12
    call WriteDec
    call Crlf
    mov eax, report+0
    call WriteDec
    call Crlf
    mov eax, report+4
    call WriteDec
    call Crlf
    mov eax, report+8
    call WriteDec
    call Crlf
    mov eax, report+12
    call WriteInt
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'اجمع أعدادًا موقّعة وخزّن النتائج',
        task: 'اكتب برنامجًا كاملًا يقرأ 4 أعداد باستخدام ReadInt ويخزنها في مصفوفة changes من النوع DWORD، ثم: (1) اجمع العدد الأول مع الثاني وخزّن الناتج في firstHalf. (2) اجمع العدد الثالث مع الرابع وخزّن الناتج في secondHalf. (3) احسب firstHalf - secondHalf وخزّن الفرق في difference. (4) اعرض النتائج الثلاث باستخدام WriteInt، كل نتيجة في سطر.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: {
          requiredCalls: ['readint', 'writeint'],
          requiredOperations: ['add', 'sub'],
          initial: { changes: { blank: true, length: 4 } },
          dataTypes: { changes: 'DWORD', firstHalf: 'DWORD', secondHalf: 'DWORD', difference: 'DWORD' },
          cases: [
            { name: 'الإدخال: 5, -3, 10, 4', input: '5\n-3\n10\n4', expect: { memory: { changes: [5, -3, 10, 4], firstHalf: 2, secondHalf: 14, difference: -12 }, outputNumbers: [2, 14, -12] } },
            { name: 'أعداد سالبة: -8, -2, 6, 1', input: '-8\n-2\n6\n1', expect: { memory: { changes: [-8, -2, 6, 1], firstHalf: -10, secondHalf: 7, difference: -17 }, outputNumbers: [-10, 7, -17] } },
            { name: 'أعداد موجبة: 100, 200, 50, 25', input: '100\n200\n50\n25', expect: { memory: { changes: [100, 200, 50, 25], firstHalf: 300, secondHalf: 75, difference: 225 }, outputNumbers: [300, 75, 225] } }
          ]
        },
        answer: 'خزّن كل عدد في changes+0 ثم changes+4 ثم changes+8 ثم changes+12. اجمع كل زوج عبر EAX وخزّن الناتج في متغيره، ثم اطرح secondHalf من firstHalf. استخدم ReadInt وWriteInt لأن الأعداد قد تكون سالبة.',
        solution: `INCLUDE Irvine32.inc

.data
changes    DWORD 4 DUP(?)
firstHalf  DWORD ?
secondHalf DWORD ?
difference DWORD ?

.code
main PROC
    call ReadInt
    mov changes+0, eax
    call ReadInt
    mov changes+4, eax
    call ReadInt
    mov changes+8, eax
    call ReadInt
    mov changes+12, eax

    mov eax, changes
    add eax, changes+4
    mov firstHalf, eax

    mov eax, changes+8
    add eax, changes+12
    mov secondHalf, eax

    mov eax, firstHalf
    sub eax, secondHalf
    mov difference, eax

    mov eax, firstHalf
    call WriteInt
    call Crlf
    mov eax, secondHalf
    call WriteInt
    call Crlf
    mov eax, difference
    call WriteInt
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'انقل آخر عنصر إلى البداية وحرّك الباقي',
        task: 'اكتب برنامجًا كاملًا يقرأ 4 أعداد باستخدام ReadDec ويخزنها في مصفوفة nums من النوع DWORD، ثم: (1) انقل العدد الأخير إلى المكان الأول. (2) حرّك الأعداد الثلاثة الباقية مكانًا واحدًا إلى اليمين. (3) اعرض المصفوفة بعد تغيير ترتيبها، كل عنصر في سطر. مثال: إذا كانت القيم 6, 1, 8, 3 تصبح 3, 6, 1, 8.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: {
          requiredCalls: ['readdec'],
          initial: { nums: { blank: true, length: 4 } },
          dataTypes: { nums: 'DWORD' },
          cases: [
            { name: 'المثال: 6, 1, 8, 3', input: '6\n1\n8\n3', expect: { memoryArrays: { nums: [3, 6, 1, 8] }, outputNumbers: [3, 6, 1, 8] } },
            { name: 'قيم أخرى: 10, 20, 30, 40', input: '10\n20\n30\n40', expect: { memoryArrays: { nums: [40, 10, 20, 30] }, outputNumbers: [40, 10, 20, 30] } }
          ]
        },
        answer: 'احفظ العنصر الأخير في سجل أولًا، ثم انقل العناصر من اليمين إلى اليسار بترتيب لا يمسح قيمة قبل نسخها: الثالث إلى الرابع، فالثاني إلى الثالث، فالأول إلى الثاني. بعدها ضع القيمة المحفوظة في المكان الأول.',
        solution: `INCLUDE Irvine32.inc

.data
nums DWORD 4 DUP(?)

.code
main PROC
    call ReadDec
    mov nums+0, eax
    call ReadDec
    mov nums+4, eax
    call ReadDec
    mov nums+8, eax
    call ReadDec
    mov nums+12, eax

    mov eax, nums+12
    mov ebx, nums+8
    mov nums+12, ebx
    mov ebx, nums+4
    mov nums+8, ebx
    mov ebx, nums
    mov nums+4, ebx
    mov nums, eax

    mov eax, nums+0
    call WriteDec
    call Crlf
    mov eax, nums+4
    call WriteDec
    call Crlf
    mov eax, nums+8
    call WriteDec
    call Crlf
    mov eax, nums+12
    call WriteDec
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'اجمع عناصر مصفوفة BYTE',
        task: 'عرّف المصفوفة scores من النوع BYTE بالقيم 10, 20, 30, 40. اكتب برنامجًا كاملًا يقرأ العناصر الأربعة بالإزاحة المباشرة ويجمعها في EAX، ثم يعرض المجموع. الناتج المطلوب 100. انتبه إلى أن العنصر بحجم بايت بينما المجموع قد يحتاج إلى سجل أكبر.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredCalls: ['writedec'], requiredOperations: ['add'], initial: { scores: [10, 20, 30, 40] }, dataTypes: { scores: 'BYTE' }, memoryReads: [0, 1, 2, 3].map((index) => ({ name: 'scores', index })), registers: { EAX: 100 }, outputNumbers: [100] },
        answer: 'اقرأ كل عنصر إلى سجل أكبر باستخدام MOVZX حتى لا تتأثر النتيجة بحجم البايت، ثم أضفه إلى EAX. الإزاحات: scores+0 وscores+1 وscores+2 وscores+3.',
        solution: `INCLUDE Irvine32.inc

.data
scores BYTE 10, 20, 30, 40

.code
main PROC
    movzx eax, scores
    movzx ebx, scores+1
    add eax, ebx
    movzx ebx, scores+2
    add eax, ebx
    movzx ebx, scores+3
    add eax, ebx
    call WriteDec
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'اعكس ترتيب مصفوفة DWORD',
        task: 'عرّف المصفوفة numbers من النوع DWORD بالقيم 1, 2, 3, 4. اكتب برنامجًا كاملًا يعكس ترتيب عناصرها داخل المصفوفة نفسها (من دون مصفوفة ثانية) باستخدام الإزاحة المباشرة، ثم يعرضها باستخدام DumpMem. النتيجة المطلوبة: 4, 3, 2, 1.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredCalls: ['dumpmem'], requiredOperations: ['mov'], initial: { numbers: [1, 2, 3, 4] }, dataTypes: { numbers: 'DWORD' }, memoryArrays: { numbers: [4, 3, 2, 1] } },
        answer: 'بدّل العنصر الأول مع الرابع، ثم الثاني مع الثالث. لأن كلا الطرفين في الذاكرة استخدم سجلين وسيطين أو سجلًا مع XCHG. الإزاحات لعناصر DWORD هي 0 و4 و8 و12.',
        solution: `INCLUDE Irvine32.inc

.data
numbers DWORD 1, 2, 3, 4

.code
main PROC
    mov eax, numbers
    xchg eax, numbers+12
    mov numbers, eax
    mov eax, numbers+4
    xchg eax, numbers+8
    mov numbers+4, eax
    mov esi, OFFSET numbers
    mov ecx, LENGTHOF numbers
    mov ebx, TYPE numbers
    call DumpMem
    exit
main ENDP
END main`
      }
    ],
    labCode: `INCLUDE Irvine32.inc

.data
ArrayA WORD 1, 2, 3, 4, 5, 6

.code
main PROC
    mov esi, OFFSET ArrayA
    mov ecx, 6
    mov ebx, 2
    call DumpMem

    mov ax, ArrayA
    xchg ArrayA+2, ax
    mov ArrayA, ax

    mov ax, ArrayA+4
    xchg ArrayA+6, ax
    mov ArrayA+4, ax

    mov ax, ArrayA+8
    xchg ArrayA+10, ax
    mov ArrayA+8, ax

    mov esi, OFFSET ArrayA
    mov ecx, 6
    mov ebx, 2
    call DumpMem
    exit
main ENDP
END main`
  },
  {
    id: 'loop-instruction',
    number: '07',
    title: 'The LOOP Instruction',
    arabicTitle: 'التكرار باستخدام LOOP',
    description: 'تكرار مجموعة تعليمات عددًا محددًا من المرات باستخدام LOOP والسجل ECX، مع قراءة الأحرف وطباعتها داخل حلقة.',
    pdf: 'assets/pdfs/loop-explained.pdf',
    theory: [
      {
        prompt: 'ماذا تفعل تعليمة LOOP في كل مرة يصل إليها التنفيذ؟',
        options: ['تنقص ECX بمقدار 1، ثم ترجع إلى العلامة إذا لم يصبح ECX صفرًا', 'تزيد ECX بمقدار 1 ثم ترجع إلى العلامة دائمًا', 'تقارن EAX بالصفر ثم تنهي البرنامج'],
        answer: 0,
        explanation: 'تنقص LOOP السجل ECX تلقائيًا ثم تفحصه: إن لم يكن صفرًا عاد التنفيذ إلى العلامة، وإن كان صفرًا انتهت الحلقة.'
      },
      {
        prompt: 'قرأنا حرفًا واحدًا بـReadChar قبل بداية الحلقة، ووضعنا WriteChar وحدها داخل حلقة تدور 3 مرات. ماذا يظهر عند إدخال A؟',
        options: ['AAA', 'ABC', 'A فقط'],
        answer: 0,
        explanation: 'ReadChar تُنفَّذ مرة واحدة لأنها خارج الحلقة، فيبقى الحرف في AL وتطبعه WriteChar في كل دورة.'
      },
      {
        prompt: 'ما الخطأ المتوقع إذا كان ECX يساوي صفرًا لحظة الوصول إلى أول LOOP؟',
        options: ['لن يُنفّذ جسم الحلقة إطلاقًا', 'يصبح ECX قيمة 32-bit العظمى فتدور الحلقة نحو أربعة مليارات مرة', 'يعطي المعالج خطأ ويتوقف فورًا'],
        answer: 1,
        explanation: 'LOOP تنقص ECX قبل الفحص؛ فتتحول 0 إلى FFFFFFFF وتستمر الحلقة. لذلك يجب أن يبدأ ECX بقيمة أكبر من صفر.'
      },
      {
        prompt: 'أين يجب أن نضع تعليمة تحديد عدد التكرارات في ECX؟',
        options: ['قبل العلامة التي تبدأ بها الحلقة', 'بعد العلامة مباشرة داخل الحلقة', 'بعد تعليمة LOOP'],
        answer: 0,
        explanation: 'لو وُضعت بعد العلامة لأُعيد ECX إلى قيمته الأولى في كل دورة، فلا يصل إلى الصفر وتصبح الحلقة لا نهائية.'
      }
    ],
    practical: [
      {
        title: 'احسب مضروب عدد يدخله المستخدم',
        task: 'اكتب برنامج MASM كاملًا يقرأ من المستخدم عددًا صحيحًا موجبًا n (من 1 إلى 12)، ثم يحسب n! = 1 × 2 × ... × n ويعرض الناتج. يجب أن يعمل الحل لأي n يدخله المستخدم، فلا تكتب الناتج مباشرة. أمثلة: 5! = 120 و4! = 24.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: {
          requiredOperations: ['loop', 'mul'],
          requiredCalls: ['readdec', 'writedec'],
          cases: [
          { name: 'n = 5', input: '5', expect: { registers: { EAX: 120 }, outputLines: ['120'] } },
          { name: 'n = 4', input: '4', expect: { registers: { EAX: 24 }, outputLines: ['24'] } },
          { name: 'n = 1', input: '1', expect: { registers: { EAX: 1 }, outputLines: ['1'] } },
          { name: 'n = 10', input: '10', expect: { registers: { EAX: 3628800 }, outputLines: ['3628800'] } },
          { name: 'n = 12', input: '12', expect: { registers: { EAX: 479001600 }, outputLines: ['479001600'] } }
          ]
        },
        answer: 'اقرأ n وانقله إلى ECX ليكون عدّاد الحلقة، وضع 1 في EAX كقيمة ابتدائية للناتج. داخل الحلقة اضرب EAX في ECX؛ ولأن ECX يتناقص من n إلى 1 يتكوّن حاصل الضرب المطلوب. اعرض EAX بعد انتهاء الحلقة.',
        solution: `INCLUDE Irvine32.inc

.code
main PROC
    call ReadDec
    mov ecx, eax
    mov eax, 1
L1:
    mul ecx
    loop L1
    call WriteDec
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'احسب أساس مرفوع إلى قوة',
        task: 'اكتب برنامجًا كاملًا يقرأ من المستخدم العدد base ثم العدد exp (أكبر من صفر)، ويحسب base ^ exp باستخدام الضرب المتكرر، ثم يعرض الناتج. مثال: إدخال 2 ثم 10 يعرض 1024. يجب أن يعمل الحل لأي قيمتين يدخلهما المستخدم (ما دام الناتج يتسع في 32-bit).',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: {
          requiredOperations: ['loop', 'mul'],
          requiredCalls: ['readdec', 'writedec'],
          cases: [
          { name: '2 ^ 10', input: '2\n10', expect: { registers: { EAX: 1024 }, outputLines: ['1024'] } },
          { name: '3 ^ 4', input: '3\n4', expect: { registers: { EAX: 81 }, outputLines: ['81'] } },
          { name: '7 ^ 1', input: '7\n1', expect: { registers: { EAX: 7 }, outputLines: ['7'] } },
          { name: '10 ^ 9', input: '10\n9', expect: { registers: { EAX: 1000000000 }, outputLines: ['1000000000'] } }
          ]
        },
        answer: 'احتفظ بالأساس في سجل لا تغيّره (مثل EBX)، وانقل الأس إلى ECX ليكون عدد التكرارات، وابدأ الناتج في EAX بالقيمة 1. في كل دورة اضرب EAX في الأساس. لاحظ أن MUL تضرب EAX تلقائيًا في المعامل الذي تكتبه.',
        solution: `INCLUDE Irvine32.inc

.code
main PROC
    call ReadDec
    mov ebx, eax
    call ReadDec
    mov ecx, eax
    mov eax, 1
L1:
    mul ebx
    loop L1
    call WriteDec
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'اجمع الأعداد من 1 إلى n',
        task: 'اكتب برنامجًا كاملًا يقرأ عددًا موجبًا n ثم يحسب مجموع الأعداد 1 + 2 + ... + n ويعرضه. مثال: إدخال 10 يعرض 55. يجب أن يعمل الحل لأي n.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: {
          requiredOperations: ['loop', 'add'],
          requiredCalls: ['readdec', 'writedec'],
          cases: [
          { name: 'n = 10', input: '10', expect: { registers: { EAX: 55 }, outputLines: ['55'] } },
          { name: 'n = 1', input: '1', expect: { registers: { EAX: 1 }, outputLines: ['1'] } },
          { name: 'n = 100', input: '100', expect: { registers: { EAX: 5050 }, outputLines: ['5050'] } }
          ]
        },
        answer: 'اجعل ECX يساوي n، وخصص سجلًا للمجموع يبدأ بصفر. في كل دورة أضف قيمة ECX الحالية إلى المجموع؛ فيمرّ ECX على n ثم n-1 حتى 1، وهي الأعداد المطلوبة نفسها. انقل المجموع إلى EAX قبل WriteDec.',
        solution: `INCLUDE Irvine32.inc

.code
main PROC
    call ReadDec
    mov ecx, eax
    mov ebx, 0
L1:
    add ebx, ecx
    loop L1
    mov eax, ebx
    call WriteDec
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'كرّر حرفًا بعدد يحدده المستخدم',
        task: 'اكتب برنامجًا كاملًا يقرأ من المستخدم عددًا (عدد المرات) ثم يقرأ حرفًا، ويطبع هذا الحرف بالعدد المطلوب في سطر واحد، ثم ينتقل إلى سطر جديد. مثال: إدخال 5 ثم * يطبع *****. انتبه: يجب حفظ العدد في مكان آمن قبل قراءة الحرف، حتى لا يضيع بعد استدعاء الإجراء الثاني.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: {
          requiredOperations: ['loop'],
          requiredCalls: ['readdec', 'readchar', 'writechar'],
          cases: [
          { name: 'العدد 5 والحرف *', input: '5\n*', expect: { registers: { ECX: 0 }, outputLines: ['*****'] } },
          { name: 'العدد 3 والحرف A', input: '3\nA', expect: { registers: { ECX: 0 }, outputLines: ['AAA'] } },
          { name: 'العدد 1 والحرف z', input: '1\nz', expect: { registers: { ECX: 0 }, outputLines: ['z'] } }
          ]
        },
        answer: 'خزّن العدد في ECX قبل قراءة الحرف، لأن ReadChar تضع الحرف في AL ولا تمس ECX. اقرأ الحرف مرة واحدة قبل العلامة، وضع WriteChar وحدها داخل الحلقة.',
        solution: `INCLUDE Irvine32.inc

.code
main PROC
    call ReadDec
    mov ecx, eax
    call ReadChar
L1:
    call WriteChar
    loop L1
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'اطبع الأبجدية من A حتى الحرف المُدخل',
        task: 'اكتب برنامجًا كاملًا يقرأ حرفًا كبيرًا (من A إلى Z)، ثم يطبع الأحرف الأبجدية من A وحتى هذا الحرف، كل حرف في سطر. مثال: إدخال D يطبع A ثم B ثم C ثم D، وإدخال A يطبع A فقط. تذكّر أن لكل حرف رمز ASCII عدديًا متسلسلًا.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: {
          requiredOperations: ['loop'],
          requiredCalls: ['readchar', 'writechar', 'crlf'],
          cases: [
          { name: 'الإدخال D', input: 'D', expect: { registers: { ECX: 0 }, outputLines: ['A', 'B', 'C', 'D'] } },
          { name: 'الإدخال A', input: 'A', expect: { registers: { ECX: 0 }, outputLines: ['A'] } },
          { name: 'الإدخال H', input: 'H', expect: { registers: { ECX: 0 }, outputLines: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] } }
          ]
        },
        answer: 'رمز A هو 65 ورمز كل حرف يليه أكبر بواحد. عدد الأحرف المطلوب طباعتها يساوي رمز الحرف المُدخل ناقص 64. استخدم هذا العدد في ECX، وابدأ AL بالحرف A، واطبعه ثم زِد AL بواحد في كل دورة.',
        solution: `INCLUDE Irvine32.inc

.code
main PROC
    call ReadChar
    movzx ecx, al
    sub ecx, 64
    mov al, 'A'
L1:
    call WriteChar
    call Crlf
    inc al
    loop L1
    exit
main ENDP
END main`
      },
      {
        title: 'اطبع 26 حرفًا متتاليًا بدءًا من حرف يدخله المستخدم',
        task: 'اكتب برنامجًا كاملًا يقرأ حرفًا واحدًا، ثم يطبع 26 حرفًا متتاليًا بدءًا من هذا الحرف في سطر واحد، حسب ترتيب رموز ASCII، ثم ينتقل إلى سطر جديد. مثال: إدخال A يطبع الأبجدية الكبيرة من A إلى Z، وإدخال a يطبع الأبجدية الصغيرة من a إلى z.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: {
          requiredOperations: ['loop'],
          requiredCalls: ['readchar', 'writechar'],
          cases: [
          { name: 'الإدخال A', input: 'A', expect: { registers: { ECX: 0 }, outputLines: ['ABCDEFGHIJKLMNOPQRSTUVWXYZ'] } },
          { name: 'الإدخال a', input: 'a', expect: { registers: { ECX: 0 }, outputLines: ['abcdefghijklmnopqrstuvwxyz'] } },
          { name: 'الإدخال K', input: 'K', expect: { registers: { ECX: 0 }, outputLines: ['KLMNOPQRSTUVWXYZ[\\]^_`abcd'] } }
          ]
        },
        answer: 'اقرأ الحرف مرة واحدة قبل الحلقة فيبقى في AL، وضع 26 في ECX لأن عدد الأحرف المطلوب ثابت. داخل الحلقة اطبع AL ثم زِده بواحد لينتقل إلى الحرف التالي في جدول ASCII.',
        solution: `INCLUDE Irvine32.inc

.code
main PROC
    call ReadChar
    mov ecx, 26
L1:
    call WriteChar
    inc al
    loop L1
    call Crlf
    exit
main ENDP
END main`
      },
      {
        title: 'عدّ تنازلي من n إلى 1',
        task: 'اكتب برنامجًا كاملًا يقرأ عددًا موجبًا n من المستخدم، ثم يطبع الأعداد من n نزولًا حتى 1، كل عدد في سطر مستقل. مثال: إدخال 5 يطبع 5 ثم 4 ثم 3 ثم 2 ثم 1. يجب أن يعمل الحل لأي n.',
        answerType: 'program',
        placeholder: 'اكتب برنامج MASM كاملًا هنا…',
        validation: { requiredOperations: ['loop'], requiredCalls: ['readdec', 'writedec'], cases: [
          { name: 'n = 5', input: '5', expect: { registers: { ECX: 0 }, outputNumbers: [5, 4, 3, 2, 1] } },
          { name: 'n = 1', input: '1', expect: { registers: { ECX: 0 }, outputNumbers: [1] } },
          { name: 'n = 8', input: '8', expect: { registers: { ECX: 0 }, outputNumbers: [8, 7, 6, 5, 4, 3, 2, 1] } }
        ] },
        answer: 'انقل n إلى ECX، فيبدأ العدّاد من n وينقص بواحد في كل دورة. في بداية كل دورة انسخ قيمة ECX إلى EAX واعرضها بـWriteDec ثم Crlf.',
        solution: `INCLUDE Irvine32.inc

.code
main PROC
    call ReadDec
    mov ecx, eax
L1:
    mov eax, ecx
    call WriteDec
    call Crlf
    loop L1
    exit
main ENDP
END main`
      }
    ],
    labCode: `INCLUDE Irvine32.inc

.code
main PROC
    mov ecx, 3
L1:
    call ReadChar
    call WriteChar
    call Crlf
    loop L1
    call DumpRegs
    exit
main ENDP
END main`
  }
];
