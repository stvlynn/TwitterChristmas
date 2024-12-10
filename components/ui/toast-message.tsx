import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface ToastMessageProps {
  message: string;
  type: "error" | "success";
}

export function ToastMessage({ message, type }: ToastMessageProps) {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: type === "error" ? "Error" : "Success",
      description: message,
      variant: type === "error" ? "destructive" : "default",
    });
  }, [message, type, toast]);

  return null;
}