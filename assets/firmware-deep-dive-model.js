(() => {
  const checklist = [
    ['c-types','C data types, promotions and conversions','c-semantics'],
    ['volatile','Volatile, atomics and memory barriers','volatile-atomics'],
    ['bit-mask','Bit masking and safe register access','volatile-atomics'],
    ['const-static','Const, static, storage duration and linkage','c-semantics'],
    ['stack-heap','Stack versus heap and deterministic allocation','memory-linker'],
    ['c-memory','C memory layout and linker maps','memory-linker'],
    ['pointers','Advanced pointers, aliasing and alignment','pointers-ownership'],
    ['smart-pointers','Smart pointers, RAII and ownership','pointers-ownership'],
    ['linked-list','Data structures and linked-list implementation','pointers-ownership'],
    ['dma','DMA descriptors, ownership and cache coherency','dma'],
    ['semaphore-mutex','Semaphores, mutexes and priority inheritance','rtos-concurrency'],
    ['race','Race conditions and lost wakeups','rtos-concurrency'],
    ['deadlock','Deadlock, livelock and starvation','rtos-concurrency'],
    ['rtos','RTOS scheduling and response-time analysis','rtos-concurrency'],
    ['process-thread','Process versus thread','architectures'],
    ['multi-threading','Multithreading and memory ordering','rtos-concurrency'],
    ['bare-metal','Bare-metal firmware architecture','architectures'],
    ['linux','Embedded Linux architecture and drivers','linux-driver'],
    ['i2c','I2C electrical timing, arbitration and recovery','i2c'],
    ['uart','UART framing, baud tolerance and DMA','uart-rs485'],
    ['rs485','RS-485 termination and turnaround','uart-rs485'],
    ['spi','SPI modes, chip select and DMA','spi'],
    ['can','CAN arbitration, bit timing and bus-off','can'],
    ['ethernet','Ethernet PHY/MAC/DMA integration','ethernet-tcpip'],
    ['tcpip','TCP/IP framing, buffering and backpressure','ethernet-tcpip'],
    ['gpio-timer','GPIO, timers, capture and watchdogs','gpio-timers'],
    ['adc','ADC acquisition, triggering and calibration','adc'],
    ['pwm','PWM, dead-time and motor-control timing','pwm'],
    ['mcal','AUTOSAR MCAL configuration workflow','mcal-workflow'],
    ['mcal-peripherals','MCAL Mcu/Port/Dio/Gpt/Icu/Adc/Pwm/Spi/Can','mcal-peripherals'],
    ['cortex','Cortex-M23/M33/M4/M7 comparison','cortex-family'],
    ['aurix','AURIX TC3xx and TriCore architecture','aurix'],
    ['mcu-dsp','MCU/DSP workload partitioning','mcu-dsp'],
    ['schematics','Reading schematics and board bring-up','bringup-tools'],
    ['logic-analyzer','Logic analyzer selection and use','bringup-tools'],
    ['oscilloscope','Oscilloscope probing and signal integrity','bringup-tools'],
    ['multimeter','Multimeter use during bring-up','bringup-tools'],
    ['secure-boot','Secure boot, firmware upgrade and lifecycle','secure-update'],
    ['architecture','Firmware platform architecture and configuration','platform-governance'],
    ['leadership','Architecture reviews, supplier governance and technical leadership','platform-governance']
  ];

  const platforms = [
    ['Cortex-M23','Armv8-M Baseline','Compact, low-power, optional TrustZone','Verify optional MPU/debug and vendor SoC limits','Secure low-end control and sensing'],
    ['Cortex-M33','Armv8-M Mainline','TrustZone-M, optional DSP/FPU, modern isolation','Secure/non-secure attribution and interrupt ownership','Connected secure controllers'],
    ['Cortex-M4','Armv7E-M','Mature DSP/control ecosystem, optional FPU','No TrustZone-M; vendor memory/bus topology varies','Motor and industrial control'],
    ['Cortex-M7','Armv7E-M high performance','Caches, TCM, high compute and DSP/FPU options','Cache/DMA coherency and worst-case timing','High-rate control and gateways'],
    ['AURIX TC3xx','TriCore TC1.6.2 multicore','Local/shared memories, DMA, GTM, EVADC, CAN, safety/security','CSA/traps, SRI/FPI contention, derivative and safety initialization','Powertrain, chassis, inverter and domain control']
  ];

  const architectures = [
    ['Bare-metal','Transparent and small','Minimal isolation','Fast startup; complexity grows sharply','Small bounded controllers'],
    ['RTOS','Schedulable with evidence','Task separation; MPU optional','Modular real-time products','Concurrent MCU control'],
    ['Embedded Linux','General purpose; PREEMPT_RT needs proof','Process/MMU isolation','Rich drivers, services and updates','Connectivity and complex applications'],
    ['Hybrid MCU + Linux','Hard real-time on MCU','Physical/software containment','More IPC, time-sync and update coordination','Gateways and rich connected products']
  ];

  const tools = [
    ['Multimeter','Static voltage/current/resistance','Power rails, shorts, continuity','Fast edges and protocol timing'],
    ['Oscilloscope','Analog voltage over time','Rise/fall, ringing, jitter, PWM, ADC settling','Long multi-channel protocol history'],
    ['Logic analyzer','Digital states across channels','I2C/SPI/UART/CAN sequence and rare triggers','Analog margin and signal integrity'],
    ['SWD/JTAG/trace','Core, registers and execution','Fault frames, watchpoints and trace','Electrical correctness']
  ];

  const mcal = [
    ['Mcu','PLL, clocks, RAM, reset and modes','Divider/lock/fallback and derivative mismatch','Clock measurement, status and mode tests'],
    ['Port/Dio','Pads, pin mux and digital I/O','Conflicting ownership and unsafe startup','Schematic trace, register readback and waveform'],
    ['Gpt/Icu','Timers, capture and interrupts','Shared resource, tick, rollover and edge errors','Known source, wrap and latency tests'],
    ['Adc','Converters, groups, queues and triggers','Settling, mapping, trigger and buffer ownership','Stimulus sweep and trigger correlation'],
    ['Pwm','Periods, duty, complementary output and shadow update','Polarity, dead-time, unsafe startup and asynchronous update','Scope timing and safe-state tests'],
    ['Spi','Channels, jobs, sequences, CS, FIFO/DMA','Mode, CS timing, sequence and DMA mismatch','Logic/scope capture and abort recovery'],
    ['Can','Controllers, HRH/HTH, message RAM and interrupts','Bit timing, object allocation, bus-off and variant mapping','Bus analyzer, error injection and recovery']
  ];

  const questionTypes = [
    ['First-principles explanation', topic => `Explain ${topic.title} from first principles. State the hidden assumptions that a senior engineer must challenge.`,
      topic => [...topic.principles, `Close with evidence: ${topic.evidence.join('; ')}.`]],
    ['Failure diagnosis', topic => `${topic.failure} Build a disciplined diagnosis and containment plan.`,
      topic => ['Preserve the failing state before changing code.', `Test hypotheses against: ${topic.principles.join(' ')}`, `Collect ${topic.evidence.join(', ')}.`, 'Separate root cause, trigger, propagation and detection gaps.', 'Verify corrective action under the original stress and adjacent boundary cases.']],
    ['Architecture design', topic => `${topic.design} Define ownership, timing, failure handling and verification.`,
      topic => ['Clarify functional and non-functional requirements.', ...topic.principles.slice(0,3), `Plan verification using ${topic.evidence.join(', ')}.`, 'State residual risk and recovery behavior.']],
    ['Trade-off review', topic => `Review this trade-off for ${topic.title}: ${topic.tradeoff}`,
      topic => ['Make workload and lifecycle assumptions explicit.', 'Compare options with measurable timing, memory, safety, security and maintainability criteria.', ...topic.principles.slice(0,2), 'Record rejected alternatives and the evidence that would reopen the decision.']],
    ['Technical leadership', topic => `You own ${topic.title} across three products and two suppliers. One release is late and evidence is incomplete. What do you do?`,
      topic => ['Create one accountable technical owner and evidence baseline.', `Prioritize the highest-risk gaps: ${topic.evidence.join(', ')}.`, 'Separate must-fix release blockers from bounded follow-up work.', 'Protect common architecture while allowing documented, time-bounded exceptions.', 'Communicate decision, residual risk, owner and closure date to engineering and management.']]
  ];

  function buildQuestions(topics) {
    return topics.flatMap((topic, topicIndex) => questionTypes.map((type, typeIndex) => ({
      id: `FDD-${String(topicIndex + 1).padStart(2,'0')}-${typeIndex + 1}`,
      topicId: topic.id,
      group: topic.group,
      tier: typeIndex === 0 ? 'Advanced' : 'Expert',
      kind: type[0],
      question: type[1](topic),
      answer: type[2](topic),
      probes: [
        `Which assumption in ${topic.title} is most likely to be wrong?`,
        `What target evidence would falsify your preferred explanation?`,
        `How does the answer change under overload, reset or partial failure?`
      ]
    })));
  }

  globalThis.AUTOLEAP_FDD_MODEL = { checklist, platforms, architectures, tools, mcal, buildQuestions };
})();
