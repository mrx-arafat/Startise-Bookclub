import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { borrowRequests } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  AlertCircle,
  BookOpen,
  CalendarClock,
  CalendarCheck,
  CalendarX,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  requested: {
    label: "Requested",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    iconColor: "text-yellow-600",
    actions: ["approved", "rejected"],
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-700 border-green-200",
    iconColor: "text-green-600",
    actions: ["returned"],
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-100 text-red-700 border-red-200",
    iconColor: "text-red-600",
    actions: [],
  },
  returned: {
    label: "Returned",
    icon: RotateCcw,
    className: "bg-blue-100 text-blue-700 border-blue-200",
    iconColor: "text-blue-600",
    actions: [],
  },
};

const fallbackBookCover =
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

export default function BorrowRequests() {
  const queryClient = useQueryClient();

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ["borrowRequests"],
    queryFn: () => borrowRequests.getAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => {
      return borrowRequests.updateStatus(id, status);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["borrowRequests"]);
      toast.success("Request status updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update request status"
      );
      console.error(error);
    },
  });

  const handleStatusUpdate = (id, newStatus) => {
    const statusLabels = {
      approved: "approve",
      rejected: "reject",
      returned: "mark as returned",
    };

    if (
      window.confirm(
        `Are you sure you want to ${statusLabels[newStatus]} this request?`
      )
    ) {
      updateStatusMutation.mutate({ id, status: newStatus });
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (expectedDate) => {
    if (!expectedDate) return null;
    const today = new Date();
    const expected = new Date(expectedDate);
    const diffTime = expected - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStepStatus = (request, step) => {
    switch (step) {
      case "requested":
        return {
          completed: true,
          icon: CalendarClock,
          date: request.createdAt,
        };
      case "approved":
        return {
          completed: ["approved", "returned"].includes(request.status),
          icon: CalendarCheck,
          date: request.approvedAt,
        };
      case "returned":
        return {
          completed: request.status === "returned",
          icon: CalendarX,
          date: request.expectedReturnDate,
        };
      default:
        return { completed: false, icon: Clock, date: null };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Borrow Requests</h2>
        <p className="text-muted-foreground">
          Manage book borrow requests from users
        </p>
      </div>

      <div className="rounded-md border">
        {/* Header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b bg-muted/50">
          <div className="md:col-span-4 lg:col-span-5 font-medium">
            Book & User
          </div>
          <div className="md:col-span-4 lg:col-span-3 font-medium">
            Timeline
          </div>
          <div className="md:col-span-2 font-medium">Status</div>
          <div className="md:col-span-2 font-medium text-right">Actions</div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading...
          </div>
        ) : (
          <div className="divide-y">
            {requestsData?.data?.map((request) => {
              const StatusIcon = statusConfig[request.status].icon;

              return (
                <div
                  key={request._id}
                  className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 hover:bg-muted/50"
                >
                  {/* Book & User Info */}
                  <div className="md:col-span-4 lg:col-span-3">
                    <div className="flex gap-3">
                      {/* Book Thumbnail */}
                      <div className="relative h-20 w-14 md:h-16 md:w-12 overflow-hidden rounded-sm bg-muted shrink-0">
                        <img
                          src={fallbackBookCover}
                          alt="Book Cover Placeholder"
                          className="object-cover w-full h-full absolute inset-0"
                        />
                        {request.bookId.coverImage && (
                          <img
                            src={request.bookId.coverImage}
                            alt={request.bookId.title}
                            className="object-cover w-full h-full absolute inset-0 transition-opacity duration-300"
                            onError={(e) => {
                              e.target.style.opacity = 0;
                            }}
                            onLoad={(e) => {
                              e.target.style.opacity = 1;
                            }}
                            style={{ opacity: 0 }}
                          />
                        )}
                      </div>
                      {/* Book and User Info */}
                      <div className="flex flex-col py-0.5 gap-1">
                        <div className="flex items-start gap-2">
                          <span className="font-medium line-clamp-1">
                            {request.bookId.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "size-1.5 rounded-full",
                              request.bookId.isAvailable
                                ? "bg-green-500"
                                : "bg-red-500"
                            )}
                          />
                          <span className="text-[10px] text-muted-foreground">
                            {request.bookId.quantity}{" "}
                            {request.bookId.quantity > 1 ? "copies" : "copy"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <span className="text-xs font-medium">
                            Requested by:
                          </span>
                          <span className="line-clamp-1">
                            {request?.userId?.name || "Deleted User"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline - Hidden on mobile */}
                  <div className="hidden md:block md:col-span-4 lg:col-span-4">
                    <div className="relative flex items-center">
                      {["requested", "approved", "returned"].map(
                        (step, index) => {
                          const {
                            completed,
                            icon: StepIcon,
                            date,
                          } = getStepStatus(request, step);
                          return (
                            <div
                              key={step}
                              className={`flex-1 flex flex-col ${
                                index === 0
                                  ? "items-start"
                                  : index === 2
                                  ? "items-end"
                                  : "items-center"
                              }`}
                            >
                              <div className="flex items-center w-full">
                                {index > 0 && (
                                  <div
                                    className={cn(
                                      "h-[2px] flex-1 -ml-1",
                                      completed ? "bg-primary" : "bg-muted"
                                    )}
                                  />
                                )}
                                <div
                                  className={cn(
                                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                                    completed
                                      ? "bg-primary border-primary text-primary-foreground"
                                      : "bg-background border-muted text-muted-foreground"
                                  )}
                                >
                                  <StepIcon className="w-4 h-4" />
                                </div>
                                {index < 2 && (
                                  <div
                                    className={cn(
                                      "h-[2px] flex-1 -mr-1",
                                      completed ? "bg-primary" : "bg-muted"
                                    )}
                                  />
                                )}
                              </div>
                              <div
                                className={`mt-1.5 flex flex-col ${
                                  index === 0
                                    ? "items-start"
                                    : index === 2
                                    ? "items-end"
                                    : "items-center"
                                }`}
                              >
                                <span className="text-[10px] font-medium capitalize">
                                  {step}
                                </span>
                                {date && (
                                  <span className="text-[10px] text-muted-foreground">
                                    {formatDate(date)}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Status and Actions Container */}
                  <div className="flex flex-col lg:col-span-5 md:grid md:grid-cols-12 gap-4 mt-4 md:mt-0">
                    {/* Status */}
                    <div className="md:col-span-5 flex items-center lg:justify-end">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium",
                          statusConfig[request.status].className
                        )}
                      >
                        <StatusIcon
                          className={cn(
                            "h-3.5 w-3.5",
                            statusConfig[request.status].iconColor
                          )}
                        />
                        {statusConfig[request.status].label}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-7 flex items-center gap-2">
                      {statusConfig[request.status].actions.map((action) => (
                        <Button
                          key={action}
                          variant="outline"
                          className={cn(
                            "relative h-10 flex-1",
                            action === "approved" &&
                              "border-green-200 hover:border-green-400 hover:bg-green-50",
                            action === "rejected" &&
                              "border-red-200 hover:border-red-400 hover:bg-red-50",
                            action === "returned" &&
                              "border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                          )}
                          onClick={() =>
                            handleStatusUpdate(request._id, action)
                          }
                        >
                          <span
                            className={cn(
                              "flex items-center justify-center gap-2 w-full",
                              action === "approved" && "text-green-600",
                              action === "rejected" && "text-red-600",
                              action === "returned" && "text-blue-600"
                            )}
                          >
                            {action === "approved" && (
                              <CheckCircle2 className="h-5 w-5" />
                            )}
                            {action === "rejected" && (
                              <XCircle className="h-5 w-5" />
                            )}
                            {action === "returned" && (
                              <RotateCcw className="h-5 w-5" />
                            )}
                            <span className="capitalize text-sm font-medium">
                              {action}
                            </span>
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
