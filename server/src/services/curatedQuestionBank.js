/**
 * curatedQuestionBank.js (Server)
 * Curated Role × Programming Language × Category × Difficulty Question Matrix.
 * Guarantees that fallback questions strictly adhere to the candidate's exact interview configuration.
 */

import { getRoleProfile } from '../config/roleConfigs.js';
import { getLanguageProfile } from '../config/languageConfigs.js';
import { validateQuestion } from './questionValidator.js';

// Pre-curated, verified question catalog by exact intersection
export const CURATED_INTERSECTIONS = {
  // 1. FRONTEND DEVELOPER + JAVASCRIPT
  'frontend_developer:javascript': [
    {
      title: 'JavaScript Event Loop & Browser Rendering Frame Budget',
      questionText: 'Explain how the JavaScript event loop, microtask queue (Promises), and macrotask queue (setTimeout) interact with the browser rendering pipeline (requestAnimationFrame and layout/paint). How do long-running JavaScript tasks cause UI jank, and how do you ensure smooth 60 FPS interactions?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Frontend Developer',
      programmingLanguage: 'JavaScript',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['JavaScript Event Loop', 'Browser Rendering', 'Microtasks', 'Performance'],
      expectedKeywords: ['event loop', 'microtasks', 'macrotasks', 'requestAnimationFrame', 'main thread', 'frame budget (16.6ms)', 'jank'],
      idealAnswerRubric: 'Explains call stack execution, microtask queue draining before the next render opportunity, requestAnimationFrame executing right before layout/paint, and splitting long tasks with scheduler.yield() or Web Workers.',
      coreCompetencyTested: 'Browser Runtime & Web Performance'
    },
    {
      title: 'DOM Event Propagation, Event Delegation & Memory Optimization',
      questionText: 'How does event propagation work in the browser DOM across capturing, target, and bubbling phases? How do you implement the Event Delegation pattern for high-frequency dynamic lists, and why is this critical for memory management in single-page applications?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Frontend Developer',
      programmingLanguage: 'JavaScript',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['DOM Manipulation', 'Event Delegation', 'Memory Management'],
      expectedKeywords: ['capturing phase', 'bubbling phase', 'event.target vs event.currentTarget', 'event delegation', 'addEventListener', 'memory leak'],
      idealAnswerRubric: 'Details 3 phases of event flow, attaching single listener to common ancestor using e.target.closest(), and preventing memory leaks caused by lingering event handlers on removed DOM nodes.',
      coreCompetencyTested: 'DOM Mechanics & Memory Optimization'
    },
    {
      title: 'Virtual DOM Reconciliation & State Immutability in React/JS',
      questionText: 'How does Virtual DOM reconciliation algorithm work in modern JavaScript libraries like React? Why is state immutability strictly required for predictable change detection, and what causes unnecessary re-renders when passing inline object/function references?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Frontend Developer',
      programmingLanguage: 'JavaScript',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Virtual DOM', 'Reconciliation', 'State Management', 'React'],
      expectedKeywords: ['virtual DOM', 'diffing algorithm', 'reconciliation', 'immutability', 'useMemo', 'useCallback', 'referential equality'],
      idealAnswerRubric: 'Explains O(N) heuristic diffing based on component types and keys, shallow comparison relying on referential identity, and memoizing handlers to avoid child re-render cascades.',
      coreCompetencyTested: 'Frontend Component Architecture & Optimization'
    },
    {
      title: 'Core Web Vitals & Frontend Asset Loading Strategies',
      questionText: 'Define Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS). In a complex JavaScript application, what optimization strategies (e.g. code splitting, preloading critical chunks, font-display: optional) do you apply to achieve green scores across all three metrics?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'ADVANCED',
      role: 'Frontend Developer',
      programmingLanguage: 'JavaScript',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Core Web Vitals', 'LCP', 'INP', 'CLS', 'Asset Optimization'],
      expectedKeywords: ['LCP', 'INP', 'CLS', 'code splitting', 'dynamic import', 'critical CSS', 'preloading', 'layout shift'],
      idealAnswerRubric: 'Defines threshold values for LCP (<2.5s), INP (<200ms), CLS (<0.1), identifies main-thread blocking JavaScript delaying INP, reserving layout dimensions to avoid CLS, and optimizing resource discovery for LCP.',
      coreCompetencyTested: 'Frontend Performance & Core Web Vitals'
    },
    {
      title: 'Client-Side Web Security: Mitigating XSS and Implementing CSP',
      questionText: 'How do Stored, Reflected, and DOM-based Cross-Site Scripting (XSS) vulnerabilities occur in JavaScript client applications? How does a strict Content Security Policy (CSP) header prevent unauthorized script execution, and how should sensitive tokens (JWT/Session) be stored in the browser?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'ADVANCED',
      role: 'Frontend Developer',
      programmingLanguage: 'JavaScript',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Web Security', 'XSS', 'Content Security Policy', 'Authentication'],
      expectedKeywords: ['XSS', 'DOM-based XSS', 'Content Security Policy (CSP)', 'nonce', 'HttpOnly cookie', 'sanitize', 'innerHTML'],
      idealAnswerRubric: 'Explains malicious script injection bypassing client escapes, CSP script-src directives with nonces/hashes, avoiding localStorage for sensitive auth tokens, and using HttpOnly SameSite cookies.',
      coreCompetencyTested: 'Client-Side Security Architecture'
    },
    {
      title: 'Asynchronous JavaScript: Fetch Cancellation and Unhandled Rejections',
      questionText: 'How do you handle asynchronous race conditions when a user triggers multiple rapid search queries? Demonstrate how to cancel in-flight HTTP requests using AbortController in JavaScript and explain how unhandled Promise rejections affect application stability.',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Frontend Developer',
      programmingLanguage: 'JavaScript',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Async JavaScript', 'AbortController', 'Promises', 'Race Conditions'],
      expectedKeywords: ['AbortController', 'abortSignal', 'fetch cancellation', 'race condition', 'debounce', 'Promise.race'],
      idealAnswerRubric: 'Details instantiating new AbortController per request, passing signal to fetch, aborting prior pending controllers, catching AbortError, and preventing outdated responses overwriting newer user state.',
      coreCompetencyTested: 'Asynchronous JavaScript & Network Resilience'
    },
    {
      title: 'Frontend State Management: Context API vs Zustand vs Redux',
      questionText: 'Evaluate the architectural trade-offs between React Context API, Redux Toolkit, and atomic/micro-state libraries like Zustand. When does the Context API cause performance degradation, and how do selector-based subscriptions prevent unnecessary renders?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Frontend Developer',
      programmingLanguage: 'JavaScript',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['State Management', 'Context API', 'Zustand', 'Redux', 'Architecture'],
      expectedKeywords: ['Context API', 'selector subscription', 're-render bottleneck', 'Zustand', 'Redux Toolkit', 'single source of truth'],
      idealAnswerRubric: 'Explains that Context updates trigger re-renders in all consuming components regardless of which slice changed, whereas Zustand/Redux use store subscriptions with equality checks to isolate re-renders.',
      coreCompetencyTested: 'Frontend State Architecture'
    },
    {
      title: 'CSS Layout Engines: Flexbox vs CSS Grid & Stacking Contexts',
      questionText: 'In responsive frontend development, how do you decide between CSS Flexbox (1-dimensional) and CSS Grid (2-dimensional)? What triggers the creation of a new CSS Stacking Context, and how do you resolve persistent z-index rendering bugs?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'BEGINNER',
      role: 'Frontend Developer',
      programmingLanguage: 'JavaScript',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['CSS Layout', 'Flexbox', 'CSS Grid', 'Stacking Context', 'z-index'],
      expectedKeywords: ['Flexbox (1D)', 'CSS Grid (2D)', 'stacking context', 'z-index', 'opacity', 'transform', 'isolation: isolate'],
      idealAnswerRubric: 'Contrasts content-first 1D flexbox alignment with layout-first 2D grid positioning, explains properties spawning stacking contexts (opacity < 1, transform, isolation: isolate), and debugging z-index collisions.',
      coreCompetencyTested: 'CSS Architecture & Layout Engines'
    },
    {
      title: 'Modern Frontend Build Pipelines: Vite vs Webpack & Tree Shaking',
      questionText: 'How does Vite leverage native ES modules (ESM) in development to achieve near-instantaneous HMR compared to traditional Webpack bundling? What conditions must a JavaScript codebase satisfy for the bundler to successfully perform tree shaking (dead-code elimination)?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'ADVANCED',
      role: 'Frontend Developer',
      programmingLanguage: 'JavaScript',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Frontend Tooling', 'Vite', 'Webpack', 'Tree Shaking', 'ES Modules'],
      expectedKeywords: ['Vite', 'ES Modules (ESM)', 'Hot Module Replacement (HMR)', 'Rollup', 'tree shaking', 'sideEffects flag'],
      idealAnswerRubric: 'Explains no-bundle dev server serving files on-demand over HTTP/2, Rollup/esbuild production bundling, static analysis requiring ES6 import/export syntax, and package.json sideEffects configuration for tree shaking.',
      coreCompetencyTested: 'Frontend Build Systems & Tooling'
    },
    {
      title: 'Client-Side Web Accessibility (a11y) & Semantic HTML5',
      questionText: 'How do screen readers and assistive technologies interpret the Accessibility Tree generated by the browser? How do you ensure an interactive custom modal or dropdown is WCAG 2.1 AA compliant regarding keyboard focus trapping and ARIA attributes?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Frontend Developer',
      programmingLanguage: 'JavaScript',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Accessibility', 'a11y', 'WCAG', 'ARIA', 'Focus Management'],
      expectedKeywords: ['accessibility tree', 'WCAG 2.1 AA', 'focus trapping', 'aria-expanded', 'role="dialog"', 'keyboard navigation (Tab/Esc)'],
      idealAnswerRubric: 'Explains converting DOM to accessibility tree, using semantic HTML before ARIA, trapping Tab focus within open modals, restoring focus on close, and handling Escape key listeners.',
      coreCompetencyTested: 'Web Accessibility & Semantic Standards'
    }
  ],

  // 2. FRONTEND DEVELOPER + TYPESCRIPT
  'frontend_developer:typescript': [
    {
      title: 'TypeScript in React: Typing Component Props, Generics & Children',
      questionText: 'How do you type polymorphic UI components in React using TypeScript generics and component-as-prop patterns? Explain the difference between React.ReactNode, React.ReactElement, and React.JSX.Element.',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Frontend Developer',
      programmingLanguage: 'TypeScript',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['TypeScript', 'React', 'Generics', 'Polymorphic Components'],
      expectedKeywords: ['polymorphic component', 'React.ReactNode', 'React.ReactElement', 'generic props', 'ComponentPropsWithoutRef'],
      idealAnswerRubric: 'Details typing "as" prop with generics constraining to valid HTML elements, difference between ReactNode (all renderable items including strings/null) and ReactElement (instantiated JSX object).',
      coreCompetencyTested: 'TypeScript React Component Architecture'
    },
    {
      title: 'Discriminated Unions for UI Async State Modeling in TypeScript',
      questionText: 'Why is modeling UI state with multiple boolean flags (isLoading, isError, hasData) error-prone? How do Discriminated Unions in TypeScript represent mutually exclusive states (Idle, Loading, Success, Failure) to prevent invalid UI states at compile time?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Frontend Developer',
      programmingLanguage: 'TypeScript',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['TypeScript', 'Discriminated Unions', 'State Modeling', 'Type Safety'],
      expectedKeywords: ['discriminated union', 'impossible state', 'type narrowing', 'status literal', 'exhaustive check'],
      idealAnswerRubric: 'Explains eliminating impossible states (e.g. isLoading true and isError true simultaneously), using common discriminant property (e.g. status), and enabling safe property access inside narrowed blocks.',
      coreCompetencyTested: 'Type-Safe UI State Modeling'
    }
  ],

  // 3. BACKEND DEVELOPER + PYTHON
  'software_engineer:python': [
    {
      title: 'Python Asyncio vs Multiprocessing in High-Throughput Web Services',
      questionText: 'In a high-throughput Python backend service (e.g. using FastAPI or Django Channels), when does the Python Global Interpreter Lock (GIL) become a throughput bottleneck? How do you architect a system that combines asyncio for non-blocking I/O with ProcessPoolExecutor for CPU-intensive tasks?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Software Development Engineer',
      programmingLanguage: 'Python',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Python Backend', 'Asyncio', 'GIL', 'Multiprocessing', 'FastAPI'],
      expectedKeywords: ['GIL', 'asyncio', 'ProcessPoolExecutor', 'I/O-bound vs CPU-bound', 'event loop non-blocking', 'FastAPI'],
      idealAnswerRubric: 'Explains GIL preventing parallel CPython bytecode execution on multiple cores, utilizing asyncio for thousands of concurrent network sockets, and offloading hashing/ML/image processing to worker processes.',
      coreCompetencyTested: 'Python Concurrency & Backend Architecture'
    },
    {
      title: 'Python Memory Management, Garbage Collection & Leaks in Long-Running Workers',
      questionText: 'How does CPython memory management work regarding reference counting and generational cyclic garbage collection (gc module)? In long-running Celery workers or API servers, what programming patterns cause cyclic memory retention, and how do you profile them using tracemalloc and objgraph?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'ADVANCED',
      role: 'Software Development Engineer',
      programmingLanguage: 'Python',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Python Memory Management', 'Garbage Collection', 'Memory Leaks', 'Profiling'],
      expectedKeywords: ['reference counting', 'cyclic GC', 'generational collector', 'tracemalloc', 'objgraph', 'weakref', 'memory leak'],
      idealAnswerRubric: 'Details instant deallocation on refcount 0, 3 generational sweeps identifying circular pointers, danger of closures capturing self in callbacks, and comparing memory snapshots with tracemalloc.',
      coreCompetencyTested: 'Python Memory Profiling & Internals'
    },
    {
      title: 'Database Integration with SQLAlchemy ORM & Mitigating N+1 Queries',
      questionText: 'When designing database persistence layers in Python using SQLAlchemy or Django ORM, how does the Identity Map pattern work? What causes the N+1 query problem during relational joins, and how do you resolve it using joinedload, selectinload, or prefetch_related?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Software Development Engineer',
      programmingLanguage: 'Python',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Python ORM', 'SQLAlchemy', 'N+1 Query', 'Database Performance'],
      expectedKeywords: ['SQLAlchemy', 'N+1 query problem', 'joinedload', 'selectinload', 'prefetch_related', 'lazy loading vs eager loading'],
      idealAnswerRubric: 'Explains default lazy-loading executing individual queries per parent entity in loops, comparing SQL JOIN overhead vs separate IN queries (selectinload), and maintaining session cache with Identity Map.',
      coreCompetencyTested: 'Python Database Architecture & ORM Optimization'
    },
    {
      title: 'Python Metaprogramming: Parameterized Decorators with functools.wraps',
      questionText: 'How do decorators work under the hood in Python as closures and higher-order callables? Write or explain the implementation of a reusable caching or rate-limiting decorator that accepts arguments, preserves function signature and docstrings via functools.wraps, and supports both synchronous and async coroutines.',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Software Development Engineer',
      programmingLanguage: 'Python',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Python Decorators', 'Metaprogramming', 'Closures', 'functools'],
      expectedKeywords: ['decorator', 'functools.wraps', 'higher-order function', 'inspect.iscoroutinefunction', 'args and kwargs'],
      idealAnswerRubric: 'Explains outer factory function returning actual decorator, wrapping with functools.wraps to prevent metadata loss (__name__, __doc__), and branching based on inspect.iscoroutinefunction to support async awaitables.',
      coreCompetencyTested: 'Python Idioms & Metaprogramming'
    }
  ],

  // 3b. BACKEND DEVELOPER + GO
  'software_engineer:golang': [
    {
      title: 'Go Goroutines, Channels, and Memory Model Concurrency',
      questionText: 'In Go backend microservices, how does the Go runtime scheduler (GMP model: Goroutines, Machines, Processors) work? How do you choose between using unbuffered channels, buffered channels, and sync.Mutex for concurrency synchronization, and how do you prevent goroutine leaks?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Software Development Engineer',
      programmingLanguage: 'Go (Golang)',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Go Backend', 'Goroutines', 'Channels', 'GMP Scheduler', 'Concurrency'],
      expectedKeywords: ['GMP model', 'goroutine leak', 'unbuffered channel', 'sync.Mutex', 'sync.WaitGroup', 'context cancellation'],
      idealAnswerRubric: 'Explains M:N cooperative scheduler mapping Goroutines to OS threads, channel communication vs shared memory mutex locking, and ensuring goroutines terminate via context.Done() or channel closes.',
      coreCompetencyTested: 'Go Concurrency & Systems Architecture'
    },
    {
      title: 'Go Memory Allocation: Escape Analysis, Stack vs Heap & GC Latency',
      questionText: 'How does the Go compiler perform escape analysis to decide whether a variable is allocated on the goroutine stack or the heap? How does heap allocation impact Go tri-color concurrent mark-and-sweep garbage collection pauses, and how do you optimize hot code paths using sync.Pool?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'ADVANCED',
      role: 'Software Development Engineer',
      programmingLanguage: 'Go (Golang)',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Go Memory Management', 'Escape Analysis', 'Garbage Collection', 'sync.Pool'],
      expectedKeywords: ['escape analysis', 'stack vs heap', 'tri-color GC', 'sync.Pool', 'pointer escape', 'allocation profiling'],
      idealAnswerRubric: 'Details stack allocation zero-overhead deallocation on function return, pointers escaping through interfaces or returns moving data to heap, and reducing GC pressure with sync.Pool object recycling.',
      coreCompetencyTested: 'Go Runtime Performance & Memory Management'
    },
    {
      title: 'Context Propagation, Timeouts & Graceful Shutdown in Go Web APIs',
      questionText: 'How should context.Context be utilized across HTTP and gRPC request lifecycles in Go? What causes context cancellation bugs, and how do you implement graceful server shutdown with os.Signal and server.Shutdown(ctx)?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Software Development Engineer',
      programmingLanguage: 'Go (Golang)',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Go Context', 'Graceful Shutdown', 'HTTP Services', 'Cancellation'],
      expectedKeywords: ['context.WithTimeout', 'context.WithCancel', 'context propagation', 'graceful shutdown', 'SIGTERM', 'server.Shutdown'],
      idealAnswerRubric: 'Explains passing context as first argument, listening on ctx.Done() in blocking I/O calls, avoiding storing context in structs, and waiting for ongoing in-flight requests to drain during SIGTERM.',
      coreCompetencyTested: 'Go Production Web Service Architecture'
    },
    {
      title: 'Idiomatic Error Handling in Go: Wrapping, Sentinel Errors & errors.Is/As',
      questionText: 'How does Go 1.13+ error wrapping with fmt.Errorf("%w", err) work? Explain the difference between errors.Is and errors.As, and contrast creating custom sentinel errors with type assertion error inspection.',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Software Development Engineer',
      programmingLanguage: 'Go (Golang)',
      category: 'TECHNICAL',
      domain: 'Software Development',
      topics: ['Go Error Handling', 'Error Wrapping', 'errors.Is', 'errors.As'],
      expectedKeywords: ['errors.Is', 'errors.As', 'error wrapping', '%w verb', 'sentinel error', 'unwrap'],
      idealAnswerRubric: 'Explains building an error chain with %w, recursively unwrapping to inspect specific sentinel errors with errors.Is, and safely binding structured custom error payloads using errors.As.',
      coreCompetencyTested: 'Go Idiomatic Error Handling'
    }
  ],

  // 4. DATA SCIENTIST + PYTHON
  'data_scientist:python': [
    {
      title: 'Data Leakage Prevention & Feature Engineering Pipelines with Scikit-Learn',
      questionText: 'How does data leakage occur during feature scaling, imputation, and target encoding in Python machine learning workflows? How do you leverage sklearn.pipeline.Pipeline and ColumnTransformer to guarantee that test folds remain strictly unexposed during cross-validation?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'ADVANCED',
      role: 'Data Scientist & ML Engineer',
      programmingLanguage: 'Python',
      category: 'TECHNICAL',
      domain: 'Artificial Intelligence & Machine Learning',
      topics: ['Machine Learning', 'Data Leakage', 'Scikit-Learn', 'Feature Engineering'],
      expectedKeywords: ['data leakage', 'scikit-learn Pipeline', 'ColumnTransformer', 'cross-validation', 'fit vs transform', 'imputation'],
      idealAnswerRubric: 'Explains fitting scalers/imputers on full datasets causing optimistic test bias, strictly isolating fit() to training splits within Pipeline, and using ColumnTransformer to handle heterogeneous features safely.',
      coreCompetencyTested: 'Machine Learning Integrity & Data Preprocessing'
    },
    {
      title: 'Evaluating Imbalanced Classification: ROC-AUC vs Precision-Recall Curves',
      questionText: 'When building a fraud detection model in Python where positive fraudulent transactions represent only 0.1% of the dataset, why is ROC-AUC a misleading metric? Why is the Precision-Recall (PR-AUC) curve superior, and how do you calibrate decision thresholds using cost-benefit matrices?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'ADVANCED',
      role: 'Data Scientist & ML Engineer',
      programmingLanguage: 'Python',
      category: 'TECHNICAL',
      domain: 'Artificial Intelligence & Machine Learning',
      topics: ['Model Evaluation', 'ROC-AUC', 'Precision-Recall', 'Imbalanced Data'],
      expectedKeywords: ['imbalanced data', 'ROC-AUC', 'Precision-Recall AUC', 'True Negative rate inflation', 'F1-score', 'threshold tuning'],
      idealAnswerRubric: 'Explains True Negative count dominating False Positive Rate calculation in ROC-AUC giving falsely optimistic scores, PR curve focusing exclusively on positive minority class, and tuning decision thresholds for business impact.',
      coreCompetencyTested: 'Statistical Evaluation & Metric Selection'
    },
    {
      title: 'Statistical Hypothesis Testing & p-value Pitfalls in Python (SciPy)',
      questionText: 'In an A/B testing scenario evaluated using scipy.stats, what are the primary assumptions of a two-sample t-test (normality, equal variance)? What is p-hacking, and how do you control for Family-Wise Error Rate using Bonferroni or False Discovery Rate (Benjamini-Hochberg) corrections?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'ADVANCED',
      role: 'Data Scientist & ML Engineer',
      programmingLanguage: 'Python',
      category: 'TECHNICAL',
      domain: 'Artificial Intelligence & Machine Learning',
      topics: ['Statistical Inference', 'Hypothesis Testing', 'p-value', 'SciPy', 'A/B Testing'],
      expectedKeywords: ['scipy.stats', 't-test', 'p-value', 'Type I error', 'p-hacking', 'Bonferroni correction', 'Benjamini-Hochberg'],
      idealAnswerRubric: 'Details null hypothesis testing, checking normality with Shapiro-Wilk or Levene test for equal variance, explaining cumulative Type I error probability across multiple tests, and applying Benjamini-Hochberg FDR adjustments.',
      coreCompetencyTested: 'Statistical Inference & Hypothesis Testing'
    }
  ],

  // 5. DEVOPS ENGINEER + PYTHON
  'devops_cloud_engineer:python': [
    {
      title: 'Infrastructure Automation with Python, Boto3 & Idempotent API Execution',
      questionText: 'When writing Python automation scripts using the AWS SDK (Boto3) or Kubernetes Python Client to provision and configure cloud infrastructure, how do you ensure idempotency? How do you handle transient API rate limiting with exponential backoff and jitter?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'ADVANCED',
      role: 'DevOps & Cloud Infrastructure Engineer',
      programmingLanguage: 'Python',
      category: 'TECHNICAL',
      domain: 'Cloud & DevOps Engineering',
      topics: ['Cloud Automation', 'Python Boto3', 'Idempotency', 'Rate Limiting'],
      expectedKeywords: ['Boto3', 'idempotency', 'exponential backoff', 'jitter', 'client tokens', 'rate limit (429/Throttling)'],
      idealAnswerRubric: 'Explains verifying existing resource state before dispatching creation requests, using client idempotency request tokens, and applying exponential backoff with full jitter to avoid thundering herd on cloud APIs.',
      coreCompetencyTested: 'Cloud Automation & Resilient Scripting'
    },
    {
      title: 'Kubernetes Pod Lifecycle, Cgroups & Automated Health Probes',
      questionText: 'How do Linux cgroups and namespaces isolate container CPU and memory inside a Kubernetes Pod? What happens when a Python container exceeds its memory limit (OOMKilled exit code 137), and how do you configure Liveness, Readiness, and Startup probes to prevent cascading deployment failures?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'ADVANCED',
      role: 'DevOps & Cloud Infrastructure Engineer',
      programmingLanguage: 'Python',
      category: 'TECHNICAL',
      domain: 'Cloud & DevOps Engineering',
      topics: ['Kubernetes', 'Containers', 'Cgroups', 'Health Probes', 'OOMKilled'],
      expectedKeywords: ['cgroups', 'namespaces', 'OOMKilled (137)', 'Liveness probe', 'Readiness probe', 'Startup probe', 'CPU throttling'],
      idealAnswerRubric: 'Explains kernel cgroup enforcement terminating processes exceeding memory limits, distinguishing liveness (restarting stalled container) from readiness (removing from service endpoints during warm-up), and tuning probe periods.',
      coreCompetencyTested: 'Container Orchestration & Systems Engineering'
    }
  ],

  // 6. CYBERSECURITY ANALYST + PYTHON
  'cybersecurity_analyst:python': [
    {
      title: 'Automated Network Packet Inspection & PCAP Analysis with Python',
      questionText: 'How would you write a Python script using Scapy or PyShark to inspect raw network packets from a PCAP capture? How do you detect anomalous TCP flags (e.g. SYN stealth scans or NULL scans) and reconstruct TCP streams to extract exfiltrated data?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Information Security & Cyber Defense Analyst',
      programmingLanguage: 'Python',
      category: 'TECHNICAL',
      domain: 'Cybersecurity & InfoSec',
      topics: ['Network Security', 'Python Scapy', 'Packet Analysis', 'Intrusion Detection'],
      expectedKeywords: ['Scapy', 'PCAP analysis', 'TCP handshake', 'SYN scan', 'TCP stream reconstruction', 'packet headers'],
      idealAnswerRubric: 'Explains parsing packet layers (Ethernet/IP/TCP), filtering on TCP flag bits (SYN without ACK, FIN/PSH/URG for Xmas scan), reassembling sequence numbers into byte payloads, and identifying rogue exfiltration channels.',
      coreCompetencyTested: 'Network Packet Forensics & Python Scripting'
    },
    {
      title: 'OWASP Top 10: Mitigating SQL Injection and SSRF in Python APIs',
      questionText: 'Explain the exploit mechanics of Server-Side Request Forgery (SSRF) and SQL Injection in Python web backends. How does parameterized querying prevent SQL injection, and what defenses (URL validation, IP whitelisting, preventing access to metadata 169.254.169.254) neutralize SSRF vulnerabilities?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'Information Security & Cyber Defense Analyst',
      programmingLanguage: 'Python',
      category: 'TECHNICAL',
      domain: 'Cybersecurity & InfoSec',
      topics: ['OWASP Top 10', 'SSRF', 'SQL Injection', 'AppSec'],
      expectedKeywords: ['SQL injection', 'parameterized query', 'SSRF', 'cloud metadata (169.254.169.254)', 'DNS rebinding', 'allowlist'],
      idealAnswerRubric: 'Contrasts string interpolation with database prepared statement parameter binding, explains attackers abusing backend HTTP requests to query internal services or cloud IAM credentials, and implementing strict domain/IP allowlists.',
      coreCompetencyTested: 'Application Security & Exploit Mitigation'
    }
  ],

  // 7. QA AUTOMATION SDET + JAVA
  'qa_automation_sdet:java': [
    {
      title: 'Thread-Safe Test Automation Framework Architecture in Java',
      questionText: 'How do you design a scalable, thread-safe test automation framework in Java using Selenium/Playwright and TestNG/JUnit 5? How do you leverage ThreadLocal to manage WebDriver instances during multi-threaded parallel execution across browsers without race conditions?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'QA Automation & SDET / Software Test Engineer',
      programmingLanguage: 'Java',
      category: 'TECHNICAL',
      domain: 'QA Automation & SDET',
      topics: ['Test Automation', 'Java', 'Selenium', 'ThreadLocal', 'Parallel Execution'],
      expectedKeywords: ['ThreadLocal<WebDriver>', 'Page Object Model', 'TestNG parallel execution', 'thread safety', 'race conditions', 'driver teardown'],
      idealAnswerRubric: 'Explains encapsulating WebDriver inside ThreadLocal to prevent threads overwriting browser session state, managing driver lifecycle with @BeforeMethod and @AfterMethod, and structuring maintainable Page Object Models.',
      coreCompetencyTested: 'Automation Framework Architecture & Concurrency'
    },
    {
      title: 'Mitigating Flaky Tests: Dynamic Explicit Waits vs Thread.sleep in Java',
      questionText: 'Why is using Thread.sleep() considered an anti-pattern in automated test suites? How do you leverage WebDriverWait, FluentWait, and ExpectedConditions in Java to handle asynchronous DOM updates, race conditions, and StaleElementReferenceExceptions reliably?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'INTERMEDIATE',
      role: 'QA Automation & SDET / Software Test Engineer',
      programmingLanguage: 'Java',
      category: 'TECHNICAL',
      domain: 'QA Automation & SDET',
      topics: ['Flaky Tests', 'Explicit Waits', 'Selenium', 'Java'],
      expectedKeywords: ['WebDriverWait', 'FluentWait', 'polling interval', 'StaleElementReferenceException', 'ExpectedConditions', 'flakiness'],
      idealAnswerRubric: 'Contrasts rigid sleep slowing CI execution with polling-based dynamic waits, configuring custom polling intervals and ignoring NoSuchElementException, and handling DOM node staleness when elements re-render.',
      coreCompetencyTested: 'Test Stability & Asynchronous Web Testing'
    }
  ],

  // 8. SYSTEM ARCHITECT + JAVA
  'system_architect:java': [
    {
      title: 'Distributed 64-bit Unique ID Generation (Snowflake ID Architecture)',
      questionText: 'Design a distributed 64-bit unique ID generator (similar to Twitter Snowflake) implemented in Java. How do you allocate bits across timestamp, datacenter ID, machine worker ID, and sequence number? How do you handle system clock drift (backward NTP synchronization) safely?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'ADVANCED',
      role: 'System Architect / Principal Engineer',
      programmingLanguage: 'Java',
      category: 'TECHNICAL',
      domain: 'System Design & Distributed Architecture',
      topics: ['System Design', 'Distributed Systems', 'Snowflake ID', 'Clock Drift'],
      expectedKeywords: ['Snowflake ID', '64-bit', 'timestamp bits', 'worker ID', 'sequence bits', 'NTP clock drift', 'bit shifting'],
      idealAnswerRubric: 'Breaks down bit budget (e.g. 1 sign bit, 41 timestamp bits for ~69 years, 10 node/worker bits, 12 sequence bits for 4096 IDs/ms), atomic sequence increment, and pausing or failing when clock moves backward until time catches up.',
      coreCompetencyTested: 'Distributed Systems Architecture & Scalability'
    },
    {
      title: 'Database Sharding, Partitioning Keys & Cross-Shard Joins',
      questionText: 'When scaling a relational database beyond single-node write limits, what criteria determine the optimal Sharding Key? What are the architectural trade-offs between Hash-based sharding and Range-based sharding, and how do you handle cross-shard queries and distributed transactions?',
      questionType: 'TECHNICAL_DEEP_DIVE',
      difficulty: 'ADVANCED',
      role: 'System Architect / Principal Engineer',
      programmingLanguage: 'Java',
      category: 'TECHNICAL',
      domain: 'System Design & Distributed Architecture',
      topics: ['Database Sharding', 'Partitioning', 'Distributed Systems', 'Scalability'],
      expectedKeywords: ['sharding key', 'hash sharding', 'range sharding', 'hotspotting', 'cross-shard joins', 'two-phase commit (2PC) / saga'],
      idealAnswerRubric: 'Explains choosing high-cardinality shard keys that align with frequent query access patterns, consistent hashing to minimize rebalancing, denormalization or CQRS to eliminate cross-shard joins, and Saga pattern for eventual consistency.',
      coreCompetencyTested: 'Data Architecture & Distributed Storage'
    }
  ]
};

