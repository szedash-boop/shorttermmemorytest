import Grid3x3 from "./Grid3x3";

interface PatternOptionsProps {
  options: number[][];
  onSelect: (index: number) => void;
}

const PatternOptions = ({ options, onSelect }: PatternOptionsProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold uppercase tracking-tighter text-center">
        SELECT THE MISSING PATTERN
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="p-4 border-2 border-foreground bg-card text-card-foreground hover:bg-foreground hover:text-primary-foreground transition-colors flex items-center justify-center gap-4"
          >
            <span className="font-bold text-2xl">
              {String.fromCharCode(65 + i)}
            </span>
            <Grid3x3 activeIndices={opt} size="w-16 h-16" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PatternOptions;
