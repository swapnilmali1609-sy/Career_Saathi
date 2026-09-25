/**
 * languageConfigs.js (Server)
 * Single source of truth for programming language calibrations in technical interviews.
 * Defines core pillars, allowed topics, prohibited topics, strict instructions, and curated questions.
 */

import { getRoleProfile } from './roleConfigs.js';

export const LANGUAGE_PROFILES = {
  python: {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    badge: 'Python Specialist',
    color: '#38bdf8',
    aliases: ['python', 'py', 'python3', 'cpython'],
    corePillars: [
      'GIL (Global Interpreter Lock) & CPU vs I/O Concurrency',
      'Memory Management, Reference Counting & Cyclic Garbage Collection',
      'Generators, Iterators, yield from & Memory Streaming',
      'Decorators, Closures, functools.wraps & Metaclasses',
      'Asyncio Event Loop, Coroutines, Tasks & Async Context Managers',
      'Type Hints, Pydantic, Dataclasses & Pythonic Clean Code'
    ],
    allowedTopics: [
      'cpython', 'gil', 'multiprocessing', 'asyncio', 'threading in python',
      'generators', 'iterators', 'yield from', 'decorators', 'functools',
      'reference counting', 'cyclic gc', 'tracemalloc', 'pydantic', 'dataclasses',
      'dunder methods', 'context managers', 'pytest', 'celery', 'fastapi', 'django',
      'numpy', 'pandas', 'scipy', 'pythonic idioms'
    ],
    prohibitedTopics: [
      'javascript event loop', 'microtask queue', 'v8 engine', 'browser rendering',
      'react fiber', 'react hooks', 'jvm', 'java bytecode', 'g1 gc', 'zgc',
      'spring boot', 'c++ pointers', 'raii', 'vtable', 'goroutines', 'go channels',
      'c# span', 'clr gc', 'rust borrow checker', 'swift arc'
    ],
    strictInstruction: (
      'Calibrate all technical questions, code snippets, memory management discussions, ' +
      'and architectural patterns strictly to Python (CPython internals, asyncio, GIL, and idiomatic Pythonic design). Never include JavaScript, Java, C++, or Go syntax.'
    ),
    questions: [
      {
        title: 'Python GIL and Multi-Core Concurrency Bottlenecks',
        questionText: 'Explain the Global Interpreter Lock (GIL) in CPython. When scaling a high-throughput microservice, how do you decide between threading, multiprocessing, and asyncio, and how does Python 3.13 free-threaded mode impact this?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['GIL', 'CPython', 'multiprocessing', 'asyncio', 'CPU-bound vs I/O-bound', 'race condition', 'mutex'],
        idealAnswerRubric: 'Explains reference counting thread safety in CPython, why CPU-bound threads do not achieve true parallelism under GIL, using ProcessPoolExecutor for CPU tasks, and asyncio for I/O multiplexing.',
        coreCompetencyTested: 'Python Internals & Concurrency'
      },
      {
        title: 'Python Memory Management, Reference Counting and Cyclic GC',
        questionText: 'How does Python manage object allocation on the heap? Describe the interaction between reference counting and the generational cyclic garbage collector (gc module). How do you diagnose and prevent circular reference memory leaks?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['reference counting', 'cyclic GC', 'generational collector', 'weakref', 'tracemalloc', 'gc.collect', 'PyObject'],
        idealAnswerRubric: 'Details instant deallocation on refcount zero, how the 3 generational GC sweeps cyclic references, the danger of __del__ in old Python versions, and profiling with tracemalloc and objgraph.',
        coreCompetencyTested: 'Python Memory Management'
      },
      {
        title: 'Generators, Iterators and Lazy Evaluation for Large Datasets',
        questionText: 'Compare Python list comprehensions with generator expressions. Under what circumstances would you implement a custom iterator with __iter__ and __next__, or leverage yield from for memory-efficient data streaming?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['generator', 'yield from', 'lazy evaluation', '__iter__', '__next__', 'StopIteration', 'memory footprint'],
        idealAnswerRubric: 'Explains O(1) auxiliary memory of generators versus allocating full lists, state preservation across yields, delegating to subgenerators with yield from, and preventing out-of-memory crashes on large files.',
        coreCompetencyTested: 'Python Data Structures & Lazy Evaluation'
      },
      {
        title: 'Python Decorators, Closures, and Function Signatures',
        questionText: 'How do decorators work under the hood in Python? Write or explain the structure of a parameterized decorator that logs execution time, preserves function metadata using functools.wraps, and supports both synchronous and async coroutine functions.',
        questionType: 'SCENARIO',
        expectedKeywords: ['decorator', 'closure', 'functools.wraps', '__name__', 'inspect.iscoroutinefunction', 'args and kwargs'],
        idealAnswerRubric: 'Explains higher-order functions and closures, preserving docstrings/__name__ via wraps, handling outer arguments, and branching based on whether the wrapped callable is an awaitable coroutine.',
        coreCompetencyTested: 'Python Metaprogramming & Decorators'
      },
      {
        title: 'Asyncio Internals: Tasks, Futures, and Event Loop Mechanics',
        questionText: 'In an asynchronous Python web service (e.g. FastAPI/Tornado), what causes the event loop to freeze or experience latency spikes? How do you prevent blocking calls and properly manage task cancellation and ExceptionGroups?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['event loop starvation', 'asyncio.run_in_executor', 'TaskGroup', 'asyncio.sleep', 'cooperative multitasking'],
        idealAnswerRubric: 'Identifies blocking synchronous I/O or heavy CPU work starving the event loop, offloading with run_in_executor, handling CancelledError cleanly, and structured concurrency with asyncio.TaskGroup.',
        coreCompetencyTested: 'Asynchronous Python & Asyncio'
      }
    ]
  },

  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    icon: '⚡',
    badge: 'JavaScript Specialist',
    color: '#facc15',
    aliases: ['javascript', 'js', 'node', 'nodejs', 'node.js', 'es6', 'ecmascript'],
    corePillars: [
      'Event Loop, Call Stack, Microtasks & Macrotasks',
      'V8 Engine Execution: JIT Compilation, Hidden Classes & Inline Caching',
      'V8 Garbage Collection (Scavenger, Mark-Sweep-Compact & Orinoco)',
      'Closures, Lexical Scope, Prototype Chain & this Binding',
      'Asynchronous Patterns: Promises, Async/Await & Unhandled Rejections',
      'Node.js Streams, Buffers, Worker Threads & Backpressure'
    ],
    allowedTopics: [
      'event loop', 'microtasks', 'macrotasks', 'v8 engine', 'promises', 'async/await',
      'closures', 'lexical scope', 'prototypes', 'hidden classes', 'inline caching',
      'scavenger gc', 'mark sweep', 'heap snapshots', 'node streams', 'backpressure',
      'worker threads', 'event emitters', 'commonjs vs esm', 'dom events', 'event bubbling'
    ],
    prohibitedTopics: [
      'python gil', 'python decorators', 'cpython', 'jvm', 'java bytecode', 'g1 gc',
      'spring boot', 'c++ pointers', 'raii', 'vtable', 'goroutines', 'go channels',
      'c# span', 'clr gc', 'rust borrow checker', 'swift arc'
    ],
    strictInstruction: (
      'Calibrate all technical questions, code snippets, memory management discussions, ' +
      'and architectural patterns strictly to JavaScript and Node.js runtime mechanics (V8 engine, Event Loop, closures, and async patterns). Never reference Python GIL, JVM, or C++ constructs.'
    ),
    questions: [
      {
        title: 'JavaScript Event Loop: Microtasks vs Macrotasks Execution Order',
        questionText: 'Explain the exact execution order of the JavaScript runtime when interleaving synchronous code, setTimeout(0), Promise.resolve().then(), process.nextTick(), and queueMicrotask(). Why are microtasks drained before the next macrotask?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['event loop', 'microtask queue', 'macrotask queue', 'call stack', 'process.nextTick', 'starvation'],
        idealAnswerRubric: 'Outlines the event loop tick: run synchronous stack, drain entire microtask queue (and any microtasks queued during execution), render UI (browser), and pick the next macrotask from task queue.',
        coreCompetencyTested: 'JavaScript Runtime & Event Loop'
      },
      {
        title: 'V8 Garbage Collection & Diagnosing Node.js Memory Leaks',
        questionText: 'How does the V8 JavaScript engine partition memory between Young Generation (Semi-spaces) and Old Generation? What common patterns (e.g. unintended closures, dangling event listeners) cause memory leaks in Node.js, and how do you profile them with heap snapshots?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['V8 engine', 'scavenger', 'mark-sweep-compact', 'heap snapshot', 'closure leak', 'event emitter leak'],
        idealAnswerRubric: 'Explains generational hypothesis, young gen pointer copying via Cheney algorithm, old gen mark-sweep, and identifying retained paths in Chrome DevTools heap snapshots.',
        coreCompetencyTested: 'V8 Engine Internals & Memory Profiling'
      },
      {
        title: 'Node.js Streams, Backpressure and Buffer Management',
        questionText: 'When piping gigabytes of data from an HTTP incoming request to cloud storage or disk, what happens if the writer is slower than the reader? How does Node.js handle backpressure with stream.pipeline() and highWaterMark?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['backpressure', 'stream.pipeline', 'highWaterMark', 'readable.pause', 'writable.write returning false', 'drain event'],
        idealAnswerRubric: 'Explains stream buffering limits (highWaterMark), writable.write returning false when saturated, pausing reader until "drain" emits, and why stream.pipeline properly manages error teardowns.',
        coreCompetencyTested: 'Node.js Systems & Stream Architecture'
      },
      {
        title: 'Prototypes, Prototypal Inheritance and Object Creation Cost',
        questionText: 'Compare Object.create(proto), ES6 class syntax, and factory functions with closures in JavaScript. How does V8 optimize property access using Hidden Classes (Shapes) and Inline Caching (Monomorphic vs Polymorphic)?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['prototype chain', 'hidden classes', 'shapes', 'inline caching', 'monomorphic', 'polymorphic', '__proto__'],
        idealAnswerRubric: 'Explains __proto__ lookups, dynamic property injection breaking hidden class transitions, monomorphic call-site performance, and closure memory footprint vs prototype sharing.',
        coreCompetencyTested: 'JavaScript Object Model & V8 Optimization'
      }
    ]
  },

  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    badge: 'TypeScript Specialist',
    color: '#60a5fa',
    aliases: ['typescript', 'ts'],
    corePillars: [
      'Structural Type System, Subtyping & Soundness',
      'Generics, Constraints & Type Parameter Inference',
      'Conditional Types, infer Keyword & Distributive Types',
      'Mapped Types, Template Literal Types & Key Remapping',
      'Discriminated Unions, Exhaustiveness Checking & Type Guards',
      'TypeScript Compiler (tsc) Architecture, Declarations & Ambient Namespaces'
    ],
    allowedTopics: [
      'generics', 'conditional types', 'infer keyword', 'mapped types', 'discriminated unions',
      'type guards', 'satisfies operator', 'keyof', 'typeof', 'template literal types',
      'structural typing', 'variance', 'tsc', 'tsconfig', 'declaration files', 'utility types'
    ],
    prohibitedTopics: [
      'python gil', 'python decorators', 'jvm bytecode', 'spring boot', 'c++ templates sfinae',
      'goroutines', 'go channels', 'c# linq expression trees'
    ],
    strictInstruction: (
      'Calibrate all technical questions, code snippets, and architecture strictly to TypeScript ' +
      '(advanced type manipulations, conditional types, discriminated unions, and compile-time type safety).'
    ),
    questions: [
      {
        title: 'Advanced TypeScript: Conditional Types and the infer Keyword',
        questionText: 'Explain how conditional types work in TypeScript (T extends U ? X : Y). How does the infer keyword extract return types or promise unwrapping (e.g. implementing your own Awaited<T> or ReturnType<T>)?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['conditional types', 'infer keyword', 'distributive conditional types', 'ReturnType', 'never type'],
        idealAnswerRubric: 'Explains type pattern matching with infer, distributivity over naked union type parameters, and avoiding unwanted distribution using tuple wrapping ([T] extends [any]).',
        coreCompetencyTested: 'TypeScript Metaprogramming & Type System'
      },
      {
        title: 'Discriminated Unions and Compile-Time Exhaustiveness Checking',
        questionText: 'How do you design domain models using Discriminated Unions in TypeScript? How do you ensure compile-time exhaustiveness checking in switch statements using the never type?',
        questionType: 'SCENARIO',
        expectedKeywords: ['discriminated union', 'discriminant property', 'never type', 'assertNever', 'exhaustiveness checking'],
        idealAnswerRubric: 'Uses shared literal tag property for automatic type narrowing, explains assigning the default case to a variable typed as never so adding a new variant breaks compile time immediately.',
        coreCompetencyTested: 'Domain Modeling & Type Narrowing'
      },
      {
        title: 'Mapped Types, Key Remapping and Immutable Deep Types',
        questionText: 'How do you implement a recursive DeepReadonly<T> or DeepPartial<T> utility type using mapped types and template literal types? What are the compile-time recursion limits in tsc?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['mapped types', 'keyof', 'as key remapping', 'template literal types', 'DeepReadonly', 'tsc recursion depth'],
        idealAnswerRubric: 'Outlines iterating keys with [K in keyof T], checking if T[K] is primitive, function, or object, recursively applying Readonly, and mitigating deep AST recursion performance degradation.',
        coreCompetencyTested: 'Advanced Type Engineering'
      }
    ]
  },

  java: {
    id: 'java',
    name: 'Java',
    icon: '☕',
    badge: 'Java / JVM Specialist',
    color: '#f97316',
    aliases: ['java', 'jvm', 'spring', 'springboot', 'openjdk'],
    corePillars: [
      'JVM Architecture: ClassLoaders, JIT (C1/C2), Bytecode & Memory Areas',
      'Garbage Collectors: G1, ZGC, Shenandoah & Stop-The-World Minimization',
      'Java Memory Model (JMM): volatile, happens-before & memory barriers',
      'Concurrency: java.util.concurrent, Locks, Virtual Threads (Project Loom)',
      'Collections Internals: HashMap (Red-Black Trees), ConcurrentHashMap',
      'Spring Framework: IoC, AOP Proxies, Bean Lifecycles & Transaction Management'
    ],
    allowedTopics: [
      'jvm', 'jit compiler', 'bytecode', 'garbage collection', 'g1 gc', 'zgc',
      'java memory model', 'volatile', 'happens-before', 'synchronized', 'reentrantlock',
      'virtual threads', 'project loom', 'hashmap', 'concurrenthashmap', 'spring boot',
      'dependency injection', 'spring aop', 'transaction management', 'junit', 'mockito'
    ],
    prohibitedTopics: [
      'python gil', 'python decorators', 'javascript event loop', 'microtask queue',
      'v8 engine', 'c++ pointers', 'c++ raii', 'rust borrow checker', 'goroutines'
    ],
    strictInstruction: (
      'Calibrate all technical questions, code snippets, memory management discussions, ' +
      'and architectural patterns strictly to Java and the JVM (Garbage Collection, Java Memory Model, Concurrency, and Spring architecture).'
    ),
    questions: [
      {
        title: 'JVM Memory Architecture & Modern Garbage Collection (G1 vs ZGC)',
        questionText: 'Walk through the JVM memory layout (Heap, Metaspace, Stack, Code Cache). Compare the G1 Garbage Collector with the sub-millisecond pause ZGC. How do colored pointers and load barriers enable concurrent compaction in ZGC?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['JVM memory', 'Metaspace', 'G1 GC', 'ZGC', 'colored pointers', 'load barrier', 'stop-the-world', 'concurrent marking'],
        idealAnswerRubric: 'Contrasts generational region-based G1 collection with ZGC load-barrier colored pointer references, explaining how ZGC achieves <1ms STW pauses irrespective of heap size (up to terabytes).',
        coreCompetencyTested: 'JVM Internals & Garbage Collection'
      },
      {
        title: 'Java Memory Model (JMM), volatile and happens-before Guarantee',
        questionText: 'What exact guarantees does the volatile keyword provide in Java regarding visibility and instruction reordering? How does the "happens-before" relationship establish memory safety across threads without full synchronized locks?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['volatile', 'happens-before', 'instruction reordering', 'memory barrier', 'CPU cache coherence', 'MESI protocol'],
        idealAnswerRubric: 'Explains CPU memory caches, compiler reordering, volatile reads/writes establishing happens-before edges via memory fence instructions, and why volatile does not guarantee compound atomicity (e.g. count++).',
        coreCompetencyTested: 'Java Concurrency & Memory Model'
      },
      {
        title: 'Virtual Threads (Project Loom) vs Platform Threads',
        questionText: 'With the introduction of Virtual Threads in Java 21, how do carrier threads schedule virtual threads? When does thread pinning occur with synchronized blocks, and how does this change thread pool architecture?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['virtual threads', 'Project Loom', 'carrier thread', 'ForkJoinPool', 'thread pinning', 'synchronized vs ReentrantLock'],
        idealAnswerRubric: 'Explains mounting/unmounting virtual threads to OS carrier threads during blocking I/O, avoiding thread pool sizing limits for I/O tasks, and avoiding carrier thread pinning by replacing synchronized with ReentrantLock.',
        coreCompetencyTested: 'Modern Java Concurrency'
      },
      {
        title: 'HashMap Internals & ConcurrentHashMap Lock Striping',
        questionText: 'How does Java 8+ HashMap resolve hash collisions (Linked List vs Red-Black Tree threshold)? How does ConcurrentHashMap achieve thread safety without blocking the entire map, and how does it handle rehashing concurrently?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['HashMap', 'TREEIFY_THRESHOLD', 'ConcurrentHashMap', 'CAS (Compare-And-Swap)', 'synchronized node', 'hash collision'],
        idealAnswerRubric: 'Details bucket arrays, treeifying to TreeNode at 8 elements (and untreeifying at 6), CAS for empty bucket insertion, synchronizing only the bin head node, and cooperative parallel resizing via Transfer tasks.',
        coreCompetencyTested: 'Java Collections Framework Internals'
      }
    ]
  },

  cpp: {
    id: 'cpp',
    name: 'C++',
    icon: '⚙️',
    badge: 'C++ Systems Specialist',
    color: '#a855f7',
    aliases: ['c++', 'cpp', 'cplusplus'],
    corePillars: [
      'RAII (Resource Acquisition Is Initialization) & Exception Safety',
      'Smart Pointers: unique_ptr, shared_ptr & Control Block Overheads',
      'Move Semantics, Rvalue References (&&) & std::forward',
      'Memory Models, std::atomic & Cache Coherence',
      'Virtual Tables (vtable), Virtual Pointer (vptr) & Dynamic Dispatch',
      'Templates, SFINAE, Concepts & Zero-Cost Abstractions'
    ],
    allowedTopics: [
      'raii', 'unique_ptr', 'shared_ptr', 'weak_ptr', 'move semantics', 'rvalue references',
      'std::forward', 'vtable', 'dynamic dispatch', 'templates', 'sfinae', 'concepts',
      'memory layout', 'cache alignment', 'std::atomic', 'undefined behavior'
    ],
    prohibitedTopics: [
      'python gil', 'javascript event loop', 'jvm garbage collection', 'clr gc', 'spring boot'
    ],
    strictInstruction: (
      'Calibrate all technical questions, code snippets, memory management discussions, ' +
      'and architectural patterns strictly to modern C++ (C++17/C++20, RAII, move semantics, smart pointers, and memory layout).'
    ),
    questions: [
      {
        title: 'RAII, Exception Safety and Smart Pointer Control Blocks',
        questionText: 'Explain the Resource Acquisition Is Initialization (RAII) idiom in modern C++. Compare std::unique_ptr with std::shared_ptr. What is the internal memory layout of a std::shared_ptr control block, and why should you use std::make_shared?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['RAII', 'std::unique_ptr', 'std::shared_ptr', 'control block', 'std::make_shared', 'weak_ptr', 'single allocation'],
        idealAnswerRubric: 'Details deterministic destructor cleanup on scope exit, atomic ref counts in control blocks, make_shared coalescing the managed object and control block into a single contiguous heap allocation, and avoiding cyclic leaks with weak_ptr.',
        coreCompetencyTested: 'C++ Memory Management & Resource Safety'
      },
      {
        title: 'Move Semantics, Rvalue References and Perfect Forwarding',
        questionText: 'How do rvalue references (&&) and move semantics eliminate deep copies in C++11+? Explain the mechanics of std::move and std::forward. Why is std::move merely an unconditional cast, and when does universal (forwarding) reference collapsing apply?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['move semantics', 'rvalue reference', 'std::move', 'std::forward', 'reference collapsing', 'prvalue vs xvalue'],
        idealAnswerRubric: 'Explains stealing heap pointers from temporary rvalues, std::move casting to xvalue, reference collapsing rules (& + && = &), and std::forward preserving original value category in template wrappers.',
        coreCompetencyTested: 'C++ Move Semantics & Metaprogramming'
      },
      {
        title: 'Virtual Table (vtable) Dispatch & Memory Layout under Multiple Inheritance',
        questionText: 'How does dynamic polymorphism work under the hood in C++? Walk through how the compiler constructs the vtable and injects the vptr. What memory layout adjustments occur during multiple inheritance or virtual inheritance?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['vtable', 'vptr', 'virtual dispatch', 'multiple inheritance', 'this pointer adjustment', 'virtual base table'],
        idealAnswerRubric: 'Explains function pointer arrays in static read-only memory, vptr stored in object header, offset adjustments when casting derived pointer to secondary base class, and diamond problem resolution via virtual inheritance.',
        coreCompetencyTested: 'C++ Object Model & Virtual Dispatch'
      }
    ]
  },

  golang: {
    id: 'golang',
    name: 'Go (Golang)',
    icon: '🐹',
    badge: 'Go Systems Specialist',
    color: '#06b6d4',
    aliases: ['go', 'golang'],
    corePillars: [
      'Goroutines & the Go Runtime Scheduler (M:N, GMP Model)',
      'Channels: Buffered vs Unbuffered, Select, Deadlocks & Leak Prevention',
      'Memory Escape Analysis: Stack vs Heap Allocation & GC Optimization',
      'Interfaces Internals: iface vs eface (itab & data pointer)',
      'Error Handling Idioms, Defer Lifecycles & Panic/Recover',
      'High-Performance Concurrency: sync.Pool, sync.Mutex & sync/atomic'
    ],
    allowedTopics: [
      'goroutines', 'channels', 'gmp scheduler', 'escape analysis', 'sync.pool',
      'interfaces in go', 'defer', 'context package', 'race detector', 'pprof',
      'garbage collector in go', 'select statement', 'deadlock prevention'
    ],
    prohibitedTopics: [
      'python gil', 'javascript event loop', 'jvm', 'java spring', 'c++ vtable'
    ],
    strictInstruction: (
      'Calibrate all technical questions, code snippets, memory management discussions, ' +
      'and architectural patterns strictly to Go (Golang runtime, goroutines, GMP scheduler, channels, and idiomatic Go design).'
    ),
    questions: [
      {
        title: 'The Go Runtime Scheduler: GMP Architecture & Work Stealing',
        questionText: 'Explain how the Go runtime schedules millions of goroutines using the GMP model (Goroutines, Machines/OS threads, Processors/contexts). How does the runtime execute cooperative preemption, sysmon monitoring, and work-stealing across processors?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['GMP model', 'goroutine', 'OS thread', 'P context', 'work stealing', 'sysmon', 'preemption'],
        idealAnswerRubric: 'Explains mapping M goroutines onto N OS threads with GOMAXPROCS processors, local run queues, sysmon retaking P during blocking syscalls, and work stealing from remote run queues.',
        coreCompetencyTested: 'Go Runtime Scheduler & Concurrency'
      },
      {
        title: 'Channel Mechanics & Preventing Goroutine Leaks',
        questionText: 'How are Go channels implemented under the hood (hchan struct, circular ring buffer, wait queues)? How do unbuffered and buffered channels coordinate data handoffs, and what causes goroutine leaks when readers or writers block indefinitely?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['hchan struct', 'circular ring buffer', 'sudog queue', 'channel lock', 'goroutine leak', 'context.Context'],
        idealAnswerRubric: 'Details hchan elements (lock, qcount, dataqsiz, sendq, recvq), direct stack copying when receiver is waiting, detecting leaks with pprof goroutine dumps, and using context cancellation to unblock channels.',
        coreCompetencyTested: 'Go Channels & Memory Leak Mitigation'
      },
      {
        title: 'Go Memory Escape Analysis and GC Optimization with sync.Pool',
        questionText: 'How does the Go compiler perform escape analysis to decide whether a variable stays on the goroutine stack or escapes to the heap? How does sync.Pool alleviate garbage collection pressure in high-throughput JSON or network servers?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['escape analysis', 'stack allocation', 'heap allocation', 'gc pressure', 'sync.Pool', 'pointer escaping'],
        idealAnswerRubric: 'Explains compiler escape checks (-gcflags="-m"), returning pointers or storing in interface values forcing heap allocations, and reusing temporary byte buffers with sync.Pool to reduce GC sweep cycles.',
        coreCompetencyTested: 'Go Performance & Memory Optimization'
      }
    ]
  },

  csharp: {
    id: 'csharp',
    name: 'C# (.NET)',
    icon: '🎯',
    badge: 'C# / .NET Specialist',
    color: '#818cf8',
    aliases: ['c#', 'csharp', '.net', 'dotnet', 'asp.net'],
    corePillars: [
      'CLR Internals: JIT Compilation, Assembly Loading & Execution',
      'Generational Garbage Collection (Gen 0, 1, 2) & Large Object Heap (LOH)',
      'Async/Await State Machine, Task vs ValueTask & SynchronizationContext',
      'Zero-Allocation High Performance: Span<T>, Memory<T> & ref struct',
      'LINQ Execution Internals: Deferred Execution, Expression Trees & IQueryable',
      'ASP.NET Core Architecture: Dependency Injection, Middleware Pipeline'
    ],
    allowedTopics: [
      'clr', 'c# async/await', 'valuetask', 'span<t>', 'memory<t>', 'loh',
      'linq', 'expression trees', 'asp.net core', 'middleware', 'dependency injection in .net'
    ],
    prohibitedTopics: [
      'python gil', 'javascript event loop', 'jvm', 'goroutines', 'rust borrow checker'
    ],
    strictInstruction: (
      'Calibrate all technical questions, code snippets, memory management discussions, ' +
      'and architectural patterns strictly to C# and modern .NET (CLR execution, async state machines, Span<T>, and ASP.NET Core).'
    ),
    questions: [
      {
        title: 'CLR Generational Garbage Collection & Large Object Heap (LOH)',
        questionText: 'How does the .NET CLR manage memory across Gen 0, Gen 1, and Gen 2 heaps? What threshold designates an object for the Large Object Heap (LOH), why was LOH fragmentation a historical issue, and how does .NET modern GC compact it?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['CLR GC', 'Gen 0/1/2', 'Large Object Heap', '85000 bytes', 'GC.Collect', 'compaction', 'GC pins'],
        idealAnswerRubric: 'Explains generational hypothesis, ephemeral segments, allocation >85,000 bytes directly on LOH, memory fragmentation, and modern background GC / LOH compaction modes.',
        coreCompetencyTested: '.NET CLR Memory Management'
      },
      {
        title: 'Async/Await State Machine & Task vs ValueTask Performance',
        questionText: 'What code does the C# compiler generate under the hood when compiling an async/await method (IAsyncStateMachine struct)? When should you return ValueTask<T> instead of Task<T> to prevent heap allocations on hot paths?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['IAsyncStateMachine', 'Task vs ValueTask', 'heap allocation', 'hot path', 'SynchronizationContext', 'ConfigureAwait'],
        idealAnswerRubric: 'Explains generated state machine struct, state transitions, completing synchronously returning ValueTask<T> without heap allocation, and avoiding ConfigureAwait(false) deadlocks.',
        coreCompetencyTested: 'C# Asynchronous Architecture'
      },
      {
        title: 'Zero-Allocation Systems: Span<T>, Memory<T> and ref struct',
        questionText: 'How do Span<T> and Memory<T> provide contiguous type-safe slices of arbitrary memory (heap, stack, native)? Why is Span<T> a ref struct, what limitations does that impose, and how does it revolutionize string parsing performance?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['Span<T>', 'Memory<T>', 'ref struct', 'stack allocation', 'zero allocation', 'pointer and length'],
        idealAnswerRubric: 'Explains fat pointer (ref T and length), ref struct restriction preventing heap escape (cannot be boxed or in normal class fields), and zero-copy slicing for parsing payloads.',
        coreCompetencyTested: '.NET High Performance & Zero-Copy Architecture'
      }
    ]
  },

  rust: {
    id: 'rust',
    name: 'Rust',
    icon: '🦀',
    badge: 'Rust Systems Specialist',
    color: '#f87171',
    aliases: ['rust', 'rustlang'],
    corePillars: [
      'Ownership, Move Semantics, Copy vs Clone',
      'The Borrow Checker: Aliasing XOR Mutability, Lifetimes (\'a)',
      'Smart Pointers: Box, Rc, Arc, RefCell & Interior Mutability',
      'Concurrency: Send and Sync Traits, Mutex, Channels & Data Race Elimination',
      'Traits, Trait Objects (dyn Trait) vs Generics Monomorphization',
      'Unsafe Rust: Invariants, Raw Pointers, FFI & Undefined Behavior'
    ],
    allowedTopics: [
      'ownership', 'borrow checker', 'lifetimes', 'send and sync', 'arc', 'mutex',
      'interior mutability', 'refcell', 'traits', 'dyn trait', 'monomorphization', 'unsafe rust'
    ],
    prohibitedTopics: [
      'python gil', 'javascript event loop', 'jvm garbage collection', 'go scheduler'
    ],
    strictInstruction: (
      'Calibrate all technical questions, code snippets, memory management discussions, ' +
      'and architectural patterns strictly to Rust (Ownership, borrow checker, lifetimes, Send/Sync, and safe systems programming).'
    ),
    questions: [
      {
        title: 'Rust Ownership, Borrow Checker and Lifetime Subtyping',
        questionText: 'Explain the core rule of the Rust Borrow Checker: "Aliasing XOR Mutability". How do explicit lifetime annotations (\'a) guide the compiler during function calls, and what is lifetime subtyping and variance in Rust?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['borrow checker', 'aliasing xor mutability', 'lifetime annotation', 'ownership', 'variance', 'dangling pointer'],
        idealAnswerRubric: 'Explains prohibiting multiple mutable references or mixing shared and mutable borrows, compile-time borrow scope calculation without runtime GC overhead, and ensuring references do not outlive the data they point to.',
        coreCompetencyTested: 'Rust Ownership & Borrow Checker'
      },
      {
        title: 'Interior Mutability: RefCell vs Mutex and Runtime Panic Costs',
        questionText: 'When a design demands mutating data through an immutable reference (&T), how does Rust provide interior mutability using Cell<T>, RefCell<T>, and Mutex<T>? Compare their single-threaded vs multi-threaded safety and runtime costs.',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['interior mutability', 'RefCell', 'borrow_mut', 'Cell', 'Mutex', 'Send and Sync', 'runtime borrow check'],
        idealAnswerRubric: 'Details Cell for Copy types via value replacement, RefCell for dynamic borrow counting (panicking on borrow violation), and Mutex/RwLock for thread-safe synchronization requiring Send/Sync.',
        coreCompetencyTested: 'Rust Memory & Interior Mutability'
      },
      {
        title: 'Monomorphization vs Dynamic Trait Objects (dyn Trait)',
        questionText: 'Compare static dispatch with Rust generics (monomorphization) against dynamic dispatch using trait objects (Box<dyn Trait>). What are the trade-offs regarding binary size, instruction cache locality, and vtable pointer lookups?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['monomorphization', 'dyn Trait', 'vtable fat pointer', 'code bloat', 'instruction cache', 'zero-cost abstraction'],
        idealAnswerRubric: 'Explains the compiler creating concrete implementations for each type parameter (inlining benefits vs code bloat), fat pointers containing data pointer and vtable pointer for dyn Trait, and heterogeneous collection support.',
        coreCompetencyTested: 'Rust Polymorphism & Performance'
      }
    ]
  },

  sql: {
    id: 'sql',
    name: 'SQL & Database Systems',
    icon: '🗄️',
    badge: 'Database & SQL Specialist',
    color: '#10b981',
    aliases: ['sql', 'postgresql', 'postgres', 'mysql', 'database', 'rdbms'],
    corePillars: [
      'Query Execution Plans (EXPLAIN ANALYZE) & Cost Estimation',
      'Indexing Strategies: B-Tree, Hash, GIN, GiST, BRIN & Composite Index Ordering',
      'Transaction Isolation Levels: Read Committed, Repeatable Read, Serializable',
      'Concurrency Control: Multi-Version Concurrency Control (MVCC) & Vacuuming',
      'Advanced SQL: Window Functions, CTEs (Recursive), Lateral Joins & Partitioning'
    ],
    allowedTopics: [
      'explain analyze', 'b-tree index', 'gin index', 'composite indexing', 'mvcc',
      'acid', 'isolation levels', 'deadlocks', 'autovacuum', 'window functions', 'recursive cte',
      'table partitioning', 'query tuning'
    ],
    prohibitedTopics: [
      'react fiber', 'css grid', 'python gil', 'jvm bytecode'
    ],
    strictInstruction: (
      'Calibrate all technical questions, code snippets, and performance discussions strictly to ' +
      'SQL, database internals, query execution plans, indexing, and transactional isolation.'
    ),
    questions: [
      {
        title: 'Query Optimization with EXPLAIN ANALYZE and Composite Index Ordering',
        questionText: 'When diagnosing a slow query with EXPLAIN ANALYZE, how do you distinguish between Sequential Scans, Index Scans, and Bitmap Index Scans? What rules determine the column ordering in composite indexes (equality vs range predicates)?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['EXPLAIN ANALYZE', 'Sequential Scan', 'Index Scan', 'Bitmap Index Scan', 'composite index', 'left-to-right prefix rule'],
        idealAnswerRubric: 'Explains planner cost thresholds, bitmap index combining multiple scans, ordering equality columns first before range columns, and covering indexes with INCLUDE.',
        coreCompetencyTested: 'SQL Execution Plans & Index Optimization'
      },
      {
        title: 'MVCC Mechanics and Vacuuming in High-Write Databases',
        questionText: 'How does Multi-Version Concurrency Control (MVCC) enable non-blocking concurrent reads and writes? In PostgreSQL or MySQL, what causes table and index bloat under frequent UPDATE statements, and how does autovacuum manage dead tuples?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['MVCC', 'xmin/xmax', 'dead tuples', 'autovacuum', 'table bloat', 'HOT (Heap-Only Tuple)'],
        idealAnswerRubric: 'Explains writing new row versions on update, transaction snapshot visibility, dead tuple accumulation, autovacuum reclaiming space without exclusive table locks, and HOT updates avoiding index rewrites.',
        coreCompetencyTested: 'Database Internals & Storage Engines'
      }
    ]
  },

  kotlin: {
    id: 'kotlin',
    name: 'Kotlin',
    icon: '📱',
    badge: 'Kotlin Specialist',
    color: '#a855f7',
    aliases: ['kotlin', 'kt'],
    corePillars: [
      'Coroutines: Suspend Functions, Dispatchers, Structured Concurrency & Flow',
      'Null Safety: Safe Calls (?.), Elvis Operator (?:), Platform Types',
      'Inline Functions, Reified Type Parameters & Crossinline',
      'Extension Functions, Higher-Order Functions & DSL Construction',
      'JVM Interoperability, Bytecode Generation & Companion Objects'
    ],
    allowedTopics: [
      'coroutines', 'suspend functions', 'dispatchers', 'flow', 'null safety',
      'extension functions', 'reified types', 'inline functions', 'jvm interop', 'sealed classes'
    ],
    prohibitedTopics: ['python gil', 'javascript event loop', 'c++ pointers', 'go channels'],
    strictInstruction: 'Calibrate all technical questions strictly to Kotlin language mechanics (Coroutines, structured concurrency, null safety, reified generics, and JVM interop).',
    questions: [
      {
        title: 'Kotlin Coroutines: Structured Concurrency & Dispatchers',
        questionText: 'Explain structured concurrency in Kotlin coroutines. How do CoroutineScope, Job hierarchy, and CoroutineExceptionHandler coordinate cancellation and error propagation across Dispatchers.IO and Dispatchers.Default?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['structured concurrency', 'CoroutineScope', 'Dispatchers.IO', 'SupervisorJob', 'cancellation propagation'],
        idealAnswerRubric: 'Explains child cancellation on parent failure, preventing orphaned tasks, using SupervisorJob to isolate child crashes, and thread switching between CPU-bound Default and I/O-bound pools.',
        coreCompetencyTested: 'Kotlin Coroutines & Concurrency'
      }
    ]
  },

  swift: {
    id: 'swift',
    name: 'Swift',
    icon: '🍏',
    badge: 'Swift Specialist',
    color: '#f43f5e',
    aliases: ['swift'],
    corePillars: [
      'Automatic Reference Counting (ARC): Weak vs Unowned References & Retain Cycles',
      'Swift Concurrency: async/await, Actors, Sendable Protocol & TaskGroup',
      'Value Types vs Reference Types: Structs with Copy-On-Write (COW) vs Classes',
      'Protocol-Oriented Programming (POP) & Generics with Associated Types',
      'Memory Safety: Memory Layout, Pointers & Exclusivity Enforcement'
    ],
    allowedTopics: [
      'arc', 'retain cycles', 'weak vs unowned', 'actors', 'swift concurrency',
      'copy on write', 'protocols', 'generics', 'sendable', 'closures capture lists'
    ],
    prohibitedTopics: ['python gil', 'javascript event loop', 'jvm', 'goroutines'],
    strictInstruction: 'Calibrate technical questions strictly to modern Swift (ARC, actors, structured concurrency, value types with COW, and protocol-oriented design).',
    questions: [
      {
        title: 'Automatic Reference Counting (ARC) & Preventing Retain Cycles',
        questionText: 'How does Swift ARC track object lifetimes? Distinguish between weak and unowned references in closure capture lists. When would an unowned reference trigger a runtime crash?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['ARC', 'retain cycle', 'weak reference', 'unowned reference', 'capture list', 'nil deallocation'],
        idealAnswerRubric: 'Explains zeroing weak references on deallocation, unowned assuming pointee stays alive (crashing on dangling access), and breaking retain cycles in asynchronous delegates or closure callbacks.',
        coreCompetencyTested: 'Swift Memory Management & ARC'
      }
    ]
  },

  php: {
    id: 'php',
    name: 'PHP',
    icon: '🐘',
    badge: 'PHP Specialist',
    color: '#818cf8',
    aliases: ['php', 'laravel', 'php8'],
    corePillars: [
      'Zend Engine Internals: Opcache, JIT in PHP 8+, Execution Lifecycle',
      'Memory Management: zval Structs, Reference Counting & Copy-on-Write (COW)',
      'Modern PHP Features: Attributes, Match Expressions, Fibers, Typed Properties',
      'Architecture & Frameworks: Laravel Service Container, Middleware, Eloquent ORM'
    ],
    allowedTopics: [
      'zend engine', 'opcache', 'php 8 jit', 'zval', 'copy on write',
      'fibers', 'laravel', 'service container', 'eloquent orm', 'composer'
    ],
    prohibitedTopics: ['python gil', 'jvm bytecode', 'c++ smart pointers', 'go goroutines'],
    strictInstruction: 'Calibrate technical questions strictly to modern PHP (PHP 8+, Zend engine, opcache, memory management, and enterprise architecture).',
    questions: [
      {
        title: 'Zend Engine Memory Management: zval Structs and Copy-On-Write',
        questionText: 'How does PHP manage memory via zval structures and Copy-On-Write (COW)? How does Opcache eliminate script compilation overhead on production web servers?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['zval', 'copy-on-write', 'refcount', 'opcache', 'preloading', 'shared memory'],
        idealAnswerRubric: 'Explains zval container memory representation, sharing memory until a mutation triggers COW, and storing precompiled bytecode in shared memory via Opcache.',
        coreCompetencyTested: 'PHP Runtime Internals & Performance'
      }
    ]
  },

  ruby: {
    id: 'ruby',
    name: 'Ruby',
    icon: '💎',
    badge: 'Ruby Specialist',
    color: '#ef4444',
    aliases: ['ruby', 'rb', 'rails', 'ruby on rails'],
    corePillars: [
      'YJIT Compilation, GVL (Giant VM Lock) & Multi-Threaded Concurrency',
      'Object Model: Metaclasses (Eigenclasses), Method Lookup & method_missing',
      'Blocks, Procs, Lambdas & Scope Binding Lifecycles',
      'Ruby on Rails Architecture: Active Record Query Optimization, Rack Middleware'
    ],
    allowedTopics: [
      'ruby yjit', 'gvl', 'metaprogramming', 'eigenclass', 'blocks procs lambdas',
      'active record', 'rails', 'n+1 query mitigation', 'fiber concurrency'
    ],
    prohibitedTopics: ['python gil', 'javascript event loop', 'jvm bytecode', 'c++ vtable'],
    strictInstruction: 'Calibrate technical questions strictly to Ruby (object model, YJIT, GVL, blocks/procs, and Rails performance patterns).',
    questions: [
      {
        title: 'Ruby Object Model: Method Lookup Chain and Eigenclasses',
        questionText: 'Walk through Ruby method lookup resolution (ancestors chain). How do eigenclasses (singleton classes) enable class-level methods and runtime metaprogramming?',
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['method lookup', 'ancestors', 'eigenclass', 'singleton class', 'module prepend', 'method_missing'],
        idealAnswerRubric: 'Outlines searching the receiver eigenclass, included/prepended modules, superclasses, and falling back to method_missing, explaining runtime dynamic dispatch.',
        coreCompetencyTested: 'Ruby Object Model & Metaprogramming'
      }
    ]
  }
};

