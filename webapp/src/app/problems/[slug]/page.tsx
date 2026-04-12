import { problems } from "../../../data/problems";
import ProblemPage from "../../../components/ProblemPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function Page({ params }: PageProps) {
  return <ProblemPage params={params} />;
}

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }));
}
