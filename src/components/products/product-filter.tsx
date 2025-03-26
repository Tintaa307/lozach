"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
}

export function ProductFilters({ onClose }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 300])
  const [filterSize, setFilterSize] = useState("")
  const [filterColor, setFilterColor] = useState("")

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const colors = [
    { name: "Vacio", value: "transparent" },
    { name: "Negro", value: "black" },
    { name: "Blanco", value: "white" },
    { name: "Gris", value: "gray" },
    { name: "Azul", value: "blue" },
    { name: "Rojo", value: "red" },
    { name: "Verde", value: "green" },
  ]
  const categories = [
    "Camisetas",
    "Sudaderas",
    "Pantalones",
    "Chaquetas",
    "Accesorios",
    "Calzado",
  ]

  return (
    <div className="space-y-1">
      <FilterSection title="Categoría">
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={`category-${category}`} />
              <label
                htmlFor={`category-${category}`}
                className="text-sm font-normal text-zinc-700 cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Precio">
        <div className="space-y-4">
          <Slider
            defaultValue={priceRange}
            min={0}
            max={300}
            step={5}
            onValueChange={(value) => setPriceRange(value as number[])}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-700">{priceRange[0]}€</span>
            <span className="text-sm text-zinc-700">{priceRange[1]}€</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Talla">
        <div className="grid grid-cols-3 gap-2">
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
                style={{ backgroundColor: color.value }}
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

      <FilterSection title="Ofertas" defaultOpen={false}>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="sale-items" />
            <label
              htmlFor="sale-items"
              className="text-sm font-normal text-zinc-700 cursor-pointer"
            >
              Productos en oferta
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="new-arrivals" />
            <label
              htmlFor="new-arrivals"
              className="text-sm font-normal text-zinc-700 cursor-pointer"
            >
              Novedades
            </label>
          </div>
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
