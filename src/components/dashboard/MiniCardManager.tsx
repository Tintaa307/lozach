"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"

interface MiniCardProps {
  items: string[]
  onAdd: (item: string) => void
  onRemove: (index: number) => void
  placeholder: string
  label: string
  addButtonText: string
}

export function MiniCardManager({
  items,
  onAdd,
  onRemove,
  placeholder,
  label,
  addButtonText,
}: MiniCardProps) {
  const [newItem, setNewItem] = useState("")

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem.trim())
      setNewItem("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {/* Input and Add Button */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!newItem.trim()}
          className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Plus className="h-4 w-4 mr-2" />
          {addButtonText}
        </Button>
      </div>

      {/* Mini Cards */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {items.map((item, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="group px-3 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 hover:from-primary/20 hover:to-primary/10 transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              <span className="mr-2">{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="h-5 w-5 p-0 hover:bg-destructive/20 hover:text-destructive rounded-full transition-all duration-200 hover:scale-110 opacity-70 group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
