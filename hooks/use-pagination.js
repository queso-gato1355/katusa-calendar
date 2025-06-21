"use client"

import { useState } from "react"

/**
 * 페이지네이션 관리 훅
 * @param {number} initialPerPage - 초기 페이지당 항목 수
 * @returns {object} 페이지네이션 상태와 핸들러들
 */
export const usePagination = (initialPerPage = 10) => {
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: initialPerPage,
    total: 0,
  })

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handlePerPageChange = (newPerPage) => {
    setPagination({ page: 1, perPage: newPerPage, total: pagination.total })
  }

  const setTotal = (total) => {
    setPagination((prev) => ({ ...prev, total }))
  }

  const resetToFirstPage = () => {
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const getTotalPages = () => {
    return Math.max(1, Math.ceil(pagination.total / pagination.perPage))
  }

  const getDisplayRange = () => {
    if (pagination.total === 0) return "0 결과"

    const start = (pagination.page - 1) * pagination.perPage + 1
    const end = Math.min(pagination.page * pagination.perPage, pagination.total)
    return `${start}-${end} / ${pagination.total}`
  }

  return {
    pagination,
    handlePageChange,
    handlePerPageChange,
    setTotal,
    resetToFirstPage,
    getTotalPages,
    getDisplayRange,
  }
}
