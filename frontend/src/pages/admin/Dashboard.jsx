import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { books, borrowRequests, suggestions, users } from "@/lib/api";
import {
  BookOpen,
  Users,
  ClipboardList,
  MessageSquarePlus,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminDashboard() {
  const { data: booksData } = useQuery({
    queryKey: ["books"],
    queryFn: () => books.getAll(),
  });

  const { data: borrowRequestsData } = useQuery({
    queryKey: ["borrowRequests"],
    queryFn: () => borrowRequests.getAll(),
  });

  const { data: suggestionsData } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () => suggestions.getAll(),
  });

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => users.getAll(),
  });

  const pendingRequests =
    borrowRequestsData?.data?.filter((req) => req.status === "requested")
      ?.length || 0;

  const stats = [
    {
      title: "Total Books",
      value: booksData?.data?.length || 0,
      description: "Books in collection",
      icon: BookOpen,
    },
    {
      title: "Active Members",
      value: usersData?.data?.length || 0,
      description: "Total registered users",
      icon: Users,
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      description: `Requests waiting for approval`,
      icon: ClipboardList,
    },
    {
      title: "Book Suggestions",
      value: suggestionsData?.data?.length || 0,
      description: "From community",
      icon: MessageSquarePlus,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to the admin dashboard
          </p>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Activity
              </CardTitle>
              <Link
                to="/admin/borrow-requests"
                className="text-xs text-muted-foreground hover:text-primary flex items-center"
              >
                View all
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px] max-h-[250px]">
              {borrowRequestsData?.data?.slice(0, 8).map((request) => (
                <div
                  key={request._id}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                >
                  <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {request.bookId.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Requested by {request.userId?.name || "Deleted User"}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                Latest Suggestions
              </CardTitle>
              <Link
                to="/admin/suggestions"
                className="text-xs text-muted-foreground hover:text-primary flex items-center"
              >
                View all
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {suggestionsData?.data?.slice(0, 5).map((suggestion) => (
                <Card
                  key={suggestion._id}
                  className="border-none shadow-none bg-muted/50"
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium leading-none">
                        {suggestion.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>by {suggestion.author}</span>
                        <span>Suggested by {suggestion.userId.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
