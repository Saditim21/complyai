// System detail
interface SystemDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SystemDetailPage({ params }: SystemDetailPageProps) {
  const { id } = await params;
  return <main>System Detail: {id}</main>;
}
