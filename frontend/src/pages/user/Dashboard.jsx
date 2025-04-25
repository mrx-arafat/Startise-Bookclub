import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("userUser") || "{}");

  const { data: borrowStats } = useQuery({
    queryKey: ["borrowStats"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:5001/api/borrow-requests/stats/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    },
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["recentActivity"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:5001/api/borrow-requests/recent/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    },
  });

  const stats = [
    {
      title: "Total Books Borrowed",
      value: borrowStats?.totalBorrowed || 0,
      icon: BookOpen,
      description: "Books you have borrowed so far",
    },
    {
      title: "Currently Borrowed",
      value: borrowStats?.currentlyBorrowed || 0,
      icon: Clock,
      description: "Books currently in your possession",
    },
    {
      title: "Returned Books",
      value: borrowStats?.returned || 0,
      icon: CheckCircle2,
      description: "Books you have returned",
    },
    {
      title: "Pending Requests",
      value: borrowStats?.pending || 0,
      icon: XCircle,
      description: "Borrow requests awaiting approval",
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      case "returned":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name}!
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your book borrowing activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest book borrowing activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {recentActivity?.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.book.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      activity.status
                    )} text-white capitalize`}
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
