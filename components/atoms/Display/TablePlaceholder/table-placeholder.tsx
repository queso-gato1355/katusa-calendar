"use client"

import React from "react"
import { useLanguage } from "@/components/providers/language-provider"

interface TablePlaceholderProps {
  rows?: number
  columns?: number
  headers?: string[]
  showActions?: boolean
  showCheckbox?: boolean
  className?: string
}

// 미리 정의된 너비 값들 (hydration 문제 방지)
const PLACEHOLDER_WIDTHS = [75, 85, 65, 90, 70, 80, 95, 60, 85, 75, 80, 65, 90, 70, 85]

/**
 * 테이블 로딩 상태를 위한 skeleton placeholder 컴포넌트
 */
export function TablePlaceholder({ 
  rows = 5,
  columns = 4,
  headers = [],
  showActions = true,
  showCheckbox = false,
  className = ""
}: TablePlaceholderProps) {
  const { isChangingLanguage } = useLanguage()

  const actualColumns = showCheckbox ? columns + 1 : columns
  const actualHeaders = showCheckbox ? ["", ...headers] : headers

  // 너비 값을 배열에서 순차적으로 선택하는 함수
  const getWidth = (rowIndex: number, colIndex: number) => {
    const index = (rowIndex * columns + colIndex) % PLACEHOLDER_WIDTHS.length
    return PLACEHOLDER_WIDTHS[index]
  }

  return (
    <div className={`w-full overflow-hidden rounded-lg border border-inherit ${className}`}>
      <table className="w-full">
        {/* Header */}
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {Array.from({ length: actualColumns }).map((_, index) => (
              <th key={index} className="px-4 py-3">
                {actualHeaders[index] ? (
                  <div className="text-left text-sm font-medium">
                    {isChangingLanguage ? (
                      <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                    ) : (
                      actualHeaders[index]
                    )}
                  </div>
                ) : (
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                )}
              </th>
            ))}
            {showActions && (
              <th className="px-4 py-3 text-right">
                <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse ml-auto"></div>
              </th>
            )}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-inherit">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {showCheckbox && (
                <td className="px-4 py-3">
                  <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </td>
              )}
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <div 
                    className="h-4 bg-gray-300 dark:bg-gray-600 rounded"
                    style={{ 
                      width: `${getWidth(rowIndex, colIndex)}%`,
                      animationDelay: `${(rowIndex * columns + colIndex) * 0.1}s`
                    }}
                  ></div>
                </td>
              ))}
              {showActions && (
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {Array.from({ length: 2 }).map((_, actionIndex) => (
                      <div 
                        key={actionIndex}
                        className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"
                        style={{ animationDelay: `${(rowIndex * 2 + actionIndex) * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * 간단한 테이블 행 placeholder
 */
export function TableRowPlaceholder({ columns = 4, showActions = true }: { columns?: number, showActions?: boolean }) {
  // 단일 행에 대한 너비 값 선택 함수
  const getRowWidth = (colIndex: number) => {
    const index = colIndex % PLACEHOLDER_WIDTHS.length
    return PLACEHOLDER_WIDTHS[index]
  }

  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <div 
            className="h-4 bg-gray-300 dark:bg-gray-600 rounded"
            style={{ width: `${getRowWidth(index)}%` }}
          ></div>
        </td>
      ))}
      {showActions && (
        <td className="px-4 py-3">
          <div className="flex justify-end gap-2">
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </td>
      )}
    </tr>
  )
}
