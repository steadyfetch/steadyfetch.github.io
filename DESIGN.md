---
name: steadyfetch.com
description: The comparative plate — every actor in a family as a specimen at one shared scale, priced on one locked column grid, printed on herbarium stock by day and on the mark's own near-black by night.
colors:
  plate: "#e7eae3"
  sheet: "#f4f6f1"
  band: "#dde2d8"
  row-hi: "#e3e8dd"
  ink: "#0c120e"
  ink-2: "#47554c"
  ink-3: "#8a9790"
  rule: "#c6cec1"
  rule-2: "#a9b4a4"
  mark: "#0a6b2d"
  mark-2: "#17a04a"
  us: "#dcecdf"
  us-rule: "#a8ccae"
  track: "#cdd6c8"
  track-us: "#bcd4c0"
  plate-dark: "#050911"
  sheet-dark: "#0a1019"
  band-dark: "#101825"
  row-hi-dark: "#121c29"
  ink-dark: "#e4ebe5"
  ink-2-dark: "#94a39c"
  ink-3-dark: "#5c6b70"
  rule-dark: "#1c2531"
  rule-2-dark: "#2c3947"
  mark-dark: "#26dc62"
  mark-2-dark: "#26dc62"
  us-dark: "#0a1c14"
  us-rule-dark: "#1c5236"
  track-dark: "#1b2530"
  track-us-dark: "#123424"
typography:
  display:
    fontFamily: "Archivo, 'Archivo Cond Fallback', Arial, sans-serif"
    fontSize: "clamp(2.15rem, 5.1vw, 3.85rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 66"
  headline:
    fontFamily: "Archivo, 'Archivo Cond2 Fallback', Arial, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.3rem)"
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 76"
  title:
    fontFamily: "Archivo, 'Archivo Fallback', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "1.24rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.006em"
    fontVariation: "'wdth' 84"
  title-plate:
    fontFamily: "Archivo, 'Archivo Fallback', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 650
    letterSpacing: "0.085em"
    fontVariation: "'wdth' 88"
  lead:
    fontFamily: "Archivo, 'Archivo Fallback', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "1.145rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Archivo, 'Archivo Fallback', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, 'Archivo Fallback', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "0.705rem"
    fontWeight: 600
    letterSpacing: "0.1em"
    fontVariation: "'wdth' 88"
  figure:
    fontFamily: "'Azeret Mono', 'Azeret Fallback', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "1.52rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.035em"
    fontFeature: "tabular-nums"
  figure-cell:
    fontFamily: "'Azeret Mono', 'Azeret Fallback', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.845rem"
    fontWeight: 400
    letterSpacing: "-0.025em"
    fontFeature: "tabular-nums"
  binomial:
    fontFamily: "'Azeret Mono', 'Azeret Fallback', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.775rem"
    fontWeight: 400
    lineHeight: 1.4
  stamp:
    fontFamily: "'Azeret Mono', 'Azeret Fallback', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.705rem"
    fontWeight: 400
    letterSpacing: "0.045em"
rounded:
  bar: "0"
  hairline: "2px"
  control: "3px"
  chip: "5px"
spacing:
  cell: "12px"
  cell-narrow: "9px"
  gutter: "24px"
  gutter-narrow: "18px"
  block: "40px"
  section: "68px"
  section-narrow: "52px"
components:
  link-action:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    padding: "0 0 2px"
  link-action-hover:
    textColor: "{colors.mark}"
  theme-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    size: "32px"
  theme-toggle-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.plate}"
  skip-link:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.plate}"
    rounded: "{rounded.hairline}"
    padding: "10px 16px"
  plate-frame:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.hairline}"
  plate-header-cell:
    backgroundColor: "{colors.band}"
    textColor: "{colors.ink-2}"
    padding: "9px 12px"
  plate-cell:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    padding: "11px 12px"
  plate-row-us:
    backgroundColor: "{colors.us}"
  plate-row-hover:
    backgroundColor: "{colors.row-hi}"
  gauge:
    backgroundColor: "{colors.track}"
    width: "118px"
    height: "6px"
    rounded: "{rounded.bar}"
  gauge-fill:
    backgroundColor: "{colors.ink-3}"
  gauge-us:
    backgroundColor: "{colors.track-us}"
  gauge-fill-us:
    backgroundColor: "{colors.mark-2}"
  proof-panel:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.hairline}"
    padding: "28px"
  code-inline:
    backgroundColor: "{colors.band}"
    textColor: "{colors.ink}"
    rounded: "{rounded.hairline}"
    padding: "1px 5px"
