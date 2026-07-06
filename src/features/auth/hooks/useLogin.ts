import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { useAuth } from "./useAuth";
import { useToast } from "@/shared/hooks/useToast";
import type { LoginPayload } from "../types";

export function useLogin() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      setSession(data.token, data.user);
      toast({ title: `Welcome back, ${data.user.name}`, variant: "success" });
      navigate("/", { replace: true });
    },
    onError: (error: Error) => {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    },
  });
}
