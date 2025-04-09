import type { Metadata } from "next"
import "./globals.css"
import { Open_Sans } from "next/font/google"
import Navbar from "@/components/navbar/Navbar"
import Footer from "@/components/footer/Footer"
import { CartProvider } from "@/context/CartContext"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Lozach",
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
    "eccommerce",
    "lozach avellaneda",
    "lozach flores",
    "tienda de ropa",
    "tienda de ropa online",
  ],
  icons: [
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon.ico",
    },
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
    <html lang="en">
      <body className={`${open_sans.className} antialiased`}>
        <CartProvider>
          <Toaster richColors duration={4000} position="top-right" />
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