/**
 * Deterministically find matching language profile
 */
export function getLanguageProfile(languageInput = '') {
  if (!languageInput || typeof languageInput !== 'string') {
    return LANGUAGE_PROFILES.python;
  }
  const clean = languageInput.trim().toLowerCase().replace(/[\s\-_]+/g, ' ');

  // 1. Direct ID match
  if (LANGUAGE_PROFILES[clean]) {
    return LANGUAGE_PROFILES[clean];
  }

  // 2. Exact match against aliases or names
  for (const key of Object.keys(LANGUAGE_PROFILES)) {
    const prof = LANGUAGE_PROFILES[key];
    const aliases = (prof.aliases || []).map(a => a.toLowerCase());
    if (prof.name.toLowerCase() === clean || aliases.includes(clean)) {
      return prof;
    }
  }

  // 3. Word boundary regex match
  for (const key of Object.keys(LANGUAGE_PROFILES)) {
    const prof = LANGUAGE_PROFILES[key];
    const candidates = [prof.name, ...(prof.aliases || [])];
    for (const cand of candidates) {
      if (cand.length < 2 && clean !== cand.toLowerCase()) continue;
      const escaped = cand.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\b)${escaped}(\\b|$)`, 'i');
      if (regex.test(clean)) {
        return prof;
      }
    }
  }

  // 4. Safe Custom fallback profile
  const sanitized = languageInput.trim();
  return {
    id: sanitized.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name: sanitized,
    icon: '💻',
    badge: `${sanitized} Specialist`,
    color: '#6366f1',
    aliases: [sanitized.toLowerCase()],
    corePillars: [
      `Core Syntax, Idioms & Standard Library of ${sanitized}`,
      `Memory Management, Allocation & Resource Cleanup in ${sanitized}`,
      `Concurrency, Threading & Asynchronous Patterns in ${sanitized}`,
      `Error Handling, Exceptions & Diagnostic Logging in ${sanitized}`,
      `Performance Profiling, Optimization & Tooling for ${sanitized}`
    ],
    allowedTopics: [sanitized],
    prohibitedTopics: [],
    strictInstruction: (
      `Calibrate technical questions, code snippets, and implementation discussions ` +
      `specifically to the syntax, semantics, and standard patterns of ${sanitized}.`
    ),
    questions: [
      {
        title: `${sanitized} Concurrency & Memory Model`,
        questionText: `In ${sanitized}, how are concurrency and memory allocation managed? How do you prevent race conditions, handle deadlocks, and ensure thread safety in production services?`,
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['concurrency', 'memory management', 'thread safety', 'race condition', 'resource cleanup'],
        idealAnswerRubric: `Provides in-depth explanation of ${sanitized} memory architecture, execution model, thread safety, and synchronization primitives.`,
        coreCompetencyTested: `${sanitized} Concurrency & Systems Architecture`
      },
      {
        title: `Idiomatic Error Handling & Exception Management in ${sanitized}`,
        questionText: `How does ${sanitized} handle error propagation, recoverable exceptions, and resource teardown? Compare its approach to other mainstream languages.`,
        questionType: 'TECHNICAL_DEEP_DIVE',
        expectedKeywords: ['error handling', 'exceptions', 'resource teardown', 'robustness', 'idiomatic'],
        idealAnswerRubric: `Explains language-specific paradigms for handling failures gracefully without resource leaks or unhandled crash states.`,
        coreCompetencyTested: `${sanitized} Clean Code & Reliability`
      }
    ]
  };
}

export const PROGRAMMING_LANGUAGES = LANGUAGE_PROFILES;

export const ROLE_LANGUAGES_CONFIG = {
  frontend_developer: {
    defaultLanguage: 'JavaScript',
    popularLanguages: ['javascript', 'typescript'],
    allowedLanguages: ['javascript', 'typescript']
  },
  data_scientist: {
    defaultLanguage: 'Python',
    popularLanguages: ['python', 'sql'],
    allowedLanguages: ['python', 'sql', 'cpp']
  },
  devops_cloud_engineer: {
    defaultLanguage: 'Go (Golang)',
    popularLanguages: ['golang', 'python'],
    allowedLanguages: ['golang', 'python', 'rust']
  },
  cybersecurity_analyst: {
    defaultLanguage: 'Python',
    popularLanguages: ['python', 'cpp', 'golang'],
    allowedLanguages: ['python', 'cpp', 'golang', 'rust', 'sql']
  },
  qa_automation_sdet: {
    defaultLanguage: 'Java',
    popularLanguages: ['java', 'python', 'javascript'],
    allowedLanguages: ['java', 'python', 'javascript', 'typescript', 'csharp']
  },
  system_architect: {
    defaultLanguage: 'Java',
    popularLanguages: ['java', 'golang', 'cpp'],
    allowedLanguages: ['java', 'golang', 'cpp', 'rust', 'csharp', 'python', 'sql']
  },
  fullstack_developer: {
    defaultLanguage: 'TypeScript',
    popularLanguages: ['typescript', 'javascript', 'python'],
    allowedLanguages: ['typescript', 'javascript', 'python', 'java', 'csharp', 'golang', 'php', 'ruby', 'sql']
  },
  software_engineer: {
    defaultLanguage: 'Java',
    popularLanguages: ['java', 'python', 'golang', 'cpp'],
    allowedLanguages: ['java', 'python', 'golang', 'cpp', 'csharp', 'rust', 'typescript', 'javascript', 'php', 'ruby', 'sql']
  }
};

/**
 * Retrieve only the programming languages strictly calibrated for the selected role
 */
export function getLanguagesForRole(role = '', domain = '') {
  const cleanRole = String(role || '').toLowerCase();

  // Mobile specific roles
  if (cleanRole.includes('android')) {
    const list = ['kotlin', 'java'];
    return Object.values(LANGUAGE_PROFILES).filter(l => list.includes(l.id)).map(l => ({ ...l, popular: true }));
  }
  if (cleanRole.includes('ios') || cleanRole.includes('swift')) {
    return Object.values(LANGUAGE_PROFILES).filter(l => l.id === 'swift').map(l => ({ ...l, popular: true }));
  }
  if (cleanRole.includes('mobile') || cleanRole.includes('react native') || cleanRole.includes('flutter')) {
    const list = ['typescript', 'javascript', 'kotlin', 'swift'];
    return Object.values(LANGUAGE_PROFILES).filter(l => list.includes(l.id)).map(l => ({
      ...l,
      popular: ['typescript', 'javascript'].includes(l.id)
    }));
  }

  const roleProfile = getRoleProfile(role, domain);
  const config = ROLE_LANGUAGES_CONFIG[roleProfile?.id] || ROLE_LANGUAGES_CONFIG.software_engineer;

  const allowedIds = new Set(config.allowedLanguages);
  const popularIds = new Set(config.popularLanguages);

  const matched = Object.values(LANGUAGE_PROFILES)
    .filter(l => allowedIds.has(l.id))
    .map(l => ({
      ...l,
      popular: popularIds.has(l.id)
    }));

  return matched.length > 0 ? matched : Object.values(LANGUAGE_PROFILES);
}

/**
 * Automatically determine the most fitting default programming language based on target role
 */
export function getDefaultLanguageForRole(role = '', domain = '') {
  const cleanRole = String(role || '').toLowerCase();

  if (cleanRole.includes('android')) return 'Kotlin';
  if (cleanRole.includes('ios') || cleanRole.includes('swift')) return 'Swift';
  if (cleanRole.includes('mobile')) return 'TypeScript';

  const roleProfile = getRoleProfile(role, domain);
  const config = ROLE_LANGUAGES_CONFIG[roleProfile?.id] || ROLE_LANGUAGES_CONFIG.software_engineer;
  return config.defaultLanguage || 'Python';
}

/**
 * Check whether a programming language is valid/calibrated for the chosen role
 */
export function isLanguageAllowedForRole(langNameOrId = '', role = '', domain = '') {
  if (!langNameOrId) return false;
  const allowed = getLanguagesForRole(role, domain);
  const clean = langNameOrId.trim().toLowerCase();
  return allowed.some(l => l.id === clean || l.name.toLowerCase() === clean);
}
