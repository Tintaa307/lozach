import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center flex-col">
      {/* Hero Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero/hero.jpg"
          alt="Hero background"
          fill
          className="object-fill object-center"
          priority
        />
        {/* Overlay to darken the image slightly */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/60 to-white"
          aria-hidden="true"
        />
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight">
            Tu estilo dice quién sos. Nosotros vamos{" "}
            <span className="font-black italic block sm:inline mt-2 sm:mt-0">
              con vos.
            </span>
          </h1>
          <p className="text-base font-medium sm:text-lg md:text-xl text-black mb-6 sm:mb-8 md:mb-10">
            En Lozach, queremos acompañarte, se vive y se siente tu libertad.
          </p>
          <Link href={"/products"}>
            <Button variant={"default"} size={"lg"} className="h-11 py-6 group">
              Comprar ahora
              <ArrowRight
                size={24}
                className="ml-2 group-hover:translate-x-1 transition-transform duration-150"
              />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
