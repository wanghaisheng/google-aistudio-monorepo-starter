# Arch-X System Console

A high-performance, decoupled dashboard architecture built with **Vite**, **React**, and **Express**.

## Core Principles

- **Zero Hardcoding**: All UI strings, infrastructure URLs, and system metadata are managed via a centralized configuration and localization layer.
- **Decoupled Storage**: Storage logic is abstracted behind a `StorageAdapter` contract, allowing seamless switching between **SQL.js**, **Supabase**, and **Cloudflare D1**.
- **Pure UI**: React components are presentational and stateless, with side effects and state managed by custom hooks and services.
- **Selective SSR/ISR**: A custom Express server provides build-time cache warming and on-demand server-side rendering with ISR capabilities.

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, Motion (Framer Motion)
- **Backend**: Express, Vite (Middleware mode)
- **Storage**: SQL.js (WASM), Supabase, Cloudflare D1
- **Design**: Bento Grid Aesthetic

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Project Structure

- `/src/core`: Core infrastructure (Config, Constants, I18n, Storage Adapters)
- `/src/services`: Business logic and API abstractions
- `/src/hooks`: Application state and side-effect management
- `/src/components`: Pure UI components
- `/server.ts`: Custom SSR/ISR server entry point
