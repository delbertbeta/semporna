# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` - Start development server (runs on port 3001 by default, configurable via LISTEN_PORT env var)
- `npm run build` - Build for production using Rsbuild
- `npm run lint` - Run ESLint with auto-fix
- Pre-commit hooks automatically run lint-staged for TypeScript, JavaScript, and Vue files

## Project Architecture

This is a Vue 3 photo gallery application called "Semporna" built with the following stack:

### Core Technologies

- **Vue 3** with Composition API and TypeScript
- **Rsbuild** for build tooling (configured in `rsbuild.config.ts`)
- **Pinia** for state management
- **Vue Router** for routing
- **Less** for styling
- **Tailwind CSS** for utility classes

### Key Dependencies

- `@yeger/vue-masonry-wall` - Masonry layout for image galleries
- `@headlessui/vue` & `@heroicons/vue` - UI components and icons
- `@vueuse/core` - Vue composition utilities
- `swiper` - Image slider/carousel functionality
- `dayjs` - Date manipulation
- `axios` - HTTP client
- `amap-js` - Amap integration (commented out)

### Project Structure

#### State Management (`src/store/`)

- `album.ts` - Album data management, handles fetching album metadata and tracking active date filters
- `index.ts` - App-wide state for modal management (About and Album modals)

#### Key Components

- `Home.vue` - Main page component
- `image-gallery.vue` - Main gallery with masonry layout
- `timeline-block.vue` - Timeline navigation component
- `album-modal.vue` - Full-screen album viewer with slider
- `about-block.vue` - About section component
- `map-block.vue` - Map display component
- `full-screen-viewer.vue` - Full-screen image viewer

#### Configuration

- `rsbuild.config.ts` - Build configuration with custom SVG sprite loader setup
- Environment variables: `API_END_POINT`, `LISTEN_PORT`, `HMR_PORT`

### Data Flow

1. Album metadata is fetched from API on app initialization
2. Gallery displays images in masonry layout filtered by year/month
3. Timeline component allows navigation between time periods
4. Clicking an image opens a modal with full-screen slider view
5. Modal state is managed through Pinia store

### SVG Icon System

Custom SVG sprite loader configured to generate icons with naming pattern: `svgicon-{directory}-{filename}`

### API Integration

- Album metadata fetched via `request/index.ts`
- Error handling implemented in store with error state tracking
