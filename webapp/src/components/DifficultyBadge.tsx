interface DifficultyBadgeProps {
  difficulty: "Easy" | "Medium" | "Hard";
  size?: "sm" | "md";
}

export default function DifficultyBadge({ difficulty, size = "sm" }: DifficultyBadgeProps) {
  const colors = {
    Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Hard: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${colors[difficulty]} ${sizes[size]}`}
    >
      {difficulty}
    </span>
  );
}
