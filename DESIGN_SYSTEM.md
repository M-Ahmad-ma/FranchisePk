# FranchiseHub Design System

Source of truth for the visual language of the app (investor + brand experiences).
Everything below is extracted from the running codebase — `tailwind.config.js`,
`src/shared/**`, and the feature screens — so a second build can match it exactly.

**Stack:** React Native 0.86 · NativeWind 4 (Tailwind presets) · Lato (bundled `.ttf`) · `lucide-react-native` icons · React Navigation 7.

---

## 1. Color system

All brand colors are defined once in `tailwind.config.js` under `theme.extend.colors`.
Each scale runs `100 → 900` plus `dark`, `dark-2`, `bold`.

### Primary — blue (brand, trust, CTAs)

| Token | Hex | Use |
|---|---|---|
| `primary-100` | `#FFFFFF` | Auth surface, inverted text on dark |
| `primary-200` | `#EBF1FF` | Skeleton fill, active drawer row, soft tint |
| `primary-300` | `#D4E3FF` | Hover/disabled tint, hairlines |
| `primary-400` | `#A4C9FF` | Progress, quiet accents |
| `primary-500` | `#87ADE4` | Secondary strokes |
| `primary-600` | `#6C93C8` | Quiet icons |
| **`primary-700`** | **`#5279AC`** | **Primary button, section titles, links, loader color** |
| `primary-800` | `#386092` | Brand tab bar active tint |
| `primary-900` | `#1C4878` | Header bar, fact-row icons, deep accents |
| `primary-dark` | `#00315D` | `inverted` button variant |
| `primary-dark-2` | `#001C39` | Darkest panels |
| `primary-bold` | `#000000` | Reserved |

### Secondary — orange (energy, promo)

`100 #FFFFFF` · `200 #FFEDE4` · `300 #FFDCC7` · `400 #FFB787` · `500 #FD8E3A` · `600 #DC7521` · **`700 #BC5D00` (secondary button)** · `800 #964900` · `900 #723600` · `dark #512400` · `dark-2 #311300`

> `secondary-200 #FFEDE4` is reused as the brand tab bar's `borderTopColor`.

### Tertiary — cyan (data, charts)

`100 #FFFFFF` · `200 #E1F4FF` · `300 #BFE9FF` · `400 #6CD2FF` · `500 #42B7E5` · `600 #0F9CC9` · **`700 #0081A7`** · `800 #006685` · `900 #004D65` · `dark #003824` · `dark-2 #002113`

### Neutral — slate-blue greys (text, borders, surfaces)

| Token | Hex | Use |
|---|---|---|
| `neutral-100` | `#FFFFFF` | Cards, inputs, sheets |
| `neutral-200` | `#EEF0FF` | **Default border / divider** (slightly blue, not grey) |
| `neutral-300` | `#DAE2FD` | Disabled button fill, dashed slots |
| `neutral-400` | `#BEC6E0` | Placeholder-ish strokes |
| `neutral-500` | `#A3ABC4` | Placeholder text, inactive icons |
| `neutral-600` | `#8990A8` | Inactive tab/drawer tint, chevrons |
| `neutral-700` | `#6F778E` | Labels, body-secondary |
| `neutral-800` | `#565E74` | Strong secondary text |
| `neutral-900` | `#3F465C` | **Primary text, back-arrow icon** |
| `neutral-dark` | `#283044` | Dark panels |
| `neutral-dark-2` | `#131B2E` | Darkest surface |

### Surfaces & backgrounds

| Token | Hex | Use |
|---|---|---|
| `light` | `#FAF8FF` | **App screen background** (`MainLayout`), StatusBar bg on auth |
| `primary-100` | `#FFFFFF` | Auth screen background (`AuthLayout`) |

### Semantic / utility (hardcoded — not in the Tailwind scale)

