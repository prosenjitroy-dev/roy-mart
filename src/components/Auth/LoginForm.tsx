"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shadcnui/card";
import { Field, FieldLabel, FieldError } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { Button } from "@/components/shadcnui/button";
import Link from "next/link";
import { toast } from "react-toastify";

import { loginSchema, type LoginSchema } from "@/lib/zodSchema";
import { authClient } from "./authClient";

const LoginForm = () => {
  const { handleSubmit, control, formState: { isSubmitting } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "all",
  });

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (redirect) {
      window.location.href = "/";
    }
  }, [redirect]);

  const onSubmit = async (data: LoginSchema) => {
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        toast.error(result.error.message || "Login failed");
      } else {
        toast.success("Logged in successfully");
        setRedirect(true);
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Card size="sm" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your email below to sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex w-full flex-col gap-6">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input {...field} id={field.name} type="email" aria-invalid={fieldState.invalid} autoComplete="email" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input {...field} id={field.name} type="password" aria-invalid={fieldState.invalid} autoComplete="current-password" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
