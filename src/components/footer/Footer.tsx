"use client"

import Link from "next/link"
import { MapPin, User, Heart, Clock } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()

  if (pathname.includes("/dashboard")) {
    return null
  }

  return (
    <footer id="footer" className="border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="flex flex-col justify-center items-start">
            <Link href="/" className="text-4xl font-script mb-3">
              <Image
                src={"/logo-big.png"}
                alt="Lozach"
                width={200}
                height={70}
                className="w-auto h-auto max-h-20"
              />
            </Link>
            <div className="flex space-x-4 mt-2">
              <Link
                href="https://www.instagram.com/lozachurban?igsh=cGFueDAzZHA4ZXVy"
                aria-label="Instagram"
                className="text-gray-800 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Explorar */}
          <div className="text-left">
            <h3 className="font-semibold text-lg mb-4">Explorar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#best-sellers" className="hover:underline">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/#author" className="hover:underline">
                  Recomendación de Autor
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:underline">
                  Ver Todo
                </Link>
              </li>
            </ul>
          </div>

          {/* Cuenta */}
          <div className="text-left">
            <h3 className="font-semibold text-lg mb-4">Cuenta</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/profile"
                  className="flex items-center hover:underline justify-start"
                >
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="flex items-center hover:underline justify-start"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Visto recientemete
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="flex items-center hover:underline justify-start"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favoritos
                </Link>
              </li>
            </ul>
          </div>

          {/* Ubicación */}
          <div className="flex flex-col items-start">
            <h3 className="font-semibold text-lg mb-4">Ubicación</h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6566.057445050533!2d-58.47669852078514!3d-34.62871444477839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc98d774c1ad1%3A0x14653ade07d7efe4!2sArgerich%20562%2C%20C1407%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1744227626139!5m2!1ses!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="A&S Cleaning Solutions Location"
              />
            </div>
            <p className="flex items-center font-medium text-sm mt-2">
              <MapPin className="w-4 h-4 mr-2" />
              Argerich 562
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          Desarrollado por{" "}
          <Link
            href="https://synera.com.ar"
            className="hover:underline text-blue-500"
          >
            Synera
          </Link>
        </div>
      </div>
    </footer>
  )
}
