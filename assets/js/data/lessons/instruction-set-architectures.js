window.AssemblyLessons = Object.assign(window.AssemblyLessons || {}, {
  'instruction-set-architectures': `
    <div class="lesson-topline">
      <button class="back-link lesson-back" type="button" data-back-to-units>← <span>العودة إلى وحدات الأساسيات</span></button>
      <span class="lesson-tag">الوحدة 04 · x86 32-bit · MASM</span>
    </div>
    <h2 class="lesson-title">Instruction Set Architectures <span>معماريات مجموعات التعليمات</span></h2>
    <p class="lesson-lead">تعرّف على العلاقة بين المعالج وتعليماته، ثم افهم CISC وRISC كلًّا على حدة قبل مقارنة أسلوبي التصميم.</p>

    <nav class="lesson-outline" aria-label="أقسام الوحدة">
      <a href="#lesson-explanation">الشرح</a>
      <a href="#lesson-questions">ما الذي ينبغي أن تعرفه؟</a>
    </nav>

    <section class="lesson-content" id="lesson-explanation" aria-labelledby="explanation-title">
      <h3 id="explanation-title"><span>01</span> الشرح</h3>

      <h4>1. شنو هي Instruction Set Architecture؟</h4>
      <p><bdi>Instruction Set Architecture (ISA)</bdi> هي المواصفات التي تحدد شلون يتعامل البرنامج مع المعالج. تقدر تعتبرها اتفاقًا بين البرنامج والمعالج: البرنامج يطلب عملية بطريقة محددة، والمعالج يعرف شلون ينفّذها.</p>
      <p>تحدد ISA أمورًا مثل:</p>
      <ul>
        <li><bdi>Instructions:</bdi> العمليات التي يستطيع المعالج تنفيذها.</li>
        <li><bdi>Registers:</bdi> السجلات التي يمكن للتعليمات استخدامها.</li>
        <li><bdi>Memory Addressing:</bdi> الطرق التي تحدد مكان البيانات في الذاكرة.</li>
        <li><bdi>Data Types:</bdi> أنواع البيانات وأحجامها التي تتعامل معها التعليمات.</li>
      </ul>
      <p>إذا وصل إلى المعالج <bdi>Machine Code</bdi> مكتوب وفق ISA مختلفة، فقد لا يفهمه؛ لأن نفس البايتات ممكن يكون لها معنى مختلف في معمارية أخرى.</p>

      <h4>2. ISA تختلف عن طريقة كتابة Assembly</h4>
      <p>الـ<bdi>ISA</bdi> تحدد معنى التعليمة والعملية التي تنفّذها. أما <bdi>Assembly Syntax</bdi> فهي طريقة كتابة التعليمة حتى يقرأها المبرمج.</p>
      <p>للمعمارية نفسها، قد توجد أكثر من طريقة كتابة. مثلًا، توجد صيغتا <bdi>Intel syntax</bdi> و<bdi>AT&amp;T syntax</bdi> لمعالجات x86. قد تختلفان في الرموز وترتيب القيم، مع أنهما تعبّران عن العملية نفسها. يستخدم <bdi>MASM</bdi> صيغة Intel.</p>

      <h4>3. CISC: مجموعة تعليمات معقّدة</h4>
      <p><bdi>CISC</bdi> اختصار لـ<bdi>Complex Instruction Set Computer</bdi>. يسمح هذا التوجّه بتعليمات متنوعة، وبعضها يستطيع الجمع بين أكثر من نوع من العمل، مثل الوصول إلى قيمة في الذاكرة وإجراء عملية حسابية عليها.</p>
      <p>من أمثلته في <bdi>MASM وx86 32-bit</bdi>:</p>
      <pre class="lesson-code" dir="ltr"><code>ADD EAX, DWORD PTR [ESI]</code></pre>
      <p>تعمل هذه التعليمة بهذا الترتيب:</p>
      <ol class="cpu-stage-list">
        <li>يستخدم المعالج العنوان الموجود في <bdi>ESI</bdi> للوصول إلى قيمة في الذاكرة.</li>
        <li>يقرأ قيمة بحجم 32-bit من ذلك العنوان.</li>
        <li>يجمعها مع القيمة الموجودة في <bdi>EAX</bdi>.</li>
        <li>يضع الناتج في <bdi>EAX</bdi>.</li>
      </ol>
      <div class="flow-figure cisc-flow" role="img" aria-label="تعليمة CISC تجمع قيمة من الذاكرة مع قيمة سجل وتضع الناتج في السجل">
        <div class="flow-title">تعليمة x86 واحدة تستخدم قيمة من الذاكرة وتجمعها</div>
        <div class="flow-row" dir="ltr">
          <div class="flow-node flow-tool"><strong>Memory [ESI]</strong><small>القيمة المقروءة</small></div><span class="flow-arrow">+</span>
          <div class="flow-node"><strong>EAX</strong><small>القيمة الحالية</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-cpu"><strong>ADD</strong><small>تنفيذ الجمع</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-machine"><strong>EAX</strong><small>الناتج</small></div>
        </div>
      </div>
      <p>من وجهة نظر ISA كتبنا العملية بتعليمة واحدة. لكن هذا <strong>لا يعني</strong> أن كل ما يحدث داخل المعالج خطوة واحدة، أو أن التعليمة تستغرق دورة ساعة واحدة دائمًا. قد ينفّذ المعالج الحديث التعليمة داخليًا بعدة خطوات، وتختلف التفاصيل حسب تصميمه.</p>
      <p>ظهر توجه CISC عندما كانت الذاكرة وموارد الحاسوب محدودة ومكلفة. كانت التعليمات الغنية تساعد على إنجاز أعمال أكثر ببرنامج أقصر. عائلة <bdi>x86</bdi>، التي تستخدمها معالجات Intel وAMD، مثال معروف على هذا التوجه.</p>
      <p>تختلف تعليمات x86 في طولها وترميزها؛ لذلك يحتاج المعالج إلى فك أجزاء التعليمة وتحديد معناها قبل تنفيذها. <a href="https://www.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-vol-2a-manual.pdf" target="_blank" rel="noreferrer">دليل Intel لتنسيق تعليمات x86</a>.</p>

      <h4>4. RISC: مجموعة تعليمات مختزلة</h4>
      <p><bdi>RISC</bdi> اختصار لـ<bdi>Reduced Instruction Set Computer</bdi>. يركّز هذا التوجّه على تعليمات أبسط وأكثر انتظامًا.</p>
      <p>في كثير من تصاميم RISC، تعمل التعليمات الحسابية على السجلات. أما القراءة من الذاكرة والكتابة إليها فتتم بتعليمات نقل منفصلة. يسمى هذا الأسلوب <bdi>Load/Store</bdi>.</p>
      <p>لنفترض أن قيمة نريد استخدامها موجودة في الذاكرة. يكون التصور المبسّط هكذا:</p>
      <div class="flow-figure load-store-figure" role="img" aria-label="في أسلوب Load Store تُحمّل القيمة من الذاكرة إلى سجل، ثم تعالجها وحدة التنفيذ، ثم تخزن النتيجة عند الحاجة">
        <div class="flow-title">نقل البيانات والعملية الحسابية خطوات منفصلة</div>
        <div class="flow-row" dir="ltr">
          <div class="flow-node flow-tool"><strong>Memory</strong><small>قراءة القيمة</small></div><span class="flow-arrow">→</span>
          <div class="flow-node"><strong>Register</strong><small>تحميل القيمة</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-cpu"><strong>ALU</strong><small>تنفيذ العملية</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-machine"><strong>Register</strong><small>حفظ النتيجة</small></div>
        </div>
        <p class="flow-caption">تُستخدم تعليمة تخزين منفصلة إذا كان المطلوب إعادة النتيجة إلى الذاكرة.</p>
      </div>
      <p>تعليمة الجمع نفسها تستطيع أن تكون تعليمة واحدة إذا كانت القيم موجودة في السجلات. لكن إذا كانت قيمة ما في الذاكرة، قد يحتاج البرنامج إلى نقلها إلى سجل أولًا، ثم تنفيذ العملية، ثم تخزين النتيجة إذا لزم الأمر. هذا يوضح الفرق في <strong>تنظيم العمل</strong>، ولا يعني أن كل عملية حسابية في RISC تحتاج دائمًا إلى أربع تعليمات.</p>
      <p>انتظام التعليمات يساعد المعالج على تحديد حدودها وفكها. بعض معماريات RISC تستخدم طولًا ثابتًا في تعليماتها الأساسية، لكن هذا ليس قانونًا يشمل كل تصميم أو امتداد؛ توجد أيضًا تعليمات مضغوطة أقصر. <a href="https://docs.riscv.org/reference/isa/v20250508/unpriv/intro.html" target="_blank" rel="noreferrer">مواصفات RISC-V</a>، <a href="https://developer.arm.com/-/media/Arm%20Developer%20Community/PDF/Learn%20the%20Architecture/Armv8-A%20Instruction%20Set%20Architecture.pdf?revision=818c7869-3849-4e5d-bde2-710e69defb57" target="_blank" rel="noreferrer">دليل Armv8-A</a>.</p>

      <h4>5. المقارنة بين CISC وRISC</h4>
      <div class="isa-table-wrap" role="region" aria-label="جدول مقارنة CISC وRISC" tabindex="0">
        <table class="isa-table">
          <thead><tr><th>جانب المقارنة</th><th>CISC</th><th>RISC</th></tr></thead>
          <tbody>
            <tr><th>فكرة التصميم</th><td>تعليمات متنوعة، وبعضها يجمع أكثر من نوع من العمل.</td><td>تعليمات أبسط وأكثر انتظامًا عادةً.</td></tr>
            <tr><th>التعامل مع الذاكرة</th><td>بعض التعليمات تستخدم قيمة من الذاكرة ضمن العملية.</td><td>كثير من التصاميم تفصل نقل البيانات عن الحساب.</td></tr>
            <tr><th>طول التعليمة</th><td>قد يختلف طول تعليمات x86.</td><td>قد يكون ثابتًا في المجموعة الأساسية، مع وجود استثناءات وامتدادات.</td></tr>
            <tr><th>عدد التعليمات</th><td>بعض الأعمال يمكن كتابتها بتعليمة مركبة.</td><td>قد تتطلب بعض الأعمال تعليمات متعددة أبسط.</td></tr>
            <tr><th>فك التعليمة</th><td>تنوع أشكال التعليمات يحتاج إلى تحليل ترميزها.</td><td>الانتظام قد يسهل تحديد حدود التعليمات وفكها.</td></tr>
            <tr><th>السرعة والطاقة</th><td>تعتمدان على تصميم المعالج والبرنامج.</td><td>تعتمدان على تصميم المعالج والبرنامج.</td></tr>
          </tbody>
        </table>
      </div>
      <p>هذه فروقات عامة بين أسلوبي تصميم، وليست ضمانات للأداء. ما يصح نقول إن كل معالج CISC أبطأ أو يستهلك طاقة أكثر، أو إن كل معالج RISC أسرع. طريقة تصميم المعالج وتنفيذه للتعليمات، ونوع البرنامج، كلها تؤثر في الأداء.</p>

      <h4>6. هل يمكن بناء حاسوب بتعليمة واحدة؟</h4>
      <p>نظريًا، يمكن بناء نظام حوسبة عام باستخدام مجموعة صغيرة جدًا من التعليمات، بل قد تكفي تعليمة واحدة إذا أمكن استخدامها للتكرار والتحكم بمسار التنفيذ. عندها تُبنى العمليات المعقدة من تكرار التعليمة بترتيب مناسب.</p>
      <p>هذه فكرة نظرية توضح أن قوة الحاسوب ما تعتمد فقط على عدد التعليمات. لكنها لا تعني أن المعالجات العملية تستخدم تعليمة واحدة.</p>

      <div class="lesson-summary"><span class="summary-mark">✓</span><p><strong>الخلاصة:</strong> ISA تحدد التعليمات والسجلات والعناوين وأنواع البيانات التي يفهمها المعالج. أما CISC وRISC فهما طريقتان مختلفتان لتنظيم مجموعة التعليمات. نعرف الفرق بينهما من طريقة تصميم التعليمات والتعامل مع الذاكرة، ولا نحكم على سرعة المعالج أو استهلاك الطاقة من الاسم وحده.</p></div>
    </section>

    <section class="lesson-questions" id="lesson-questions" aria-labelledby="questions-title">
      <div class="questions-heading"><span class="questions-mark">?</span><div><h3 id="questions-title"><span>02</span> ما الذي ينبغي أن تعرفه بعد هذه المحاضرة؟</h3><p>أسئلة نظرية لمراجعة أفكار المحاضرة.</p></div></div>
      <ol>
        <li>ما المقصود بـ<bdi>ISA</bdi>، وما أهم الأمور التي تحددها؟</li>
        <li>ما الفرق بين ISA وطريقة كتابة تعليمات Assembly؟</li>
        <li>شلون يختلف أسلوب CISC عن RISC في تصميم التعليمات والتعامل مع الذاكرة؟</li>
        <li>لماذا ما يصح نفترض أن كل تعليمة CISC تنفّذ بدورة واحدة، أو أن كل تعليمة RISC تحتاج عدة تعليمات؟</li>
        <li>ما فائدة انتظام التعليمات في تصميم RISC؟</li>
      </ol>
    </section>
  `
});