---

# Design System: steadyfetch.com

## Overview

**Creative North Star: "The Comparative Plate"**

A field-guide plate, not a vendor comparison page. Every actor in a family is laid out as a specimen at one shared scale: its binomial (`account/slug`) in the identity column, its diagnostic under the name, its price drawn as a bar on a visible track against the dearest row on that plate, and the bar is drawn for our own rows too, even where ours is the longest. The plate ground runs edge to edge: herbarium stock in light, the brand's own near-black in dark. One ink, one accent hue, hairline rules, and ledger rows instead of cards; the only framed objects on a page are the plates themselves (the comparison tables, and the proof panel that opens the hub, which the stylesheet names "the plate that opens the site").

Hierarchy comes from scale, from Archivo's width axis and from rule weight, never from colour blocks or shadows. Titles are condensed Archivo; every measured figure and every actor binomial is Azeret Mono set at focal size with tabular numerals. Density is high and even: 11px cell padding, 24px ledger rows, 68px between sections. The page is quiet enough that the one moving thing, the lead pulse rule wiping in under the header, reads as the brand's signature rather than as decoration.

The site is generated by `build.mjs` and styled by one stylesheet; the "components" are its render functions (`head`, `stampBand`, `foot`, `ourCard`, `compTable`, `vendorRows`, `proofBlock`, `familyPage`, `indexPage`) and the class contracts they emit. Rendering may be restructured; the verified content above the `// ---------- RENDER ----------` line may not.

**Key Characteristics:**
- Plate ground edge to edge; framed objects are plates only
- One ink, one accent hue (two lightness registers in light, one pigment in dark)
- Ledger rows on hairline rules, never cards or boxes
- Condensed Archivo for titles; Azeret Mono for every figure and binomial
- A locked four-column numeric grid identical on every plate on every page
- Gauges on visible tracks, scaled per column, drawn for our rows too
- Zero layout shift: metric-matched fallbacks for both webfonts
- Three-scope theme token contract; every colour is a token in all three

## Colors

One ink and one green on a cool grey-green ground, with every value a custom property that exists in three scopes.

### Primary
- **Steadyfetch Green, text register** (`--mark`): links, the slug in our own rows, hover colour on every link and row title, focus rings, the `::selection` ground, and the pulse rule's stroke. Dark enough to carry text on herbarium stock.
- **Steadyfetch Green, fill register** (`--mark-2`): fills only: the gauge fill and proof rail fill on our rows, the scale-note swatch, the ticks before key paragraphs and "ways" items, the promise headings. Brighter than the text register because a 6px bar needs luminance, not text contrast.
- In dark, both registers are the mark's own pigment (`--mark-dark`, `--mark-2-dark`): the same green that strokes the Apify profile picture.

### Neutral
- **Plate** (`--plate`): the page ground, body background, header and footer. Herbarium stock in light; the brand's near-black in dark. It runs edge to edge and is never boxed.
- **Sheet** (`--sheet`): the surface inside a frame: table cells and the proof panel. A half-step lighter than the plate in both themes, so a framed object reads as a sheet laid on the plate.
- **Band** (`--band`): the table header row and inline `code`: the third step of the ground, below the plate in light and above the sheet in dark.
- **Row highlight** (`--row-hi`): the hovered or focused row's cell ground.
- **Ink** (`--ink`): all primary text, the slug half of a binomial, every figure.
- **Ink 2** (`--ink-2`): secondary text: the account half of a binomial, diagnostics, labels, the stamp, nav, table headers, footer, and the colour every unhovered row fades to while another row is hovered.
- **Ink 3** (`--ink-3`): the gauge and rail fill on competitor rows. Text never uses it.
- **Rule** (`--rule`): every hairline: section tops, ledger row bottoms, cell bottoms, the plate frame, the stamp's top and dividers.
- **Rule 2** (`--rule-2`): the firmer hairline: under the table header, over the meter, under uppercase action links, the theme toggle's border, list ticks, the faint footer pulse, the scrollbar thumb.
- **Us** (`--us`) and **Us rule** (`--us-rule`): our own rows' cell tint and the identity column's right edge on those rows; also the underline under row titles and the left rule on the billing-law line.
- **Track** (`--track`) and **Track, us** (`--track-us`): the gauge and rail ground. Two tokens so the empty part of the track stays visible on a tinted `us` row.

