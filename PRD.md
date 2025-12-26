# prd_requirements.md

## Project
Personal website for Karanvir (Karan) Khanna, designed as a playful Linux-like operating system UI, built fully in React.

## Primary Goal
Create a highly interactive “web OS” portfolio that feels like a mini desktop environment: windows, terminal, file explorer, apps, and games. It should be fun to explore, packed with information about Karan, and visually alive with motion and micro-interactions.

## Inputs the agent MUST scrape and use
1. Resume PDF (local file provided): /mnt/data/karan_resume_one_page (7).pdf :contentReference[oaicite:0]{index=0}  
2. Devpost: https://devpost.com/prokaranvir?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav  
3. GitHub: https://github.com/Karanvir1729  
4. LinkedIn: https://www.linkedin.com/in/karan-khanna-b7013b24b/  

### Scraping requirements
- The agent must extract and normalize:
  - Bio + headline + contact links
  - Work experience (roles, bullets, dates, tech)
  - Projects (name, description, links, awards)
  - Education + coursework
  - Skills (languages, frameworks/tools, infra/devops/cloud/security/data governance)
  - Awards/certifications
- GitHub scraping details:
  - Pinned repos, top repos by stars, most recent active repos
  - Readme highlights, screenshots/assets if available, tech stacks, notable commits cadence
  - Auto-generate “Repo cards” with tags + quick actions (open, readme, live demo if exists)
- Devpost scraping details:
  - Projects + hackathon wins, media, project descriptions, tech used, teammates, demos
- LinkedIn scraping details:
  - Titles, experiences, descriptions, skills, featured links, education
- All scraped content should be stored in a local JSON format committed to the repo (content/content.json) with a deterministic schema.

## Target audience
- Recruiters and hiring managers for software engineering, data/ML, automation, infra, and systems roles
- Hackathon judges and collaborators
- Friends who want to explore a fun interactive site

## Brand / personality
- “Builder who ships” energy: automation, optimization, systems thinking, playful hacker vibe
- Aesthetic: Linux desktop + terminal + pixel/retro accents, but modern polished UI
- Heavy motion, but not chaotic; smooth and intentional

## Core UX concept: “Web Linux Desktop”
The site boots into a desktop environment:
- Top bar (time, status icons, quick search, theme toggle)
- Dock/taskbar with pinned apps
- Draggable, resizable windows with minimize/maximize/close
- Desktop icons
- Right click context menu on desktop and files
- Global spotlight search (Ctrl+K) to launch apps and jump to content
- Keyboard shortcuts like a real OS

### Boot sequence (must be included)
- Short boot animation: fake BIOS lines, then a loading bar, then desktop
- Option to “Skip boot next time” stored in localStorage

## Apps (windows) required
### 1) Terminal (high priority, flagship)
A terminal that:
- Supports commands (typed interface) with autocomplete and history
- Commands show real content from scraped data
- Must include “help” and “man” style docs

Example commands:
- `whoami` -> Karan’s quick bio
- `resume` -> opens resume viewer window
- `projects` -> lists projects, lets user open each
- `experience` -> timeline view
- `skills` -> searchable skills list
- `open github` / `open devpost` / `open linkedin`
- `repo <name>` -> opens repo detail window
- `play <game>` -> launches a game
- `theme <name>` -> changes theme (persist)
- `neofetch` -> fun system-style profile summary card
- `cat /home/karan/about.txt` style Easter eggs

### 2) File Explorer
A fake filesystem backed by structured JSON:
- `/home/karan/`
  - `about.txt`
  - `experience/`
  - `projects/`
  - `skills.json`
  - `awards.md`
  - `contact.vcf`
  - `fun/`
- Clicking files opens them in relevant viewers (markdown viewer, json viewer, image viewer)
- Include search inside file explorer

### 3) Projects App (Devpost + GitHub merged)
- Grid/list views
- Filters: hackathon winners, game projects, automation, ML, optimization
- Each project has:
  - overview
  - tech stack
  - screenshots/video embeds if available
  - “What I built” + “Impact” + “Hard parts” sections (agent-generated but grounded in scraped content)
  - links (repo, demo, devpost)

### 4) Experience App
- Timeline view with company cards and deep drill-down
- Must highlight IPPINKA (16 months) and KPMG role prominently
- Include metrics and tools from resume (automation, PO optimization, solver orchestration, infra)

### 5) Skills Matrix
- Searchable tag cloud
- Grouped by categories (Languages, Frameworks, Infra, DevOps, Cloud/APIs, Security, Data Governance, Optimization)
- “Skill proof” links: repo/projects where each skill appears

### 6) Resume Viewer
- Embedded PDF viewer
- Download button
- “Highlights” sidebar that auto-links to related projects

### 7) Games Arcade (must have multiple mini-games)
At minimum 3 mini-games that are light but addictive:
1. **Terminal Typing Rush**
   - Type commands quickly; improves “terminal OS” vibe
2. **Inventory Optimizer Puzzle**
   - A small grid-based puzzle inspired by procurement/PO optimization (does not need real solvers, but should reference the theme)
3. **Bug Hunt**
   - Click/drag to squash “bugs” floating on desktop; score + combos

Optional bonus games:
- Snake inside a terminal window
- Minesweeper “package manager edition”

Games must:
- Run entirely client-side
- Use requestAnimationFrame loops where appropriate
- Have sound toggle (default off)
- Store high scores in localStorage

