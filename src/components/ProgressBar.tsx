const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full h-2 border border-foreground mb-8 bg-card">
    <div
      className="h-full bg-foreground transition-all duration-500"
      style={{ width: `${progress}%` }}
    />
  </div>
);

export default ProgressBar;
