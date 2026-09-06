# PRD — [Your Name] Portfolio

**Status:** Draft
**Companion docs:** `design.md` (visual/interaction spec) · `assistant-llm-plan.md`
(the live help assistant) · `from-scratch-model-plan.md` (the trained-from-scratch
exhibit model)

---

## 1. Summary

A personal portfolio site built as an interactive light-mode desktop
environment rather than a scrolling page. Visitors "arrive" at a machine —
a boot sequence, a dock of apps, draggable windows for About/Resume/Work/
Contact — and can talk to a small assistant you built and trained
yourself if they want help navigating or have questions. A second, purely
exhibited from-scratch model demonstrates the training process itself as
its own project.

## 2. Problem & Goals

**Problem:** A resume PDF and a grid of project thumbnails is the default
portfolio shape, and it doesn't demonstrate anything about how you think
or build — it's a container, not a piece of work in itself.

**Goals:**
1. Get hiring managers/collaborators to the information they need (resume,
   relevant project) with minimal friction, inside a distinctive
   experience they remember.
2. Demonstrate technical range beyond frontend polish — specifically,
   that you can scope, build, and ship a small ML system end-to-end (the
   assistant), not just talk about ML.
3. Make the site itself worth sharing/screenshotting, the way the
   eeerik.com reference is — without copying its visual language wholesale.

**Non-goals:**
- Not a general-purpose chatbot product — the assistant is scoped
  narrowly (see §5.3).
- Not a CMS or multi-user platform — content is edited by you, in source
  files, not through an admin UI.
- Not optimizing for SEO/content-marketing reach — this is a portfolio,
  not a blog trying to rank.

## 3. Audience

- **Primary:** hiring managers, recruiters, and technical collaborators
  evaluating you for a role or project — likely visiting once, on desktop,
  with limited time.
- **Secondary:** peers/other designers-developers browsing for
  inspiration or curiosity — more likely to explore deeply, on any device,
  more tolerant of (even delighted by) easter eggs.

Design and content decisions should default to serving the primary
audience's speed-to-information first, and treat the secondary audience's
enjoyment as a bonus layered on top — never the reverse.

## 4. Success Metrics

Qualitative for a v1 (no real traffic-based targets yet):
- A first-time visitor can find your resume and at least one project
  within ~30 seconds without instruction.
- The assistant correctly answers the eval set defined in
  `assistant-llm-plan.md` §7 at a high pass rate before launch, and
  gracefully declines out-of-scope questions.
- The site is usable end-to-end on mobile, keyboard-only, and with
  `prefers-reduced-motion` set, per `design.md` §7.
- Post-launch: track (anonymously) whether visitors who open the
  Assistant also go on to open Contact or Resume — a rough proxy for
  whether it's actually helping people get where they need to go.

## 5. Feature Requirements

### 5.1 The Shell
| Requirement | Detail |
|---|---|
| Boot sequence | Plays once per session, skippable, per `design.md` §3 |
| Top status bar | Window-control dots, machine name, live clock |
| Dock | Bottom-centered, icons for About / Resume / Work / Contact / Assistant |
| Window manager | Draggable, resizable, closable windows; focus brings to front |
| Responsive mode | Dock → tab bar, windows → full-screen sheets below ~768px |

### 5.2 Content Windows
| Window | Requirement |
|---|---|
| About | Short bio, one pinned "photo," in-voice copy |
| Resume | Readable in-window document; "Download as PDF" action |
| Work | Finder-style grid of project files; click to open case-study window per project |
| Contact | Mail-compose-style form; verb-consistent send/sent states |

### 5.3 The Assistant (primary, live)
Per `assistant-llm-plan.md` in full. Summary requirements:
- Small fine-tuned open-weight model (1–3B params) + retrieval over
  `/content`, not a from-scratch model — accuracy matters more than the
  "trained by me" story here.
- Scoped strictly to: background/experience questions, project questions,
  site navigation/routing, and a graceful handoff to Contact otherwise.
- Must decline out-of-scope requests in-voice rather than attempting them.
- Streaming responses into the chat window UI from `design.md` §4.
- Guardrails for prompt injection, rate limiting, and no leakage of
  anything not already public in `/content`.