### Named Rules
**The Three-Scope Rule.** Light is the bare `:root`. Dark is `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` for the system preference and `:root[data-theme="dark"]` for the toggle. Every colour token is declared in all three blocks with identical dark values; no colour exists only inside a media block, and no rule below the token blocks names a hex. `color-scheme` is set in each scope.

**The Two-Register Accent Rule.** The single accent hue has a text register (`--mark`) and a fill register (`--mark-2`). Text, links, focus and strokes use the text register; bars, swatches and ticks use the fill register. Never put the fill register on text.

**The Mark Keeps Its Pigments Rule.** The lockup chip and footer chip are the one theme-invariant object: a `#050911` square with the pulse stroked in `#26DC62`, in both themes, because they reproduce the pre-existing Apify mark exactly. Nothing else may hard-code a colour.

**The Visible Track Rule.** A bar is always a fill on a visible track. On our own rows the track is `--track-us`, chosen so the unfilled remainder still reads against the `--us` tint.

## Typography

**Display Font:** Archivo variable, width axis 62–125, weight 400–700, self-hosted as a subsetted woff2 at `/brand/fonts/archivo-var.woff2` (with `Archivo Cond Fallback` at 70.5% for the h1 stack and `Archivo Cond2 Fallback` at 77.7% for h2, metric-matched on Liberation Sans Bold / Arial Bold)
**Body Font:** Archivo, the same self-hosted file (with `Archivo Fallback` at 98.7%, metric-matched on Arial / Liberation Sans). Nav and small caps labels take `--ui`, backed by `Archivo Nav Fallback` at 86.3% — they are set at `font-stretch: 86%`, which no fallback can condense, and they were what visibly wrapped without it.
**Label/Mono Font:** Azeret Mono 400–600, self-hosted at `/brand/fonts/azeret-var.woff2` (with `Azeret Fallback` at 108%, metric-matched on DejaVu Sans Mono)

**Character:** A grotesk that gets narrower as it gets larger, paired with a wide, slightly technical mono that carries every number. The plate title is compressed and tight; the figures are mono, tabular and tracked negative at focal size; the labels are small uppercase Archivo with open tracking.

### Hierarchy
- **Display** (700, `wdth` 66, `clamp(2.15rem, 5.1vw, 3.85rem)`, 1.02): the page `h1`, `text-wrap: balance`, `max-width: 27rem` in rem, never ch. One per page.
- **Headline** (650, `wdth` 76, `clamp(1.5rem, 3vw, 2.3rem)`, 1.1): section `h2`, `max-width: 36rem`; also the family name in a hub ledger row.
- **Title** (650, `wdth` 84, 1.24rem, 1.2): the actor name in a ledger row.
- **Plate title** (650, `wdth` 88, .875rem, uppercase, .085em, `--ink`): the plate's `h3` and the "Outside Apify" divider.
- **Lead** (400, 1.145rem, 1.55, 66ch): the first intro paragraph; 1.06rem below 760px.
- **Body** (400, 1rem, 1.6, 70ch): paragraphs; row prose at .965rem/1.55/62ch; the billing-law line at .82rem.
- **Label** (600, `wdth` 88, .705rem, .1em, uppercase, `--ink-2`): unit labels under figures, plate counts, "ways" headings. Nav links (.715rem, `wdth` 86, .06em), crumbs (.75rem, .085em), action links (.715rem, `wdth` 90, .075em) and table headers (.655rem, .09em) are the same voice at neighbouring sizes.
- **Figure, focal** (Azeret 600, 1.52rem, 1.15, -.035em, tabular): the meter's two prices on a ledger row; 1.85rem/-.045em in the proof; 1.34rem below 760px.
- **Figure, cell** (Azeret 400, .845rem, -.025em, tabular, right-aligned, nowrap): every numeric table cell; fees at .775rem; the cell note at .68rem with tracking reset to 0.
- **Binomial** (Azeret, .775rem, 1.4): `account/slug` with the account and slash in `--ink-2` and the slug in `--ink` at 600. The slug is the differentiator, so it is the loud half; a `<wbr>` follows the slash.
- **Stamp** (Azeret 400, .705rem, uppercase, .045em, `--ink-2`): the collection stamp; the scale note and unit lines are the same voice without the uppercase.

