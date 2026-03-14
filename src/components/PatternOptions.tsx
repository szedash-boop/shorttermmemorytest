import Grid3x3 from "./Grid3x3";

interface PatternOptionsProps {
  options: number[][];
  onSelect: (index: number) => void;
  selectedIndex?: number | null;
}

const PatternOptions = ({ options, onSelect, selectedIndex }: PatternOptionsProps) => {
  const labels = ["A", "B", "C", "D"];
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold uppercase tracking-tighter">
        SELECT YOUR ANSWER
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={selectedIndex !== undefined && selectedIndex !== null}
            className={`flex flex-col items-center gap-2 p-3 border-2 transition-opacity ${
              selectedIndex === i
                ? "border-card-foreground bg-card-foreground/10"
                : selectedIndex !== undefined && selectedIndex !== null
                ? "border-muted opacity-40"
                : "border-card-foreground hover:bg-card-foreground hover:text-card"
            }`}
          >
            <span className="font-bold text-lg">{labels[i]}</span>
            <Grid3x3 activeIndices={opt} size="w-16 h-16" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PatternOptions;