// Curated Behavioral Questions (STAR Method, Role-Calibrated)
export const CURATED_BEHAVIORAL_QUESTIONS = [
  {
    title: 'Resolving a Critical Cross-Team Production Outage',
    questionText: 'Describe a situation where a critical production incident affected your services. Walking through the STAR method (Situation, Task, Action, Result), how did you coordinate triage, communicate with cross-functional stakeholders, and establish systemic preventions to avoid recurrence?',
    questionType: 'BEHAVIORAL_STAR',
    difficulty: 'INTERMEDIATE',
    category: 'BEHAVIORAL',
    domain: 'Software Development',
    expectedKeywords: ['situation', 'task', 'action', 'result', 'root cause', 'post-mortem', 'communication'],
    idealAnswerRubric: 'Candidate uses structured STAR narrative: clearly establishes problem severity, their personal responsibility, rapid calm communication/mitigation actions taken, and blameless post-mortem systemic fixes.',
    coreCompetencyTested: 'Incident Management & Crisis Leadership'
  },
  {
    title: 'Navigating Technical Disagreement & Architectural Alignment',
    questionText: 'Tell me about a time when you and another senior engineer or architect strongly disagreed on an architectural decision or technology choice. How did you analyze the trade-offs objectively, resolve the conflict, and maintain productive collaboration?',
    questionType: 'BEHAVIORAL_STAR',
    difficulty: 'INTERMEDIATE',
    category: 'BEHAVIORAL',
    domain: 'Software Development',
    expectedKeywords: ['trade-offs', 'data-driven decision', 'proof of concept (POC)', 'compromise', 'alignment', 'collaboration'],
    idealAnswerRubric: 'Demonstrates professional maturity, separating ego from technical decisions, using benchmarks or prototypes to gather objective telemetry, and committing fully to team decisions once finalized.',
    coreCompetencyTested: 'Technical Conflict Resolution & Team Collaboration'
  },
  {
    title: 'Managing Competing Deadlines and Technical Debt',
    questionText: 'Describe a project where tight delivery deadlines pressured the team to compromise on code quality or skip test coverage. How did you negotiate scope with product managers, manage technical debt, and ensure platform maintainability?',
    questionType: 'BEHAVIORAL_STAR',
    difficulty: 'INTERMEDIATE',
    category: 'BEHAVIORAL',
    domain: 'Software Development',
    expectedKeywords: ['technical debt', 'scope negotiation', 'product manager', 'trade-offs', 'prioritization', 'MVP'],
    idealAnswerRubric: 'Shows pragmatic engineering mindset: communicating business impact of debt clearly to non-technical stakeholders, cutting non-essential scope rather than critical tests, and scheduling debt paydown sprints.',
    coreCompetencyTested: 'Pragmatic Engineering & Stakeholder Communication'
  }
];

