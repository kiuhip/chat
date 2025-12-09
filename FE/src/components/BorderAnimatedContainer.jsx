export function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full animated-border-container rounded-2xl animate-border flex overflow-hidden">
      {children}
    </div>
  );
}