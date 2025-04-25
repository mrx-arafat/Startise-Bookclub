import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const fallbackBookCover =
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

export default function BorrowRequests() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["borrowRequests"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:5001/api/borrow-requests/me",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (requestId) => {
      const response = await axios.delete(
        `http://localhost:5001/api/borrow-requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["borrowRequests"]);
      toast.success("Request cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel request");
    },
  });

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "requested":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500/10 text-yellow-500"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-500/10 text-green-500">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-500/10 text-red-500">
            Rejected
          </Badge>
        );
      case "returned":
        return (
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
            Returned
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="space-y-4">
          <div className="text-center">Loading your requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Book Requests</h2>
        <p className="text-muted-foreground">
          View and manage your book borrowing requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>
            Track the status of your book borrowing requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Book Info</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>
                    <div className="flex gap-3">
                      {/* Book Thumbnail */}
                      <div className="relative h-16 w-12 overflow-hidden rounded-sm bg-muted shrink-0">
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
                      {/* Book Info */}
                      <div className="flex flex-col py-0.5 gap-1">
                        <span className="font-medium line-clamp-1">
                          {request.bookId.title}
                        </span>
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
                            {/* {request.bookId.quantity}{" "}
                            {request.bookId.quantity > 1 ? "copies" : "copy"} */}
                            By {request.bookId.author}
                          </span>
                        </div>
                        {request.bookId.category && (
                          <span className="text-[10px] font-medium rounded-full px-2 py-0.5 bg-muted w-fit">
                            {request.bookId.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(request.createdAt)}</TableCell>
                  <TableCell>{request.durationInDays} days</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === "approved"
                      ? formatDate(request.expectedReturnDate)
                      : request.status === "returned"
                      ? formatDate(request.returnedDate)
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {request.status === "requested" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 px-2 lg:px-3 text-red-500 hover:text-red-500 hover:bg-red-50"
                          >
                            Cancel Request
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Request</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this book request?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Request</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => cancelMutation.mutate(request._id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Cancel Request
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!requests?.length && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    You haven't made any book requests yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
