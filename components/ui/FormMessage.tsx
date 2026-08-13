import { Check, TriangleAlert } from "lucide-react";

type FormMessageProps = {
  type?: "success" | "error" | "info";
  message?: string;
  className?: string;
};

export function FormMessage({ type, message, className = "" }: FormMessageProps) {
  if (!message) return null;

  const styles = {
    success: "text-emerald-700",
    error: "text-rose-600",
    info: "text-slate-500",
  };

  const icons = {
    success: <Check size={13} className="shrink-0" />,
    error: <TriangleAlert size={13} className="shrink-0" />,
    info: null,
  };

  return (
    <p className={`mt-2 flex items-center gap-1.5 text-xs ${styles[type]} ${className}`}>
      {icons[type]}
      {message}
    </p>
  );
}