| Hex | Role | Where |
|---|---|---|
| `#00A572` | Success / verified | `CheckCircle2`, "Verified" badge, success copy |
| `#E0409A` | Accent pink | Investor profile help row |
| `#BEFFDB` | Success tint bg | Investor stat tiles |
| `#FFE4F0` | Pink tint bg | Investor stat tiles |
| `#436CF5` | App splash/loader blue | `AppNavigator` initial loader, accordions |
| `#001551` | Image scrim (commented out) | Property hero overlay |
| `text-red-500` | Error | Form + API error copy |
| `text-amber-500` | Star rating / highlight | Cards, testimonials |

---

## 2. Typography

**Family:** Lato — 10 faces bundled (`assets/fonts/`, Android `assets/fonts/`, iOS `UIAppFonts`).
Registered postscript names are used directly, so no runtime font loader is needed.

| Utility class | Font file | Weight feel |
|---|---|---|
| `font-lato-thin` | Lato-Thin | 100 |
| `font-lato-light` | Lato-Light | 300 |
| **`font-lato`** | **Lato-Regular** | **400 — body default** |
| **`font-lato-bold`** | **Lato-Bold** | **700 — labels, buttons, most UI** |
| **`font-lato-black`** | **Lato-Black** | **900 — display headings only** |
| `font-lato-italic` … `font-lato-black-italic` | matching italic faces | accents |

> Italic variants exist (`font-lato-light-italic`, `font-lato-bold-italic`, `font-lato-thin-italic`, `font-lato-black-italic`) but are rarely used.

### Type scale in use

| Style | Classes | Where |
|---|---|---|
| Micro label | `font-lato-bold text-[11px] tracking-[1px] uppercase` | Overlines, "already have an account" |
| Eyebrow / section | `font-lato-bold text-sm tracking-[2px] uppercase text-primary-700` | Form section titles |
| Caption | `font-lato text-xs` | Form labels, meta |
| Small body | `font-lato text-sm` | Chips, badges, error text |
| **Body** | **`font-lato text-base leading-6`** | Default copy |
| Body strong | `font-lato-bold text-base` | Buttons, key values |
| Card title | `font-lato-bold text-lg` / `text-[15px]` | Cards |
| Screen title | `font-lato-black text-2xl` | "Add Brand", page headings |
| Display | `font-lato-black text-[34px] leading-[40px]` | Auth/onboarding headlines |
| Display XL | `font-lato-black text-[30px] leading-[44px]` | Rare hero numbers |
| Numeric input | `text-[22px] leading-[26px] font-lato-bold` | OTP / code entry |

**Tracking values:** `tracking-[1px]` micro, `tracking-[2px]` section eyebrow, `tracking-[3px]` rare, `tracking-widest` for emphasis links.

**Rules**
- Never bold body copy with `font-lato-bold` inside paragraphs — switch the whole block or use `font-lato-black` for headings only.
- Uppercase is always paired with tracking (`uppercase` + `tracking-[1px]`/`[2px]`).
- Error text is always `text-red-500 text-sm font-lato`.

---

## 3. Spacing, layout & grid

- **Screen gutter:** `px-4` (default), `px-6` for focused/auth content. Horizontal lists use `mx-4`.
- **Vertical rhythm:** `mb-1.5` label→field, `mb-4` between fields, `mb-6`/`mb-8` between blocks, `mt-6`/`mt-8` before a new section.
- **Top padding:** `pt-4` (header row), `pt-6` (first section), `px-4 pt-6` for form bodies.
- **Gaps:** `gap-1.5` inline icons, `gap-2` chip/button internals, `gap-3` header rows, `gap-4` grids.
- **Rows:** `flex-row items-center justify-between` is the canonical row; `flex-1` for trailing content.
- **Scroll:** every long screen is `ScrollView` inside a `KeyboardAvoidingView` (`behavior` = `padding` on iOS) with `contentContainerStyle={{ paddingBottom: 40 }}`.
- **Safe areas:** handled by layouts, never inline — `MainLayout` applies `insets.top` when `showHeader`, `AuthLayout` applies both insets.

---

## 4. Radius

