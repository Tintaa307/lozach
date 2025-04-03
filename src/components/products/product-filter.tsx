"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Product } from "@/types/types"
import { Label } from "../ui/label"

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="py-4 border-b border-zinc-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-sm font-medium text-zinc-900"
      >
        {title}
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-zinc-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        )}
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  )
}

interface ProductFiltersProps {
  onClose?: () => void
  products: Product[]
  setProducts: (products: Product[]) => void
}

export function ProductFilters({
  onClose,
  products,
  setProducts,
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 30500])
  const [filterSize, setFilterSize] = useState("")
  const [filterColor, setFilterColor] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  const sizes = ["S", "M", "L", "XL", "XXL"]

  const childSizes = ["6", "8", "10", "12", "14", "16", "18"]

  const adultSizes = ["28", "30", "32", "34", "36", "38"]

  const colors = [
    { name: "Vacio", value: "transparent", color: "transparent" },
    { name: "Negro", value: "negro", color: "black" },
    { name: "Blanco", value: "blanco", color: "" },
    { name: "Gris", value: "gris", color: "gray" },
    { name: "Azul", value: "azul", color: "blue" },
    { name: "Rojo", value: "rojo", color: "red" },
    { name: "Verde", value: "verde", color: "green" },
    { name: "Celeste", value: "celeste", color: "#09e0c6" },
    { name: "Beige", value: "beige", color: "beige" },
    { name: "Chocolate", value: "chocolate", color: "#663401" },
    { name: "Tostado", value: "tostado", color: "#cb5916" },
  ]
  const categories = ["Todas", "Niños", "Adultos"]

  useEffect(() => {
    // Copiamos el array original para ir filtrando
    let filtered = [...products]

    // 1) Filtrar por categoría (adult/child), asumiendo:
    //    "Niños" -> product.category === "child"
    //    "Adultos" -> product.category === "adult"
    //    "Todas" -> no filtra
    if (filterCategory !== "Todas") {
      if (filterCategory === "Niños") {
        filtered = filtered.filter((p) => p.category === "child")
      } else if (filterCategory === "Adultos") {
        filtered = filtered.filter((p) => p.category === "adult")
      }
    }

    // 2) Filtrar por color, solo si se seleccionó uno distinto de "transparent"
    if (filterColor && filterColor !== "transparent") {
      filtered = filtered.filter((p) => p.color.includes(filterColor))
    }

    // 3) Filtrar por talle, si se han seleccionado talles
    //    (ej: ["S", "M"] o ["28", "30"] dependiendo si es adulto o niño)
    if (filterSize.length > 0) {
      filtered = filtered.filter((p) =>
        // Verificamos si al menos uno de los talles del producto
        // está en el array de talles seleccionados
        p.size.talles.some((talle) => filterSize.includes(talle.toUpperCase()))
      )
    }

    // 4) Filtrar por rango de precio
    const [minPrice, maxPrice] = priceRange
    filtered = filtered.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    )

    setProducts(filtered)
  }, [products, filterCategory, filterColor, filterSize, priceRange])

  return (
    <div className="space-y-1">
      <FilterSection title="Categoría">
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`${category}`}
                checked={filterCategory === category}
                onCheckedChange={(checked) =>
                  setFilterCategory(checked ? category : "")
                }
              />
              <Label
                htmlFor={`${category}`}
                className="text-sm font-normal text-zinc-700 cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Precio">
        <div className="space-y-4">
          <Slider
            defaultValue={priceRange}
            min={0}
            max={30500}
            step={5}
            onValueChange={(value) => setPriceRange(value as number[])}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-700">{priceRange[0]}$</span>
            <span className="text-sm text-zinc-700">{priceRange[1]}$</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Talla (adultos)">
        <div className="grid grid-cols-3 gap-2">
          {/* Botón para quitar el filtro de talle */}
          <Button
            variant={"outline"}
            onClick={() => setFilterSize("")}
            className={cn(
              "flex h-8 items-center justify-center rounded-md border border-zinc-200 text-sm cursor-pointer hover:border-zinc-400",
              filterSize === "" && "bg-black text-white border-none"
            )}
          >
            Todas
          </Button>
          {sizes.map((size) => (
            <Button
              key={size}
              variant={"outline"}
              onClick={() => setFilterSize(size)}
              className={cn(
                "flex h-8 items-center justify-center rounded-md border border-zinc-200 text-sm cursor-pointer hover:border-zinc-400",
                filterSize === size && "bg-black text-white border-none"
              )}
            >
              {size}
            </Button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Talla (adultos)">
        <div className="grid grid-cols-3 gap-2">
          {adultSizes.map((size) => (
            <Button
              key={size}
              variant={"outline"}
              onClick={() => setFilterSize(size)}
              className={cn(
                "flex h-8 items-center justify-center rounded-md border border-zinc-200 text-sm cursor-pointer hover:border-zinc-400",
                filterSize === size && "bg-black text-white border-none"
              )}
            >
              {size}
            </Button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Talla (niños)">
        <div className="grid grid-cols-3 gap-2">
          {/* Botón para quitar el filtro de talle */}
          <Button
            variant={"outline"}
            onClick={() => setFilterSize("")}
            className={cn(
              "flex h-8 items-center justify-center rounded-md border border-zinc-200 text-sm cursor-pointer hover:border-zinc-400",
              filterSize === "" && "bg-black text-white border-none"
            )}
          >
            Todas
          </Button>
          {childSizes.map((size) => (
            <Button
              key={size}
              variant={"outline"}
              onClick={() => setFilterSize(size)}
              className={cn(
                "flex h-8 items-center justify-center rounded-md border border-zinc-200 text-sm cursor-pointer hover:border-zinc-400",
                filterSize === size && "bg-black text-white border-none"
              )}
            >
              {size}
            </Button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div key={color.name} className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size={"icon"}
                onClick={() => setFilterColor(color.value)}
                className={cn(
                  "relative h-6 w-6 rounded-full border border-zinc-200 cursor-pointer",
                  {
                    "border-black": filterColor === color.value,
                  }
                )}
                style={{
                  backgroundColor: color.color,
                }}
              >
                {color.value === "transparent" && (
                  <div className="w-full h-[1px] bg-black/40 rotate-45" />
                )}
              </Button>
              <span
                className={cn("text-xs text-zinc-600", {
                  "font-medium text-black": filterColor === color.value,
                })}
              >
                {color.name}
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      {onClose && (
        <div className="pt-6 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1 bg-black hover:bg-zinc-800 text-white">
            Aplicar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
