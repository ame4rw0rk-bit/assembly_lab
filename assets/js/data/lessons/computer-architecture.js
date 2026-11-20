window.AssemblyLessons = Object.assign(window.AssemblyLessons || {}, {
  'computer-architecture': `
    <div class="lesson-topline">
      <button class="back-link lesson-back" type="button" data-back-to-units>← <span>العودة إلى وحدات الأساسيات</span></button>
      <span class="lesson-tag">الوحدة 02 · Computer Architecture</span>
    </div>
    <h2 class="lesson-title">Computer Architecture <span>معمارية الحاسوب</span></h2>
    <p class="lesson-lead">تعرّف على مكوّنات الحاسوب، وكيف تتعاون الذاكرة والمعالج وأجهزة الإدخال والإخراج لتنفيذ البرامج.</p>

    <nav class="lesson-outline" aria-label="أقسام الوحدة">
      <a href="#lesson-explanation">الشرح</a>
      <a href="#lesson-questions">ما الذي ينبغي أن تعرفه؟</a>
    </nav>

    <section class="lesson-content" id="lesson-explanation" aria-labelledby="explanation-title">
      <h3 id="explanation-title"><span>01</span> الشرح</h3>

      <h4>1. ما المقصود بـ Computer Architecture؟</h4>
      <p><bdi>Computer Architecture</bdi> هي الصورة العامة لتصميم الحاسوب: ما مكوّناته، وما وظيفة كل مكوّن، وكيف تتبادل المكوّنات التعليمات والبيانات حتى ينفّذ الحاسوب البرامج.</p>
      <p>من أشهر التصاميم <bdi>Von Neumann Architecture</bdi>. فكرتها الأساسية أن التعليمات والبيانات تُخزّن في الذاكرة، ثم يجلبها المعالج وينفّذها. هذا التصميم ما زال أساسًا لفهم كثير من الحواسيب، حتى لو كانت تفاصيل الأجهزة الحديثة أكثر تعقيدًا.</p>

      <h4>2. المكوّنات الرئيسية للحاسوب</h4>
      <p>يتكوّن الحاسوب، بصورة مبسّطة، من ثلاثة أجزاء رئيسية:</p>
      <div class="flow-figure" role="img" aria-label="المكونات الرئيسية للحاسوب: المعالج والذاكرة وأجهزة الإدخال والإخراج">
        <div class="flow-title">الصورة العامة للحاسوب</div>
        <div class="flow-row" dir="ltr">
          <div class="flow-node flow-cpu"><strong>CPU</strong><small>يعالج وينفّذ</small></div><span class="flow-arrow">⇄</span>
          <div class="flow-node flow-machine"><strong>Memory</strong><small>تخزّن مؤقتًا</small></div><span class="flow-arrow">⇄</span>
          <div class="flow-node flow-tool"><strong>Input / Output</strong><small>إدخال وإخراج</small></div>
        </div>
      </div>
      <ul>
        <li><bdi>CPU:</bdi> ينفّذ تعليمات البرنامج ويعالج البيانات.</li>
        <li><bdi>Memory:</bdi> تحتفظ بالتعليمات والبيانات التي يحتاجها البرنامج أثناء العمل.</li>
        <li><bdi>Input/Output:</bdi> تسمح للحاسوب باستقبال البيانات وإظهار النتائج أو حفظها؛ مثل لوحة المفاتيح والشاشة ووحدات التخزين.</li>
      </ul>
      <p>ويمكن النظر إلى داخل المعالج بصورة أولية على أنه يضم:</p>
      <ul>
        <li><bdi>Control Unit (CU):</bdi> تنظّم تنفيذ التعليمات وتوجّه عمل أجزاء المعالج.</li>
        <li><bdi>Arithmetic Logic Unit (ALU):</bdi> تنفّذ العمليات الحسابية والمنطقية.</li>
        <li><bdi>Registers:</bdi> مواقع تخزين صغيرة وسريعة داخل المعالج.</li>
      </ul>
      <p>المعالج يجلب التعليمات والبيانات، يعالجها، ثم يرسل النتائج إلى الذاكرة أو إلى جهاز إخراج.</p>

      <h4>3. كيف تتحرك البيانات؟</h4>
      <p>عندما يعمل برنامج، يحتاج المعالج إلى تعليماته وبياناته. في النموذج المبسّط، تكون البيانات المطلوبة في الذاكرة، فيجلبها المعالج ويعالجها. وقد يرسل نتيجة إلى الشاشة أو يحفظها في وحدة التخزين.</p>
      <div class="flow-figure flow-figure-compact" role="img" aria-label="انتقال البرنامج من التخزين إلى الذاكرة ثم المعالج وإخراج النتيجة">
        <div class="flow-row" dir="ltr">
          <div class="flow-node flow-tool"><strong>Storage</strong><small>ملفات البرنامج</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-machine"><strong>RAM</strong><small>بيانات أثناء التشغيل</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-cpu"><strong>CPU</strong><small>يجلب ويعالج</small></div><span class="flow-arrow">→</span>
          <div class="flow-node"><strong>Output</strong><small>شاشة أو تخزين</small></div>
        </div>
      </div>
      <p>وحدات التخزين مثل <bdi>SSD</bdi> و<bdi>HDD</bdi> تحتفظ بالملفات والتطبيقات حتى بعد إطفاء الحاسوب. أما <bdi>RAM</bdi> فتحتفظ مؤقتًا بما يحتاجه البرنامج أثناء التشغيل. لهذا ينقل نظام التشغيل البيانات المطلوبة من التخزين إلى الذاكرة عند تشغيل البرامج، بدل أن يعتمد المعالج على وحدة التخزين لكل عملية.</p>

      <h4>4. الذاكرة وطبقات السرعة</h4>
      <p>الذاكرة ليست مستوى واحدًا. توجد طبقات تختلف في سرعتها وحجمها وموقعها:</p>
      <div class="flow-figure memory-hierarchy" role="img" aria-label="ترتيب طبقات التخزين من الأسرع والأصغر إلى الأبطأ والأكبر">
        <div class="flow-title">من الأسرع والأصغر إلى الأبطأ والأكبر</div>
        <div class="flow-row" dir="ltr">
          <div class="flow-node flow-cpu"><strong>Registers</strong><small>داخل المعالج</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-machine"><strong>Cache</strong><small>L1 · L2 · L3</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-tool"><strong>RAM</strong><small>ذاكرة أساسية</small></div><span class="flow-arrow">→</span>
          <div class="flow-node"><strong>SSD / HDD</strong><small>تخزين دائم</small></div>
        </div>
      </div>
      <ul>
        <li><bdi>Registers:</bdi> داخل المعالج، وسعتها صغيرة جدًا، ويستخدمها المعالج مباشرة أثناء تنفيذ التعليمات.</li>
        <li><bdi>Cache:</bdi> ذاكرة سريعة تحتفظ بنسخ من بيانات وتعليمات يُحتمل أن يحتاجها المعالج قريبًا. مستوياتها الشائعة <bdi>L1 وL2 وL3</bdi>؛ وتختلف تفاصيلها بين المعالجات.</li>
        <li><bdi>RAM:</bdi> أكبر من Cache، لكنها أبطأ. تحتفظ بالبرامج والبيانات المطلوبة أثناء التشغيل.</li>
        <li><bdi>SSD / HDD:</bdi> سعتها كبيرة وتحتفظ بالبيانات لمدة طويلة، لكنها أبطأ من RAM وCache.</li>
      </ul>
      <p>وجود Cache يقلل حاجة المعالج إلى انتظار RAM في كل مرة يحتاج فيها إلى تعليمات أو بيانات. كلما ابتعدنا في هذا التسلسل عن المعالج، زادت السعة عادةً وقلّت السرعة. أما أرقام زمن الوصول المحددة فتختلف بحسب الجهاز، لذلك نستخدم هذا الترتيب لفهم الفكرة لا لحفظ رقم ثابت.</p>

      <h4>5. عناوين الذاكرة وحجمها</h4>
      <p>يصل المعالج إلى مواقع الذاكرة باستخدام <bdi>Memory Addresses</bdi>. تخيّل الذاكرة مثل صف طويل من الخانات، ولكل خانة عنوان يميّزها.</p>
      <p>في نظام يستخدم عناوين بعرض <bdi>32-bit</bdi>، يوجد نظريًا <bdi>2^32</bdi> عنوانًا مختلفًا. وإذا كان كل عنوان يشير إلى بايت واحد، فهذا يعادل مساحة عناوين مقدارها <bdi>4 GiB</bdi> تقريبًا. أما <bdi>64-bit</bdi> فيتيح مساحة نظرية أكبر بكثير، لكن المعالجات وأنظمة التشغيل لا تستخدم بالضرورة كل العناوين الممكنة.</p>
      <div class="lesson-note"><strong>مهم:</strong> مساحة العناوين النظرية لا تعني أن الجهاز يحتوي فعليًا على هذا المقدار من RAM. كما أن العناوين الافتراضية التي يستخدمها البرنامج والعناوين الفعلية في RAM ليست دائمًا الشيء نفسه؛ يتولى نظام التشغيل والمعالج إدارة العلاقة بينها.</div>

      <h4>6. تنظيم ذاكرة البرنامج</h4>
      <p>يرى البرنامج مساحة ذاكرة منظّمة منطقيًا إلى أجزاء لها وظائف مختلفة:</p>
      <div class="memory-map" role="img" aria-label="تصور منطقي لأقسام ذاكرة البرنامج من العناوين الأعلى إلى الأدنى">
        <span class="memory-address">عناوين أعلى</span>
        <div class="memory-segment segment-stack"><b>Stack</b><small>استدعاءات الدوال وبياناتها المؤقتة</small></div>
        <div class="memory-segment segment-heap"><b>Heap</b><small>بيانات ينشئها البرنامج أثناء التشغيل</small></div>
        <div class="memory-segment segment-data"><b>Data</b><small>بيانات البرنامج الثابتة والعامة</small></div>
        <div class="memory-segment segment-text"><b>Text</b><small>تعليمات البرنامج</small></div>
        <span class="memory-address">عناوين أقل</span>
      </div>
      <p>هذا <bdi>تصوّر منطقي لذاكرة العملية</bdi>، وليس تقسيمًا فعليًا للـRAM إلى أربعة أقسام ثابتة. لكل برنامج مساحة عناوين افتراضية خاصة به يديرها نظام التشغيل. كما أن ترتيب الأجزاء واتجاه نموها قد يختلفان باختلاف النظام؛ الرسم للتوضيح فقط.</p>

      <h4>7. كيف تتصل المكوّنات؟ Bus</h4>
      <p>تتواصل أجزاء الحاسوب عبر قنوات اتصال وواجهات تسمى <bdi>Bus</bdi>. يمكن تشبيهها بطرق تنقل المعلومات بين المعالج والذاكرة وأجهزة الإدخال والإخراج.</p>
      <p>في النموذج الأساسي، تنقل هذه القنوات أنواعًا مختلفة من المعلومات:</p>
      <ul>
        <li><bdi>Data:</bdi> القيمة أو البيانات التي يجري نقلها.</li>
        <li><bdi>Address:</bdi> موقع الذاكرة أو الجهاز المقصود.</li>
        <li><bdi>Control:</bdi> إشارات تحدد نوع العملية، مثل القراءة أو الكتابة.</li>
      </ul>
      <p>عرض الناقل يحدد مقدار البيانات التي يمكن نقلها في عملية واحدة ضمن تصميم معيّن، لكن الأداء يعتمد أيضًا على سرعة الاتصال وطريقته، مو على العرض وحده.</p>

      <h4>8. ما علاقة هذا كله بـ Assembly؟</h4>
      <p>تعليمات Assembly تتعامل مع المعالج والذاكرة بصورة قريبة من العتاد. فهم Computer Architecture يساعد الطالب على معرفة مصدر البيانات ووجهتها، ولماذا قد يكون الوصول إلى سجل داخل المعالج أسرع من الوصول إلى RAM، ولماذا تختلف التعليمات أو العناوين بين المعماريات.</p>
      <p>هذه الصورة العامة تمهّد لفهم تفاصيل <bdi>CPU Architecture</bdi> والسجلات والعناوين في الوحدات القادمة.</p>

      <div class="lesson-summary"><span class="summary-mark">✓</span><p><strong>الخلاصة:</strong> يتعاون المعالج والذاكرة وأجهزة الإدخال والإخراج لتنفيذ البرامج. تساعد طبقات الذاكرة ووسائل الاتصال والعناوين على فهم مكان البيانات وكيف تصل إلى المعالج.</p></div>
    </section>

    <section class="lesson-questions" id="lesson-questions" aria-labelledby="questions-title">
      <div class="questions-heading"><span class="questions-mark">?</span><div><h3 id="questions-title"><span>02</span> ما الذي ينبغي أن تعرفه بعد هذه المحاضرة؟</h3><p>أسئلة نظرية لمراجعة أفكار المحاضرة.</p></div></div>
      <ol>
        <li>ما الفكرة الأساسية في <bdi>Von Neumann Architecture</bdi>؟</li>
        <li>ما المكوّنات الرئيسية للحاسوب، وما وظيفة كل منها بصورة عامة؟</li>
        <li>ما الفرق بين <bdi>Cache</bdi> و<bdi>RAM</bdi> ووحدات التخزين من حيث السرعة والاستخدام؟</li>
        <li>ما المقصود بمساحة العناوين النظرية، ولماذا لا تساوي بالضرورة مقدار RAM الفعلي؟</li>
        <li>ما المعلومات التي تنقلها قنوات <bdi>Bus</bdi> بين مكوّنات الحاسوب؟</li>
      </ol>
    </section>
  `
});
