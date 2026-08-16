# STRON Design System

A dark, athletic-premium visual system for a gym membership + competitive fitness racing app. Built around one core idea: **flat dark surfaces carry the UI, a single blue gradient carries the brand, and color is never decorative — it always encodes status or meaning.**

---

## 1. Color Tokens

### Base surfaces
| Token | Hex | Use |
|---|---|---|
| `--bg-page` | `#050506` | App canvas / screen background |
| `--surface` | `#141417` | Elevated card default |
| `--surface-2` | `#1c1c20` | Nested inputs, inner chips inside cards |
| `--border` | `#232326` | Card hairline border |
| `--border-2` | `#2a2a30` | Nested input border |
| `--border-strong` | `rgba(255,255,255,0.16)` | Emphasis border on dark |

### Text
| Token | Hex | Use |
|---|---|---|
| `--text-primary` | `#f0f1f3` | Headlines, values, primary labels |
| `--text-secondary` | `#9aa0aa` / `#8b929c` | Supporting copy, field labels |
| `--text-muted` | `#6b7280` / `#5c626c` / `#7a8494` | Captions, timestamps, disabled |

### Brand — Blue (primary actions, hero, links)
| Token | Hex | Use |
|---|---|---|
| `--blue-hero-gradient` | `linear-gradient(160deg, #16214a 0%, #2c4aa8 55%, #3f66d6 100%)` | Hero headers, feature icon fills |
| `--blue-btn-gradient` | `linear-gradient(135deg, #3f66d6 0%, #2c4aa8 100%)` | Primary buttons |
| `--blue-accent` | `#7096f0` | Icons, links, small accents |
| `--blue-tint-bg` | `rgba(63,102,214,0.14–0.18)` | Icon chip backgrounds, selected states |

### Status colors (always dot + tint background, never text alone)
| Meaning | Hex | Tint bg |
|---|---|---|
| Success / Active / Live / Paid | `#4CD964` (also `#4ade80`, `#2fae56` text variant) | `rgba(76,217,100,0.12–0.16)` |
| Warning / Draft / Pending / Fee-cost / About-to-expire | `#ffb454` (also `#ffd84d`) | `rgba(255,180,84,0.10–0.14)` |
| Error / Expired / Destructive / Loss / Overdue | `#ff6b6b` (also `#ff8a7d`) | `rgba(255,107,107,0.08–0.16)` |
| Neutral / Completed / Read | `#9aa0aa` on `rgba(255,255,255,0.06–0.08)` | — |

### Premium tier — Gold (reserved exclusively for STRON PRO)
| Token | Hex | Use |
|---|---|---|
| `--gold-solid` | `#f0b83c` | PRO badge, icons, checkmarks |
| `--gold-gradient` | `linear-gradient(135deg, #f0b83c 0%, #d99a26 100%)` | PRO buttons, badges |
| `--gold-tint-bg` | `rgba(240,184,60,0.08–0.32)` | PRO card backgrounds/borders |
| Text-on-gold | `#1c1200` | Always dark text on gold fills, never white |

**Rule:** gold never appears for anything except PRO/premium — this is what makes it legible as "the upgrade thing" everywhere it shows up.

---

## 2. Typography

| Font | Weight(s) | Role |
|---|---|---|
| **Space Grotesk** | 500 / 700 / 800 | Big numbers, screen titles, hero headlines — anything that should feel like a stat or a statement |
| **Inter** | 400–700 | All body copy, labels, buttons, descriptions — the workhorse |
| **JetBrains Mono** | 400 / 500 | Data-flavored content: prices, dates, timestamps, IDs, ticket codes, eyebrow labels (uppercase + letter-spaced) |

**Pairing logic:** if it's a *value* (₹43,25,234, +50 steps, 04:28/km) → Space Grotesk or JetBrains Mono. If it's *prose* (descriptions, button labels, body text) → Inter. Eyebrow/overline labels are always JetBrains Mono, uppercase, `letter-spacing: 0.08–0.14em`, small (10–11.5px), muted color.

---

## 3. Shape & Elevation

- **Phone frame:** 44px corner radius, 1px `#1a1a1c` border
- **Cards:** 16–22px radius, 1px `#232326` border, no drop shadow needed on flat cards (dark-on-dark)
- **Buttons:** 12–15px radius; pills (chips, status tags, segmented toggles) use full 20px+ radius
- **Icon containers:** 8–16px radius squares/circles depending on size, never mix square-icon + circle-icon styles on the same screen
- **Bottom sheets:** 28px top-corner radius only, drag handle bar (36×4px, `#333338`) centered at top

