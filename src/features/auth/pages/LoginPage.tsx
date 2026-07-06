import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Logo } from "@/shared/components/Logo";
import { useAuth } from "../hooks/useAuth";
import { useLogin } from "../hooks/useLogin";
import { LoginIllustration } from "../components/LoginIllustration";

const loginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { isAuthenticated } = useAuth();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userId: "", password: "" },
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden flex-1 items-center justify-center bg-bg md:flex">
        <LoginIllustration />
      </div>

      <div className="flex w-full flex-col justify-center border-l border-primary/15 bg-surface px-8 py-12 sm:px-16 md:w-1/2 lg:px-24">
        <div className="flex w-full max-w-md flex-col gap-6">
          <Logo />

          <div>
            <h1 className="text-2xl font-semibold text-foreground">Login</h1>
            <p className="mt-1 text-sm text-muted">Use your company provided Login credentials</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="Enter User ID"
                autoComplete="username"
                invalid={Boolean(errors.userId)}
                {...register("userId")}
              />
              {errors.userId && <p className="text-xs text-danger">{errors.userId.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                autoComplete="current-password"
                invalid={Boolean(errors.password)}
                {...register("password")}
              />
              {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
            </div>

            <button type="button" className="-mt-2 self-start text-sm font-medium text-primary hover:underline">
              Forgot password?
            </button>

            <Button type="submit" size="lg" className="mt-1 w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
