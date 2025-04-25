import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const fallbackBookCover =
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

const borrowFormSchema = z.object({
  durationInDays: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 && val <= 30, {
      message: "Duration must be between 1 and 30 days",
    }),
});

export default function Books() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("userUser") || "{}");

  const form = useForm({
    resolver: zodResolver(borrowFormSchema),
    defaultValues: {
      durationInDays: "14",
    },
  });

  const { data: books, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5001/api/books", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    },
  });

  const borrowMutation = useMutation({
    mutationFn: async ({ bookId, durationInDays }) => {
      const response = await axios.post(
        "http://localhost:5001/api/borrow-requests",
        {
          bookId,
          userId: user._id,
          durationInDays,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      toast.success("Borrow request sent successfully!");
      setIsDialogOpen(false);
      form.reset();
      setSelectedBook(null);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to send borrow request"
      );
    },
  });

  const handleBorrowClick = (book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  const onSubmit = (data) => {
    if (selectedBook) {
      borrowMutation.mutate({
        bookId: selectedBook._id,
        durationInDays: data.durationInDays,
      });
    }
  };

  // Filter books based on search term
  const filteredBooks = books?.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Browse Books</h2>
          <p className="text-muted-foreground">
            Discover and borrow books from our collection
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search books by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Card key={n} className="overflow-hidden group p-0">
              <div className="aspect-[3/4] bg-muted animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredBooks?.map((book) => (
            <Card key={book._id} className="overflow-hidden group p-0">
              <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                <img
                  src={fallbackBookCover}
                  alt="Book Cover Placeholder"
                  className="object-cover w-full h-full absolute inset-0"
                />
                {book.coverImage && (
                  <img
                    src={book.coverImage}
                    alt={book.title}
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
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "size-2 rounded-full",
                        book.isAvailable && book.quantity > 0
                          ? "bg-green-500"
                          : "bg-red-500"
                      )}
                    />
                    <span className="text-[10px] font-medium text-white">
                      {book.quantity} {book.quantity > 1 ? "copies" : "copy"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-medium leading-tight line-clamp-1 text-sm">
                    {book.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      By {book.author}
                    </p>
                    <span className="text-[10px] font-medium rounded-full px-2 py-0.5 bg-muted">
                      {book.category}
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full h-7 text-xs"
                  onClick={() => handleBorrowClick(book)}
                  disabled={
                    !book.isAvailable ||
                    book.quantity < 1 ||
                    borrowMutation.isLoading
                  }
                >
                  {borrowMutation.isLoading && selectedBook?._id === book._id
                    ? "Sending Request..."
                    : book.isAvailable && book.quantity > 0
                    ? "Borrow Book"
                    : "Currently Unavailable"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredBooks?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No books found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Borrow Book</DialogTitle>
            <DialogDescription>
              For how many days would you like to borrow "{selectedBook?.title}
              "?
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="durationInDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (in days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        placeholder="Enter number of days"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={borrowMutation.isLoading}>
                  {borrowMutation.isLoading
                    ? "Sending Request..."
                    : "Confirm Borrow"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