// Curated HR & Culture Questions
export const CURATED_HR_QUESTIONS = [
  {
    title: 'Career Motivation and Long-Term Engineering Growth',
    questionText: 'What motivated your interest in this role, and what specific technical challenges or domain areas are you most eager to tackle over the next two to three years of your career?',
    questionType: 'SHORT_ANSWER',
    difficulty: 'INTERMEDIATE',
    category: 'HR',
    domain: 'Software Development',
    expectedKeywords: ['career growth', 'learning', 'impact', 'motivation', 'continuous improvement'],
    idealAnswerRubric: 'Articulates clear self-awareness, alignment with team mission, enthusiasm for technical mastery, and thoughtful long-term perspective.',
    coreCompetencyTested: 'Career Motivation & Organizational Fit'
  },
  {
    title: 'Constructive Feedback and Growth Mindset',
    questionText: 'Can you share an example of critical feedback you received from a peer or manager that surprised you? How did you process that feedback, and what concrete changes did you implement in your work habits or communication style?',
    questionType: 'SHORT_ANSWER',
    difficulty: 'INTERMEDIATE',
    category: 'HR',
    domain: 'Software Development',
    expectedKeywords: ['feedback', 'growth mindset', 'self-awareness', 'adaptation', 'communication'],
    idealAnswerRubric: 'Shows humility, receptiveness to constructive feedback without defensiveness, and proactive behavioral change with measurable self-improvement.',
    coreCompetencyTested: 'Receptiveness to Feedback & Emotional Intelligence'
  }
];

