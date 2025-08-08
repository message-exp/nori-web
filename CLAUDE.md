# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Manager

- Uses `pnpm` as the package manager
- Install dependencies: `pnpm install`
- Setup git hooks: `pnpm prepare`

### Development Server

- Start dev server: `pnpm dev` (runs on http://localhost:5173)
- Build for production: `pnpm build`
- Start production server: `pnpm start`

### Code Quality

- Lint code: `pnpm lint`
- Check types: `pnpm typecheck` (runs react-router typegen + tsc)
- Format code: `pnpm format`
- Check formatting: `pnpm format:check`

## Architecture Overview

### Framework & Stack

- **React Router v7** with SSR enabled by default
- **TypeScript** with strict mode
- **Tailwind CSS v4** for styling
- **Vite** for build tooling
- **Matrix JS SDK** for Matrix protocol integration
- **shadcn/ui** components (New York style)

### Project Structure

- `app/` - Main application code
  - `routes/` - React Router file-based routing
  - `components/` - Reusable React components
    - `ui/` - shadcn/ui components
    - `room-chat/` - Room-specific chat components
    - `message/` - Message display components
  - `lib/` - Utility libraries
    - `matrix-api/` - Matrix protocol API wrappers
    - `contacts-server-api/` - Contacts server API integration
  - `contexts/` - React context providers
  - `hooks/` - Custom React hooks

### Key Architectural Patterns

#### Matrix Client Management

- Central `Client` class in `app/lib/matrix-api/client.ts` wraps Matrix JS SDK
- Handles token refresh, authentication state, and HTTP request wrapping
- Global client instance exported for app-wide use
- Room context (`app/contexts/room-context.tsx`) manages room state and Matrix events

#### Routing Structure

- File-based routing with React Router v7
- Route naming convention: `_layout.route.tsx` pattern
- Main layouts: `_dash.tsx` (dashboard), `_home.tsx` (home), `_index.tsx` (landing)

#### Component Organization

- UI components follow shadcn/ui patterns with Radix UI primitives
- Custom components in feature-specific folders (room-chat, message, card-list)
- Theme support via `next-themes` with dark mode default

#### State Management

- React Context for global state (rooms, auth)
- Custom hooks for Matrix SDK integration
- No external state management library

### Import Aliases

- `~/*` maps to `app/*`
- Components use `~/components`, utils use `~/lib/utils`

### Matrix Integration

- Room management, messaging, and user authentication
- Timeline handling with debounced message loading
- Invite system and room settings
- Bridge network icon support

## Contact Management System

The application includes a contact management system with two main entities, now implemented with full API integration:

#### ContactCard (contact-cards)

Basic contact information cards containing:

**Data Model:**

```typescript
interface ContactCard {
  id: UUID; // Unique identifier
  contact_name: string; // Contact name
  nickname?: string; // Optional nickname
  contact_avatar_url?: string; // Optional avatar URL
}
```

**API Data Structures:**

- `ContactCardResponse`: Complete data returned to frontend
- `ContactCardCreate`: Input data for creating new contacts (excludes id)
- `ContactCardUpdate`: Input data for updating contact information

**Main Operations:**

- Get all contact cards
- Create new contact card
- Update contact card information
- Delete contact card

#### PlatformContact (platform-contact)

Platform-specific account information for contacts, with one-to-many relationship to ContactCard:

**Data Model:**

```typescript
interface PlatformContact {
  id: UUID; // Unique identifier
  contact_card_id: UUID; // Foreign key to ContactCard
  platform: PlatformEnum; // Platform type (Telegram/Discord/Matrix)
  platform_user_id: string; // User ID on that platform
  dm_room_id: string; // Direct message room ID
}

enum PlatformEnum {
  TELEGRAM = "Telegram",
  DISCORD = "Discord",
  MATRIX = "Matrix",
}
```

**API Data Structures:**

- `PlatformContactResponse`: Complete data returned to frontend
- `PlatformContactCreate`: Input data for creating new platform contacts
- `PlatformContactUpdate`: Input data for updates (platform_user_id and dm_room_id only)

**Main Operations:**

- Get all platform contacts for a specific ContactCard
- Create new platform contact information
- Update platform contact information
- Delete platform contact information

**Relationship Structure:**

```
ContactCard (1) ←→ (many) PlatformContact
```

- One contact can have multiple platform accounts
- Each platform account belongs to one contact

### API Integration

The contacts system is implemented with a dedicated API client:

**Location:** `app/lib/contacts-server-api/`

**Structure:**

- `index.ts` - Axios client with authentication interceptors
- `types.ts` - TypeScript definitions for all data models
- `contacts.ts` - Contact card CRUD operations
- `platform-contacts.ts` - Platform contact CRUD operations
- `bridge/telegram.ts` - Telegram-specific bridge operations

**Authentication:**

- Uses Bearer token authentication via request interceptors
- Integrates with existing auth cookie system
- Configurable via `VITE_CONTACTS_SERVER` environment variable

**Error Handling:**

- Axios-based HTTP client with 10-second timeout
- Standard HTTP error responses with proper typing

### UI Components

**Contact Card Components** (`app/components/card-list/`):

- `card-list.tsx` - Main container for contact cards display
- `contact-card.tsx` - Individual contact card component
- `create-card-dialog.tsx` - Form dialog for creating new contacts

**Features:**

- Form validation using react-hook-form with Zod schema
- File upload support for contact avatars
- Responsive card grid layout
- Loading states and error handling

**Routes:**

- `_home.cards.tsx` - Main contacts page with card list integration

## Development Notes

### Environment Setup

- Node.js v22+ required
- Pre-commit hooks configured with lint-staged
- ESLint + Prettier for code quality

**Environment Variables:**

- `VITE_CONTACTS_SERVER` - Base URL for the contacts API server

### Docker Support

- Dockerfile available for containerized deployment
- Production builds serve on port 3000
