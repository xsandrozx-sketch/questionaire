# Innovation Assessment Radar

React/Vite questionnaire based on the supplied Excel workbook. It contains 63 questions across 7 dimensions, uses a 1–5 Likert scale, calculates dimension averages and displays a radar chart. Submitted assessments are stored in Supabase.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and set the Supabase URL and anon key.
3. `npm run dev`

## Railway
Build command: `npm run build`
Start command: `npm start`
The app listens on Railway's `PORT`.

## Supabase
Apply `supabase/schema.sql`, then add the project's URL and anon key as Railway environment variables.