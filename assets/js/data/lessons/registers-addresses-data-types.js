window.AssemblyLessons = Object.assign(window.AssemblyLessons || {}, {
  'registers-addresses-data-types': `
    <div class="lesson-topline">
      <button class="back-link lesson-back" type="button" data-back-to-units>← <span>العودة إلى وحدات الأساسيات</span></button>
      <span class="lesson-tag">الوحدة 05 · x86 32-bit · MASM</span>
    </div>
    <h2 class="lesson-title">Registers, Addresses, and Data Types <span>السجلات والعناوين وأنواع البيانات</span></h2>
    <p class="lesson-lead">افهم أماكن العمل السريعة داخل المعالج، وكيف تصل التعليمات إلى الذاكرة، وكيف يؤثر حجم البيانات وترتيب بايتاتها على البرنامج.</p>

    <nav class="lesson-outline" aria-label="أقسام الوحدة">
      <a href="#lesson-explanation">الشرح</a>
      <a href="#lesson-questions">ما الذي ينبغي أن تعرفه؟</a>
    </nav>

    <section class="lesson-content" id="lesson-explanation" aria-labelledby="explanation-title">
      <h3 id="explanation-title"><span>01</span> الشرح</h3>

      <p>حتى نفهم تعليمات Assembly ونكتبها بصورة صحيحة، نحتاج إلى فهم ثلاثة أشياء: <bdi>Registers</bdi>، و<bdi>Memory Addresses</bdi>، و<bdi>Data Types</bdi>. ونحتاج أيضًا إلى معرفة ترتيب البايتات في الذاكرة، أو <bdi>Endianness</bdi>.</p>

      <h4>1. Registers</h4>
      <p>تخيّل الذاكرة مكانًا واسعًا يحتفظ بالبيانات، بينما <bdi>Registers</bdi> خانات صغيرة جدًا داخل نواة المعالج، يصل إليها بسرعة ويستخدمها أثناء تنفيذ التعليمات. حجمها محدود، لذلك ما نكدر نخزّن كل بيانات البرنامج داخلها.</p>
      <p>في x86 32-bit نركّز على نوعين رئيسيين:</p>

      <h5>سجلات البيانات</h5>
      <p>تُستخدم لحفظ القيم التي تعمل عليها التعليمات. من سجلات البيانات الشائعة <bdi>EAX</bdi> و<bdi>EBX</bdi> و<bdi>ECX</bdi> و<bdi>EDX</bdi>، وتوجد أيضًا سجلات مثل <bdi>ESI</bdi> و<bdi>EDI</bdi>.</p>
      <p>هذه الأسماء تصف سجلات متاحة للبرنامج، لكنها مو محصورة بوظيفة واحدة دائمًا. بعض التعليمات أو أساليب استدعاء الإجراءات تعطي سجلات معيّنة أدوارًا شائعة؛ مثلًا <bdi>EAX</bdi> يُستخدم كثيرًا لإرجاع نتيجة من إجراء، لكن الدور الدقيق يعتمد على التعليمة أو أسلوب استدعاء الإجراء.</p>

      <h5>سجلات المؤشرات</h5>
      <ul>
        <li><bdi>EBP:</bdi> يُستخدم عادةً للإشارة إلى إطار الإجراء في المكدس <bdi>Stack</bdi>.</li>
        <li><bdi>ESP:</bdi> يشير إلى الموضع الحالي أعلى المكدس؛ وتتغير قيمته عند إضافة قيم إلى المكدس أو إزالتها.</li>
        <li><bdi>EIP:</bdi> يحمل عنوان التعليمة التالية في مسار التنفيذ. يديره المعالج، ولا نتعامل معه مثل سجل بيانات عادي.</li>
      </ul>
      <p>هناك أيضًا <bdi>EFLAGS</bdi>، الذي يحتفظ بحالات يحدّثها المعالج، مثل <bdi>ZF (Zero Flag)</bdi> التي تشير إلى نتيجة تساوي صفرًا. نحتاج هذه الحالات لاحقًا مع التعليمات الشرطية.</p>
      <div class="lesson-note"><strong>تذكّر:</strong> سجلات مثل <bdi>RAX</bdi> و<bdi>R8</bdi> تنتمي إلى x86 64-bit. في أمثلة هذه الوحدة نستخدم أسماء سجلات 32-bit مثل <bdi>EAX</bdi> و<bdi>ESI</bdi>.</div>

      <h4>2. Sub-Registers: الأجزاء الأصغر من السجل</h4>
      <p>بعض سجلات البيانات يمكن الوصول إلى أجزاء منها بدل استخدام السجل كله. هذا مفيد عندما تكون البيانات أصغر من 32-bit.</p>
      <div class="register-breakdown" role="img" aria-label="تقسيم السجل EAX إلى EAX ذي 32 بت وAX ذي 16 بت وAH وAL، وكل منهما 8 بت">
        <div class="reg-level"><span>EAX <small>32-bit</small></span><div class="reg-bar"><i></i><i></i><i></i><i></i></div></div>
        <div class="reg-level reg-level-16"><span>AX <small>16-bit</small></span><div class="reg-bar"><i></i><i></i></div></div>
        <div class="reg-level reg-level-8"><span>أجزاء AX <small>8-bit لكل جزء</small></span><div class="reg-bar"><i>AH</i><i>AL</i></div></div>
      </div>
      <ul>
        <li><bdi>EAX:</bdi> كامل السجل، حجمه 32-bit.</li>
        <li><bdi>AX:</bdi> الجزء الأقل من EAX، حجمه 16-bit.</li>
        <li><bdi>AH:</bdi> أعلى 8 bits من AX.</li>
        <li><bdi>AL:</bdi> أقل 8 bits من AX.</li>
      </ul>
      <p>والنمط نفسه ينطبق على <bdi>EBX</bdi> و<bdi>ECX</bdi> و<bdi>EDX</bdi>:</p>
      <div class="isa-table-wrap" role="region" aria-label="أجزاء سجلات البيانات في x86 32-bit" tabindex="0">
        <table class="isa-table register-table">
          <thead><tr><th>السجل 32-bit</th><th>الجزء 16-bit</th><th>أعلى 8 bits</th><th>أقل 8 bits</th></tr></thead>
          <tbody>
            <tr><th>EAX</th><td>AX</td><td>AH</td><td>AL</td></tr>
            <tr><th>EBX</th><td>BX</td><td>BH</td><td>BL</td></tr>
            <tr><th>ECX</th><td>CX</td><td>CH</td><td>CL</td></tr>
            <tr><th>EDX</th><td>DX</td><td>DH</td><td>DL</td></tr>
          </tbody>
        </table>
      </div>
      <p>أما سجلات مثل <bdi>ESI</bdi> و<bdi>EDI</bdi> و<bdi>EBP</bdi> و<bdi>ESP</bdi>، فلها أجزاء 16-bit مثل <bdi>SI</bdi> و<bdi>DI</bdi> و<bdi>BP</bdi> و<bdi>SP</bdi>، لكن ما لها أجزاء 8-bit في نمط x86 32-bit.</p>

      <h4>3. Memory Addresses</h4>
      <p>تحتاج كل خانة في الذاكرة إلى عنوان حتى يستطيع المعالج الوصول إليها. في نمط x86 32-bit يكون العنوان بعرض 32-bit، ومجاله النظري من:</p>
      <pre class="lesson-code" dir="ltr"><code>0x00000000 إلى 0xFFFFFFFF</code></pre>
      <p>لكن البرنامج ما يقدر يقرأ أو يكتب أي عنوان يختاره بلا قيود. نظام التشغيل والمعالج يديران الذاكرة، ويحددان المناطق المسموح قراءتها أو كتابتها أو تنفيذ التعليمات منها.</p>

      <h4>4. طرق الوصول إلى القيمة Addressing Modes</h4>
      <p>تحدد طريقة العنونة <bdi>Addressing Mode</bdi> من أين يحصل المعالج على القيمة التي تحتاجها التعليمة. نفترض في الأمثلة أن عندنا سجلًا اسمه <bdi>EAX</bdi>، وسجلًا <bdi>EBX</bdi>، ومتغيرًا <bdi>myValue</bdi>، وأن <bdi>ESI</bdi> يحتوي عنوانًا في الذاكرة.</p>
      <div class="isa-table-wrap" role="region" aria-label="طرق العنونة مع أمثلة MASM 32-bit" tabindex="0">
        <table class="isa-table addressing-table">
          <thead><tr><th>طريقة العنونة</th><th>الفكرة</th><th>مثال MASM / x86 32-bit</th></tr></thead>
          <tbody>
            <tr><th>Immediate</th><td>القيمة مكتوبة ضمن التعليمة.</td><td><code>ADD EAX, 2</code></td></tr>
            <tr><th>Register</th><td>القيمة موجودة في سجل.</td><td><code>ADD EAX, EBX</code></td></tr>
            <tr><th>Direct</th><td>التعليمة تشير إلى متغير أو موقع ذاكرة معروف.</td><td><code>MOV EAX, myValue</code></td></tr>
            <tr><th>Indirect</th><td>السجل يحتوي العنوان الذي توجد عنده القيمة.</td><td><code>MOV EAX, DWORD PTR [ESI]</code></td></tr>
            <tr><th>Stack</th><td>الوصول إلى قيمة عبر المكدس، عادة باستخدام ESP.</td><td><code>PUSH EAX</code><br><code>MOV EAX, DWORD PTR [ESP]</code></td></tr>
          </tbody>
        </table>
      </div>
      <p>في المثال <bdi>[ESI]</bdi> تعني الوصول إلى الذاكرة عند العنوان الموجود في <bdi>ESI</bdi>، و<bdi>DWORD PTR</bdi> توضح أن القيمة المقروءة حجمها 4 بايتات.</p>
      <p>في <bdi>Immediate</bdi> و<bdi>Register</bdi> تكون القيمة نفسها ضمن التعليمة أو في السجل. أما في <bdi>Direct</bdi> و<bdi>Indirect</bdi> فيحتاج المعالج إلى الوصول إلى الذاكرة. و<bdi>PUSH</bdi> مثال على تعليمة تستخدم المكدس وتغيّر <bdi>ESP</bdi>.</p>
      <p>قد يكون الوصول إلى الذاكرة أبطأ من التعامل مع سجل، لكن ماكو ترتيب سرعة ثابت ينطبق على كل تعليمات ومعالجات؛ فالنتيجة تعتمد على تصميم المعالج ومكان البيانات في الذاكرة المخبئية وغيرها.</p>

      <h4>5. Address Endianness</h4>
      <p>عندما نخزّن قيمة تتكون من عدة بايتات في الذاكرة، نحتاج نحدد ترتيب هذه البايتات. هذا الترتيب يسمى <bdi>Endianness</bdi>.</p>
      <ul>
        <li><bdi>Little Endian:</bdi> يوضع البايت الأقل أهمية في العنوان الأقل.</li>
        <li><bdi>Big Endian:</bdi> يوضع البايت الأعلى أهمية في العنوان الأقل.</li>
      </ul>
      <p>لنأخذ القيمة <bdi>0x0011223344556677</bdi>. تتكون من 8 بايتات. إذا بدأنا من العنوان الأقل:</p>
      <div class="isa-table-wrap" role="region" aria-label="ترتيب بايتات القيمة في Little Endian وBig Endian" tabindex="0">
        <table class="isa-table endian-table" dir="ltr">
          <thead><tr><th>العنوان</th><th>+0</th><th>+1</th><th>+2</th><th>+3</th><th>+4</th><th>+5</th><th>+6</th><th>+7</th></tr></thead>
          <tbody>
            <tr><th>Little Endian</th><td>77</td><td>66</td><td>55</td><td>44</td><td>33</td><td>22</td><td>11</td><td>00</td></tr>
            <tr><th>Big Endian</th><td>00</td><td>11</td><td>22</td><td>33</td><td>44</td><td>55</td><td>66</td><td>77</td></tr>
          </tbody>
        </table>
      </div>
      <p>إذا خزّنا القيمة ثم قرأناها باستخدام الترتيب نفسه، نحصل على القيمة الأصلية. ترتيب البايتات لا يغيّر عنوان الذاكرة نفسه؛ إنما يغيّر ترتيب بايتات القيمة المخزّنة. معالجات x86 تستخدم <bdi>Little Endian</bdi>. <a href="https://software.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-vol-1-manual.pdf" target="_blank" rel="noreferrer">يوضح دليل Intel الرسمي ترتيب البايتات في IA-32 وIntel 64</a>.</p>
      <p>مثال أبسط: العدد <bdi>426</bdi> يساوي <bdi>0x01AA</bdi>. في Little Endian يُخزّن البايت <bdi>AA</bdi> في العنوان الأقل، ثم <bdi>01</bdi> في العنوان الذي يليه. أما Big Endian فيخزّن <bdi>01</bdi> أولًا ثم <bdi>AA</bdi>. لو قرأنا البايتين بترتيب معاكس فسنحصل على <bdi>0xAA01</bdi>، أي العدد <bdi>43521</bdi>.</p>
      <div class="lesson-note"><strong>ملاحظة:</strong> ترتيب البايتات مهم للقيم متعددة البايتات. أما النصوص، فعادةً تبقى حروفها مرتبة كما خُزّنت؛ Little Endian ما يعني عكس كل كلمة أو نص.</div>

      <h4>6. Data Types</h4>
      <p>تحدد أنواع البيانات عدد البايتات التي يستخدمها المتغير أو المعامل:</p>
      <div class="isa-table-wrap" role="region" aria-label="أحجام أنواع البيانات المستخدمة في MASM" tabindex="0">
        <table class="isa-table data-type-table">
          <thead><tr><th>النوع</th><th>الحجم</th><th>مثال</th></tr></thead>
          <tbody>
            <tr><th>BYTE</th><td>8 bits — بايت واحد</td><td><code>0ABh</code></td></tr>
            <tr><th>WORD</th><td>16 bits — بايتان</td><td><code>01AAh</code></td></tr>
            <tr><th>DWORD</th><td>32 bits — 4 بايتات</td><td><code>0ABCDEF12h</code></td></tr>
            <tr><th>QWORD</th><td>64 bits — 8 بايتات</td><td><code>0ABCDEF1234567890h</code></td></tr>
          </tbody>
        </table>
      </div>
      <p>في MASM، تُستخدم هذه الأسماء لتحديد حجم البيانات في الذاكرة. ويجب أن يتوافق حجم البيانات مع الجزء الذي تعمل عليه التعليمة:</p>
      <div class="isa-table-wrap" role="region" aria-label="مطابقة أجزاء السجلات مع أنواع البيانات" tabindex="0">
        <table class="isa-table data-type-table">
          <thead><tr><th>الجزء المستخدم</th><th>الحجم</th><th>نوع البيانات المطابق</th></tr></thead>
          <tbody><tr><th>AL</th><td>8 bits</td><td>BYTE</td></tr><tr><th>AX</th><td>16 bits</td><td>WORD</td></tr><tr><th>EAX</th><td>32 bits</td><td>DWORD</td></tr></tbody>
        </table>
      </div>
      <pre class="lesson-code" dir="ltr"><code>smallValue BYTE 0ABh
wordValue  WORD 01AAh
number     DWORD 0ABCDEF12h

mov al, smallValue
mov ax, wordValue
mov eax, number</code></pre>
      <p>يقرأ كل أمر قيمة تناسب حجم السجل المقابل له. أما <bdi>QWORD</bdi> فيخزّن 8 بايتات في الذاكرة، لكن ما عدنا سجلًا عامًا واحدًا بحجم 64-bit في x86 32-bit؛ لذلك ما نحمّل قيمة QWORD كاملة في <bdi>EAX</bdi>. <a href="https://learn.microsoft.com/en-us/cpp/assembler/masm/directives-reference?view=msvc-160" target="_blank" rel="noreferrer">مرجع Microsoft لتوجيهات MASM</a>.</p>

      <div class="lesson-summary"><span class="summary-mark">✓</span><p><strong>الخلاصة:</strong> السجلات تحفظ القيم التي يعمل عليها المعالج، والعناوين تحدد مواقع البيانات، وطرق العنونة تحدد شلون تصل التعليمات إليها. حجم البيانات وترتيب بايتاتها يحددان شلون تُقرأ القيمة وتُخزّن.</p></div>
    </section>

    <section class="lesson-questions" id="lesson-questions" aria-labelledby="questions-title">
      <div class="questions-heading"><span class="questions-mark">?</span><div><h3 id="questions-title"><span>02</span> ما الذي ينبغي أن تعرفه بعد هذه المحاضرة؟</h3><p>أسئلة نظرية لمراجعة أفكار المحاضرة.</p></div></div>
      <ol>
        <li>ما وظيفة Registers، وما الفرق العام بين سجلات البيانات وسجلات المؤشرات؟</li>
        <li>شلون يتفرع <bdi>EAX</bdi> إلى <bdi>AX</bdi> و<bdi>AH</bdi> و<bdi>AL</bdi>؟</li>
        <li>ما الفرق بين طرق العنونة Immediate وRegister وDirect وIndirect وStack؟</li>
        <li>شلون يختلف ترتيب تخزين القيمة في Little Endian عن Big Endian؟</li>
        <li>ليش لازم يتوافق حجم البيانات مع حجم السجل المستخدم؟</li>
      </ol>
    </section>
  `
});