### Named Rules
**The Width Axis Rule.** Hierarchy climbs by condensing, not by colouring: display at `wdth` 66, headline 76, row titles 84, labels 86–92, body at 100. Weight moves the same way (700, 650, 600, 400). `font-synthesis-weight: none` so a fallback never fakes a weight.

**The Figure Face Rule.** Every measured figure and every actor binomial is Azeret Mono with `font-variant-numeric: tabular-nums`; prose is never mono, and no figure is ever set in Archivo.

**The Metric Fallback Rule.** Both faces are self-hosted, subsetted variable woff2 under `/brand/fonts/` (SIL OFL), preloaded with `crossorigin` and served same-origin, so the page makes no external subresource request at all and Archivo is present at first paint on a cold load. Both use `font-display: swap`, never `optional` — `optional` was tried and reverted, because it left a cold search visitor in the fallback face for the entire visit. Five `@font-face` fallbacks carry `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override: 0%`, every ratio measured from the shipped variable fonts against faces that actually exist (Liberation Sans, Arial, Roboto, DejaVu Sans Mono) — never Arial Narrow, which is absent on Linux and Android. Each override is the font's own metric divided by that fallback's `size-adjust`, so the adjust changes advance width without moving the line box. Measured CLS is 0.0000 with zero shift entries, on the hub and on ad-transcripts, at 1440×900 and 390×844. Headings take `max-width` in `rem`, never `ch`: `ch` is font-dependent and resized the box on swap.

**The Aligned Decimal Rule.** Per-1,000 prices render with `minimumFractionDigits: 2`; per-run fees keep every published digit and are padded with U+2007 figure spaces to the longest fraction on that plate, so decimal points align down every column. Missing values are an em dash or the word `none` in `--ink-2`, never blank.

## Layout

A single 1160px measure (`--page`) with 24px side gutters, centred; header, main and footer share it. Main runs 40px top and 72px bottom. Sections sit 68px apart, each opened by a pulse rule with 26px below it; the first section on the hub sits 40px down. Prose measures: 70ch body, 66ch lead, 62ch row prose, 76–78ch lists and key.

**Ledger rows** (`.act`, `.fam`) are a two-column grid, `minmax(0, 1fr) 264px`, gap `10px 36px`, `grid-template-areas: "name meter" "main meter"`, padded 24px top and bottom on a `--rule` hairline. DOM order is name, then meter, then main, so the order a screen reader hears is the order the narrow layout shows. The meter is a two-up grid (one-up on the hub) with an 18px column gap, a `--rule-2` top and 12px above the figures.

**Plates** are a `<section class="plate">` with a head row (title left, count right, baseline-aligned), a `.plate-scroll` region (`overflow-x: auto`, `tabindex="0"`, `aria-labelledby`, `overscroll-behavior-x: contain`) and a scale note. Inside: `table-layout: fixed`, `border-collapse: separate`, a `<colgroup>` on every table.

**Breakpoints** (all max-width): 900px stacks ledger rows to `"name" "meter" "main"`, drops the meter's top rule and caps it at 420px; 860px wraps the header, turns nav into a one-line horizontal scroll strip (hidden scrollbar, 88% fade mask on the right) and pushes the theme toggle to the right edge; 760px is the phone plate (gutters to 18px, sections to 52px, type steps down, plates go full-bleed); 480px retunes column widths for a 390px screen. `(hover: hover)` gates the row-dimming behaviour; `(prefers-reduced-motion: reduce)` kills all motion.

### Named Rules
**The Locked Grid Rule.** Every plate emits `<colgroup><col class="c-id"><col class="c-n"><col class="c-n"><col class="c-fee"><col class="c-u"></colgroup>` (plus `col.c-tx` after the identity column on the two transcript families, whose scroll region is flagged `has-tx`) with `table-layout: fixed`. The numeric columns are 146 / 146 / 104 / 96px (transcripts 104px) at desktop, 112 / 112 / 88 / 72 (68) below 760px, 94 / 94 / 78 / 64 (52) below 480px: identical on every plate on every page. Only `col.c-id { width: auto }` flexes. The table's `min-width` floor must equal the identity column's intended width plus the fixed columns: 726px = 234 + 492 (830 with transcripts); 624 / 628 at 760px; 462 / 514 at 480px. A floor below that sum collapses the identity column.