| Token | Use |
|---|---|
| `rounded-lg` (8) | Small thumbnails `w-12 h-12` |
| `rounded-xl` (12) | Buttons (`Button` component), image tiles `w-20 h-20`, compact cards |
| **`rounded-2xl` (16)** | **Inputs, cards, primary CTA, sheets — the house radius** |
| `rounded-3xl` (24) | Modal/selector panels |
| `rounded-full` | Chips, avatars, icon buttons, badges, back button |

---

## 5. Elevation

Cards are white on `#FAF8FF`, so shadows are navy-tinted and low-contrast.

```js
// Standard card — src/features/home/components/Card.tsx
shadowColor: '#0A1A3D', shadowOpacity: 0.12, shadowRadius: 14,
shadowOffset: { width: 0, height: 8 },

// Carousel card
shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12,
shadowOffset: { width: 0, height: 4 },

// Testimonials (softer)
shadowColor: '#0A1A3D', shadowOpacity: 0.08, shadowRadius: 14,
shadowOffset: { width: 0, height: 8 },
```

NativeWind shadow utilities appear only as `shadow-sm` / `shadow-md` / `shadow-lg` (badges, floating pills).

---

## 6. Iconography

- Library: **`lucide-react-native`** (stroke icons, 2px default).
- Sizes: `12` inline/trailing · `15–16` in rows & fact lists · `18` chevrons · `20` field/toolbar · `24` tab bar · `40–48` success illustrations.
- Colors: `#5279AC` (primary action), `#8990A8` (muted/chevron), `#3F465C` (neutral), `#FFFFFF` (on dark), `#00A572` (verified/success), `#436CF5` (accordion/expand), `#1C4878` (fact rows).
- Always import icons individually: `import { ChevronDown, ArrowLeft } from 'lucide-react-native'`.

---

## 7. Navigation chrome

| Element | Value |
|---|---|
| App header (MainLayout) | `px-3 py-5 bg-primary-900 flex flex-row justify-between`, white `Menu` icon, logo `w-[70%]`, optional right slot (`<UserAvatar />`) |
| Drawer header | `py-7 p-3 bg-primary-900 border-b-[0.5px] border-neutral-200` |
| Drawer active row | `backgroundColor: '#EBF1FF'` (brand) / `'#EDF0FF'` (investor), inactive transparent |
| Drawer surface | `#FFFFFF`, label `font-lato-bold text-neutral-700` |
| Brand tab bar | bg `#FFFFFF`, `borderTopColor: '#FFEDE4'`, height `64`, pad `8`, active `#386092`, inactive `#8990A8`, label `11px Lato-Bold` |
| Investor tab bar | bg `#FFFFFF`, active `#5279AC`, inactive `#8990A8` |
| StatusBar | `dark-content` + `backgroundColor="#FAF8FF"` (light screens) / `#FFFFFF` (auth) · `light-content` on dark hero screens |

---

## 8. Component recipes

Copy these class strings verbatim for a pixel-matching rebuild.

### Screen scaffold
```
MainLayout → View flex-1 bg-light (+ paddingTop: insets.top when header)
  KeyboardAvoidingView (flex-1, padding on iOS)
    ScrollView (showsVerticalScrollIndicator={false}, paddingBottom: 40)
      header row: px-4 pt-4 flex-row items-center gap-3
      body:      px-4 pt-6
```

### Page header (back + title)
```tsx
<TouchableOpacity className="w-10 h-10 rounded-full border border-neutral-200 bg-white items-center justify-center">
  <ArrowLeft size={20} color="#3F465C" />
</TouchableOpacity>
<Text className="text-neutral-900 text-2xl font-lato-black">Add Brand</Text>
```

### Section eyebrow
```
text-primary-700 text-sm font-lato-bold tracking-[2px] uppercase mt-2 mb-3
```

### Text input
```
bg-white rounded-2xl px-4 py-3.5 text-neutral-900 font-lato text-base
border border-neutral-200
+ mb-4
multiline → min-h-[88px] + style { textAlignVertical: 'top' }
placeholder → placeholderTextColor="#A3ABC4"
auth variant → bg-white rounded-2xl px-5 py-4 … border border-neutral-300
```

