import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import MarkdownRenderer from "../../../components/MarkdownRenderer";

// We'll dynamically import topics data
import { topics } from "../../../data/topics";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TopicDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = topics.find((t) => t.slug === slug);

  if (!topic) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/topics"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Topics
      </Link>

      {/* Header */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="text-emerald-400" size={24} />
          <h1 className="text-3xl font-bold text-white">{topic.title}</h1>
        </div>
        <p className="text-slate-400">{topic.description}</p>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8">
        <MarkdownRenderer content={topic.content} />
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        {(() => {
          const currentIndex = topics.findIndex((t) => t.slug === slug);
          const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
          const nextTopic =
            currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;
          return (
            <>
              {prevTopic ? (
                <Link
                  href={`/topics/${prevTopic.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                >
                  <ArrowLeft size={14} />
                  {prevTopic.title}
                </Link>
              ) : (
                <div />
              )}
              {nextTopic && (
                <Link
                  href={`/topics/${nextTopic.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                >
                  {nextTopic.title}
                  <ArrowLeft size={14} className="rotate-180" />
                </Link>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}
