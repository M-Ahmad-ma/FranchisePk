# FranchisePk — UI/UX Overview

> Complete visual and structural overview of the FranchisePk (FranchiseHub) React Native app.

**Stack:** React Native 0.86 · React 19 · React Navigation v7 · NativeWind v4 (Tailwind) · lucide-react-native icons · Lato font family
**Display name:** FranchisePk

---

## 1. Color Theme

The app follows a **blue-dominant professional brand** with a light lavender-tinted background, green success accents, and muted gray-blue neutrals.

**App background:** `light` → **`#FAF8FF`** (soft lavender-white)

### Primary palette (Tailwind)

| Swatch | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | dark | dark-2 | bold |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **primary** (blue) | `#FFFFFF` | `#EFEFFF` | `#DCE1FF` | `#B7C4FF` | `#91A7FF` | `#6989FF` | `#436CF5` | `#2151DA` | `#0039B5` | `#002682` | `#001551` | `#000000` |
| **secondary** (lighter blue) | `#FFFFFF` | `#EDF0FF` | `#D8E2FF` | `#ADC6FF` | `#81AAFF` | `#4D8EFF` | `#2573E6` | `#005AC2` | `#004395` | `#002E6A` | `#001A42` | `#000000` |
| **tertiary** (green) | `#FFFFFF` | `#BEFFDB` | `#6FFBBE` | `#4EDEA3` | `#26C289` | `#00A572` | `#00885D` | `#006C49` | `#005236` | `#003824` | `#002113` | `#000000` |
| **neutral** (gray-blue) | `#FFFFFF` | `#EEF0FF` | `#DAE2FD` | `#BEC6E0` | `#A3ABC4` | `#8990A8` | `#6F778E` | `#565E74` | `#3F465C` | `#283044` | `#131B2E` | `#000000` |

### Most-used brand tokens

| Token | Hex | Usage |
|---|---|---|
| `primary-700` | `#436CF5` | Primary buttons, active states, key icons/text |
| `primary-100` | `#FFFFFF` | Backgrounds |
| `primary-200` | `#EFEFFF` | Icon-chip backgrounds, drawer active bg |
| `primary-800` | `#2151DA` | "FranchisePk" wordmark, property prices, icons |
| `primary-900` | `#0039B5` | Onboarding bg, dark headings |
| `secondary-200` | `#EDF0FF` | Search bar bg, outlined button bg |
| `tertiary-200` | `#BEFFDB` | Green icon-chip backgrounds |
| `tertiary-600` | `#00A572` | Green success accents/icons |
| `neutral-200` | `#EEF0FF` | Card borders, tab bar top border |
| `neutral-500` | `#A3ABC4` | Secondary text, chevrons |
| `neutral-600` | `#8990A8` | Placeholder text, inactive nav tints |
| `neutral-700` | `#6F778E` | Body text |

### Inline accent colors (not always in palette)

| Color | Hex | Used for |
|---|---|---|
| Pink | `#E0409A` | FileText icon, "Returns"/"Help & Support" icons |
| Pink chip bg | `#FFE4F0` | Custom pink icon-chip background (Profile) |
| Red | `#EF4444` | Tag pill on franchise cards (`bg-red-500`) |
| Named `blue` | — | Hamburger menu, back arrows, "view all" arrow, sign-out icon |

### Overlays / scrims
- `bg-black/40` — Onboarding image overlay
- `bg-black/50` — BottomSheet backdrop
- `bg-black/30` — Signup interest-picker modal backdrop

---

## 2. Typography — Lato

Lato is the app-wide font family, linked via `react-native.config.js` (`assets/fonts/`) and applied through NativeWind `fontFamily` utilities.

| Tailwind class | Font file | Use |
|---|---|---|
| `font-lato` | Lato-Regular | Body text, input text |
| `font-lato-bold` | Lato-Bold | Titles, buttons, active chips, wordmark |
| `font-lato-black` | Lato-Black | Hero / oversized headings |
| `font-lato-light` | Lato-Light | Subtle/large display text |
| `font-lato-thin` | Lato-Thin | — |
| `font-lato-italic` | Lato-Italic | — |
| `font-lato-bold-italic` | Lato-BoldItalic | — |
| `font-lato-light-italic` | Lato-LightItalic | — |
| `font-lato-thin-italic` | Lato-ThinItalic | — |
| `font-lato-black-italic` | Lato-BlackItalic | — |

