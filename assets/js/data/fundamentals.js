/* Course content is kept separate from the UI so it can later come from an API. */
window.AssemblyCourseData = {
  fundamentals: [
    {
      id: 'assembly-language',
      title: 'Assembly Language',
      arabicTitle: 'لغة التجميع',
      description: 'تعرّف على لغة قريبة من تعليمات المعالج، وكيف تتحول الأوامر إلى خطوات ينفذها الحاسوب.',
      topics: ['Machine code', 'Assembler', 'Source code'],
      number: '01'
    },
    {
      id: 'computer-architecture',
      title: 'Computer Architecture',
      arabicTitle: 'معمارية الحاسوب',
      description: 'افهم المكوّنات الرئيسية للحاسوب وكيف تتعاون لتنفيذ البرامج ومعالجة البيانات.',
      topics: ['CPU', 'Memory', 'Input / Output'],
      number: '02'
    },
    {
      id: 'cpu-architecture',
      title: 'CPU Architecture',
      arabicTitle: 'معمارية المعالج',
      description: 'تعرّف على أجزاء المعالج ودورة تنفيذ التعليمة من جلبها حتى تنفيذها.',
      topics: ['Control Unit', 'ALU', 'Instruction cycle'],
      number: '03'
    },
    {
      id: 'instruction-set-architectures',
      title: 'Instruction Set Architectures',
      arabicTitle: 'معماريات مجموعات التعليمات',
      description: 'اكتشف ما الذي تحدده مجموعة التعليمات، وكيف تميّز بين عائلات المعالجات وطرائقها.',
      topics: ['ISA', 'CISC', 'RISC'],
      number: '04'
    },
    {
      id: 'registers-addresses-data-types',
      title: 'Registers, Addresses, and Data Types',
      arabicTitle: 'السجلات والعناوين وأنواع البيانات',
      description: 'تعرّف على سجلات x86 ذات 32-bit، وعناوين الذاكرة، وأحجام البيانات الأساسية.',
      topics: ['EAX / EBX', 'Memory address', 'BYTE / WORD / DWORD'],
      number: '05'
    }
  ]
};
