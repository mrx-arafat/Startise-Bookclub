import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { books } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const fallbackBookCover =
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.string().transform((val) => parseInt(val, 10)),
  coverImage: z.string().url("Must be a valid URL").optional(),
  isAvailable: z.boolean().optional(),
});

export default function Books() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      quantity: "",
      coverImage: "",
      isAvailable: true,
    },
  });

  const { data: booksData, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: () => books.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => books.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      toast.success("Book created successfully");
      setIsOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to create book");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => books.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      toast.success("Book updated successfully");
      setIsOpen(false);
      setEditingBook(null);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to update book");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => books.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      toast.success("Book deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete book");
    },
  });

  const toggleAvailability = (book) => {
    updateMutation.mutate({
      id: book._id,
      data: { ...book, isAvailable: !book.isAvailable },
    });
  };

  const onSubmit = (data) => {
    if (editingBook) {
      updateMutation.mutate({ id: editingBook._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    form.reset({
      title: book.title,
      author: book.author,
      category: book.category,
      quantity: book.quantity.toString(),
      coverImage: book.coverImage || "",
      isAvailable: book.isAvailable,
    });
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Books</h2>
          <p className="text-muted-foreground">
            Manage your library's book collection
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBook ? "Edit Book" : "Add New Book"}
              </DialogTitle>
            </DialogHeader>
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
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Book title" {...field} />
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
                        <Input placeholder="Author name" {...field} />
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
                        <Input placeholder="Book category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Number of copies"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Availability</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {editingBook ? "Update Book" : "Add Book"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {booksData?.data?.map((book) => (
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
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 bg-background/60 backdrop-blur-sm hover:bg-background/80"
                    onClick={() => handleEdit(book)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 bg-background/60 backdrop-blur-sm hover:bg-background/80 hover:text-red-600"
                    onClick={() => handleDelete(book._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "size-2 rounded-full",
                        book.isAvailable ? "bg-green-500" : "bg-red-500"
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
                <div className="flex items-center justify-center border-t pt-2">
                  <div className="flex items-center gap-1.5">
                    <Switch
                      size="sm"
                      checked={book.isAvailable}
                      onCheckedChange={() => toggleAvailability(book)}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        book.isAvailable ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {book.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