> Note: Lato has **no Medium/SemiBold** — `font-medium`/`font-semibold` were mapped to `font-lato`/`font-lato-bold`. The tab bar still sets `Inter-Medium` (11px) inline, which is not in the Lato asset set — a known leftover.

---

## 3. Layout System

### `MainLayout` (`src/shared/layouts/MainLayout.tsx`) — used by most app screens
- Root: `flex-1 bg-light` → background `#FAF8FF`
- Safe-area top padding (below status bar)
- Always renders `<AppHeader />` then children

### `AuthLayout` (`src/shared/layouts/AuthLayout.tsx`) — used by Login/Signup
- White bg, safe-area top & bottom padding
- `StatusBar barStyle="dark-content"` on `#FFFFFF`
- No header

### `AppHeader`
- Hamburger `Menu` icon → opens drawer
- "FranchisePk" wordmark `text-primary-800` (4xl)
- 40px `Avatar` (Unsplash image) on the right
- Bottom border `border-neutral-500` (0.5px)

---

## 4. Navigation Map

```
App.tsx
└─ NavigationContainer
   └─ AppNavigator (state switch on isAuthenticated)
      ├─ [not authed] AuthNavigator (native stack)
      │   ├─ Onboarding  →  Login  ⇄  Signup
      │
      └─ [authed] InvestorDrawer (drawer, width 280, white)
          ├─ MainTabs → InvestorBottomTab (bottom tabs)
          │   ├─ Home               → HomeScreen
          │   ├─ FranchiseDirectory → FranchiseStack
          │   │   ├─ FranchiseList → CompanyDetail
          │   ├─ Properties         → PropertiesStack
          │   │   ├─ PropertiesList → PropertyDetail
          │   └─ Profile            → InvestorProfileScreen
          ├─ MyInterests → ContactUs
          ├─ Partners    → Partners
          ├─ Vacancies   → VacancyScreen
          └─ Profile     → InvestorProfileScreen
```

**Nav styling:** Drawer — active tint `#436CF5`, active bg `#EFEFFF`, inactive tint `#8990A8`, rounded items (12). Tab bar — bg `#FFFFFF`, active tint `#436CF5`, inactive tint `#8990A8`, top border `#EEF0FF`, height 64.

> Note: `Dashboard` exists in the tab param types + icon map but **no screen is registered** for it. The Properties tab is registered even though the type order lists Dashboard before Profile.

---

## 5. Screens (12)

### Auth — `src/features/auth/screens/`

| Screen | File | Description |
|---|---|---|
| Onboarding | `OnboardingScreen.tsx` | 3 swipeable full-bleed Unsplash slides with `bg-black/40` overlay, large white Lato-bold titles, paging dots (active `#436CF5`), "Next"/"Get Started" primary button. Bg `primary-900`. |
| Login | `LoginScreen.tsx` | Centered card on white. "FranchisePk" heading + tagline, Login/Sign Up tabs (`border-primary-700`), email + password inputs, "Forgot password?", full-width "Access Portfolio" button. |
| Signup | `SignupScreen.tsx` | Same layout. Full Name, Email, "Select area of interest" dropdown (modal sheet of 6 sectors), Password, "Create Account" button. |

### Home — `src/features/home/screens/`

| Screen | File | Description |
|---|---|---|
| Home | `HomeScreen.tsx` | Feed in MainLayout: auto-playing image carousel (250px), sector chips, "Featured Opportunities" + "view all", horizontal franchise `Card`s, "International Franchises" stacked cards. |

### Franchise — `src/features/franchise/screens/`

| Screen | File | Description |
|---|---|---|
| Franchise List | `FranchiseListScreen.tsx` | "Explore" directory: search bar, filter chips, stacked franchise cards → CompanyDetail. |
| Company Detail | `CompanyDetailScreen.tsx` | Hero image, floating back button, bookmark, "Submit Request" bottom sheet; FinancialStatsCard (Total Investment / Franchise Fee / Royalty Fee), "About" text, optional YouTube embed, related-franchise rail. |
| Properties | `Properties.tsx` | "PREMIUM PORTFOLIO" eyebrow + huge "Featured Properties" title (6xl), search, filter chips, property cards, "List Your Property" CTA. |
| Property Detail | `PropertyDetailScreen.tsx` | Hero image, floating back, title, description, Market Value in `primary-700`, "Submit Inquiry" bottom sheet. |

