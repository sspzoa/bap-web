export default function LoadingSpinner() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-white border-t-2 border-b-2" />
    </div>
  );
}
