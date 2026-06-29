# EBA Marketing Website — Design System

## Brand Essence
**The Engineering Business Academy** — the operating system for M&E business owners who are world-class on the tools but were never taught the business. Built by someone who ran a £70m engineering firm, went through a pre-pack, and came back. Not theory. Not motivation. Real systems.

**Personality:** Authoritative. Direct. Earned. (Not slick. Not corporate. Not cheerful.)

---

## Chosen Approach: Warm Editorial Authority

### Design Movement
British editorial meets precision engineering — think *Architects' Journal* crossed with a well-made technical manual. Serif headlines, structured grids, deliberate use of white space and rule lines. The visual language of a serious institution, not a course platform.

### Core Principles
1. **Typography does the heavy lifting** — Playfair Display headlines at scale carry the authority; DM Sans body ensures readability
2. **Restraint signals confidence** — no gradients, no stock-photo collages, no confetti animations; space and structure communicate premium
3. **Warm, not cold** — the cream/oat/rust palette keeps it human and approachable despite the editorial rigour
4. **Every section has one job** — no section tries to do two things; one message, one CTA, move on

### Color Philosophy
- **Cream `#EEE9DF`** — primary background; warm, paper-like, not clinical white
- **Navy `#1B2632`** — primary text and dark sections; authority without aggression
- **Rust `#A35139`** — primary accent; earned, warm, distinctive — the brand's ownable colour
- **Oat `#DDD6C8`** — secondary surface; separates sections without harsh contrast
- **Amber `#FFB162`** — used sparingly for highlights and "live" indicators
- **White `#FFFFFF`** — used for cards and tool demo surfaces only

### Layout Paradigm
Asymmetric editorial grid. Sections alternate between left-heavy and right-heavy layouts. No full-width centred hero blocks. Product pages use a two-column structure: content left, visual/demo right. The homepage uses a magazine-style section flow with varying column widths.

### Signature Elements
1. **Rust rule lines** — thin horizontal rules in rust colour as section openers, not decorative
2. **Oversize section labels** — small-caps rust labels ("THE ACADEMY", "AI TOOLS", "THE FOUNDER") above every section heading
3. **Navy callout cards** — dark navy panels for high-emphasis content (pricing, guarantees, the pre-pack story)

### Typography System
- **Display headings:** Playfair Display 800–900, tight tracking (−0.02em), line-height 1.05–1.1
- **Section headings:** Playfair Display 700, tracking −0.015em
- **Body:** DM Sans 400, 17–18px, line-height 1.65
- **Labels/caps:** DM Sans 600, 11–12px, letter-spacing 0.1em, uppercase
- **Prices/numbers:** Playfair Display 700 italic for emphasis

### Interaction Philosophy
Deliberate and calm. Hover states are subtle (opacity shift, not colour explosion). Accordions open with a smooth ease-out. CTAs have a firm scale(0.97) press response. No parallax, no scroll-triggered fireworks. The site should feel like a well-made book, not a SaaS demo.

### Animation
- Reveal on scroll: `opacity 0→1, translateY 20px→0`, 400ms ease-out, threshold 0.1
- Accordion: max-height transition, 250ms ease-out
- Button press: scale(0.97), 160ms
- No entrance animations on above-the-fold content — it should be instant

### Brand Voice
Headlines are declarative statements, not questions or slogans.
- ✅ "The business your engineering deserves."
- ✅ "Built by someone who's actually done it."
- ❌ "Are you ready to take your business to the next level?"
- ❌ "Welcome to the Engineering Business Academy"

CTAs are direct actions, not invitations:
- ✅ "Join the founding cohort →"
- ✅ "See how it works →"
- ❌ "Get started today"
- ❌ "Learn more"

### Wordmark & Logo
Bold square "EB" monogram in rust on navy background. Used in nav header and as favicon. The full name "THE ENGINEERING BUSINESS ACADEMY" in DM Sans 600 small-caps beside it.

### Signature Brand Color
**Rust `#A35139`** — every page has at least one rust element. It is the thread that ties the whole site together.

---

## Style Decisions
- Letter-spacing on Playfair Display headings: −0.02em (not −0.03em — too tight for serif)
- Section label pattern: rust background pill, DM Sans 600 uppercase 11px, 6px 14px padding
- Navy callout cards: `#1B2632` background, cream text, rust accent line at top
- Tool demo cards: white background, subtle shadow, rust border-left accent
- Pricing numbers: Playfair Display italic, rust colour
- All CTAs: rust fill, white text, no border-radius (sharp corners signal precision)
- Ghost CTAs: transparent, navy border 1px, navy text — never rust outline (too weak)
- No shadcn components in custom pages — all UI is bespoke inline styles matching the palette
- Gradient text: never used — emphasis comes from scale, weight, and layout
- Tool demo previews: animated walkthroughs (not live tools) with "Access the tool →" CTA to subdomain
- Stripe: Payment Links only (no backend) — placeholder URL in code for Mark to replace