**The Full-Bleed Plate Rule.** Below 760px the scroll region takes `margin: 0 -18px`, drops its left and right borders and its radius, and runs to the screen edge: gutters would cost the reader a whole column.

**The 390 Rule.** Below 480px the identity column plus the two price columns must be readable before the first horizontal swipe: 132 + 52 + 94 + 94 = 372px, which clears a 15px classic scrollbar on a 390px screen. Any retune of the narrow widths redoes this sum.

**The Name-First Rule.** Ledger rows keep DOM order name, measurement, detail and place them with `grid-template-areas`; never reorder with `order` or by moving markup.

## Elevation & Depth

The system is flat. Depth is tonal and ruled: plate, sheet and band are three half-steps of one ground, and every edge is a 1px hairline in `--rule` or `--rule-2`. There is exactly one drop shadow, `--sticky-shadow`, a right-edge scrim under the sticky identity column that only becomes visible once a plate scrolls horizontally and the numeric columns slide beneath it. Row hover and focus-within use `box-shadow` as two inset accent hairlines, not as depth; on the sticky identity cell the scrim and the hairlines are composed in one declaration so neither is lost.

### Shadow Vocabulary
- **Sticky scrim** (`box-shadow: 10px 0 10px -10px rgba(12, 18, 14, .28)` in light; `10px 0 10px -10px rgba(0, 0, 0, .55)` in dark): the sticky identity column's right edge inside a scrolling plate. Nowhere else.
- **Row accent hairlines** (`box-shadow: inset 0 1px 0 var(--mark), inset 0 -1px 0 var(--mark)`): the hovered or keyboard-focused table row.

### Named Rules
**The Hairline Rule.** Structure is drawn with 1px rules, never with shadows, borders thicker than 1px, or filled panels. A new surface that needs separation gets a hairline or a half-step of ground, in that order.

**The One Row at a Time Rule.** With a pointer present, hovering any row keeps that row in full ink between two accent hairlines on `--row-hi` while every other row's text and gauge fill drop to `--ink-2` and `--track`. Our rows keep their `--us` tint under hover. Focus-within gives keyboard users the same highlight without dimming the rest.

## Shapes

