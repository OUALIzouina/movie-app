# Reel — Movie Frontend

A React (Vite) frontend for a Node/Express/Prisma movie backend. Cookie-based
JWT auth, movie browsing with search/filter, and a per-user watchlist.

## Stack

- React 18 + Vite
- React Router DOM v6
- Tailwind CSS (custom "cinema at night" theme — see `tailwind.config.js`)
- Axios (`withCredentials: true` for the HTTP-only cookie)
- Auth state via React Context (`src/context/AuthContext.jsx`)

## Project structure

```
movie-frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── AuthContext.jsx
    ├── services/
    │   ├── api.js              # axios instance
    │   ├── authService.js
    │   ├── movieService.js
    │   └── watchlistService.js
    ├── components/
    │   ├── Navbar.jsx
    │   ├── MovieCard.jsx
    │   ├── SkeletonCard.jsx
    │   ├── Loader.jsx
    │   ├── ErrorBanner.jsx
    │   └── ProtectedRoute.jsx
    └── pages/
        ├── Home.jsx
        ├── Login.jsx
        ├── Signup.jsx
        ├── MovieDetails.jsx
        ├── Watchlist.jsx
        └── NotFound.jsx
```

## Backend API contract this app expects

| Method | Endpoint            | Purpose                          |
|--------|----------------------|-----------------------------------|
| POST   | `/auth/register`     | Create account, set JWT cookie   |
| POST   | `/auth/login`         | Log in, set JWT cookie           |
| POST   | `/auth/logout`        | Clear JWT cookie                 |
| GET    | `/auth/me`            | Return current user from cookie  |
| GET    | `/movies`             | List movies (`?search=&genre=&minRating=`) |
| GET    | `/movies/:id`         | Movie detail                     |
| GET    | `/watchlist`          | Current user's watchlist         |
| POST   | `/watchlist/`         | Body: `{ movieId }`               |
| DELETE | `/watchlist/:movieId` | Remove one entry                 |
| PUT    | `/watchlist/:movieId` | Update one entry                 |

If your backend uses different field names or a different "who am I" route,
the two places to adjust are `src/services/authService.js` (the `/auth/me`
path) and the `data.user ?? data` / `data.movies ?? data` fallbacks sprinkled
through the pages — they're written to tolerate either a wrapped
(`{ user: {...} }`) or bare (`{...}`) response shape, but you may need to
tweak the exact key names to match your Prisma serializer.

### CORS + cookies

Because auth relies on an HTTP-only cookie, your Express server must:

```js
app.use(cors({
  origin: 'http://localhost:5173', // your Vite dev origin
  credentials: true,
}))
```

And when setting the cookie on login/register:

```js
res.cookie('token', jwt, {
  httpOnly: true,
  sameSite: 'lax',   // 'none' + secure:true if frontend/backend are on different domains in prod
  secure: process.env.NODE_ENV === 'production',
})
```

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the API URL**

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```
   VITE_API_URL=http://localhost:4000/api
   ```

3. **Install Tailwind** (already wired up via `tailwind.config.js` /
   `postcss.config.js` / the `@tailwind` directives in `src/index.css` — this
   step is just `npm install`, nothing extra to run). If you're bootstrapping
   from scratch instead of using these files directly:

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

   then paste in the provided `tailwind.config.js` content and add the three
   `@tailwind` directives to the top of your CSS entry file.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:5173`. Make sure your backend is running (default
   assumed at `http://localhost:4000`) and CORS is configured as above.

5. **Build for production**

   ```bash
   npm run build
   npm run preview   # sanity-check the production build locally
   ```

## Notes on the auth flow

- No token is ever stored in `localStorage` — the JWT lives only in the
  HTTP-only cookie the backend sets, which JS can't read. This is why
  `AuthContext` calls `GET /auth/me` on mount: it's the only way to know if a
  valid session already exists.
- Every request in `src/services/api.js` sets `withCredentials: true`,
  which is required for the browser to send/receive that cookie.
- `ProtectedRoute` waits for the initial session check (`initializing`)
  before redirecting, so a hard refresh on `/watchlist` won't flash to
  `/login` while the cookie is still being verified.

## Design notes

The UI leans into a "cinema at night" identity: a near-black navy backdrop,
a marquee-gold accent, and a signature ticket-stub card (perforated tear line
between poster and details) used for both the movie grid and the watchlist.
Headings use Fraunces (a display serif), body text uses Inter, and small
metadata labels use Space Mono for a ticket/stub feel.
