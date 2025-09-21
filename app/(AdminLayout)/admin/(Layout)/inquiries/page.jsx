"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/Cards/card";
import { Badge } from "@/components/atoms/Display/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/overlays/Dialog/dialog";
import { PaginationControls } from "@/components/molecules/Controls/pagination-controls";
import { usePagination } from "@/lib/hooks/use-pagination";
import {
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { 
  fetchInquiries,
  deleteInquiriesByStatus,
  updateInquiryStatusById
} from "@/lib/api/supabase/helpers";
import InquiryDialog from "./inquiry_dialog";

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [response, setResponse] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const pagination = usePagination({
    initialPage: 1,
    initialPerPage: 10,
  });

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 문의 목록 가져오기
  const getInquiries = async () => {
    try {
      setLoading(true);
      const from = (pagination.page - 1) * pagination.perPage;
      const to = from + pagination.perPage - 1;
      const { data, count } = await fetchInquiries(from, to);

      setInquiries(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("문의 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  const handleBulkDelete = async () => {
    try {
      const { error } = await deleteInquiriesByStatus('completed');
      // const { error } = await supabaseClient
      //   .from("inquiries")
      //   .delete()
      //   .eq("status", "completed");

      if (error) throw error;

      toast.success("처리 완료된 문의가 일괄 삭제되었습니다.");
      getInquiries();
    } catch (error) {
      console.error("Error deleting completed inquiries:", error);
      toast.error("처리 완료된 문의 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (mounted) {
      getInquiries();
    }
  }, [mounted, pagination.page, pagination.perPage]);

  // 문의 상태 업데이트
  const updateInquiryStatus = async (
    inquiryId,
    status,
    adminResponse = null
  ) => {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (adminResponse) {
        console.log("Admin response provided:", adminResponse);
        updateData.admin_response = adminResponse;
        updateData.responded_at = new Date().toISOString();
      }

      const { error } = await updateInquiryStatusById(inquiryId, updateData);

      if (error) throw error;

      toast.success("문의 상태가 업데이트되었습니다.");

      getInquiries();
      setIsDialogOpen(false);
      setResponse("");
      setSelectedInquiry(null);
    } catch (error) {
      console.error("Error updating inquiry:", error);
      toast.error("문의 상태 업데이트 중 오류가 발생했습니다.");
      setIsDialogOpen(false);
    }
  };

  // 상태별 배지 색상
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            대기중
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="default">
            <AlertCircle className="w-3 h-3 mr-1" />
            처리중
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            완료
          </Badge>
        );
      default:
        return <Badge variant="secondary">알 수 없음</Badge>;
    }
  };

  // 문의 유형 한글 변환
  const getInquiryTypeText = (type) => {
    const types = {
      general: "일반 문의",
      calendar: "캘린더 추가 요청",
      bug: "오류 신고",
      feature: "기능 제안",
      other: "기타",
    };
    return types[type] || type;
  };

  // 페이지네이션 헬퍼 함수들
  const getTotalPages = () => Math.ceil(totalCount / pagination.perPage) || 1;
  const getDisplayRange = () => {
    if (totalCount === 0) return "0 결과";
    const start = (pagination.page - 1) * pagination.perPage + 1 || 1;
    const end = Math.min(pagination.page * pagination.perPage, totalCount) || 1;
    return `${start}-${end} / ${totalCount}개`;
  };

  // 마운트되지 않았으면 렌더링하지 않음
  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>문의 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        
        {/* 처리 완료 일괄 삭제 버튼 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleBulkDelete}
          className="text-destructive hover:text-destructive bg-destructive-foreground/80 hover:bg-destructive-foreground/60"
        >
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
            <InquiryDialog
              key={inquiry.id}
              setResponse={setResponse}
              response={response}
              setIsDialogOpen={setIsDialogOpen}
              isDialogOpen={isDialogOpen}
              setSelectedInquiry={setSelectedInquiry}
              selectedInquiry={selectedInquiry}
              inquiry={inquiry}
              updateInquiryStatus={updateInquiryStatus}
            />
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
  );
}
