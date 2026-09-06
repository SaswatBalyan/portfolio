# Design Spec — Personal Portfolio as a Desktop

A light, minimal desktop environment that lives in the browser. The visitor
isn't reading a page about your work — they're sitting down at your machine.
Resume, work, and contact are apps you open. A small assistant you built
yourself sits in the dock, ready to help someone who's lost.

Reference points: the "device you're sitting at" feeling from eeerik.com
(desktop icons, draggable windows, a boot moment, a persistent chat widget)
— reinterpreted in a quiet, restrained, paper-toned palette with soft
pastel accents instead of a loud neon one, with a bottom dock instead of a
Mac-style top menu bar (closer to Ubuntu/GNOME).

---

## 1. Design Plan

### Color

A warm paper-toned palette, not stark white, with two soft pastels doing
the same job the amber/teal pair did in dark mode: one accent carries all
interactive state, a second is reserved only for the assistant. Pastels
are confined to accent roles (fills, borders, dots, small state) — the
base neutrals still do most of the work, so the page doesn't slide into
a generic "friendly pastel SaaS" look.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#FBF7F1` | Desktop background — warm paper, not stark white |
| `--surface` | `#FFFFFF` | Window bodies |
| `--surface-raised` | `#F2EBDF` | Titlebars, dock background |
| `--line` | `#E4DAC8` | Hairline borders between chrome and content |
| `--ink` | `#2B2620` | Primary text — warm near-black, not pure black |
| `--ink-dim` | `#8E8474` | Secondary text, timestamps, inactive labels |
| `--coral` | `#F0AD8C` | Primary accent (soft) — fills, dots, hover states, icon tint |
| `--coral-text` | `#B85C36` | Deepened coral for links/focus rings — AA-safe on `--bg`/`--surface` |
| `--lilac` | `#C6B8EA` | Assistant accent (soft) — reserved solely for the assistant app |
| `--lilac-text` | `#6E58A8` | Deepened lilac for the assistant's text/focus needs |

No shadow-under-every-window. Windows separate from the desktop with a
1px `--line` border; only the **focused** window additionally gets a
soft `--ink`-tinted shadow (low opacity, warm, not the generic
`rgba(0,0,0,.1)` grey). Shadow depth signals focus state — it's not
decoration applied uniformly the way a SaaS card grid would.

### Type

Two families, clearly distinct roles, both justified by the desktop
metaphor rather than decorative habit:

- **System chrome (monospace):** window titlebars, dock tooltips, the
  clock, filenames, the terminal/boot sequence, the assistant's chat log.
  Suggest **Berkeley Mono** or **IBM Plex Mono** (fallback: `ui-monospace,
  "SF Mono", Menlo, monospace`). This is load-bearing here — it's what a
  desktop actually looks like — not a "small data label" flourish.
- **Content (humanist sans):** resume text, project descriptions, about
  copy — anything meant to be read at length inside a window. Suggest
  **Inter** or **Public Sans** at a slightly generous line-height (1.5–1.6)
  so paragraphs of ink-on-paper text stay easy to sit with for a full
  resume or case study.

Scale (rem, 16px base): 0.75 / 0.875 / 1 / 1.25 / 1.75 / 2.75. The 2.75
size is reserved for exactly one thing: the name/prompt in the boot
sequence. Nothing else on the site gets that large — the hero moment is
temporal (the boot), not a giant static headline.

Sentence case throughout. No tracked-out ALL-CAPS eyebrows. The one
legitimate use of caps is the titlebar text, because that's literally how
window titlebars are set on a real desktop — a functional convention, not
a decorative one.

### Layout

Desktop-first structure, mobile is a separate honest mode (see §7), not a
squished version of the desktop.

