import Link from "next/link";
import {
  Layers,
  Link as LinkIcon,
  Boxes,
  TreePine,
  ArrowUpDown,
  Hash,
  Network,
  Type,
  GitMerge,
  BrainCircuit,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Layers,
  Link: LinkIcon,
  Boxes,
  TreePine,
  ArrowUpDown,
  Hash,
  Network,
  Type,
  GitMerge,
  BrainCircuit,
  SlidersHorizontal,
  Sparkles,
};

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  emerald:  { bg: "bg-emerald-500/10",  text: "text-emerald-400",  border: "border-emerald-500/20",  glow: "hover:shadow-emerald-500/5"  },
  blue:     { bg: "bg-blue-500/10",     text: "text-blue-400",     border: "border-blue-500/20",     glow: "hover:shadow-blue-500/5"     },
  purple:   { bg: "bg-purple-500/10",   text: "text-purple-400",   border: "border-purple-500/20",   glow: "hover:shadow-purple-500/5"   },
  amber:    { bg: "bg-amber-500/10",    text: "text-amber-400",    border: "border-amber-500/20",    glow: "hover:shadow-amber-500/5"    },
  rose:     { bg: "bg-rose-500/10",     text: "text-rose-400",     border: "border-rose-500/20",     glow: "hover:shadow-rose-500/5"     },
  cyan:     { bg: "bg-cyan-500/10",     text: "text-cyan-400",     border: "border-cyan-500/20",     glow: "hover:shadow-cyan-500/5"     },
  orange:   { bg: "bg-orange-500/10",   text: "text-orange-400",   border: "border-orange-500/20",   glow: "hover:shadow-orange-500/5"   },
  indigo:   { bg: "bg-indigo-500/10",   text: "text-indigo-400",   border: "border-indigo-500/20",   glow: "hover:shadow-indigo-500/5"   },
  pink:     { bg: "bg-pink-500/10",     text: "text-pink-400",     border: "border-pink-500/20",     glow: "hover:shadow-pink-500/5"     },
  teal:     { bg: "bg-teal-500/10",     text: "text-teal-400",     border: "border-teal-500/20",     glow: "hover:shadow-teal-500/5"     },
  lime:     { bg: "bg-lime-500/10",     text: "text-lime-400",     border: "border-lime-500/20",     glow: "hover:shadow-lime-500/5"     },
  sky:      { bg: "bg-sky-500/10",      text: "text-sky-400",      border: "border-sky-500/20",      glow: "hover:shadow-sky-500/5"      },
};

interface TopicCardProps {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  problemCount?: number;
}

export default function TopicCard({
  slug,
  title,
  description,
  icon,
  color,
  problemCount,
}: TopicCardProps) {
  const IconComponent = iconMap[icon] || Layers;
  const colors = colorMap[color] || colorMap.emerald;

  return (
    <Link href={`/topics/${slug}`}>
      <div
        className={`group relative overflow-hidden rounded-xl border ${colors.border} bg-slate-900/50 p-6 transition-all duration-300 hover:bg-slate-800/50 hover:border-opacity-50 hover:shadow-lg ${colors.glow} hover:-translate-y-1`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${colors.bg} ${colors.text} transition-transform group-hover:scale-110`}
          >
            <IconComponent size={24} />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
              {title}
            </h3>
            <p className="mt-1 text-sm text-slate-400 line-clamp-2">
              {description}
            </p>
            {problemCount !== undefined && (
              <div className="mt-3 flex items-center gap-2">
                <span className={`text-xs font-medium ${colors.text}`}>
                  {problemCount} problems
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Decorative gradient */}
        <div
          className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${colors.bg} opacity-0 blur-2xl transition-opacity group-hover:opacity-100`}
        />
      </div>
    </Link>
  );
}