- Clear, visible disclosure that it's an AI you built.

### 5.4 The From-Scratch Exhibit (secondary, demonstrative)
Per `from-scratch-model-plan.md` in full. Summary requirements:
- A separately-labeled window/exhibit, never presented as the help chat.
- Shows the actual training artifacts: loss curve, checkpoint sample
  generations, corpus/parameter/training-time facts.
- Optional live prompt box against the finished checkpoint, explicitly
  labeled as a small, quirky, from-scratch model — expectations set so
  its rougher output reads as the point, not a bug.

### 5.5 Desktop Easter Eggs (optional, low priority)
2–3 loose desktop icons outside the dock (a `notes.txt`, a small toy) —
nice-to-have polish, not required for launch. Keep desktop-surface icon
count low per `design.md` §1's anti-clutter principle.

## 6. Technical Architecture (high level)

```
┌────────────────────────┐        ┌──────────────────────────┐
│  Frontend (React)      │──HTTP──▶  Assistant API            │
│  window manager, dock, │        │  retrieval + small LLM    │
│  chat UI, boot sequence│        │  (assistant-llm-plan.md)  │
└────────────────────────┘        └──────────────────────────┘
          │                                    │
          │                       ┌──────────────────────────┐
          └──────────HTTP─────────▶  Exhibit API              │
                                  │  from-scratch model        │
                                  │  (from-scratch-model-plan.md)│
                                  └──────────────────────────┘

/content (markdown source of truth) ──▶ feeds both the Resume/Work/About
windows (rendered directly) and the Assistant's retrieval index
```

Content lives once, in `/content`, and is consumed both by the rendered
site windows and by the assistant's retrieval layer — a resume edit
updates both automatically rather than needing to stay in sync by hand.

## 7. Non-Functional Requirements

- **Accessibility:** keyboard operability, visible focus states, AA
  contrast, `prefers-reduced-motion` support — full detail in `design.md`
  §7. This is a launch blocker, not a follow-up.
- **Performance:** boot sequence and shell interactive quickly on load;
  assistant/exhibit model calls should stream so perceived latency stays
  low even if generation takes a couple of seconds.
- **Privacy:** assistant conversation logs (if kept, per
  `assistant-llm-plan.md` §8) store no identifying data beyond a session
  id, with a visible disclosure near the chat input.
- **Content ownership:** anything used to train or ground either model
  must be content you hold rights to (your own writing) or verified
  public-domain/permissively-licensed sources for the exhibit model's base
  corpus — see `from-scratch-model-plan.md` §2.1.

## 8. Roadmap

| Phase | Scope | Reference |
|---|---|---|
| 1 — Shell | Boot sequence, dock, window manager, static About/Resume/Work/Contact content | `design.md` §3 |
| 2 — Assistant baseline | `/content` structured, retrieval layer live over base model, no fine-tune yet | `assistant-llm-plan.md` §2, §5 |
| 3 — Assistant fine-tune | Synthetic Q&A set, LoRA fine-tune, eval pass, guardrails, deploy | `assistant-llm-plan.md` §2–8 |
| 4 — Exhibit model | Base pretrain, continued pretrain on your writing, `train_log.txt` window | `from-scratch-model-plan.md` full |
| 5 — Polish | Mobile pass, accessibility audit, easter eggs, real-visitor feedback loop | `design.md` §7, `assistant-llm-plan.md` §2.3 |

Phases 1–3 are the launchable v1. Phase 4 can ship after, as an
added exhibit — it doesn't block the assistant or the core site.

## 9. Open Questions

- Final machine/site name and assistant name/voice — placeholders used
  throughout the companion docs (`[name]OS`, `guide`) pending your call.
- Hosting/inference budget ceiling — determines the deployment tier chosen
  in `assistant-llm-plan.md` §8 (serverless vs. self-hosted vs. client-side).
- Whether conversation logging (§7, Privacy) is worth the added privacy
  surface for a v1, or deferred to phase 5 once there's real traffic to learn from.

## 10. Appendix

- `design.md` — full visual/interaction design spec
- `assistant-llm-plan.md` — implementation plan for the live retrieval-grounded assistant
- `from-scratch-model-plan.md` — implementation plan for the from-scratch exhibit model
