import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Open_Sans } from "next/font/google"
import NavbarServer from "@/components/navbar/NavbarServer"
import Footer from "@/components/footer/Footer"
import { CartProvider } from "@/context/CartContext"
import { Toaster } from "sonner"
import WhatsappButton from "@/components/whatsapp-button/whatsapp-button"

export const metadata: Metadata = {
  title: {
    default:
      "Lozach - Tu estilo dice quién sos | Ropa de Mujer, Hombre y Niños",
    template: "%s | Lozach",
  },
  description:
    "Lozach - Tu estilo dice quién sos. Nosotros vamos con vos. Somos una marca de ropa que acompaña tu libertad. Estamos en Avellaneda y Flores, Buenos Aires. Te ofrecemos ropa de mujer, hombre y niños. Comprá online y encontrá las últimas tendencias en moda.",
  keywords: [
    "Lozach",
    "ropa",
    "moda",
    "estilo",
    "libertad",
    "tendencias",
    "comprar ropa",
    "avellaneda",
    "ropa de mujer",
    "ropa de hombre",
    "ropa de niños",
    "flores",
    "ropa de verano",
    "ropa de invierno",
    "lozach",
    "lozach ropa",
    "lozach moda",
    "lozach estilo",
    "ecommerce",
    "lozach avellaneda",
    "lozach flores",
    "tienda de ropa",
    "tienda de ropa online",
    "moda argentina",
    "ropa argentina",
    "tendencias moda",
    "outfit",
    "look",
    "fashion",
    "clothing",
    "apparel",
    "buenos aires",
    "argentina",
  ],
  authors: [{ name: "Lozach" }],
  creator: "Lozach",
  publisher: "Lozach",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://lozachurban.store"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://lozachurban.store",
    siteName: "Lozach",
    title: "Lozach - Tu estilo dice quién sos | Ropa de Mujer, Hombre y Niños",
    description:
      "Lozach - Tu estilo dice quién sos. Nosotros vamos con vos. Somos una marca de ropa que acompaña tu libertad. Estamos en Avellaneda y Flores, Buenos Aires.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lozach - Tu estilo dice quién sos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lozach - Tu estilo dice quién sos | Ropa de Mujer, Hombre y Niños",
    description:
      "Lozach - Tu estilo dice quién sos. Nosotros vamos con vos. Somos una marca de ropa que acompaña tu libertad.",
    images: ["/twitter-image.jpg"],
    creator: "@lozach",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "fashion",
  classification: "Fashion & Apparel",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon.ico",
    },
  ],
  manifest: "/site.webmanifest",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

const open_sans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" dir="ltr">
      <head>
        <meta name="geo.region" content="AR-C" />
        <meta name="geo.placename" content="Buenos Aires" />
        <meta name="geo.position" content="-34.6037;-58.3816" />
        <meta name="ICBM" content="-34.6037, -58.3816" />
        <meta name="DC.title" content="Lozach - Tu estilo dice quién sos" />
        <meta name="DC.creator" content="Lozach" />
        <meta name="DC.subject" content="Fashion, Clothing, Apparel" />
        <meta
          name="DC.description"
          content="Lozach - Tu estilo dice quién sos. Nosotros vamos con vos. Somos una marca de ropa que acompaña tu libertad."
        />
        <meta name="DC.publisher" content="Lozach" />
        <meta name="DC.contributor" content="Lozach" />
        <meta name="DC.date" content="2024" />
        <meta name="DC.type" content="Text" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.identifier" content="https://lozachurban.store" />
        <meta name="DC.language" content="es" />
        <meta name="DC.rights" content="Copyright Lozach" />
        <meta name="DC.coverage" content="Argentina" />
        <meta name="DC.audience" content="General" />
        <meta name="DC.provenance" content="Lozach" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className={`${open_sans.className} antialiased`}>
        <CartProvider>
          <Toaster richColors duration={4000} position="top-right" />
          <NavbarServer />
          {children}
          <WhatsappButton />
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
