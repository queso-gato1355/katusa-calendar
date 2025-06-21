"use client"

import { useState } from "react"

/**
 * 필터링 관리 훅
 * @param {object} initialFilter - 초기 필터 상태
 * @returns {object} 필터 상태와 핸들러들
 */
export const useFilter = (initialFilter = {}) => {
  const [filter, setFilter] = useState(initialFilter)

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetFilters = () => {
    setFilter(initialFilter)
  }

  const updateFilter = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return {
    filter,
    handleFilterChange,
    resetFilters,
    updateFilter,
  }
}