Square by default. Measurement bars, rails, swatches and list ticks have no radius. Frames (the plate scroll region, the proof panel, inline code, the skip link, link focus rings) take a 2px hairline radius that reads as a softened corner rather than a rounded one; controls (the theme toggle, the lockup's focus ring) take 3px; the mark's chip is 5px at 30px in the header and 4px at 24px in the footer, and the shipped icon is `rx 80` on a 512 square. The pulse geometry is the one recurring silhouette: one clean step up and back down, `M64 306H200V177H311V306H447` on a 512 square; stretched into a rule it becomes `M0 11H196V4H286V11H1200` on a 1200×14 box, stroked at `--step` (1.5px) with `vector-effect: non-scaling-stroke`. Borders are 1px everywhere; the only 2px strokes are focus outlines and the hovered body-link underline.

## Components

### Header and Navigation
- **Style:** the plate ground with no bottom border; the pulse rule beneath it is the header's edge. The lockup is the 30px chip plus the wordmark at 1.14rem, 600, `wdth` 92; the wordmark goes `--mark` on hover.
- **Nav links:** label voice (.715rem, 600, `wdth` 86, .06em, uppercase, `--ink-2`) with a transparent 1px bottom border that becomes `--mark` on hover and on `aria-current="page"`, when the text also goes `--ink`. Nav pushes right with `margin-left: auto`.
- **Mobile:** below 860px the nav drops to its own line as a horizontal scroll strip with a hidden scrollbar and an 88% fade mask on the right; items are `white-space: nowrap`.
- **Skip link:** `--ink` on `--plate`, 10px 16px, 2px radius, parked at `top: -60px` and revealed at 12px on `:focus-visible`.

### Theme Toggle
- **Shape:** a 32px square, 1px `--rule-2` border, 3px radius, transparent, holding a 16px inline SVG (a rounded square half-filled with `currentColor`).
- **Hover:** inverts to `--ink` ground, `--plate` icon, `--ink` border. Focus: `2px solid var(--mark)`, offset 2px.
- **Behaviour:** writes `data-theme` on `<html>` and `sf-theme` in localStorage; an inline `<head>` script restores it before first paint; the `aria-label` reads "Switch to the light plate" or "Switch to the dark plate".

### The Pulse Rule (signature)
A full-width 14px SVG (`viewBox 0 0 1200 14`, `preserveAspectRatio="none"`) stroked in `currentColor` at `--step`. `.pulse` alone is `--mark` and opens every section; `.pulse--lead` under the header is revealed once with a `clip-path: inset(0 100% 0 0)` to `inset(0)` wipe (.9s, `--ease`, .05s delay, `forwards`), only under `prefers-reduced-motion: no-preference`; `.pulse--faint` in `--rule-2` opens the footer. The reveal is a clip-path wipe, never a stroke-dash animation: under `non-scaling-stroke` a dash is measured in screen pixels and stops short of the viewport edge.

### The Collection Stamp
`<p class="stamp">` of `<span>`s: what was read, from where, when, how many. Azeret .705rem uppercase in `--ink-2`, a `--rule` hairline above with 11px padding, and `--rule` dividers between spans (18px each side; 10px below 760px). It sits between the `h1` and the lead on every page.

### Ledger Row and Meter
- **Row:** `.act` (an actor; `.act.vendor` for an off-Apify vendor) or `.fam` (a family on the hub). Title with a `--us-rule` underline that turns `--mark` on hover; prose; a `.law` line in `--ink-2` behind a 1px `--us-rule` left rule; a `.links` row of action links.
- **Meter:** the right column, 264px. Two focal figures in Azeret 1.52rem/600 with a label beneath each, then a `.unitline` in Azeret .755rem naming the unit and any surcharge (`.ext` on its own line). A `--rule-2` top rule marks it as the instrument; vendors, who publish no comparable figure, get a `--rule` top and a "Price as published" unit line instead. On the hub the meter holds a count, a full-width gauge and a breakdown line.

### The Plate (signature)
- **Frame:** `.plate-scroll`: 1px `--rule` border, 2px radius, `--sheet` ground, horizontal overflow, keyboard-focusable with a `--mark` focus ring.
- **Header row:** `--band` ground, `--ink-2`, .655rem uppercase label voice, 9px 12px, `--rule-2` bottom; numeric headers right-aligned; the first header cell sticky at `z-index: 4`.
- **Cells:** `--sheet` ground, 11px 12px, `--rule` bottom, `vertical-align: top`; the last row loses its bottom rule so the frame closes the plate.
- **Identity column:** `th[scope="row"]`, sticky left at `z-index: 2`, weight 400, `--rule` right edge, `--sticky-shadow`. Holds the binomial link (`.bi`) and the diagnostic (`.diag`, .82rem, `--ink-2`, 5px below).
- **Numeric cells:** `.num`, right-aligned mono; the value in `.v`, an optional `.note` beneath ("per batch of 1,000" or "per page/item"), then the gauge. `.tx` (transcripts) is a plain .84rem text cell that exists only on the two `has-tx` families.
- **Our rows:** `tr.us`: `--us` cells, `--us-rule` right edge on the identity cell, slug in `--mark`, gauge on `--track-us` filled with `--mark-2`.
- **States:** row hover and focus-within per the One Row at a Time Rule; the binomial slug goes `--mark` and underlines on hover; every link carries a `--mark` focus ring.
- **Scale note:** under every plate, a 15×4px `--mark-2` swatch then "Bars are drawn per column against the dearest row on this plate", with the batch/page clause appended when the plate has an unpriced row.

### The Gauge (signature)
`<span class="gauge"><span style="--w:NN.N%"></span></span>`: a 118×6px track (94×5 below 760px, 70px wide below 480px) in `--track`, right-aligned under the figure with `margin: 7px 0 0 auto`, and a fill of `width: var(--w)` in `--ink-3` (`--mark-2` on our rows) with `min-width: 1px` so a tiny price still registers. `--w` is computed per column as value divided by the dearest row on that plate, to one decimal. Both price columns get a gauge, our own rows included. Rows priced per batch or per page get no gauge and no `--w`, because the unit is not the same; the fee and users columns never get one. The hub's family rows reuse the gauge full-width for actor count against the widest plate.

### The Proof
`.proof` is the plate that opens the hub: `--sheet`, 1px `--rule`, 2px radius, 28px padding (18px on a phone). Two `.spec` specimens each carry a binomial (`.who`, Azeret .8rem), a 14px `.rail` on `--track` with a `.fill` at `var(--w)` (`min-width: 2px`), and the amount in Azeret 1.85rem/600/-.045em right-aligned; `.spec.mine` swaps to `--track-us`, a `--mark-2` fill and a `--mark` amount. The competitor's specimen is drawn first. Two `.verdict` paragraphs and an action link close it.

### Action Links
The site has no filled buttons. The call to action is an uppercase hairline-underlined text link: .715rem, 600, `wdth` 90, .075em, `--ink-2` with a 1px `--rule-2` bottom border and 2px padding below; hover turns text and border `--mark`. The proof's `.more a` is the emphatic variant (`--ink` text, `--mark` border at rest). Body links are `--mark`, 1px underline at .18em offset, thickening to 2px on hover.

### Key, Lists, Promise
- **Key** (`.key p`): 78ch, 16px block padding, a `--rule` top between paragraphs (none on the first), 22px left inset with a 10×1px `--mark-2` tick at the top of each paragraph.
- **List** (`.list li`): no bullets; a 10×1px `--rule-2` tick at .72em; 12px between items. The `.ways` variant: 18px between items, a `--mark-2` tick, and a label-voice `<b>` heading on its own line.
- **Promise** (`.promise li`): hairline-separated items with a label-voice `<b>` in `--mark`.

### Inline Code
`code`: Azeret at .84em, `--band` ground, `--ink`, 1px 5px, 2px radius, `word-break: break-word`.

### Footer
The plate ground with a `--rule` top and the faint pulse; a 24px chip plus wordmark, then .795rem `--ink-2` paragraphs at 92ch (links in `--ink-2`, `--mark` on hover).

## Do's and Don'ts

### Do:
- **Do** declare every new colour in all three theme scopes (bare `:root`, the guarded dark media block, `:root[data-theme="dark"]`) and reference it only as `var(--token)` below the token blocks.
- **Do** set every measured figure and every actor binomial in `var(--mono)` with `font-variant-numeric: tabular-nums`, prices with two decimals and fees padded with U+2007 to the plate's longest fraction.
- **Do** emit a `<colgroup>` with `col.c-id` plus the fixed numeric columns on every plate, keep `table-layout: fixed`, and set the table `min-width` to the identity width plus the sum of the fixed columns at every breakpoint.
- **Do** draw a gauge on both price columns for every row with a per-1,000 price, our own rows included, scaled to the dearest row on that plate; put it on `--track-us` when the row is ours.
- **Do** keep ledger rows in DOM order name, meter, main and place them with `grid-template-areas`.
- **Do** give every interactive element a `2px solid var(--mark)` focus ring with an offset, and every row a focus-within treatment equal to hover.
- **Do** size heading `max-width` in `rem` and prose in `ch`; keep any new `@font-face` fallback metric-matched with `size-adjust` and ascent/descent overrides measured from the shipped font.
- **Do** run the plate full-bleed below 760px and re-check the 390px sum whenever a narrow column width changes.
- **Do** regenerate every raster with `brand/render.py`, which reads its counts and date out of `build.mjs`, and keep the mark's geometry as measured (`M64 306H200V177H311V306H447`).

### Don't:
- **Don't** card anything: no boxed actor cards, no filled panels, no borders thicker than 1px. Frames belong to plates (the comparison tables and the proof) only.
- **Don't** add a shadow. The sticky scrim is the only one, and hover depth is two inset hairlines, not a lift.
- **Don't** ship a tick-and-cross "us vs them" table, hide a competitor's bar, or cap our own bar short of its true length.
- **Don't** draw a gauge on a row priced per batch or per page, or on the fee or users columns; a bar means one shared unit.
- **Don't** hard-code a colour anywhere except the mark's chip (`#050911` ground, `#26DC62` stroke).
- **Don't** put the fill-register green (`--mark-2`) on text, or `--ink-3` on text; both are bar pigments.
- **Don't** reveal the pulse with a stroke-dash animation; under `non-scaling-stroke` it stops short of the edge. Use the clip-path wipe, and only under `prefers-reduced-motion: no-preference`.
- **Don't** use a `ch` unit on a heading's `max-width`, load either face with `display: optional`, move the fonts back to a third-party host, or name a fallback face (`Arial Narrow`) that is not installed on Linux or Android — each of those was a real, shipped bug.
- **Don't** collapse the plate to stacked cards on a phone; it stays a table with a sticky identity column inside its own scroll region.
- **Don't** change a word or a number in the content data above the render line; the render layer restructures, it never rewrites.
