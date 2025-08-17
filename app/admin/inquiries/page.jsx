"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/admin/sidebar"
import { supabaseClient } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { usePagination } from "@/hooks/use-pagination"
import { Eye, MessageSquare, CheckCircle, Clock, AlertCircle, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { fetchInquiries } from "@/lib/supabase-helpers"

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState("light")
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [response, setResponse] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const pagination = usePagination({
    initialPage: 1,
    initialPerPage: 10,
  })

  // 테마 설정
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  // TODO: 디비 다루는 함수 대거 리펙토링

  // 문의 목록 가져오기
  const getInquiries = async () => {
    setLoading(true)
    const from = (pagination.page - 1) * pagination.perPage
    const to = from + pagination.perPage - 1
    const { data, error, count } = await fetchInquiries(from, to)

    setInquiries(data || [])
    setTotalCount(count || 0)
    setLoading(false)
  }

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabaseClient
        .from("inquiries")
        .delete()
        .eq("status", "completed")

      if (error) throw error

      toast.success("처리 완료된 문의가 일괄 삭제되었습니다.")
      getInquiries()
    } catch (error) {
      console.error("Error deleting completed inquiries:", error)
      toast.error("처리 완료된 문의 삭제 중 오류가 발생했습니다.")
    }
  }

  useEffect(() => {
    getInquiries()
  }, [pagination.page, pagination.perPage])

  // 문의 상태 업데이트
  const updateInquiryStatus = async (inquiryId, status, adminResponse = null) => {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
      }

      if (adminResponse) {
        updateData.admin_response = adminResponse
        updateData.responded_at = new Date().toISOString()
      }

      const { error } = await supabaseClient.from("inquiries").update(updateData).eq("id", inquiryId)

      if (error) throw error

      toast.success("문의 상태가 업데이트되었습니다.")

      fetchInquiries()
      setIsDialogOpen(false)
      setResponse("")
      setSelectedInquiry(null)
    } catch (error) {
      console.error("Error updating inquiry:", error)
      toast.error("문의 상태 업데이트 중 오류가 발생했습니다.")
      setIsDialogOpen(false)
    }
  }

  // 상태별 배지 색상
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            대기중
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="default">
            <AlertCircle className="w-3 h-3 mr-1" />
            처리중
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            완료
          </Badge>
        )
      default:
        return <Badge variant="secondary">알 수 없음</Badge>
    }
  }

  // 문의 유형 한글 변환
  const getInquiryTypeText = (type) => {
    const types = {
      general: "일반 문의",
      calendar: "캘린더 추가 요청",
      bug: "오류 신고",
      feature: "기능 제안",
      other: "기타",
    }
    return types[type] || type
  }

  // 페이지네이션 헬퍼 함수들
  const getTotalPages = () => Math.ceil(totalCount / pagination.perPage) || 1
  const getDisplayRange = () => {
    if (totalCount === 0) return "0 결과"
    const start = (pagination.page - 1) * pagination.perPage + 1 || 1
    const end = Math.min(pagination.page * pagination.perPage, totalCount) || 1
    return `${start}-${end} / ${totalCount}개`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>문의 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Sidebar activeCalendar="inquiries" theme={theme} />
      <div className="md:ml-64 p-4 md:p-8">
        <div className="flex items-top justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">문의 관리</h1>
            <p className="text-muted-foreground">사용자 문의를 확인하고 처리할 수 있습니다.</p>
          </div>
          {/* 처리 완료 일괄 삭제 버튼 */}
          <Button variant="outline" size="sm" onClick={handleBulkDelete} className={`${theme === "dark" ? "dark bg-gray-600 text-white" : "bg-gray-200 text-gray-900"}`}>
            <Trash2 className="w-4 h-4 mr-1" />
            처리 완료 삭제
          </Button>
        </div>

        {inquiries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">등록된 문의가 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className={`hover:shadow-md transition-shadow` + (theme === "dark" ? " bg-gray-800 border-gray-700" : " bg-white border-gray-200")}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{inquiry.subject}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{inquiry.name}</span>
                        <span>•</span>
                        <span>{inquiry.email}</span>
                        <span>•</span>
                        <span>{getInquiryTypeText(inquiry.type)}</span>
                        <span>•</span>
                        <span>{new Date(inquiry.created_at).toLocaleDateString("ko-KR")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(inquiry.status)}
                      <Dialog open={isDialogOpen && selectedInquiry?.id === inquiry.id} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedInquiry(inquiry)}>
                            <Eye className="w-4 h-4 mr-1" />
                            상세보기
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>문의 상세 정보</DialogTitle>
                          </DialogHeader>
                          {selectedInquiry && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">이름</label>
                                  <p className="text-sm text-muted-foreground">{selectedInquiry.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">이메일</label>
                                  <p className="text-sm text-muted-foreground">{selectedInquiry.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">문의 유형</label>
                                  <p className="text-sm text-muted-foreground">
                                    {getInquiryTypeText(selectedInquiry.type)}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">상태</label>
                                  <div className="mt-1">{getStatusBadge(selectedInquiry.status)}</div>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium">제목</label>
                                <p className="text-sm text-muted-foreground mt-1">{selectedInquiry.subject}</p>
                              </div>

                              <div>
                                <label className="text-sm font-medium">문의 내용</label>
                                <div className="mt-1 p-3 bg-muted rounded-md">
                                  <p className="text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
                                </div>
                              </div>

                              <div className="flex justify-between">
                                <div className="space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => updateInquiryStatus(selectedInquiry.id, "in_progress")}
                                    disabled={selectedInquiry.status === "in_progress"}
                                  >
                                    처리중으로 변경
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => updateInquiryStatus(selectedInquiry.id, "pending")}
                                    disabled={selectedInquiry.status === "pending"}
                                  >
                                    대기중으로 변경
                                  </Button>
                                </div>
                                <Button
                                  onClick={() => updateInquiryStatus(selectedInquiry.id, "completed", response)}
                                  disabled={!response.trim()}
                                >
                                  응답하고 완료 처리
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{inquiry.message}</p>
                  {inquiry.admin_response && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded text-xs">
                      <strong>관리자 응답:</strong> {inquiry.admin_response.substring(0, 100)}...
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <PaginationControls
              pagination={pagination}
              onPageChange={pagination.setPage}
              onPerPageChange={pagination.setPerPage}
              getTotalPages={getTotalPages}
              getDisplayRange={getDisplayRange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
