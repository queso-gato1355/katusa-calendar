import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/overlays/Dialog/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/Cards/card";
import {
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/atoms/Display/badge";
import { Button } from "@/components/atoms/Button/button";

export default function InquiryDialog({
  setResponse,
  response,
  setSelectedInquiry,
  selectedInquiry,
  setIsDialogOpen,
  isDialogOpen,
  inquiry,
  updateInquiryStatus,
}) {
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

  return (
    <Dialog
      open={isDialogOpen && selectedInquiry?.id === inquiry.id}
      onOpenChange={setIsDialogOpen}
    >
      <DialogTrigger asChild>
        <Card
          className="hover:shadow-md hover:bg-card/70 transition-shadow bg-card border cursor-pointer"
          onClick={() => setSelectedInquiry(inquiry)}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="text-lg truncate">
                  {inquiry.subject}
                </CardTitle>
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="truncate">{inquiry.name}</span>
                  <span>•</span>
                  <span className="truncate">{inquiry.email}</span>
                  <span>•</span>
                  <span className="truncate">
                    {getInquiryTypeText(inquiry.type)}
                  </span>
                  <span>•</span>
                  <span className="truncate">
                    {new Date(inquiry.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <div className="md:hidden flex flex-col items-start gap-2 text-sm text-muted-foreground">
                  <span className="truncate">
                    {getInquiryTypeText(inquiry.type)}
                  </span>
                  <span className="truncate">
                    {new Date(inquiry.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(inquiry.status)}
              </div>
            </div>
          </CardHeader>
          <hr className="mb-6 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 truncate">
              {inquiry.message}
            </p>
            {inquiry.admin_response && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded text-xs truncate">
                <strong>관리자 응답:</strong>{" "}
                {inquiry.admin_response.substring(0, 100)}...
              </div>
            )}
          </CardContent>
        </Card>
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
                <p className="text-sm text-muted-foreground truncate">
                  {selectedInquiry.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">이메일</label>
                <p className="text-sm text-muted-foreground truncate">
                  {selectedInquiry.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">문의 유형</label>
                <p className="text-sm text-muted-foreground truncate">
                  {getInquiryTypeText(selectedInquiry.type)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">상태</label>
                <div className="mt-1">
                  {getStatusBadge(selectedInquiry.status)}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">제목</label>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {selectedInquiry.subject}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">문의 내용</label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <p className="text-sm whitespace-pre-wrap truncate">
                  {selectedInquiry.message}
                </p>
              </div>
            </div>

            {selectedInquiry.admin_response && (
              <div>
                <label className="text-sm font-medium">기존 관리자 응답</label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedInquiry.admin_response}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">응답 작성</label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="어떻게 처리할 지에 대한 메모를 작성하세요... 문의 대답은 이메일로 전송하세요..."
                className="mt-1 w-full p-3 border rounded-md resize-none min-h-[100px] bg-background"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:space-x-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() =>
                    updateInquiryStatus(selectedInquiry.id, "in_progress")
                  }
                  disabled={selectedInquiry.status === "in_progress"}
                  className="w-full sm:w-auto"
                >
                  처리중으로 변경
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    updateInquiryStatus(selectedInquiry.id, "pending")
                  }
                  disabled={selectedInquiry.status === "pending"}
                  className="w-full sm:w-auto"
                >
                  대기중으로 변경
                </Button>
              </div>
              <Button
                onClick={() =>
                  updateInquiryStatus(selectedInquiry.id, "completed", response)
                }
                disabled={!response.trim()}
                className="w-full sm:w-auto"
              >
                응답하고 완료 처리
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
