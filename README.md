# ✈️ Sky Scanner

A modern flight search application built with Next.js 16, featuring real-time flight data from the Duffel API.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)

## Features

- 🔍 **Real-time Flight Search** - Search flights using the Duffel API
- 📅 **Date Price Calendar** - View prices across different dates
- 🎯 **Advanced Filters** - Filter by stops, airlines, departure time, and duration
- 💰 **Price Caching** - Smart caching for consistent price display
- 🌐 **Currency Conversion** - Automatic conversion to INR
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Flight Data**: [Duffel API](https://duffel.com/)
- **Database**: Prisma (optional)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Duffel API key ([Get one here](https://duffel.com/))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Krishna3451/sky-scanner.git
   cd sky-scanner-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file and add your Duffel API key:
   ```env
   DUFFEL_ACCESS_TOKEN=your_duffel_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── actions/          # Server actions for API calls
├── app/              # Next.js App Router pages
│   ├── flights/      # Flight search results page
│   └── page.tsx      # Landing page
├── components/       # Reusable UI components
│   ├── results/      # Flight results components
│   └── search/       # Search form components
├── data/             # Mock data for development
├── lib/              # Utility libraries (Duffel client)
└── services/         # Business logic and API services
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DUFFEL_ACCESS_TOKEN` | Your Duffel API access token | Yes |

## Deployment

Deploy easily on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js)

## License

This project is private and not open for distribution.
