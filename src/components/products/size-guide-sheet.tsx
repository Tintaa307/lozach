"use client"

import { Ruler } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SizeGuide } from "@/types/size-guides/types"

interface SizeGuideSheetProps {
  guide: SizeGuide
}

export function SizeGuideSheet({ guide }: SizeGuideSheetProps) {
  const hasContent = guide.headers.length > 0 && guide.rows.length > 0

  if (!hasContent) {
    return null
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs font-medium text-gray-700 underline-offset-4 hover:underline"
        >
          <Ruler className="mr-1 h-3.5 w-3.5" />
          Guía de talles
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle>{guide.name}</SheetTitle>
          {guide.description ? (
            <SheetDescription>{guide.description}</SheetDescription>
          ) : (
            <SheetDescription>
              Medidas de referencia para elegir tu talle.
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {guide.headers.map((header, index) => (
                  <TableHead key={index} className="text-foreground">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {guide.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {guide.headers.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      {row[colIndex] ?? ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {guide.note && (
          <p className="mt-4 text-xs text-muted-foreground">{guide.note}</p>
        )}
      </SheetContent>
    </Sheet>
  )
}