```
┌──────────────────────────────────────────────────────────┐
│  ● ● ○         [name].local              12:04            │  ← top status bar
│                                                             │   (thin, quiet — clock
│                                                             │    + connection dot only)
│                                                             │
│   [Resume]     [Work]                                       │
│                                                              │
│                                                              │
│              ┌───────────────────────┐                      │
│   [About]    │  window: Resume ▾ ✕   │                      │
│              │  ...content...        │                      │
│              │                       │                      │
│              └───────────────────────┘                      │
│                                                              │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  [About] [Resume] [Work] [Contact]  ·  [Assistant]  │    │  ← dock
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

Icons on the desktop surface itself are minimal (2–3 max — treat them as
easter eggs, e.g. a `notes.txt` or `now-playing.wav`), because the dock is
the real navigation. This avoids inheriting eeerik.com's cluttered-desktop
density while keeping its "this is a machine" identity. Windows open
centered, slightly offset if more than one is open, and are draggable by
the titlebar. Content inside windows is left-aligned, max 68–72 characters
per line for resume/about prose.

### Principles

1. **The desktop is the homepage.** There is no scroll-down landing page —
   arriving at the site *is* arriving at the desktop. The boot sequence is
   the one hero moment.
2. **One accent for the machine, one for the guest.** Coral = your work.
   Lilac = the assistant. A visitor should always be able to tell which
   one they're looking at without reading a label.
3. **Every visual device is functional.** Titlebars, the clock, the dock,
   the "unsaved" dot on a window — all real states of a real desktop, not
   decoration borrowed from an OS for style points.
4. **Quiet by default, precise on interaction.** No ambient motion once
   the boot finishes. Windows open/close/drag/snap with quick, exact
   easing — motion always answers something the visitor did.
5. **Light mode is native, not a toggle.** This machine lives on a sunlit
   desk, not in a server room. (A dark "night mode" can exist later as an
   Easter egg — e.g. dragging a `moonrise.exe` icon — never as a settings
   switch that dilutes the identity.)

---

## 2. Review Against the Brief (anti-slop check)

- ~~Warm cream + serif + terracotta~~ — the closest generic pattern to
  this palette, so worth checking explicitly: `#FBF7F1` is a paper tone,
  not the specific `#F4F1EA` cream; there's no serif anywhere in the type
  system (mono + humanist sans only); and coral/lilac are a deliberately
  *pair* of soft accents rather than one warm terracotta doing all the
  work. Different enough on all three axes, not just the hex value.
- **SaaS card kit — the real risk on a light pastel palette.** Rounded
  cards, an identical soft grey shadow under everything, and gradient
  washes as decoration is the default a light+pastel brief slides toward.
  Mitigated directly: corners stay square-ish (2px radius), shadows only
  appear on the *focused* window (a functional state, not blanket
  decoration — see Color above), there are no gradient washes anywhere,
  and pastel is confined to accent roles (fills/borders/dots) rather than
  large wash backgrounds. If a build pass ever adds a gradient "for
  polish," that's the tell this has drifted.
- ~~ALL-CAPS eyebrows / em-dash labels / middle-dot meta strings~~ — none;
  the only caps usage is the functional titlebar text.
- **Monospace as a label font** — flagged generally as a tell, but here
  it's the *primary system voice* because the subject is literally an
  operating system UI. Kept, but confined to chrome/system text; long-form
  reading (resume, about, project write-ups) stays in the humanist sans so
  paragraphs remain comfortable to read.
- **Risk to watch:** a light, pastel, rounded interface reads as a
  friendly onboarding app unless the OS-ness is kept load-bearing —
  functional titlebars, the dock, hairline structure, and plain
  unembellished copy (no exclamation points, no illustrated blobs) are
  what keep this a *machine* rather than a product landing page that
  happens to be pastel-colored.

---

## 3. The Shell

**Boot sequence (page load, plays once per session):**
A brief terminal-style sequence, ~1.5–2s, skippable on click/keypress:
```
[name]OS — booting...
loading resume.................. done
loading work..................... done
starting assistant............... done
```
Then a quick fade/scale into the desktop. This is the single orchestrated
motion moment the whole site earns — everything after is response-to-
action only.

**Top status bar:** three window-control dots (decorative, or wired to
"minimize all"), the machine name (`erik.local` style — use the person's
actual name), and a live clock. No nav links here — navigation lives in
the dock, where it belongs on this kind of desktop.

**Dock (bottom, Ubuntu/GNOME-style):** centered pill, `--surface`
background, icons for **About**, **Resume**, **Work**, **Contact**, a
thin divider, then **Assistant** on its own, visually offset (small lilac
dot) so it never gets mistaken for "just another app." Icons scale up
subtly on hover (1.0 → 1.12, ~120ms) with a small label tooltip above —
the one hover-affordance genuinely useful here, not decoration on every
element.

**Windows:** each app opens as a draggable, closable window with a
titlebar (`● ● ○` traffic-light-style but functional: close / minimize /
maximize), resizable from the corner, and a subtle "unsaved/live" dot if
relevant (e.g., Resume window shows a small dot if you're mid-edit-view of
a newer version). Opening/closing uses a quick 150–200ms scale+fade, never
a bouncy spring — precise, not playful.

- **About** — short, plainspoken bio. One project screenshot as a framed
  "photo" pinned to the window, not a hero image.
- **Resume** — rendered as a real document inside the window (not a PDF
  embed if avoidable — style it as a clean, readable in-window doc), with
  a "Download as PDF" action styled like a real file-save action, not a
  button-with-arrow.
- **Work** — opens like a Finder/Files view: a grid of project "files"
  (thumbnail + filename + filetype, echoing the reference screenshots),
  click to open a full case-study window per project.
- **Contact** — a simple form styled like composing a message in a native
  mail app window; primary action reads "Send," success state reads
  "Sent" — active-voice, consistent verb through the whole flow.

---

## 4. The Assistant