### Field label
```
text-neutral-700 font-lato-bold text-xs mb-1.5 ml-1
required marker appended: " *"
```

### Primary CTA (full-width, forms)
```
rounded-2xl py-4 items-center justify-center
enabled  → bg-primary-700, text-white font-lato-bold text-base
disabled → bg-neutral-300, text-neutral-500 font-lato-bold text-base
loading  → <ActivityIndicator color="#FFFFFF" />
activeOpacity 0.85
```

### `Button` component variants (`src/shared/components/Button.tsx`)
```
base:     px-5 py-2 rounded-xl items-center justify-center flex-row
text:     text-base font-lato-bold
primary:  bg-primary-700 / text-white
secondary:bg-secondary-700 / text-white
inverted: bg-primary-dark / text-white
outlined: bg-transparent / text-primary-700
link:     bg-transparent border-none / text-primary-700
disabled: opacity-50 · icon+label gap-2 · activeOpacity 0.8
```

### Select / dropdown trigger
```
<field classes> flex-row items-center justify-between mb-4
text: text-neutral-900 (selected) | text-neutral-400 (placeholder)
trailing: <ChevronDown size={18} color="#8990A8" />
```
Selector modal: `flex-1 bg-black/30 justify-center px-6` → panel `bg-white rounded-3xl p-4 max-h-[70%]`,
title `font-lato-bold text-base px-2 pt-2 pb-1`, rows `py-3 border-b border-neutral-200`,
footer action `text-primary-700 font-lato-bold`.

### Chip
```
px-4 py-2 rounded-full · text-sm font-lato
selected   → bg-primary-700 / text-primary-100
unselected → bg-neutral-200 / text-neutral-700
```

### Search bar
White rounded field, `lucide` `Search` leading icon, `X` clear action — `src/shared/components/Search.tsx`.

### Card
```
bg-white rounded-2xl overflow-hidden (+ standard card shadow)
list spacing: mx-2 my-2  |  mx-4 mb-4
```

### Image thumbnails
```
logo    → w-12 h-12 rounded-lg   (placeholder: bg-primary-200 + <ImagePlus size={20} color="#5279AC"/>)
gallery → w-20 h-20 rounded-xl
remove  → absolute -top-1.5 -right-1.5 bg-white rounded-full border border-neutral-200 w-6 h-6 items-center justify-center
add slot→ w-20 h-20 rounded-xl bg-gray-50 border border-dashed border-neutral-300
```

### Status / verified badge
```
rounded-full px-3.5 py-1.5 flex-row items-center gap-1.5 shadow-lg
bg-[#00A572] + white text  (success/verified)
dot variant → w-2 h-2 rounded-full bg-[#00A572]
```

### Loading & skeleton
- Inline spinner: `<ActivityIndicator size="large" color="#5279AC" />`; white on buttons; `#436CF5` for the app-boot loader.
- Skeleton base: `backgroundColor: '#EBF1FF'`, rounded via prop, white shimmer strip (opacity 0.18 peak, 1800 ms, ease-in-out, skewed −20°).

### Error / empty copy
```
text-red-500 text-sm font-lato mb-3 text-center   (form errors)
text-neutral-600 font-lato text-base leading-6    (empty-state body)
```

### Modal / sheet
Transparent `Modal` + `animationType="fade"` over `bg-black/30`, content in `bg-white rounded-3xl p-4`.
Bottom sheets live in `src/shared/components/BottomSheet.tsx`.

---

## 9. Voice & microcopy conventions

- Required fields marked with a trailing ` *` in the label; nothing else.
- Placeholders are concrete examples: `e.g. Acme Franchise`, `e.g. 500000`, `+92 300 0000000`.
- Titles: `Add Brand` / `Edit Brand`, `Create Brand` / `Save Changes`.
- Section eyebrows are 1–2 words, uppercase: `BRAND INFO`, `LOCATION`, `INVESTMENT`.
- Errors are one line and action-oriented: `Please fill in all required fields.` / `Something went wrong. Please try again.`

