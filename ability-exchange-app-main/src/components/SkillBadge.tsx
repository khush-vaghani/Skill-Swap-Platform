import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  skill: string;
  type: "offered" | "wanted";
  className?: string;
}

export function SkillBadge({ skill, type, className }: SkillBadgeProps) {
  return (
    <Badge
      variant={type === "offered" ? "secondary" : "outline"}
      className={cn(
        "text-xs transition-colors",
        type === "offered" 
          ? "bg-success/10 text-success hover:bg-success/20 border-success/20" 
          : "border-accent text-accent hover:bg-accent/10",
        className
      )}
    >
      {skill}
    </Badge>
  );
}