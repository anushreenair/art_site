# Atelier

Atelier is a practice-first art learning workspace for artists who want focused exercises, useful references, progress tracking, and relevant opportunities.

This project is currently a frontend prototype built to validate the product experience and interaction design.

## Features

- Explore curated art references and focused practice studies
- Generate practice sessions and track progress
- Compare studies and experiment with palettes
- Keep a practice journal with reflection-based recommendations
- Browse competitions, workshops, exhibitions, grants, residencies, and commissions
- Track application requirements and statuses
- Explore artist rights and artwork digitisation workflows
- Responsive layouts for desktop and mobile screens

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- CSS
- Vitest and Testing Library
- Lucide React icons

## Getting Started

### Requirements

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Build for production

```bash
npm run build
```

### Run tests

```bash
npm test
```

## Architecture

The application is a client-side React application. Routes are defined in `src/App.tsx`, and pages are composed from reusable components in `src/components/`.

The current data flow is:

```text
Local TypeScript data
        ->
React pages and components
        ->
Local UI state and browser persistence
```

The project does not currently include a custom backend, database, API server, authentication service, or scraping worker.

## Data Structures and Persistence

- Typed arrays of objects store studies, opportunities, learning paths, challenges, and progress data.
- TypeScript union types constrain values such as opportunity categories and experience levels.
- `Record` types store keyed state such as application statuses and filters.
- React state manages temporary interactions such as selected filters, onboarding steps, and practice sessions.
- React Context shares Art Box material state across related components.
- Practice journal entries are serialized as JSON in browser `localStorage`.

The main opportunity model is defined in `src/data/opportunity-listings.ts`. Journal persistence and recommendations are implemented in `src/lib/practiceJournal.ts`.

## Backend and Web Scraping Status

The opportunity listings currently use representative seed data so the frontend experience can be demonstrated without an external service. The application is designed so that this data source can later be replaced with API responses.

A production version could add a Node.js and TypeScript backend with the following pipeline:

1. Scheduled jobs fetch approved opportunity sources.
2. Source-specific parsers extract names, deadlines, locations, eligibility, fees, prizes, media, and official URLs.
3. Records are normalized into the shared opportunity schema.
4. Duplicate records and expired deadlines are filtered out.
5. Valid records are stored in a database such as PostgreSQL.
6. The frontend reads the data through endpoints such as `/api/opportunities`.

Cheerio would be suitable for regular HTML pages, while Playwright could handle sources that require JavaScript rendering. A real implementation would also need rate limiting, caching, retries, source attribution, and compliance with each website's terms and `robots.txt` rules.

## Testing

Tests cover data filtering, reference cards, onboarding, critique workflows, and other interactive components.

The main commands are:

```bash
npm test
npm run build
```

## Interview Summary

> Atelier is a React and TypeScript frontend prototype for an art practice platform. I used typed data models, reusable components, React Router, local state, Context, and localStorage to build the core workflows. I kept the opportunity data local while validating the user experience, but the data structures are ready to connect to a backend API and scheduled web-scraping pipeline in a production version.

## Project Structure

```text
src/
  components/   Reusable UI and workflow components
  data/         Typed seed data and filtering logic
  lib/          Domain helpers and browser persistence
  pages/        Route-level screens
  types/        Shared TypeScript types
```