---

## 10. Assets

| Asset | Path | Notes |
|---|---|---|
| Logo (light) | `assets/FranchiseLogo.png` | Header `w-[70%]`, drawer |
| Hero background | `assets/bgImage.jpg` | Home hero |
| Fonts | `assets/fonts/Lato-*.ttf` (10 faces) + root `Lato.zip` | Also mirrored in `android/app/src/main/assets/fonts` and iOS `UIAppFonts` |
| License | `assets/OFL.txt` | SIL Open Font License |
| Remote imagery | `imageUrl()` → `https://www.franchisepk.com/public/user_img` | `catImageUrl()`, `partnerLogoUrl()` for other buckets |

---

## 11. Token source (copy into a new `tailwind.config.js`)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        lato: 'Lato-Regular',
        'lato-bold': 'Lato-Bold',
        'lato-light': 'Lato-Light',
        'lato-thin': 'Lato-Thin',
        'lato-black': 'Lato-Black',
        'lato-italic': 'Lato-Italic',
        'lato-bold-italic': 'Lato-BoldItalic',
        'lato-light-italic': 'Lato-LightItalic',
        'lato-thin-italic': 'Lato-ThinItalic',
        'lato-black-italic': 'Lato-BlackItalic',
      },
      colors: {
        light: '#FAF8FF',
        primary: {
          100: '#FFFFFF', 200: '#EBF1FF', 300: '#D4E3FF', 400: '#A4C9FF',
          500: '#87ADE4', 600: '#6C93C8', 700: '#5279AC', 800: '#386092',
          900: '#1C4878', dark: '#00315D', 'dark-2': '#001C39', bold: '#000000',
        },
        secondary: {
          100: '#FFFFFF', 200: '#FFEDE4', 300: '#FFDCC7', 400: '#FFB787',
          500: '#FD8E3A', 600: '#DC7521', 700: '#BC5D00', 800: '#964900',
          900: '#723600', dark: '#512400', 'dark-2': '#311300', bold: '#000000',
        },
        tertiary: {
          100: '#FFFFFF', 200: '#E1F4FF', 300: '#BFE9FF', 400: '#6CD2FF',
          500: '#42B7E5', 600: '#0F9CC9', 700: '#0081A7', 800: '#006685',
          900: '#004D65', dark: '#003824', 'dark-2': '#002113', bold: '#000000',
        },
        neutral: {
          100: '#FFFFFF', 200: '#EEF0FF', 300: '#DAE2FD', 400: '#BEC6E0',
          500: '#A3ABC4', 600: '#8990A8', 700: '#6F778E', 800: '#565E74',
          900: '#3F465C', dark: '#283044', 'dark-2': '#131B2E', bold: '#000000',
        },
      },
    },
  },
  plugins: [],
};
```

Plus `global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 12. Do & Don't

**Do**
- Reach for `primary-700` for anything actionable; `primary-900` for chrome (headers/drawers).
- Keep `neutral-200 #EEF0FF` as the default border — it is intentionally blue-tinted.
- Use `rounded-2xl` for anything that holds content, `rounded-full` for anything that is a token (chip/badge/avatar).
- Keep body text at `font-lato text-base leading-6`; use `font-lato-black` only for display headings.
- Let layouts own safe areas and status bar.

**Don't**
- Don't introduce greys outside the `neutral` scale (`#EEF0FF`, not `#E5E7EB`).
- Don't use `shadowColor: '#000'` at high opacity on light cards — use the navy `#0A1A3D` recipe.
- Don't set uppercase without tracking.
- Don't hardcode new hex values for statuses; reuse `#00A572` (success), `red-500` (error), `amber-500` (rating/highlight).
- Don't exceed `rounded-2xl` except for selector panels (`rounded-3xl`) and full-round elements.