---

## 4. Core Component Patterns

### Hero header
Blue gradient, rounded bottom corners only (`0 0 32px 32px`), circular outline back button, Space Grotesk title. Used for section entry screens (My Business, Coupons, Tickets).

### Overlap card
A card sits with negative top margin, floating half-on/half-off the hero boundary (e.g. Plan card, stat strip, gym profile card). This is the system's signature layering move — use it any time a summary card should feel "pulled forward" from the hero.

### Status pill
`● dot + label`, pill radius, color-coded per the status table above. Never render status as plain colored text alone — always pair a pill/dot.

### Progress / proportion bar
Track `#232326`, fill colored by meaning, 4–8px height, rounded ends. Prefer a single stacked/segmented bar over raw side-by-side numbers whenever showing "how much of X is in state Y."

### Segmented toggle
Dark pill container, active segment gets solid fill (white or blue), inactive stays transparent text-only.

### Icon chip
Small rounded-square, tinted background at ~14% opacity of the icon's color, icon centered. Reused everywhere: quick actions, perk lists, notification type markers.

### Unified action bar
Multiple related quick-actions live in **one card with internal dividers**, not as separate floating buttons — reduces visual clutter (see: My Business quick actions, Days Validity stats).

### Alert / banner card
Tinted background + matching border color at ~25–30% opacity, icon left, message + optional inline CTA. Severity color follows the status table (red = urgent, amber = needs attention, blue/gold = promotional).

### Fixed bottom nav
Always `position: absolute/fixed` to viewport, never inline in scroll content. Frosted glass (`rgba(20,20,23,0.9)` + `backdrop-filter: blur`), active tab gets tinted pill background + colored icon — every screen must show which tab is active.

### FAB
Circular, gradient fill matching context (blue for neutral add, gold for PRO), soft colored glow shadow beneath.

### Ticket / stub card
Dashed perforation divider with circular cutout notches at both edges, mimicking a real ticket tear line — used for anything ticket/pass-shaped.

### Bottom sheet
Dimmed page background behind, sheet slides from bottom, drag handle, used for permission requests, ratings, quick actions, filters — never for primary navigation.

---

## 5. Iconography

- Line icons only, stroke-based, consistent stroke width (2–2.4px), rounded joins/caps
- No filled icons except small brand glyphs (crown for PRO, star for ratings)
- One icon = one meaning, reused consistently (e.g. calendar always means date/validity, shield/crown always means PRO, pin always means location)

---

## 6. Copy & Interaction Principles

1. **One card, one point.** If a card needs 3 lines to make its case, cut to the single strongest line + one supporting fact. Move detail to a secondary screen (see: PRO upsell banner iterations).
2. **CTA hierarchy is strict:** primary = solid gradient fill; secondary = ghost/outline; tertiary = plain text link. Never two solid-filled buttons competing in the same view.
3. **Destructive actions stay quiet until confirmed** — red-tinted ghost style, not solid red, except in a final confirm step.
4. **Status is never text-only** — always color + icon + (when useful) a dot.
5. **Framing is chosen deliberately, not by default.** Gain-framed copy ("Save ₹X") for low-stakes/recurring nudges; loss-framed copy ("You lost ₹X") for higher-urgency, less-frequent moments — and loss-framing should still use the gold/sell visual treatment, not alert-red, or it reads as an error instead of an offer.
6. **Every list needs a reason, not just an item.** Prefer "Delhi Marathon · 2.1 km away" over "Delhi Marathon" alone.
7. **No dead ends.** Empty states, error states, and paywalls always include a next action, never just a message.
8. **No unexplained UI.** Every avatar, badge, or floating element must have an obvious purpose at a glance — if it needs an unstated assumption to make sense, cut it or label it.

---

## 7. How to Prompt This System

When generating a new screen for this app, specify:
- **Surface type:** hero (gradient) / elevated card (dark) / sheet (modal) / full-bleed (share cards, onboarding)
- **Status/meaning color** if the screen involves state (paid/due, live/draft, active/expired)
- **Whether gold applies** (only if PRO/premium is involved)
- **Which existing pattern it extends** (e.g. "use the overlap-card pattern," "use the alert-banner pattern") rather than designing a new one from scratch — the system is meant to be composed, not reinvented per screen.
