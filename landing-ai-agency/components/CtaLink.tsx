import type { ReactNode } from "react";
import { BOT_LINK } from "@/lib/site-content";
import { ArrowIcon } from "./ArrowIcon";

type CtaLinkProps = {
  children: ReactNode;
  className?: string;
  compact?: boolean;
};

export function CtaLink({ children, className = "", compact = false }: CtaLinkProps) {
  return (
    <a
      className={`cta-link${compact ? " cta-link--compact" : ""}${className ? ` ${className}` : ""}`}
      href={BOT_LINK}
      target="_blank"
      rel="noreferrer"
    >
      <span>{children}</span>
      <ArrowIcon />
    </a>
  );
}
