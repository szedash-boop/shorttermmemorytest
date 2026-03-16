import { PatternItem } from "@/data/testData";
import ShapeRenderer from "@/components/shapes/ShapeRenderer";

interface PatternDisplayProps {
  pattern: PatternItem;
}

const PatternDisplay = ({ pattern }: PatternDisplayProps) => {
  const layoutClass =
    pattern.layout === "grid3x3"
      ? "grid grid-cols-3 gap-4"
      : pattern.layout === "grid2x2"
      ? "grid grid-cols-2 gap-4"
      : "flex gap-4 flex-wrap justify-center";

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold uppercase tracking-tighter">
        STUDY THE PATTERN
      </h2>
      <div className={`bg-card p-6 border-2 border-foreground ${layoutClass}`}>
        {pattern.pattern.map((item, i) => (
          <ShapeRenderer key={i} testId={pattern.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default PatternDisplay;
