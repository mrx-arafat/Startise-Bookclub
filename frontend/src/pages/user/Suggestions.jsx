import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const suggestionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  author: z.string().min(2, "Author must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export default function Suggestions() {
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("userUser") || "{}");

  const form = useForm({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      description: "",
      link: "",
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:5001/api/books/categories",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    },
  });

  const { data: suggestions } = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:5001/api/suggestions/user/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    },
  });

  const createSuggestion = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        "http://localhost:5001/api/suggestions",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["suggestions"]);
      toast.success("Book suggestion submitted successfully!");
      form.reset();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to submit suggestion"
      );
    },
  });

  const onSubmit = (data) => {
    createSuggestion.mutate(data);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "bg-yellow-500",
      approved: "bg-green-500",
      rejected: "bg-red-500",
    };

    return (
      <Badge
        className={`${variants[status.toLowerCase()]} text-white capitalize`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Suggest a Book</h2>
        <p className="text-muted-foreground">
          Help us improve our collection by suggesting books
        </p>
      </div>

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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter book description"
                          {...field}
                        />
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
                        Add a link to the book's page on Amazon, Goodreads, etc.
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
              Track the status of your suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions?.map((suggestion) => (
                <div
                  key={suggestion._id}
                  className="flex flex-col space-y-2 border-b pb-4 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{suggestion.title}</h3>
                    {getStatusBadge(suggestion.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By {suggestion.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Category: {suggestion.category}</span>
                    <span>•</span>
                    <span>
                      Suggested on:{" "}
                      {new Date(suggestion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {suggestions?.length === 0 && (
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
