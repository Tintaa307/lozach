import Link from "next/link"
import { MapPin, Search, User, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="max-w-full mx-auto px-4 py-12">
        <div className="flex flex-row justify-evenly items-start gap-8">
          {/* Logo */}
          <div className="w-1/4 h-[20vh] flex items-center justify-center">
            <Link href="/" className="text-4xl font-script ">
              <Image
                src={"/logo-big.png"}
                alt="Lozach"
                width={300}
                height={100}
              />
            </Link>
          </div>

          <div className="w-1/4 space-y-4 flex flex-col items-center">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Explorar</h3>
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
          </div>

          {/* Cuenta */}
          <div className="w-1/4 space-y-4 flex flex-col items-center">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Cuenta</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/buscar"
                    className="flex items-center hover:underline"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/perfil"
                    className="flex items-center hover:underline"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/carrito"
                    className="flex items-center hover:underline"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Carrito
                  </Link>
                </li>
                <li>
                  <Link
                    href="/carrito"
                    className="flex items-center hover:underline"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Favoritos
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Ubicación */}
          <div className="w-1/4 space-y-4 flex items-center justify-center flex-col">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Ubicación</h3>
              <div className="bg-gray-200 h-32 w-56 relative flex items-center justify-center">
                <MapPin className="w-6 h-6 text-gray-500" />
              </div>
              <p className="flex items-center font-medium text-sm">
                <MapPin className="w-4 h-4 mr-1" /> Argerich 562
              </p>
            </div>
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
