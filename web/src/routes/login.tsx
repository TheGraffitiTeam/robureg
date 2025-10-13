import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldLabel,
    FieldError,
    FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export const Route = createFileRoute('/login')({
    component: Login,
})

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

function Login() {
    const navigate = useNavigate()
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                const errorMessage = errorData?.message || "Invalid credentials"
                throw new Error(errorMessage)
            }

            const result = await response.json()

            // Store JWT token in localStorage
            if (result.access_token) {
                localStorage.setItem('access_token', result.access_token)
            }

            toast.success("Login Successful", {
                description: "Welcome back!",
            })

            // Redirect to dashboard
            navigate({ to: "/dashboard" })
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Login failed. Please try again."

            toast.error("Login Failed", {
                description: message,
            })
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8">
                    <div>
                        <h1 className="text-3xl font-bold text-center">Login</h1>
                        <p className="text-muted-foreground mt-2 text-center">
                            Sign in to your account
                        </p>
                    </div>

                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        aria-invalid={!!form.formState.errors.email}
                                        {...field}
                                    />
                                )}
                            />
                            <FieldError>{form.formState.errors.email?.message}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        aria-invalid={!!form.formState.errors.password}
                                        {...field}
                                    />
                                )}
                            />
                            <FieldError>{form.formState.errors.password?.message}</FieldError>
                        </Field>
                    </FieldGroup>

                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