### Investor — `src/features/investor/screens/`

| Screen | File | Description |
|---|---|---|
| Profile | `InvestorProfileScreen.tsx` | Centered Avatar (88px, shadow-tinted blue), name/email, "INVESTOR" pill; Portfolio Overview (Active 12 / Invested $2.8M / Returns +18.4%); Account Settings rows; Sign Out (outlined). |
| Contact Us | `ContactUs.tsx` | "Let's build your empire together" hero; Meet the Team (7 TeamCards, Contact → bottom sheet); Our Location with embedded OpenStreetMap WebView. |
| Partners | `Partners.tsx` | "Trusted Partners" eyebrow + headline; 2-column grid of 8 partner cards (Starbucks, McDonald's, 7-Eleven, Anytime Fitness, Domino's, Kumon, Subway, Hilton). |
| Vacancies | `VacancyScreen.tsx` | "Join Our Team" + "Vacancies" heading; 2 job cards (Business Development Officer, Internship Program); "Send Your Application" form. |

---

## 6. Shared Components

| Component | Purpose |
|---|---|
| `Button` | Variants: `primary` (`#436CF5` white text), `secondary`, `inverted`, `outlined` (`#EDF0FF` bg, `#436CF5` text), `link` (underlined). Props: `loading`, `disabled` (50% opacity), `icon` + `iconPosition`, `className`. Rounded-xl, Lato-bold. |
| `BottomSheet` | Reanimated slide-up sheet (300ms/250ms), `black/50` backdrop, white `rounded-t-3xl` with drag-handle bar. Used for all submit/contact forms. |
| `Avatar` | Circular image, fallback initials (default `#436CF5` bg), error fallback, optional `onPress`. |
| `Search` | Rounded search row (`#EDF0FF` bg, neutral border), Search icon, clear "X", optional submit button. |
| `Chip` / `ChipList` | Filter pills: selected = `#436CF5` bg + white text; unselected = `neutral-200`. `ChipList` is horizontal-scroll with `selectedId`/`onSelect`. |
| `MapView` | WebView-rendered Leaflet + OpenStreetMap (zoom 15, marker popup) with floating location chip. |
| `Card` (home) | White `rounded-2xl` franchise card: image h-44, red tag pill, title/description, "INVESTMENT RANGE" + price, optional Details button. |
| `FinancialStatsCard` | 3 bordered stat rows with colored icons (DollarSign `#436CF5`, FileText `#E0409A`, Percent `#26C289`). |
| `PropertiesCard` | Property card: image h-48, market value `#2151DA`, outlined "View Details" button. |
| `ListPropertyCTA` | "List Your Property" secondary-tinted CTA card (HousePlus `#2151DA`) + bottom sheet. |
| `TeamCard` | Team member card: image h-56, name/role, outlined "Contact" button (Mail `#6989FF`). |

---

## 7. Visual Conventions

- **Cards** — white, `rounded-2xl`, thin `neutral-200` borders, subtle shadow
- **Primary buttons** — full-width, `#436CF5`, white Lato-bold text, `rounded-xl`
- **Filter chips** — pill, filled `#436CF5` when selected
- **Icon chips** — colored icon on pastel tinted square (`primary-200`, `tertiary-200`, `#FFE4F0`)
- **Eyebrow labels** — uppercase small text in `primary-700`/`#2151DA`
- **Hero headings** — large Lato-bold in `#0039B5` / `#2151DA`
- **Screen backgrounds** — `#FAF8FF` (light) except Onboarding (`primary-900`) and auth screens (white)

---

## 8. Mock Data

All mock data lives in `src/shared/utils/Array.ts`: `franchiseFilters` (10 sectors), `franchiseData` (5 local brands), `internationalFranchises` (7 brands), `propertyData` (8 properties), `teamMembers` (7), `partnersData` (8). Images: local `assets/image1..3.jpg` + remote Unsplash URLs.
