
```markdown
# OS-PhiloSim — Build Brief

University OS mini-project, 20 marks. Interactive Dining Philosophers synchronization simulator. Must look like a commercial product, not a student assignment.

## Already done
- Vite + React 19 + TS scaffolded
- Tailwind v3 configured with custom colors (bg, panel, border, accent, eating, hungry, deadlock, waiting)
- Installed: framer-motion, chart.js, react-chartjs-2, lucide-react, react-router-dom
- `src/index.css` has @tailwind directives + Inter font + `.glass` utility
- Folder structure exists: src/components/{ui,simulator,charts,layout,theory}, src/engine/strategies, src/hooks, src/pages, src/lib
- Routing scaffolded with Home, Simulator, Theory pages + navbar

## Build everything below. Do NOT simplify. Do NOT ask for confirmation between phases — just build.

## Stack constraints
React 19, TypeScript strict, Tailwind v3, Framer Motion, Chart.js + react-chartjs-2, lucide-react, react-router-dom. NO shadcn CLI — inline UI primitives (Button, Card, Slider, Switch, Tabs, Badge) under `src/components/ui/`. No backend, no external APIs.

## Visual identity
Dark theme `#0a0a0f` base. Glassmorphism panels (backdrop-blur, rgba(255,255,255,0.04) bg, rgba(255,255,255,0.08) borders). Accent indigo `#6366f1`. State colors: thinking blue `#3b82f6`, hungry amber `#f59e0b`, eating emerald `#10b981`, deadlock rose `#f43f5e`, waiting slate `#64748b`. Inter font. Generous spacing. Linear/Vercel aesthetic.

## Engine (build this FIRST and get it right)
- Tick-based scheduler driven by `requestAnimationFrame`. Single `engine.tick(deltaMs)` call per frame. Speed multiplier scales delta. Pause = stop calling tick. Step mode = manually call tick once per click.
- Each philosopher is an FSM: `THINKING → HUNGRY → WAITING → EATING → THINKING`. Each state has a duration (thinking/eating randomized within range).
- Forks are semaphores: `{ id, value: 0|1, ownerId: number|null }`.
- Strategies are pluggable modules in `src/engine/strategies/`. Each exports `{ name, description, tryAcquire(philo, forks, ctx), release(philo, forks, ctx) }`. Engine calls the active strategy — engine code never branches on mode.
- Deadlock detection: if every philosopher is WAITING and holds exactly one fork for > 3 seconds sim time, emit `DEADLOCK` event and freeze.
- Event bus: pub/sub. Every state transition pushes `{ timestamp, philosopherId, type, message, color }` to a ring buffer (cap 500). Components subscribe.
- Stats tracker: meals per philosopher, total wait time, hungry time, thinking time, eating time, deadlock count, fork utilization %, sim time.
- Types in `src/engine/types.ts` — discriminated unions, no `any`.

## 4 Modes (strategies)
1. **Deadlock Demo** — every philosopher grabs LEFT fork first, then tries right. Guaranteed deadlock. Display ❌ DEADLOCK DETECTED overlay with explanation.
2. **Semaphore** — binary semaphore per fork. Philosopher only attempts pickup if both forks available (atomic check). Display semaphore values live (Fork0=1, Fork1=0, ...). ✅ DEADLOCK AVOIDED.
3. **Waiter** — central waiter object grants permission. Only N-1 philosophers can be hungry at once (max philosophers minus one). Show waiter decisions in log.
4. **Resource Ordering** — always pick lower-numbered fork first regardless of position. Prevents circular wait.

## UI components to build

**Layout**
- Navbar (already exists, polish it)
- Home page: animated gradient hero, big title, subtitle "Interactive Operating System Synchronization Laboratory", CTA → /simulator, 6 concept cards (Synchronization, Deadlock, Semaphore, Mutex, Starvation, Resource Allocation) with icons + hover lift, "About Dining Philosophers" section, footer.

**Simulator page** (the main view)
- Top: mode selector (4 tabs)
- Center-left: circular SVG dining table, 600x600. Philosophers positioned by `angle = i * 2π/n - π/2`. Each philosopher = avatar circle (gradient by state) + label P0..Pn + state ring + name. Forks between philosophers, rotate/glow when held. Use Framer Motion for all transitions. Hungry = pulse. Eating = glow + scale 1.05. Deadlock = red flash.
- Right sidebar: tabs for [Event Log | Stats | Internal OS]
  - Event Log: auto-scrolling, timestamped, color-coded by event type, export button
  - Stats: meals per philosopher (bar), wait/hungry/thinking times, deadlock count, fork utilization, sim time
  - Internal OS: semaphore values table, per-philosopher state + held forks, queues (waiting/blocked/eating/thinking)
- Bottom: control panel — Start/Pause/Reset, speed slider (0.25/0.5/1/2/4x), step button, philosopher count slider (5–10), random thinking time toggle
- Below table: mode explainer card (changes per mode)

**Charts page or tab**
Chart.js: meals bar chart, wait time line chart, fork utilization doughnut, timeline gantt for last 30s. Update every 500ms (debounced).

**Theory page**
Full educational content with collapsible sections: Process Synchronization, Critical Section, Semaphore, Mutex, Deadlock, Starvation, Dining Philosophers Problem, Coffman's 4 Conditions (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait), Deadlock Prevention, Deadlock Avoidance, Deadlock vs Starvation comparison table, Advantages, Disadvantages, Real-world Applications. Each section has clean heading + body + small inline diagram where relevant.

**Extras**
- Keyboard shortcuts: Space=pause/play, R=reset, S=step, 1-4=switch mode, +/- speed, F=fullscreen
- Export event log as .txt
- Screenshot button (html2canvas — install it)
- Fullscreen API toggle
- Toast notifications for major events (deadlock, mode change)

## Folder structure (use exactly this)
```
src/
  components/
    ui/              Button, Card, Slider, Switch, Tabs, Badge, Toast
    simulator/      Table, Philosopher, Fork, ControlPanel, EventLog, StatsPanel, ModeSelector, ModeExplainer, InternalOSView
    charts/          MealsChart, WaitTimeChart, ForkUsageChart, TimelineChart
    layout/          Navbar, HeroSection, ConceptCard
    theory/          TheoryPanel, TheorySection
  engine/
    types.ts
    simulation.ts
    eventBus.ts
    stats.ts
    strategies/      deadlock.ts, semaphore.ts, waiter.ts, ordering.ts, index.ts
  hooks/
    useSimulation.ts
    useKeyboardShortcuts.ts
    useFullscreen.ts
  pages/             Home.tsx, Simulator.tsx, Theory.tsx
  lib/               utils.ts
```

## Code quality
- Strict TS, no `any`, discriminated unions for states/events
- Each component < 250 lines, extract subcomponents
- Heavy comments in engine (this is graded — examiner will read it)
- Reusable hooks
- Clean prop types

## Deliverables at the end
- Fully working `npm run dev`
- Updated README.md: overview, features (full list), installation, how to run, folder structure, tech stack, screenshots placeholder, future scope, author
- All 4 modes demonstrably work
- No console errors
- Responsive down to 1280px width minimum