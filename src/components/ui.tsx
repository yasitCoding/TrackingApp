import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

export function PageTitle({
  eyebrow,
  children,
  action,
}: {
  eyebrow?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="mb-1 text-[13px] font-medium text-faint">{eyebrow}</p> : null}
        <h1 className="text-[34px] leading-none font-semibold tracking-tight">{children}</h1>
      </div>
      {action}
    </div>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const styles = {
    primary: "bg-accent text-on-accent hover:opacity-90",
    secondary: "bg-fill text-ink hover:bg-fill-strong",
    danger: "bg-alert text-white hover:opacity-90",
    ghost: "bg-transparent text-ink hover:underline px-0",
  }[variant];

  return (
    <button
      className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-[12px] px-4 text-[15px] font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${styles} ${className}`}
      {...props}
    />
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] text-mute">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-11 w-full rounded-[12px] border border-line bg-fill px-3 text-[15px] text-ink outline-none placeholder:text-faint focus:border-accent ${props.className ?? ""}`}
    />
  );
}

export function EmptyState({
  title,
  detail,
  action,
}: {
  title: string;
  detail: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="text-[19px] font-semibold tracking-tight">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-mute">{detail}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
