import { PatternItem } from "@/data/testData";
import { PATTERN_IMAGES } from "@/lib/patternImages";

interface PatternOptionsProps {
  pattern: PatternItem;
  onSelect: (index: number) => void;
  selectedIndex: number | null;
}

const PatternOptions = ({ pattern, onSelect, selectedIndex }: PatternOptionsProps) => {
  const imgSrc = PATTERN_IMAGES[pattern.image];

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold uppercase tracking-tighter">
        SELECT YOUR ANSWER
      </h2>
      <div className="bg-white p-4 border-2 border-foreground">
        <img
          src={imgSrc}
          alt="Pattern with options"
          className="max-w-full max-h-[350px] object-contain"
        />
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        {pattern.optionLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={selectedIndex !== null}
            className={`w-14 h-14 border-2 border-foreground font-bold text-xl transition-colors ${
              selectedIndex === i
                ? "bg-foreground text-background"
                : selectedIndex !== null
                ? "opacity-30"
                : "bg-background text-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PatternOptions;
