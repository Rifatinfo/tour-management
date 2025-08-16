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
import { toast } from "sonner";
import { useLoginMutation } from "@/redux/features/auth/auth.api";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [login] = useLoginMutation()
  const navigate = useNavigate();
  const formSchema = z
    .object({
      email: z.email(),
      password: z.string().min(8, { error: "Password is too short" }),
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const userInfo = {
        email : data.email,
        password : data.password
    }
    try{
        const result = await login(userInfo).unwrap();
        console.log(result);
        toast.success("User Login Successfully");
        navigate("/verify");
    }catch(error){
        if(error.status === 401){
           toast.success("User Account is Not Verify");
           navigate("/verify", {state : data.email});
        }
        console.log(error);
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
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <div className="grid gap-6">
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
          <Link to="/register" replace className="underline underline-offset-4">
            Register
          </Link>
        </div>
      </form>
    </Form>
  );
}
