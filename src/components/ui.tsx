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
    primary:
      "bg-accent text-on-accent shadow-none hover:-translate-y-0.5 hover:bg-[#ff9340] hover:shadow-[0_10px_28px_rgba(255,122,24,0.38)] active:translate-y-0",
    secondary: "bg-fill text-ink hover:-translate-y-0.5 hover:bg-fill-strong hover:text-white active:translate-y-0",
    danger:
      "bg-alert text-white hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_10px_24px_rgba(255,77,58,0.35)] active:translate-y-0",
    ghost: "bg-transparent text-ink hover:text-accent hover:underline px-0",
  }[variant];

  return (
    <button
      className={`inline-flex h-11 cursor-pointer items-center justify-center rounded-[12px] px-4 text-[15px] font-medium transition duration-200 ease-out disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${styles} ${className}`}
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
