# Jackie Jeans — Onboarding

A fit-finding onboarding experience for Jackie Jeans. Answer 10 quick questions via text or voice to get matched with denim that actually fits.

Built with [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), and [Framer Motion](https://www.framer.com/motion/).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |

## Project Structure

```
app/
├── page.tsx          # Landing page with quiz entry points
├── layout.tsx        # Root layout with fonts and global styles
├── quiz/             # Text-based fit quiz flow
├── voice/            # Voice-based onboarding flow
├── complete/         # Completion / results page
└── globals.css       # Global styles

components/           # Shared UI components
lib/
├── questions.ts       # Quiz questions, brands, and size data
└── parseVoiceAnswer.ts # Voice answer parsing logic
```

## How It Works

The app collects body measurements and fit preferences through a conversational quiz. Users can choose between a traditional form-based quiz or a voice-driven onboarding flow. Responses are parsed and used to recommend well-fitting denim.

## License

[MIT](LICENSE)
