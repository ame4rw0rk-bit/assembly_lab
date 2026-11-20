window.AssemblyLessons = Object.assign(window.AssemblyLessons || {}, {
  'cpu-architecture': `
    <div class="lesson-topline">
      <button class="back-link lesson-back" type="button" data-back-to-units>← <span>العودة إلى وحدات الأساسيات</span></button>
      <span class="lesson-tag">الوحدة 03 · x86 32-bit · MASM</span>
    </div>
    <h2 class="lesson-title">CPU Architecture <span>معمارية المعالج</span></h2>
    <p class="lesson-lead">تعرّف على أجزاء المعالج، وتوقيت عمله، والمراحل التي تمر بها التعليمة حتى تُنفّذ.</p>

    <nav class="lesson-outline" aria-label="أقسام الوحدة">
      <a href="#lesson-explanation">الشرح</a>
      <a href="#lesson-questions">ما الذي ينبغي أن تعرفه؟</a>
    </nav>

    <section class="lesson-content" id="lesson-explanation" aria-labelledby="explanation-title">
      <h3 id="explanation-title"><span>01</span> الشرح</h3>

      <h4>1. ما دور المعالج؟</h4>
      <p><bdi>CPU</bdi> هو الجزء الذي ينفّذ تعليمات البرنامج ويعالج البيانات. يحتوي المعالج على أجزاء تتعاون أثناء التنفيذ:</p>
      <ul>
        <li><bdi>Control Unit (CU):</bdi> تنظّم خطوات التنفيذ وتوجّه انتقال البيانات والتعليمات.</li>
        <li><bdi>Arithmetic Logic Unit (ALU):</bdi> تنفّذ العمليات الحسابية والمنطقية.</li>
        <li><bdi>Registers:</bdi> مواقع صغيرة وسريعة يحتفظ فيها المعالج مؤقتًا بالقيم التي يعمل عليها.</li>
      </ul>

      <h4>2. Clock وClock Cycle</h4>
      <p>ينظّم <bdi>Clock</bdi> توقيت عمل المعالج. وكل نبضة توقيت تسمى <bdi>Clock Cycle</bdi>. وتقاس سرعة الساعة بوحدة <bdi>Hertz</bdi>، أي عدد النبضات في الثانية.</p>
      <p>إذا كان التردد <bdi>3 GHz</bdi>، فهذا يعني تقريبًا ثلاثة مليارات نبضة في الثانية لكل نواة عند ذلك التردد. لكنه <strong>لا يعني</strong> أن المعالج ينفّذ ثلاثة مليارات تعليمة في الثانية؛ فالتعليمة الواحدة قد تحتاج عدة نبضات، وقد تتداخل مراحل تعليمات مختلفة في المعالجات الحديثة.</p>
      <div class="flow-figure clock-figure" role="img" aria-label="نبضات الساعة المتكررة وتقسيم الوقت إلى Clock Cycles">
        <div class="flow-title">نبضات الساعة تقسّم الزمن إلى دورات</div>
        <div class="clock-wave" dir="ltr"><span></span><span></span><span></span><span></span><span></span></div>
        <div class="clock-cycle-labels" dir="ltr"><span>Cycle 1</span><span>Cycle 2</span><span>Cycle 3</span><span>Cycle 4</span></div>
      </div>
      <p>إذن <bdi>Clock Cycle</bdi> هي نبضة توقيت واحدة، أما <bdi>Instruction Cycle</bdi> فهي المراحل التي يمر بها المعالج لمعالجة تعليمة.</p>

      <h4>3. دورة تنفيذ التعليمة</h4>
      <p>نستخدم نموذجًا مبسّطًا من أربع مراحل حتى نفهم ما يحدث داخل المعالج:</p>
      <div class="flow-figure instruction-flow" role="img" aria-label="مراحل دورة التعليمة: جلب، فك، تنفيذ، حفظ ثم الانتقال للتعليمة التالية">
        <div class="flow-title">Instruction Cycle</div>
        <div class="flow-row" dir="ltr">
          <div class="flow-node"><strong>Fetch</strong><small>جلب التعليمة</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-tool"><strong>Decode</strong><small>فهم التعليمة</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-cpu"><strong>Execute</strong><small>تنفيذ العملية</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-machine"><strong>Store</strong><small>حفظ النتيجة</small></div>
        </div>
        <p class="flow-caption">بعد حفظ النتيجة، ينتقل المعالج إلى التعليمة التالية ويكرر المراحل.</p>
      </div>
      <ol class="cpu-stage-list">
        <li><strong>Fetch — جلب:</strong> يحدد سجل <bdi>EIP</bdi> في x86 32-bit عنوان التعليمة التالية. يجلب المعالج التعليمة من الذاكرة، وقد يجدها في Cache.</li>
        <li><strong>Decode — فك:</strong> تفهم وحدة التحكم <bdi>CU</bdi> معنى التعليمة والعملية المطلوبة.</li>
        <li><strong>Execute — تنفيذ:</strong> ينفّذ المعالج العملية. العمليات الحسابية والمنطقية تنفّذها عادةً <bdi>ALU</bdi>.</li>
        <li><strong>Store — حفظ:</strong> تُحفظ النتيجة في المكان المطلوب، مثل سجل أو موقع في الذاكرة.</li>
      </ol>
      <p>بعدها ينتقل المعالج إلى التعليمة التالية. وإذا غيّرت التعليمة مسار البرنامج، يتغير العنوان الذي يشير إليه <bdi>EIP</bdi>.</p>

      <h4>4. مثال على تنفيذ تعليمة Assembly</h4>
      <p>نفترض أن السجل <bdi>EAX</bdi> يحتوي على القيمة <bdi>4</bdi>. التعليمة التالية تزيد قيمته واحدًا:</p>
      <pre class="lesson-code" dir="ltr"><code>add eax, 1</code></pre>
      <p>في دورة التنفيذ، يجلب المعالج التعليمة ويفهم أنها عملية جمع. ثم تقرأ <bdi>ALU</bdi> قيمة <bdi>EAX</bdi> وتضيف إليها <bdi>1</bdi>. بعدها تُحفظ النتيجة الجديدة، وهي <bdi>5</bdi>، في <bdi>EAX</bdi>.</p>
      <p>هذه صيغة Intel لمعمارية <bdi>x86 32-bit</bdi>، وهي الصيغة المستخدمة في MASM.</p>

      <h4>5. ليش بعض التعليمات تحتاج دورات أكثر؟</h4>
      <p>تختلف التعليمات في مقدار العمل المطلوب لتنفيذها. كما تختلف طريقة التنفيذ بين معالج وآخر. لذلك قد تحتاج تعليمة إلى عدة <bdi>Clock Cycles</bdi>، ولا يصح افتراض أن كل تعليمة تستغرق دورة واحدة بالضبط.</p>
      <p>لهذا لا تعني زيادة تردد الساعة وحدها زيادة الأداء بالنسبة نفسها. يتأثر الأداء أيضًا بمعمارية المعالج، ونوع التعليمات، والذاكرة، وطريقة تنظيم مراحل التنفيذ.</p>

      <h4>6. تداخل المراحل وتعدد الأنوية</h4>
      <p>دورة التعليمة ذات المراحل الأربع هي نموذج تعليمي. في المعالجات الحديثة، قد تبدأ مرحلة جلب تعليمة جديدة بينما تعليمة سابقة في مرحلة الفك أو التنفيذ. يشبه ذلك خط إنتاج: تعمل مراحل مختلفة على تعليمات مختلفة في الوقت نفسه.</p>
      <div class="flow-figure pipeline-figure" role="img" aria-label="تداخل مراحل ثلاث تعليمات عبر الزمن داخل خط تنفيذ المعالج">
        <div class="flow-title">تداخل المراحل عبر الزمن</div>
        <div class="pipeline-grid" dir="ltr">
          <span class="pipeline-label">Instruction 1</span><b class="pipe-fetch">Fetch</b><b class="pipe-decode">Decode</b><b class="pipe-execute">Execute</b><b class="pipe-store">Store</b>
          <span class="pipeline-label">Instruction 2</span><i></i><b class="pipe-fetch">Fetch</b><b class="pipe-decode">Decode</b><b class="pipe-execute">Execute</b><b class="pipe-store">Store</b>
          <span class="pipeline-label">Instruction 3</span><i></i><i></i><b class="pipe-fetch">Fetch</b><b class="pipe-decode">Decode</b><b class="pipe-execute">Execute</b>
        </div>
        <p class="flow-caption">كل عمود يمثل خطوة زمنية؛ قد تعمل كل مرحلة على تعليمة مختلفة.</p>
      </div>
      <p>وتوجد أيضًا أكثر من نواة داخل كثير من المعالجات؛ كل نواة تستطيع تنفيذ تعليمات برنامج أو مسار عمل مستقل. هذا يختلف عن تداخل المراحل داخل النواة الواحدة.</p>

      <h4>7. علاقة التعليمة بمعمارية المعالج</h4>
      <p>لكل معمارية <bdi>Instruction Set Architecture (ISA)</bdi> تحدد التعليمات التي يفهمها المعالج وطريقة ترميزها. لذلك فإن <bdi>Machine Code</bdi> المخصص لمعمارية x86 قد لا يمثل التعليمة نفسها في ARM، وقد لا يكون صالحًا للتنفيذ عليها أصلًا.</p>
      <p>تختلف المعماريات كذلك في طريقة كتابة Assembly. يستخدم <bdi>MASM</bdi> أسلوب <bdi>Intel syntax</bdi>، لذلك نلتزم بصيغته في أمثلة هذه المادة.</p>
      <p>بصورة عامة، تميل تصاميم <bdi>RISC</bdi> إلى تعليمات أبسط وأكثر انتظامًا، بينما تسمح تصاميم <bdi>CISC</bdi> بتعليمات أكثر تنوعًا وتعقيدًا. لكن لا يمكن الحكم على سرعة المعالج أو استهلاكه للطاقة من هذين الاسمين وحدهما؛ فالأداء يتأثر بكيفية تصميم المعالج وتنفيذ التعليمات.</p>
      <p>تُظهر بعض أدوات النظام معلومات عن المعمارية وأوضاع التشغيل وترتيب البايتات، مثل <bdi>Little Endian</bdi>. أما معنى ترتيب البايتات نفسه فسيتضح عند دراسة تخزين البيانات والعناوين.</p>

      <div class="lesson-summary"><span class="summary-mark">✓</span><p><strong>الخلاصة:</strong> ساعة المعالج تنظّم التوقيت، ودورة التعليمة تشرح مراحل التعامل معها. النموذج الأساسي هو: جلب، فك، تنفيذ، ثم حفظ النتيجة؛ وقد تتداخل هذه المراحل في المعالجات الحديثة.</p></div>
    </section>

    <section class="lesson-questions" id="lesson-questions" aria-labelledby="questions-title">
      <div class="questions-heading"><span class="questions-mark">?</span><div><h3 id="questions-title"><span>02</span> ما الذي ينبغي أن تعرفه بعد هذه المحاضرة؟</h3><p>أسئلة نظرية لمراجعة أفكار المحاضرة.</p></div></div>
      <ol>
        <li>ما الفرق بين <bdi>Clock Cycle</bdi> و<bdi>Instruction Cycle</bdi>؟</li>
        <li>ماذا يعني تردد <bdi>3 GHz</bdi>، ولماذا لا يساوي عدد التعليمات التي ينفّذها المعالج في الثانية؟</li>
        <li>ما المراحل الأربع الأساسية لدورة التعليمة؟</li>
        <li>ما دور <bdi>EIP</bdi> في متابعة التعليمة التالية في x86 32-bit؟</li>
        <li>ما الفرق بين تداخل مراحل التعليمات داخل النواة الواحدة والتنفيذ على عدة أنوية؟</li>
      </ol>
    </section>
  `
});
