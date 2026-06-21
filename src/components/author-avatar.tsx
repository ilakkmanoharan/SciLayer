import { getAuthorInitials } from "@/lib/authors";

type AuthorAvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
};

export function AuthorAvatar({ name, size = "md", className = "" }: AuthorAvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-slate-800 font-bold text-white shadow-sm ${sizeClasses[size]} ${className}`}
      aria-hidden
    >
      {getAuthorInitials(name)}
    </span>
  );
}
