"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  User,
  ChevronDown,
  MapPin,
  MenuIcon,
  X,
  Settings,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { CartSheet } from "../cart/Cart"
import { usePathname, useRouter } from "next/navigation"
import { SearchResults } from "./search-results"
import { PublicUser } from "@/types/auth/types"

interface NavbarClientProps {
  user: PublicUser | null
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const pathname = usePathname()

  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest("input") && !target.closest(".search-results")) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleMouseEnter = (dropdown: string) => {
    setActiveDropdown(dropdown)
  }

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

  if (pathname.includes("/dashboard")) {
    return null
  }

  return (
    <TooltipProvider>
      <header className="fixed w-full top-0 left-0 bg-white z-40 shadow-md">
        {/* Main Navbar */}
        <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-auto md:hidden hover:bg-transparent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("tienda")}
              >
                <Button
                  variant="ghost"
                  className="flex items-center text-sm font-medium p-0 h-auto hover:bg-transparent"
                >
                  TIENDA{" "}
                  <ChevronDown
                    className={cn(
                      "ml-1 h-4 w-4 transition-transform duration-200",
                      activeDropdown === "tienda" && "rotate-180"
                    )}
                  />
                </Button>
              </div>
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("ubicacion")}
              >
                <Button
                  variant="ghost"
                  className="flex items-center text-sm font-medium p-0 h-auto hover:bg-transparent"
                >
                  UBICACIÓN{" "}
                  <ChevronDown
                    className={cn(
                      "ml-1 h-4 w-4 transition-transform duration-200",
                      activeDropdown === "ubicacion" && "rotate-180"
                    )}
                  />
                </Button>
              </div>
            </div>

            {/* Logo - centered on desktop, left-aligned on mobile */}
            <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 translate-x-4">
              <Link href="/" className="text-2xl font-script">
                <Image
                  src={"/logo-small.png"}
                  alt="Lozach"
                  width={100}
                  height={50}
                />
              </Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div
                className="relative hidden md:block"
                onMouseEnter={() => handleMouseEnter("search")}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-auto hover:bg-gray-400/20 flex items-center justify-center p-2"
                    >
                      <Search className="h-6 w-6 md:h-7 md:w-7" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Buscar productos</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      router.push("/profile")
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-auto flex items-center justify-center p-[6px] cursor-pointer max-md:p-[9px] max-sm:p-[10px]"
                  >
                    <User className="h-6 w-6 md:h-7 md:w-7" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mi perfil</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CartSheet />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mi carrito</p>
                </TooltipContent>
              </Tooltip>
              {user && user.role === "admin" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        router.push("/dashboard")
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-auto flex items-center justify-center p-[6px] cursor-pointer max-md:p-[9px] max-sm:p-[10px]"
                    >
                      <Layers className="h-6 w-6 md:h-7 md:w-7" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Panel de Administración</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out pt-20 px-6",
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 hover:bg-transparent"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="flex flex-col space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-medium mb-3">TIENDA</h3>
              <div className="flex flex-col space-y-4 pl-2">
                {/* <Link
                href="/outlet"
                className="text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                OUTLET
              </Link> */}
                <Link
                  href="/#best-sellers"
                  className="text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  BEST SELLERS
                </Link>
                <Link
                  href="/#author"
                  className="text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  RECOMENDACIÓN DE AUTOR
                </Link>
                <Link
                  href="/products"
                  className="text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  VER TODO
                </Link>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-medium mb-3">UBICACIÓN</h3>
              <div className="flex items-center pl-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">ARGERICH 562</span>
              </div>
              <Link
                href="/#footer"
                className="text-sm text-gray-500 pl-8"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ver ubicación
              </Link>
            </div>

            <div className="pb-4">
              <div className="relative w-full">
                <div className="flex items-center border-b border-gray-200 pb-2">
                  <Search className="h-5 w-5 mr-2 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Buscar productos..."
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-0 p-0"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSearchResults(e.target.value.trim() !== "")
                    }}
                    onFocus={() => {
                      if (searchQuery.trim() !== "") {
                        setShowSearchResults(true)
                      }
                    }}
                  />
                </div>
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-50 search-results">
                    <SearchResults
                      searchQuery={searchQuery}
                      onClose={() => {
                        setShowSearchResults(false)
                        setMobileMenuOpen(false)
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Admin Section - Mobile only */}
            {user && user.role === "admin" && (
              <div className="border-b pb-4">
                <h3 className="font-medium mb-3">ADMINISTRACIÓN</h3>
                <div className="flex flex-col space-y-4 pl-2">
                  <Link
                    href="/dashboard"
                    className="text-sm flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Panel de Administración
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tienda Dropdown - Desktop only */}
        <div
          className={cn(
            "absolute left-0 right-0 bg-gray-50 border-b border-gray-200 px-6 py-3 z-50 transform transition-all duration-300 ease-in-out hidden md:block",
            activeDropdown === "tienda"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          )}
          onMouseEnter={() => handleMouseEnter("tienda")}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* <Button
              variant="link"
              asChild
              className="text-sm font-medium p-0 h-auto"
            >
              <Link href="/outlet">OUTLET</Link>
            </Button> */}
              <Button
                variant="link"
                asChild
                className="text-sm font-medium p-0 h-auto"
              >
                <Link href="/#best-sellers">BEST SELLERS</Link>
              </Button>
              <Button
                variant="link"
                asChild
                className="text-sm font-medium p-0 h-auto"
              >
                <Link href="/#author">RECOMENDACIÓN DE AUTOR</Link>
              </Button>
              <Button
                variant="link"
                asChild
                className="text-sm font-medium p-0 h-auto"
              >
                <Link href="/products">VER TODO</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Ubicacion Dropdown - Desktop only */}
        <div
          className={cn(
            "absolute left-0 right-0 bg-gray-50 text-black px-6 py-3 z-50 transform transition-all duration-300 ease-in-out hidden md:block",
            activeDropdown === "ubicacion"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          )}
          onMouseEnter={() => handleMouseEnter("ubicacion")}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center justify-center">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="font-medium">ARGERICH 562</span>
            <Link href={"/#footer"}>
              <Button
                variant="link"
                className="ml-2 text-sm text-muted-foreground p-0 h-auto"
              >
                Ver ubicación
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Dropdown - Desktop only */}
        <div
          className={cn(
            "absolute left-0 right-0 bg-white border-b border-gray-200 px-6 py-3 z-50 transform transition-all duration-300 ease-in-out hidden md:block",
            activeDropdown === "search"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          )}
          onMouseEnter={() => handleMouseEnter("search")}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center flex-1 relative">
              <Search className="h-5 w-5 mr-2 text-gray-500" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                className=""
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSearchResults(e.target.value.trim() !== "")
                }}
                onFocus={() => {
                  if (searchQuery.trim() !== "") {
                    setShowSearchResults(true)
                  }
                }}
              />
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 search-results">
                  <SearchResults
                    searchQuery={searchQuery}
                    onClose={() => {
                      setShowSearchResults(false)
                      setMobileMenuOpen(false)
                    }}
                    isDesktop={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <FilterPanel open={isFilterOpen} onOpenChange={setIsFilterOpen} /> */}
      </header>
    </TooltipProvider>
  )
}