/**
 * Generate fully validated, intersection-aware fallback questions
 * @param {object} params
 * @returns {Array<object>}
 */
export function generateCuratedQuestions({
  role = 'Frontend Developer',
  programmingLanguage = 'JavaScript',
  domain = 'Software Development',
  category = 'TECHNICAL',
  difficulty = 'INTERMEDIATE',
  totalQuestions = 5
}) {
  const roleProfile = getRoleProfile(role, domain);
  const langProfile = getLanguageProfile(programmingLanguage);
  const catUpper = (category || 'TECHNICAL').toUpperCase();
  const diffUpper = (difficulty || 'INTERMEDIATE').toUpperCase();

  const sessionConfig = {
    targetRole: roleProfile.title,
    roleProfile,
    programmingLanguage: langProfile.name,
    languageProfile: langProfile,
    domain,
    category: catUpper,
    difficulty: diffUpper
  };

  const pool = [];

  // 1. Check for exact intersection match
  const intersectionKey = `${roleProfile.id}:${langProfile.id}`;
  if (CURATED_INTERSECTIONS[intersectionKey]) {
    pool.push(...CURATED_INTERSECTIONS[intersectionKey]);
  }

  // 2. Track-specific pools
  if (catUpper === 'BEHAVIORAL') {
    pool.unshift(...CURATED_BEHAVIORAL_QUESTIONS);
  } else if (catUpper === 'HR') {
    pool.unshift(...CURATED_HR_QUESTIONS);
  }

  // 3. Fallback to language questions if category is TECHNICAL/CODING and they pass role validation
  if (catUpper === 'TECHNICAL' || catUpper === 'CODING') {
    const rawLangQuestions = (langProfile.questions || []).map(q => ({
      ...q,
      role: roleProfile.title,
      programmingLanguage: langProfile.name,
      category: catUpper,
      difficulty: diffUpper,
      domain
    }));
    pool.push(...rawLangQuestions);
  }

  // 4. Validate all candidates through questionValidator to guarantee ZERO violations
  const verifiedQuestions = [];
  for (const candidate of pool) {
    if (verifiedQuestions.length >= totalQuestions) break;
    const val = validateQuestion(candidate, sessionConfig);
    if (val.isValid && !verifiedQuestions.some(v => v.title === candidate.title || v.questionText === candidate.questionText)) {
      verifiedQuestions.push({
        ...candidate,
        difficulty: candidate.difficulty || diffUpper,
        role: roleProfile.title,
        programmingLanguage: langProfile.name,
        category: catUpper,
        domain
      });
    }
  }

  // 5. If still need more questions, dynamically formulate from the role's core pillars & language
  const SYNTH_TEMPLATES = [
    (role, lang, pillar) => `As a ${role} leveraging ${lang}, how do you design, implement, and scale "${pillar}"? Detail the specific language idioms, performance characteristics, and common pitfalls you encounter in production.`,
    (role, lang, pillar) => `Walk through a critical engineering scenario where you had to debug or optimize "${pillar}" in ${lang}. What profiling techniques, memory patterns, and architectural trade-offs did you evaluate as a ${role}?`,
    (role, lang, pillar) => `When building resilient systems with ${lang}, what are the best practices for ensuring "${pillar}" remains robust under high load or failover? Contrast your approach to alternative patterns.`,
    (role, lang, pillar) => `In your production experience as a ${role}, how do you maintain clean code, observability, and test coverage around "${pillar}" in ${lang}? Explain how you prevent regressions and memory leaks.`,
    (role, lang, pillar) => `Describe the internal execution mechanics and runtime model of ${lang} that directly influence how you architect "${pillar}". What trade-offs between memory footprint and latency must you balance?`
  ];

  let pillarIndex = 0;
  const pillars = roleProfile.corePillars || roleProfile.core_pillars || [];
  while (verifiedQuestions.length < totalQuestions && pillarIndex < pillars.length) {
    const pillar = pillars[pillarIndex];
    const templateFn = SYNTH_TEMPLATES[pillarIndex % SYNTH_TEMPLATES.length];
    pillarIndex++;

    const synthQuestion = {
      orderIndex: verifiedQuestions.length + 1,
      title: `${pillar} in ${langProfile.name}`,
      questionText: templateFn(roleProfile.title, langProfile.name, pillar),
      questionType: catUpper === 'BEHAVIORAL' ? 'BEHAVIORAL_STAR' : 'TECHNICAL_DEEP_DIVE',
      difficulty: diffUpper,
      role: roleProfile.title,
      programmingLanguage: langProfile.name,
      category: catUpper,
      domain,
      topics: [pillar, langProfile.name],
      expectedKeywords: [langProfile.name, ...roleProfile.allowedTopics.slice(0, 3)],
      idealAnswerRubric: `Demonstrates thorough hands-on mastery of ${pillar} utilizing idiomatic ${langProfile.name} constructs, explaining architectural trade-offs, reliability, and edge-case handling specific to a ${roleProfile.title}.`,
      coreCompetencyTested: pillar
    };

    const val = validateQuestion(synthQuestion, sessionConfig);
    if (val.isValid && !verifiedQuestions.some(v => v.questionText === synthQuestion.questionText)) {
      verifiedQuestions.push(synthQuestion);
    }
  }

  // Re-index orderIndex cleanly
  return verifiedQuestions.slice(0, totalQuestions).map((q, idx) => ({
    ...q,
    orderIndex: idx + 1
  }));
}
