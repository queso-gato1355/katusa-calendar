"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function PaginationControls({
  pagination,
  onPageChange,
  onPerPageChange,
  theme = "light",
  perPageOptions = [5, 10, 20, 50],
  getDisplayRange,
  getTotalPages,
}) {
  const totalPages = getTotalPages()

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-muted-foreground">{getDisplayRange()}</div>

      <div className="flex items-center gap-2">
        <div className="flex items-center mr-4">
          <Label htmlFor="perPage" className="mr-2">
            페이지당 항목:
          </Label>
          <select
            id="perPage"
            value={pagination.perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="h-8 w-16 rounded-md border border-input bg-background px-2"
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={pagination.page === 1}
            className={theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="flex items-center px-2 text-sm">
            {pagination.page} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={pagination.page >= totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
