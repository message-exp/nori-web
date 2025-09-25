interface LoadingProps {
  text?: string;
  className?: string;
}

export function Loading({ text = "Loading...", className }: LoadingProps) {
  return (
    <div
      className={`flex items-center justify-center h-full ${className || ""}`}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-2"></div>
        {text}
      </div>
    </div>
  );
}
