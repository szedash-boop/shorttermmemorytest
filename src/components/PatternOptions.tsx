import { PatternItem } from "@/data/testData";
import ShapeRenderer from "@/components/shapes/ShapeRenderer";

interface PatternOptionsProps {
  pattern: PatternItem;
  onSelect: (index: number) => void;
  selectedIndex: number | null;
}

const PatternOptions = ({ pattern, onSelect, selectedIndex }: PatternOptionsProps) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold uppercase tracking-tighter">
        SELECT YOUR ANSWER
      </h2>
      <div className="flex gap-3 sm:gap-6 flex-wrap justify-center">
        {pattern.options.map((option, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={selectedIndex !== null}
            className={`flex flex-col items-center gap-2 p-3 border-2 transition-colors ${
              selectedIndex === i
                ? "border-foreground bg-foreground text-background"
                : selectedIndex !== null
                ? "border-muted-foreground opacity-30"
                : "border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            <ShapeRenderer testId={pattern.id} item={option} />
            <span className="font-bold text-lg">{pattern.optionLabels[i]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PatternOptions;
