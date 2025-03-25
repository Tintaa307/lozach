"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

interface FilterOption {
  id: string
  label: string
}

interface FilterSection {
  title: string
  options: FilterOption[]
}

const filterSections: FilterSection[] = [
  {
    title: "TIPO DE PRENDA",
    options: [
      { id: "remera", label: "REMERA" },
      { id: "buzo", label: "BUZO" },
      { id: "jean", label: "JEAN" },
      { id: "chomba", label: "CHOMBA" },
      { id: "campera", label: "CAMPERA" },
      { id: "joggin", label: "JOGGIN" },
    ],
  },
  {
    title: "TAMAÑO",
    options: [
      { id: "adulto", label: "ADULTO" },
      { id: "nino", label: "NIÑO" },
    ],
  },
  {
    title: "COLOR",
    options: [
      { id: "amarillo", label: "AMARILLO" },
      { id: "gris", label: "GRIS" },
      { id: "negro", label: "NEGRO" },
      { id: "azul", label: "AZUL" },
      { id: "jean", label: "JEAN" },
      { id: "rojo", label: "ROJO" },
      { id: "blanco", label: "BLANCO" },
      { id: "marron", label: "MARRÓN" },
      { id: "verde", label: "VERDE" },
      { id: "celeste", label: "CELESTE" },
      { id: "natural", label: "NATURAL" },
      { id: "violeta", label: "VIOLETA" },
    ],
  },
]

interface FilterPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FilterPanel({ open, onOpenChange }: FilterPanelProps) {
  const [selectedFilters, setSelectedFilters] = React.useState<Set<string>>(
    new Set()
  )

  const handleCheckboxChange = (id: string) => {
    const newSelected = new Set(selectedFilters)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedFilters(newSelected)
  }

  const handleClearFilters = () => {
    setSelectedFilters(new Set())
  }

  const handleConfirmFilters = () => {
    // Here you would typically handle the filter application
    console.log("Applied filters:", Array.from(selectedFilters))
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader className="p-6">
          <SheetTitle className="text-left text-lg font-medium">
            FILTRAR
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-6 p-6">
            {filterSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="font-medium text-sm">{section.title}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {section.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={option.id}
                        checked={selectedFilters.has(option.id)}
                        onCheckedChange={() => handleCheckboxChange(option.id)}
                      />
                      <label
                        htmlFor={option.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 space-y-2 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearFilters}
          >
            LIMPIAR
          </Button>
          <Button className="w-full" onClick={handleConfirmFilters}>
            CONFIRMAR FILTROS
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
