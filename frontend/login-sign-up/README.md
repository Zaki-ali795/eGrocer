# eGrocer Auth UI

A ready-to-integrate React authentication component for the eGrocer platform.
Supports **Login** and **Sign Up** flows with three role types: Customer, Seller, and Admin.

---

## Folder Structure

```
egrocer-auth/
└── src/
    ├── components/
    │   ├── index.js                    ← barrel export (import from here)
    │   └── auth/
    │       ├── index.js
    │       └── EGrocerAuthUI.jsx       ← main component
    └── pages/
        └── AuthPage.jsx               ← example usage page
```

---

## Dependencies

Make sure these are installed in your project:

```bash
npm install lucide-react
```

Tailwind CSS must also be configured. If it isn't yet:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then add this to your `tailwind.config.js` content array:

```js
"./src/**/*.{js,jsx,ts,tsx}"
```

---

## Integration

### 1. Copy the component

Copy the `src/components/auth/` folder into your project's components directory.

### 2. Import and use

```jsx
// Option A — default import
import EGrocerAuthUI from "./components/auth/EGrocerAuthUI";

// Option B — named import via barrel
import { EGrocerAuthUI } from "./components";

function App() {
  return <EGrocerAuthUI />;
}
```

### 3. With React Router

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EGrocerAuthUI from "./components/auth/EGrocerAuthUI";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<EGrocerAuthUI />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Customisation

| What                  | Where                                   |
|-----------------------|-----------------------------------------|
| Brand name / tagline  | Left panel section in `EGrocerAuthUI.jsx` |
| Hero image            | `backgroundImage` URL in left panel     |
| Role cards            | `roleCards` array near top of component |
| Colors                | Tailwind `green-*` classes throughout   |
| Form submission logic | `onSubmit` handler on the `<form>` tag  |

### Adding form submission

Find the `<form>` tag and add an `onSubmit` handler:

```jsx
<form
  className="space-y-5"
  onSubmit={(e) => {
    e.preventDefault();
    // your login / signup API call here
  }}
>
```

---

## Notes

- The component is **fully self-contained** — no external state management needed.
- The left hero panel is hidden on mobile (`hidden lg:flex`) and shown on large screens.
- All Tailwind classes are standard utility classes — no custom config required.
