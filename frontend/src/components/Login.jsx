import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Axios } from "../api/Axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(2, "Password must be at least 6 characters"),
});

function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await Axios.post("/auth/login", data);
      localStorage.setItem("_auth", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast({
        title: "Success",
        description: "Welcome to Book Club!",
      });
      navigate("/books");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Login failed",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-white">
      <Card className="w-[400px] shadow-lg border-teal-100">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-teal-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-teal-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-teal-600">
            Sign in to borrow books and join the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        {...field}
                        className="w-full border-teal-200 focus:border-teal-400 focus:ring-teal-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="w-full border-teal-200 focus:border-teal-400 focus:ring-teal-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-colors"
              >
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-teal-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-teal-600 hover:text-teal-700 font-semibold hover:underline">
              Register here
            </Link>
          </div>
          <div className="text-sm text-center text-teal-600">
            Are you an admin?{" "}
            <Link to="/admin/login" className="text-teal-600 hover:text-teal-700 font-semibold hover:underline">
              Login here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
