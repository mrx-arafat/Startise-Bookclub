import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { suggestions } from "@/lib/api/suggestions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";

const suggestionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  author: z.string().min(2, "Author must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export default function Suggestions() {
  const queryClient = useQueryClient();

  // Get user data and token
  const userString = localStorage.getItem("userUser");
  const token = localStorage.getItem("userToken");
  const user = userString ? JSON.parse(userString) : null;

  const form = useForm({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      link: "",
    },
  });

  const {
    data: userSuggestions,
    isError: suggestionsError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["userSuggestions", user?.id],
    queryFn: () => {
      if (!user?.id) {
        throw new Error("User ID is required");
      }
      return suggestions.getUserSuggestions();
    },
    enabled: !!user?.id && !!token,
  });

  const createSuggestion = useMutation({
    mutationFn: (data) => {
      if (!user?.id) {
        throw new Error("User ID is required");
      }
      return suggestions.create({ ...data, userId: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userSuggestions", user?.id]);
      toast.success("Book suggestion submitted successfully!");
      form.reset();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit suggestion"
      );
    },
  });

  const onSubmit = (data) => {
    if (!user?.id || !token) {
      toast.error("Please log in to submit suggestions");
      return;
    }
    createSuggestion.mutate(data);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Suggest a Book</h2>
        <p className="text-muted-foreground">
          Help us improve our collection by suggesting books
        </p>
      </div>

      {!user?.id && (
        <div className="text-red-500 bg-red-50 p-4 rounded-md">
          Please log in to view and submit suggestions
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Suggestion Form */}
        <Card>
          <CardHeader>
            <CardTitle>New Book Suggestion</CardTitle>
            <CardDescription>
              Fill out the form below to suggest a new book
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Book Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter book title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter book category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Link (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/book"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Add a link to the book's page on Amazon,
                        Goodreads, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createSuggestion.isLoading}
                >
                  {createSuggestion.isLoading
                    ? "Submitting..."
                    : "Submit Suggestion"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Suggestions List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Suggestions</CardTitle>
            <CardDescription>
              Thank you for helping us improve our collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-center text-muted-foreground">
                  Loading your suggestions...
                </p>
              ) : suggestionsError ? (
                <div className="text-center text-red-500">
                  <p>Error loading suggestions.</p>
                  <p className="text-sm">
                    {error?.message || "Please try again later."}
                  </p>
                </div>
              ) : userSuggestions?.length > 0 ? (
                userSuggestions.map((suggestion) => (
                  <div
                    key={suggestion._id}
                    className="flex flex-col space-y-2 border-b pb-4 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{suggestion.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="italic">
                          Thank you for your suggestion!
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      By {suggestion.author}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span>Category: {suggestion.category}</span>
                      <span>•</span>
                      <span>
                        Suggested on:{" "}
                        {new Date(suggestion.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  You haven't made any suggestions yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
