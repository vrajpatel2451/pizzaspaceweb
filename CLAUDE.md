# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Create production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 16 application using the App Router with React 19.

**Stack:**
- Next.js 16 with App Router (files in `app/` directory)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4 (via @tailwindcss/postcss)

**Path Aliases:**
- `@/*` maps to the project root

**Fonts:**
- Geist Sans and Geist Mono loaded via `next/font/google`

**Images:**
- Use `CustomImage` from `@/components/ui/custom-image` for all images
- This is a wrapper around Next.js Image with error handling and fallback support
- Do NOT use `next/image` directly - always use CustomImage
