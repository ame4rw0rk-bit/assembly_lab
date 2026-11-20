window.AssemblyLessons = {
  'assembly-language': `
    <div class="lesson-topline">
      <button class="back-link lesson-back" type="button" data-back-to-units>← <span>العودة إلى وحدات الأساسيات</span></button>
      <span class="lesson-tag">الوحدة 01 · x86 32-bit · MASM</span>
    </div>
    <h2 class="lesson-title">Assembly Language <span>لغة التجميع</span></h2>
    <p class="lesson-lead">تعرّف على لغة Assembly ومكانها بين لغات البرمجة وتعليمات المعالج، واكتشف كيف تتحول التعليمات إلى صيغة قابلة للتنفيذ.</p>

    <nav class="lesson-outline" aria-label="أقسام الوحدة">
      <a href="#lesson-explanation">الشرح</a>
      <a href="#lesson-questions">ما الذي ينبغي أن تعرفه؟</a>
    </nav>

    <section class="lesson-content" id="lesson-explanation" aria-labelledby="explanation-title">
      <h3 id="explanation-title"><span>01</span> الشرح</h3>

      <h4>من البرنامج إلى المعالج</h4>
      <p>نستخدم الكمبيوتر والهاتف عن طريق أنظمة التشغيل والتطبيقات. يكتب المبرمج هذه البرامج بلغات مثل <bdi>C++</bdi> و<bdi>Java</bdi> و<bdi>Python</bdi>؛ لأنها أقرب إلى طريقة تعبير البشر وأسهل في القراءة والكتابة من تعليمات المعالج.</p>
      <p>المعالج <bdi>CPU</bdi> ينفّذ تعليمات ممثلة بصيغة ثنائية باستخدام <bdi>0</bdi> و<bdi>1</bdi>. لذلك لا تصل إليه البرامج بصيغتها التي كتبها المبرمج مباشرة؛ بل تمر بمراحل تحويل تجعل التعليمات مناسبة للمعالج.</p>

      <h4>ما هي Assembly؟</h4>
      <p><bdi>Assembly</bdi> لغة تستخدم أسماء رمزية مختصرة لتمثيل تعليمات المعالج. هذه الأسماء أسهل للإنسان من كتابة الأرقام الثنائية أو الست عشرية مباشرةً.</p>
      <p>لهذا توصف Assembly أحيانًا بأنها <bdi>Symbolic Machine Code</bdi>، أي تمثيل رمزي مقروء لتعليمات الآلة. لكن المعالج لا ينفّذ أسماء Assembly نفسها. برنامج اسمه <bdi>Assembler</bdi> يحوّلها إلى <bdi>Machine Code</bdi>، وهي التعليمات التي يستطيع المعالج تنفيذها.</p>

      <div class="flow-figure" role="img" aria-label="تحويل Assembly إلى Machine Code ثم تنفيذها بواسطة المعالج">
        <div class="flow-title">من Assembly إلى التنفيذ</div>
        <div class="flow-row" dir="ltr">
          <div class="flow-node"><strong>Assembly</strong><small>تعليمات رمزية</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-tool"><strong>Assembler</strong><small>يحوّل التعليمات</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-machine"><strong>Machine Code</strong><small>تعليمات الآلة</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-cpu"><strong>CPU</strong><small>ينفّذ التعليمات</small></div>
        </div>
        <p class="flow-caption">يحوّل Assembler الصيغة الرمزية إلى تعليمات يستطيع المعالج تنفيذها.</p>
      </div>

      <h4>كيف تصل اللغات عالية المستوى إلى المعالج؟</h4>
      <p>في النموذج التعليمي المبسّط، يحوّل <bdi>Compiler</bdi> البرنامج إلى تعليمات تناسب المعالج المستهدف، وقد تمر هذه العملية بصيغة Assembly. بعد ذلك يحوّل <bdi>Assembler</bdi> تعليمات Assembly إلى Machine Code.</p>
      <div class="flow-figure flow-figure-compact" role="img" aria-label="مسار مبسط لتحويل برنامج بلغة عالية المستوى إلى تعليمات ينفذها المعالج">
        <div class="flow-title">مسار مبسّط للبرنامج المترجم</div>
        <div class="flow-row" dir="ltr">
          <div class="flow-node"><strong>High-level</strong><small>لغة عالية المستوى</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-tool"><strong>Compiler</strong><small>يترجم البرنامج</small></div><span class="flow-arrow">→</span>
          <div class="flow-node"><strong>Assembly</strong><small>تعليمات رمزية</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-tool"><strong>Assembler</strong><small>يحوّل التعليمات</small></div><span class="flow-arrow">→</span>
          <div class="flow-node flow-machine"><strong>Machine Code</strong><small>للتنفيذ</small></div>
        </div>
        <p class="flow-caption">هذا مسار تعليمي مبسّط؛ تختلف مراحل الترجمة باختلاف اللغة والأدوات.</p>
      </div>
      <p>بعض اللغات، مثل <bdi>Python</bdi> و<bdi>JavaScript</bdi>، تعتمد على مفسّر أو بيئة تشغيل <bdi>Runtime</bdi> ومكتبات تساعدها على تنفيذ الأوامر. وقد تستخدم هذه البيئات صيغة وسيطة أو أجزاء مترجمة مسبقًا؛ لذلك تختلف مراحل التنفيذ من لغة إلى أخرى.</p>

      <h4>مثال: عرض عبارة على الشاشة</h4>
      <p>يوضح المثال طريقة عرض عبارة باستخدام Assembly لمعمارية <bdi>x86 32-bit</bdi> ومكتبة <bdi>Irvine32</bdi>، التي توفر دوال جاهزة للتعامل مع الشاشة:</p>
      <pre class="lesson-code" dir="ltr"><code>INCLUDE Irvine32.inc

.data
message BYTE "Hello, world!", 0

.code
main PROC
    mov edx, OFFSET message
    call WriteString
    call Crlf
    exit
main ENDP

END main</code></pre>
      <p>في قسم البيانات <bdi>.data</bdi>، تُخزَّن العبارة في المتغير <bdi>message</bdi>. والرقم <bdi>0</bdi> في نهايتها يحدد نهاية النص لدالة <bdi>WriteString</bdi>.</p>
      <p>في قسم التعليمات <bdi>.code</bdi>، يبدأ الإجراء <bdi>main</bdi>. تنقل التعليمة <bdi>mov</bdi> عنوان العبارة إلى السجل <bdi>EDX</bdi>. بعدها تستدعي <bdi>call WriteString</bdi> الدالة التي تعرض النص، وتستدعي <bdi>call Crlf</bdi> الدالة التي تنقل المؤشر إلى سطر جديد. ثم تنهي <bdi>exit</bdi> البرنامج.</p>

      <h4>Machine Code: ثنائي وست عشري</h4>
      <p>يمكن عرض Machine Code بطرق مختلفة. النظام الثنائي يستخدم <bdi>0</bdi> و<bdi>1</bdi>، أما النظام الست عشري <bdi>Hexadecimal</bdi> فيستخدم رموزًا أساسها 16 لعرض البيانات بصورة أقصر. كلاهما تمثيل لبايتات التعليمات نفسها، وليس لغة Assembly مختلفة.</p>
      <p>في مجال أمن المعلومات، يُستخدم مصطلح <bdi>Shellcode</bdi> لوصف تعليمات Machine Code تُحلَّل لدراسة سلوك البرامج والثغرات الأمنية.</p>

      <h4>اختلاف معماريات المعالجات</h4>
      <p>لكل معمارية معالج مجموعة تعليمات خاصة بها. من الأمثلة <bdi>Intel x86</bdi> و<bdi>ARM</bdi>، وتُستخدم ARM في كثير من الهواتف وبعض الحواسيب. لذلك لا تعمل تعليمات Assembly الخاصة بمعمارية تلقائيًا على معمارية أخرى.</p>

      <h4>لماذا نتعلم Assembly؟</h4>
      <p>تساعد Assembly على فهم ما يحدث داخل البرنامج بعد ترجمته: ما التعليمات التي ينفذها المعالج؟ وكيف يتعامل البرنامج مع البيانات والذاكرة؟ لهذا تُستخدم في تحليل البرامج وفهم الثغرات الأمنية، إلى جانب استخدامها في دراسة طريقة عمل المعالج والبرمجيات القريبة منه.</p>

      <h4>صيغة Java الوسيطة</h4>
      <p>تستخدم Java صيغة وسيطة تسمى <bdi>Bytecode</bdi>، ثم تتعامل معها بيئة <bdi>Java Runtime</bdi> على الجهاز. تختلف هذه الطريقة عن لغات مثل C++ التي تُترجم عادةً لتناسب الجهاز المستهدف. وتتأثر سرعة البرامج بعوامل متعددة، فلا تحددها اللغة وحدها.</p>

      <div class="lesson-summary"><span class="summary-mark">✓</span><p><strong>خلاصة الشرح:</strong> Assembly تمثيل رمزي لتعليمات قريبة من المعالج. يحوّلها Assembler إلى Machine Code، ثم ينفّذ المعالج التعليمات المناسبة لمعمارية الجهاز.</p></div>
    </section>

    <section class="lesson-questions" id="lesson-questions" aria-labelledby="questions-title">
      <div class="questions-heading"><span class="questions-mark">?</span><div><h3 id="questions-title"><span>02</span> ما الذي ينبغي أن تعرفه بعد هذه المحاضرة؟</h3><p>أسئلة نظرية لمراجعة أفكار المحاضرة.</p></div></div>
      <ol>
        <li>ما المقصود بلغة Assembly، ولماذا توصف بأنها <bdi>Symbolic Machine Code</bdi>؟</li>
        <li>ما وظيفة <bdi>Assembler</bdi>، وإلى أي صيغة يحوّل تعليمات Assembly؟</li>
        <li>ما المراحل الأساسية التي تمر بها تعليمات Assembly حتى ينفّذها <bdi>CPU</bdi>؟</li>
        <li>ما الفرق بين <bdi>Assembly</bdi> و<bdi>Machine Code</bdi>؟</li>
        <li>لماذا تختلف تعليمات Assembly بين معماريتَي <bdi>x86</bdi> و<bdi>ARM</bdi>؟</li>
      </ol>
    </section>
  `
};
