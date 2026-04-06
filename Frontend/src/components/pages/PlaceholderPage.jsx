/**
 * Dark placeholder for routes that will be implemented later.
 */
export default function PlaceholderPage({ title, message }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-neutral-950 px-6 py-16 text-neutral-100">
      <h1 className="mb-3 text-center text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-lg text-center text-neutral-400">{message}</p>
    </div>
  );
}