### 8) “About / Story” App
- A narrative page with interactive elements:
  - draggable sticky notes
  - animated timeline of “wins”
  - “current interests” section (ML, optimization, systems, hackathons, games)

## Motion + “moving things” requirements
- Desktop environment should feel alive:
  - subtle parallax background
  - floating particles or soft noise layer
  - window open/close transitions
  - icons with hover physics
  - spring-based drag interactions
- Use a motion library (Framer Motion preferred) for:
  - window transitions
  - dock magnification effect
  - spotlight search overlay
  - boot animation
- Must include an FPS/performance guard:
  - reduce effects if user toggles “Low Motion” or if device is low-power

## Information density requirement
The OS must expose “a lot of information” without overwhelming:
- Default desktop is clean, with discoverability through apps and terminal
- Provide quick summary panels plus deeper drill-down pages
- Every major resume bullet should be represented somewhere (experience details, project details, skills proof) :contentReference[oaicite:1]{index=1}

## Content requirements based on resume (must be represented)
From the resume, ensure the site clearly includes:
- Name: Karanvir (Karan) Khanna :contentReference[oaicite:2]{index=2}
- UofT CS, Apr 2026, CGPA 3.7/4.0, Dean’s List, coursework :contentReference[oaicite:3]{index=3}
- IPPINKA (Jun 2024–Sept 2025): automation, PO optimization, forecasting, infra deployment, mentoring :contentReference[oaicite:4]{index=4}
- KPMG (May–Oct 2023): AI assistants, governance pipelines, playbook, vendor evaluation :contentReference[oaicite:5]{index=5}
- Projects:
  - Tarazoo (HTN 2025 Winner)
  - Automated PO System
  - Tormented by Lights (Game Jam 2025 Winner)
  - Definition Finder (DeerHacks 2022 Winner)
  - Matroid Theory research + paper :contentReference[oaicite:6]{index=6}
- Certifications/Awards (CDMP, hackathon wins) :contentReference[oaicite:7]{index=7}
- Skills categories including Optimization and Data Governance :contentReference[oaicite:8]{index=8}

## Tech requirements
- Framework: React (must be React-first, no non-React front-end framework)
- Language: TypeScript
- Build tool: Vite (preferred) or Next.js (acceptable)
- Styling: Tailwind or CSS modules (agent chooses one and stays consistent)
- Animation: Framer Motion preferred
- State management: lightweight (Zustand or Redux Toolkit), but keep it clean
- Routing: internal “app router” within OS, not traditional pages (still allow deep links if possible)
- Data: scraped content stored as JSON, loaded locally (no backend required)

## Architecture requirements
### OS shell modules
- Window manager:
  - z-index stacking
  - snapping
  - minimize/maximize
  - focus handling
  - keyboard controls
- App registry:
  - list of installed apps with icons, launch commands, permissions
- Filesystem model:
  - virtual nodes (folders/files)
  - open handlers (viewer apps)
- Terminal command system:
  - parser
  - command registry
  - autocompletion
  - piping optional (bonus)

### Data pipeline
- A scraping script (Node.js) that:
  - pulls GitHub, Devpost, LinkedIn
  - extracts resume PDF text
  - outputs a single normalized JSON schema
- Include a “content refresh” command:
  - `npm run refresh-content`
- The site should render from JSON only (no hardcoding resume content in UI components)

## Accessibility requirements
- Full keyboard navigation for desktop, dock, and terminal
- High-contrast mode
- Reduced motion toggle
- Font scaling support

## Performance requirements
- Lighthouse performance target: 85+ on desktop
- Avoid heavy shaders; keep particle effects configurable
- Code splitting by app window (lazy load apps)

## Security / legal requirements
- Do not collect user data beyond localStorage preferences
- No tracking by default
- Clearly label outbound links
- If LinkedIn scraping is limited by auth, the agent must:
  - fall back to using publicly available LinkedIn page sections
  - otherwise prompt the user for exported LinkedIn profile PDF (only if necessary)

## Deliverables
1. A complete React codebase with OS UI
2. Scraper scripts and normalized content JSON
3. At least 8 apps (Terminal, Explorer, Projects, Experience, Skills, Resume, About, Arcade)
4. Minimum 3 mini-games
5. Documentation:
   - README with setup, content refresh, deployment steps
   - “Commands” doc for terminal usage
6. Deployment target:
   - GitHub Pages or Vercel (agent chooses and configures)

## Quality bar
- This should feel like a polished interactive product, not a simple portfolio template.
- The agent should spend substantial effort on:
  - smooth window manager behavior
  - cohesive visual system
  - fun terminal and games
  - connecting every claim to evidence (repo links, devpost links, resume bullets)

## Implementation plan (agent must follow)
1. Scrape and normalize content into JSON
2. Build OS shell (window manager, dock, desktop, spotlight)
3. Implement Terminal + core commands
4. Implement File Explorer backed by the JSON filesystem
5. Implement Projects/Experience/Skills apps driven by scraped data
6. Implement Arcade games
7. Add boot sequence, themes, and motion polish
8. Performance pass + accessibility pass
9. Deploy and verify mobile responsiveness (even if desktop-first)

## Non-goals
- No server-side account system
- No paid services
- No bloated UI kits that fight the OS aesthetic

## Success criteria
- A recruiter can learn Karan’s full story and open proof links within 2 minutes.
- A friend can play games and explore for 10+ minutes without getting bored.
- The terminal is genuinely useful and fun.
- The site looks and behaves like an OS, not a webpage with OS wallpaper.
