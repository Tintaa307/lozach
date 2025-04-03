import Link from "next/link"
import { MapPin, Search, User, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="flex justify-start items-center">
            <Link href="/" className="text-4xl font-script">
              <Image
                src={"/logo-big.png"}
                alt="Lozach"
                width={200}
                height={70}
                className="w-auto h-auto max-h-20"
              />
            </Link>
          </div>

          {/* Explorar */}
          <div className="text-left">
            <h3 className="font-semibold text-lg mb-4">Explorar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/outlet" className="hover:underline">
                  Outlet
                </Link>
              </li>
              <li>
                <Link href="/bestsellers" className="hover:underline">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/recomendacion-autor" className="hover:underline">
                  Recomendación de Autor
                </Link>
              </li>
              <li>
                <Link href="/ver-todo" className="hover:underline">
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
                  href="/buscar"
                  className="flex items-center hover:underline justify-start"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Link>
              </li>
              <li>
                <Link
                  href="/perfil"
                  className="flex items-center hover:underline justify-start"
                >
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </Link>
              </li>
              <li>
                <Link
                  href="/carrito"
                  className="flex items-center hover:underline justify-start"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Carrito
                </Link>
              </li>
              <li>
                <Link
                  href="/favoritos"
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
            <div className="bg-gray-200 w-full max-w-[250px] aspect-video relative flex items-center justify-center mb-3">
              <MapPin className="w-6 h-6 text-gray-500" />
            </div>
            <p className="flex items-center font-medium text-sm">
              <MapPin className="w-4 h-4 mr-1" /> Argerich 562
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
