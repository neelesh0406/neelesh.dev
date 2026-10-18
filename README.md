# neelesh.dev

Original portfolio design, with a scroll-controlled iPhone Duo hero and Neelesh’s portrait. The rest of the original sections and layout are retained.

## Local preview

Node 22.12+.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. `npm run typecheck` and `npm run build` validate the source. The home page reads published content from the public `portfolio_v2` Sanity dataset and revalidates every 60 seconds. Copy `.env.example` to `.env.local` for local configuration. The original `production` dataset and legacy Studio configuration remain unchanged. A write token is needed only for content-management scripts; keep it in `.env.local`, never in public environment variables.

## Hero

- `components/Hero.tsx`: original typography, yellow accents, background circles, typewriter and navigation; phone replaces the circular hero image.
- `components/PhoneHero.tsx`: maps the existing page scroll container to the phone’s fold progress. Click/drag and a keyboard-accessible toggle also work.
- `components/iphone-duo/`: source adapted from https://github.com/jal-co/iphone-duo (MIT notices and third-party asset notes included).
- `public/models/iphone-duo.glb`: optimized reference model, reduced from 15,137,168 to 3,568,160 bytes with deduplicated textures, WebP and Meshopt. Geometry hierarchy and named hinge/screen materials preserved.
- `public/phone/portrait.webp`: supplied portrait converted to a web texture, without embedded photo metadata.
- `public/phone/inside.svg`: portrait and personal introduction shown inside the open phone.

The phone is client-loaded independently of the rest of the page. Reduced-motion users get an open device. Model optimization can be reproduced with `node scripts/optimize-phone.mjs /path/to/original/iphone-duo.glb`.

## Status

GitHub repository: https://github.com/neelesh0406/neelesh.dev. Local folder and Git remote retain the old name because permission to update `.git/config` was declined. No implementation changes have been pushed or deployed.

The earlier broad redesign was rejected and restored to the original design. This checkpoint includes the hero, supporting data/build setup, isolated Sanity dataset integration, and image sizing and header hydration fixes. Browser smoke test: `npm run test:e2e` with a server running on port 3000 and Google Chrome installed.
