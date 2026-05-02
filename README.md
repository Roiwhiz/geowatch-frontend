# GeoWatch Frontend

GeoWatch is a sophisticated AI-powered geopolitical analysis platform. It provides users with deep insights into global events using established international relations frameworks such as Realism, Liberalism, Constructivism, and Political Economy.

The platform enables users to engage in analytical conversations with an AI assistant, generating comprehensive reports with structured outputs including BLUF (Bottom Line Up Front), background analysis, current situations, and implications.

## 🚀 Key Features

- **AI-Driven Geopolitical Analysis**: Leverage multiple analytical frameworks to understand global events.
- **Structured Report Generation**: Automatic generation of professional reports with detailed sections.
- **Interactive Chat Interface**: A seamless session-based chat experience for exploring complex topics.
- **Internationalization (i18n)**: Full support for multiple languages including Arabic (RTL), German, English, Spanish, French, and Chinese.
- **Responsive Design**: Optimized for both desktop and mobile devices with a clean, modern UI.
- **User Identification**: Secure email-based identification system.
- **Real-time Data Visualization**: Integrated charts and data representation for analytical reports.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (based on [Radix UI](https://www.radix-ui.com/))
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) & [TanStack Query v5](https://tanstack.com/query/latest)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 📦 Project Structure

```text
├── app/                  # Next.js App Router (Localized routes)
├── components/           # React components
│   ├── ui/               # Reusable Shadcn UI primitives
│   └── ...               # Feature-specific components
├── hooks/                # Custom React hooks
├── i18n/                 # Internationalization configuration
├── lib/                  # Core logic and utilities
│   ├── services/         # API clients and business logic
│   ├── stores/           # Zustand state stores
│   └── validators/       # Zod schemas for data validation
├── messages/             # Translation JSON files (EN, AR, DE, etc.)
├── providers/            # React context providers (Query, Theme)
└── public/               # Static assets
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+ 
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd geowatch-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_BACKEND_URL=your_backend_api_url
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌍 Internationalization

This project uses `next-intl` for multi-language support. 
- Translations are located in the `messages/` directory.
- Routing is handled via the `[locale]` dynamic segment.
- Supported languages: English (en), Arabic (ar), German (de), Spanish (es), French (fr), Chinese (zh).

## 📄 License

This project is private and confidential.
