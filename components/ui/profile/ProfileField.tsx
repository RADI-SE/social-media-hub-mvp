import { Check, Loader2, TriangleAlert } from "lucide-react";

type ProfileFieldProps = {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  type?: string;
  placeholder?: string;
  warning?: boolean;
  disabled?: boolean;
  isSaving?: boolean;
  error?: string;
  helper?: string;
  success?: string;
};

export function ProfileField({
  label,
  value,
  onChange,
  onSave,
  type = "text",
  placeholder = "",
  warning = false,
  disabled = false,
  isSaving = false,
  error,
  helper,
  success,
}: ProfileFieldProps) {
  const inputId = `profile-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const messageId = `${inputId}-message`;

  return (
    <form
      className="rounded-2xl border border-white/90 bg-white/65 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
      noValidate
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-slate-700">
            {label}
          </label>
          <div className="relative">
            <input
              id={inputId}
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={isSaving}
              aria-invalid={Boolean(error)}
              aria-describedby={error || helper || success ? messageId : undefined}
              className={`w-full rounded-xl border bg-white/85 px-4 py-3 pr-10 text-sm text-slate-700 outline-none ${
                error
                  ? "border-rose-300 focus:ring-2 focus:ring-rose-100"
                  : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              }`}
            />
            {warning && (
              <TriangleAlert
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500"
              />
            )}
          </div>
          {(error || success || helper) && (
            <p
              id={messageId}
              className={`mt-2 flex items-center gap-1.5 text-xs ${
                error ? "text-rose-600" : success ? "text-emerald-700" : "text-slate-500"
              }`}
            >
              {success && <Check size={13} />}
              {error || success || helper}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={disabled || isSaving}
          className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-[#173b9a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0f2e7d] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isSaving && <Loader2 size={15} className="animate-spin" />}
          {isSaving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
