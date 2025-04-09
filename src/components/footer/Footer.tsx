import Link from "next/link"
import { MapPin, User, Heart, Clock } from "lucide-react"
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
                  href="/carrito"
                  className="flex items-center hover:underline justify-start"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Visto recientemete
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