This is the one place the "lilac" accent is used, and the one place
personality is allowed to be a little more expressive than the rest of the
restrained shell — it's a guest in the room, not the room itself.

- **Dock icon:** a small terminal/chat glyph with a persistent soft lilac
  dot (idle "breathing" opacity pulse only — the one exception to "no
  ambient motion," because it's signaling availability, not decorating).
- **Opens as:** a chat window, same chrome as other windows, titled
  something specific and in-voice rather than generic — e.g. `guide` or
  the assistant's actual given name — not "AI Assistant" or "Chatbot."
- **Message layout:** assistant messages left-aligned in a lilac-bordered
  bubble on `--surface`, visitor messages right-aligned, plain `--surface-
  raised` bubble, no avatar cartoon needed — the lilac border alone is
  enough to distinguish it. Monospace for both, matching the system voice.
- **First message on open:** something that orients a lost visitor
  immediately and in plain language — what it can help with (finding a
  specific project, explaining a piece of the resume, pointing at contact
  info) — not a personality flex before it's useful.
- **Empty/typing state:** three-dot typing indicator only; no "thinking..."
  copy that anthropomorphizes more than needed.
- **Failure state:** if the assistant can't answer, it says so plainly and
  points at a fallback (the Contact window) — in its own voice, not an
  apologetic one.

---

## 5. Motion

One rule: motion always answers something the visitor did, except the
single boot sequence and the assistant's idle-availability pulse.

| Interaction | Motion |
|---|---|
| Boot | One 1.5–2s sequence, skippable, plays once per session |
| Open window | Scale 0.97→1 + fade, 180ms, ease-out |
| Close window | Reverse of open, 140ms |
| Drag window | 1:1 with cursor, no lag/spring |
| Dock icon hover | Scale 1→1.12, 120ms, label tooltip fades in |
| Assistant idle | Soft opacity pulse on the dock dot only |
| Send message | Bubble enters with a 100ms fade, no slide |

Respect `prefers-reduced-motion`: boot sequence becomes instant text, all
scale transitions become simple opacity crossfades.

---

## 6. Writing

- Window titles are literal and short: `Resume`, `Work`, `Contact` — not
  `My Journey` or `Let's Talk`.
- The boot sequence lines describe real things being loaded, in plain
  present-continuous verbs, no jokes forced into it unless they're true to
  your actual personality (a light, dry touch is fine — a whole bit about
  "hacking Instagram" is fine on eeerik.com's very loud site, but would
  fight this quieter one).
- Contact form: label fields by what they are (`Your email`, `What's
  this about?`), and the button says exactly what happens (`Send`), and
  the confirmation matches (`Sent — I'll reply within a couple of days`).
- Assistant tone: helpful and specific, not cute-for-its-own-sake. It can
  have a little personality (this is your build, your voice) but its job
  in every message is to get the visitor to the right window.

---

## 7. Responsive & Accessibility

- **Mobile:** the desktop metaphor doesn't force-fit onto a small screen.
  Below ~768px, the dock becomes a fixed bottom tab bar (same icon set,
  same order), and "windows" become full-screen sheets that slide up from
  the dock icon rather than floating/draggable panels. The assistant
  becomes a standard bottom-right launcher bubble. Same palette, type, and
  voice — different chrome, not a shrunk version of the desktop.
- Visible keyboard focus ring on every icon, window control, and form
  field, styled with `--coral-text` (or `--lilac-text` inside the
  assistant) — the deepened variants, since the soft pastel tones alone
  don't clear contrast requirements against `--bg`/`--surface` — 2px
  offset outline, never suppressed.
- Windows are keyboard-operable: Tab into a window, Esc to close, arrow
  keys or a "maximize" affordance for anyone who can't drag.
- Contrast: `--ink` on `--bg`/`--surface` checked at AA minimum for body
  text; `--ink-dim` reserved for non-essential metadata only.
- All decorative dots/icons carry `aria-hidden`; real controls (close,
  minimize, send) get proper labels, not just a glyph.

---

## 8. Implementation Notes

- Recommended stack: React + Tailwind for the shell (dock, window
  manager, drag/resize), keeping the design tokens above as CSS variables
  rather than hardcoded Tailwind colors, so the two-accent rule stays
  enforceable across the codebase.
- Window manager can be simple (z-index bump on focus, no need for true
  overlap physics) — the goal is the *feeling* of a desktop, not a full
  window-manager reimplementation.
- Assistant: since you're building your own small LLM, keep the chat
  window's front-end decoupled from the model — a simple `POST` to
  your inference endpoint with the conversation history, streamed back
  token-by-token into the chat bubble for a live-typing feel. Cache
  nothing sensitive client-side; if the model has access to your resume/
  work content for retrieval, keep that indexing server-side.
- Keep the boot sequence's copy in one config object (list of `{label,
  status}` lines) so it's easy to edit without touching layout code.
