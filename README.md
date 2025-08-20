# Rick & Morty Explorer

A polished React application for exploring characters from the Rick and Morty universe. Built with Next.js, TypeScript, TailwindCSS, and React Query to demonstrate modern web development practices and excellent user experience.

## 🚀 Features Implemented

### Core Requirements ✅
- **Project Setup**: Next.js 14 with TypeScript and clean file architecture
- **Data List + Detail View**: Character listing with pagination and detailed character pages at `/character/:id`
- **Search & Filtering**: Debounced search (400ms) with URL state synchronization
- **Multiple Filters**: Status, species, gender filters with URL persistence
- **Sorting**: Name A-Z, Name Z-A, Newest First, Oldest First with client-side sorting
- **Favorites System**: Toggle favorites from list and detail views with localStorage persistence
- **Data Fetching**: Proper loading states, error handling, and request cancellation with AbortController

### Enhanced Features ✅
- **React Query Caching**: Efficient data caching with background refetch (5min stale, 10min cache)
- **URL as Source of Truth**: Complete state synchronization - all filters, search, pagination, and sorting in URL
- **Scroll Position Preservation**: Browser back/forward maintains scroll position using sessionStorage
- **Dark/Light Theme Toggle**: Manual theme switching with system preference detection and persistence
- **Error Boundaries**: Comprehensive error handling with retry functionality
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Keyboard navigation, ARIA labels, focus management, semantic HTML
- **E2E Testing**: Comprehensive Playwright test suite (35 tests across 5 browsers)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query + URL state
- **Data Fetching**: Axios with AbortController
- **Testing**: Playwright (E2E)
- **API**: [Rick and Morty API](https://rickandmortyapi.com/)

## 📦 Installation & Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd rick-morty-explorer

# Install dependencies
npm install

# Install Playwright browsers for testing
npx playwright install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run E2E tests
npm run test
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Architecture & Design Decisions

### File Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── character/[id]/     # Dynamic character detail pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/             # Reusable UI components
│   ├── AppHeader.tsx       # Header with navigation and theme toggle
│   ├── CharacterCard.tsx   # Character card component
│   ├── ErrorBoundary.tsx   # Error handling components
│   ├── FavoriteButton.tsx  # Favorite toggle button
│   ├── LoadingSkeleton.tsx # Loading state components
│   ├── Pagination.tsx      # Pagination component
│   ├── QueryProvider.tsx   # React Query provider
│   ├── SearchFilters.tsx   # Search and filter controls
│   ├── ThemeProvider.tsx   # Theme context provider
│   └── ThemeToggle.tsx     # Theme toggle button
├── hooks/                  # Custom React hooks
│   ├── useDebounce.ts      # Debounced callbacks and values
│   ├── useFavorites.ts     # Favorites management
│   ├── useScrollPosition.ts # Scroll position tracking
│   └── useUrlState.ts      # URL state synchronization
├── services/               # API layer
│   └── api.ts              # Rick & Morty API client
├── types/                  # TypeScript type definitions
│   └── index.ts            # Shared types
└── utils/                  # Utility functions
    └── sortUtils.ts        # Client-side sorting logic
```

### Key Design Decisions

#### 1. **URL as Single Source of Truth**
- All application state (search, filters, sorting, pagination) lives in the URL
- Enables shareable links and proper browser navigation
- Custom `useUrlState` hook manages synchronization
- **Trade-off**: More complex state management, but superior user experience

#### 2. **Client-Side Sorting with Server-Side Filtering**
- API handles search and filters (server-side for performance)
- Sorting implemented client-side for responsiveness
- Reduces API calls while maintaining fast interactions
- **Trade-off**: Limited to sorting current page, but excellent UX

#### 3. **React Query for Data Management**
- Handles caching, background refetch, and error states automatically
- 5-minute stale time, 10-minute cache time for optimal performance
- Request deduplication and race condition prevention
- **Trade-off**: Additional dependency, but significantly better data fetching UX

#### 4. **Scroll Position Preservation**
- sessionStorage tracks scroll position with URL matching
- Automatic restoration on browser back/forward navigation
- Clears position when filters change to avoid confusion
- **Trade-off**: Additional complexity, but maintains user context

#### 5. **Theme System**
- Manual toggle with system preference fallback
- Context-based with localStorage persistence
- Handles SSR hydration issues gracefully
- **Trade-off**: More setup, but provides both manual control and system integration

## 🎯 Performance Optimizations

- **Image Optimization**: Next.js Image component with lazy loading
- **Request Cancellation**: AbortController prevents race conditions
- **Debounced Search**: 400ms debounce reduces API calls
- **React Query Caching**: Reduces redundant network requests
- **Code Splitting**: Automatic route-based splitting with Next.js
- **Client-Side Sorting**: Fast sorting without additional API calls

## 🧪 Testing Strategy

The application includes comprehensive E2E testing with Playwright:

```bash
# Run all tests (35 tests across 5 browsers)
npm run test

# Run tests with UI
npm run test:ui

# Type checking
npm run type-check
```

### Test Coverage
- **Homepage functionality**: Loading, search, filters
- **Character navigation**: Detail pages, back navigation
- **Favorites system**: Adding, removing, persistence
- **Sorting functionality**: All sort options
- **Pagination**: Navigation between pages
- **Error handling**: Network errors, empty states
- **Responsive design**: Mobile, tablet, desktop viewports

## 🔧 API Integration

Integration with the [Rick and Morty API](https://rickandmortyapi.com/):

- **Characters Endpoint**: `/api/character` with search/filter support
- **Individual Character**: `/api/character/{id}` for detailed views
- **Episodes**: `/api/episode/{ids}` for character episode information

### Error Handling Strategy
- Network errors with automatic retry functionality
- 404 errors with helpful user messaging
- Request cancellation for race condition prevention
- Graceful fallbacks for missing or incomplete data
- Error boundaries for unexpected application errors

## 🚦 Features Implemented vs Requirements

### Must-Have Requirements: 100% ✅
- ✅ React/Next.js + TypeScript setup
- ✅ Data list with pagination
- ✅ Detail view with routing
- ✅ Debounced search with URL binding
- ✅ Multiple filters with URL state
- ✅ **Sorting functionality** (Name A-Z, Z-A, Newest, Oldest)
- ✅ Favorites with localStorage persistence
- ✅ Loading states and error handling
- ✅ Request cancellation

### Nice-to-Have Features: 8/8 ✅
- ✅ React Query for caching and background refetch
- ✅ **URL state management** (complete synchronization)
- ✅ **Scroll position preservation** (browser navigation)
- ✅ **Theme toggle** with persistence
- ✅ Error boundaries with retry functionality
- ✅ Responsive design and accessibility
- ✅ E2E testing with Playwright
- ✅ Code splitting (automatic with Next.js)

### Challenge Requirements Addressed
- ✅ **URL as source of truth**: Direct URL visits recreate exact application state
- ✅ **Request cancellation**: AbortController prevents race conditions during typing
- ✅ **Empty states**: Helpful messaging for no results, no favorites, errors
- ✅ **Navigation preservation**: Back/forward maintains scroll position and context

## 🌟 Notable Implementation Highlights

### 1. **Advanced URL State Management**
The application implements complete URL synchronization where every user interaction is reflected in the URL, making all application states shareable and bookmark-able.

### 2. **Intelligent Caching Strategy**
React Query configuration optimizes for both performance and data freshness with smart cache invalidation and background updates.

### 3. **Accessibility First**
Comprehensive accessibility implementation including keyboard navigation, screen reader support, and proper semantic markup.

### 4. **Production-Ready Error Handling**
Multi-layered error handling from network level to component level with user-friendly error messages and recovery options.

### 5. **Cross-Browser Testing**
Comprehensive testing across Chrome, Firefox, Safari, and mobile browsers ensures consistent functionality.

## 🚀 Deployment

The application is optimized for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- Any static hosting service supporting Node.js

### Environment Variables
No environment variables required - the app uses the public Rick and Morty API.

## 📈 Performance Metrics

Expected performance characteristics:
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Core Web Vitals**: All green
- **Lighthouse Score**: 90+ across all categories

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using the Rick and Morty API • Next.js • React Query • TypeScript**