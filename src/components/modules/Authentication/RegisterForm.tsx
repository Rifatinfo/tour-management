import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormDescription } from "@/components/ui/form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import Password from "@/components/ui/Password";
import { useRegisterMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const navigate = useNavigate();
    const [register] = useRegisterMutation();
    const formSchema = z
        .object({
            name: z
                .string()
                .min(3, {
                    error: "Name is too short",
                })
                .max(50),
            email: z.email(),
            password: z.string().min(8, { error: "Password is too short" }),
            confirmPassword: z
                .string()
                .min(8, { error: "Confirm Password is too short" }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Password do not match",
            path: ["confirmPassword"],
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const userInfo = {
            name: data.name,
            email: data.email,
            password: data.password
        }
        try {
            const result = await register(userInfo).unwrap();
            console.log(result);
            toast.success("User created Successfully");
            navigate("/login");
        } catch (err) {
            if (err.status === 401) {
                toast.success("User Account is Not Verify");
                navigate("/verify", {state : data.email});
            }
            console.log(err);
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("flex flex-col gap-6", className)}
                {...props}
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Register To Your Account</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>

                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="john.doe@company.com"
                                        type="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="sr-only">
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Password {...field} />
                                </FormControl>
                                <FormDescription className="sr-only">
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Password {...field} />
                                </FormControl>
                                <FormDescription className="sr-only">
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>

                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full cursor-pointer"
                    >
                        Login with Google
                    </Button>
                </div>

                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/login" replace className="underline underline-offset-4">
                        Login
                    </Link>
                </div>
            </form>
        </Form>
    );
}
