import Image from "next/image"
import Link from "next/link"

interface CategoryLink {
  title: string
  href: string
  image: string
}

export default function CatagoriesSection() {
  // Main banners
  const mainBanners = [
    {
      title: "SALE",
      href: "/sale",
      image: "/placeholder.svg?height=600&width=500",
    },
    {
      title: "WOMEN",
      href: "/women",
      image: "/placeholder.svg?height=600&width=500",
    },
  ]

  // Category links
  const categoryLinks: CategoryLink[] = [
    {
      title: "CAMISAS",
      href: "/category/camisas",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      title: "REMERAS",
      href: "/category/remeras",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      title: "BUZOS",
      href: "/category/buzos",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      title: "PANTALONES",
      href: "/category/pantalones",
      image: "/placeholder.svg?height=400&width=300",
    },
  ]

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 py-8">
      {/* Main Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {mainBanners.map((banner, index) => (
          <Link
            key={index}
            href={banner.href}
            className="relative overflow-hidden group"
          >
            <div className="relative aspect-[5/6] bg-[#c2bcb2]">
              <Image
                src={banner.image || "/placeholder.svg"}
                alt={banner.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-3xl font-medium tracking-wider">
                  {banner.title}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Category Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categoryLinks.map((category, index) => (
          <Link
            key={index}
            href={category.href}
            className="relative overflow-hidden group"
          >
            <div className="relative aspect-square bg-[#c2bcb2]">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl font-medium tracking-wider">
                  {category.title}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
