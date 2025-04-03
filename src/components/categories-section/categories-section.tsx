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
      title: "ADULTOS",
      href: "/products",
      image: "/categories/adults.jpg?height=600&width=500",
    },
    {
      title: "NIÑOS",
      href: "/products",
      image: "/categories/childs.jpg?height=600&width=500",
    },
  ]

  // Category links
  const categoryLinks: CategoryLink[] = [
    {
      title: "CAMISAS",
      href: "/products",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      title: "REMERAS",
      href: "/products",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      title: "BUZOS",
      href: "/products",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      title: "PANTALONES",
      href: "/products",
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
            className="relative overflow-hidden group z-10"
          >
            <div className="absolute w-full h-full bg-black/40 z-20" />
            <div className="relative aspect-[5/6]">
              <Image
                src={banner.image || "/placeholder.svg"}
                alt={banner.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-3xl font-medium tracking-wider z-20">
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
