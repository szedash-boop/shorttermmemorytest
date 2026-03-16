import { PatternItem } from "@/data/testData";
import ShapeRenderer from "@/components/shapes/ShapeRenderer";

interface PatternDisplayProps {
  pattern: PatternItem;
}

const PatternDisplay = ({ pattern }: PatternDisplayProps) => {
  // Determine layout class dynamically
  const layoutClass =
    pattern.layout === "grid3x3"
      ? "grid grid-cols-3 gap-2" // Tightened gap for 3x3 grids
      : pattern.layout === "grid2x2"
      ? "grid grid-cols-2 gap-4"
      : "flex gap-4 flex-wrap justify-center";

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold uppercase tracking-tighter">
        Study the Pattern
      </h2>
      
      {/* Container for the pattern items */}
      <div className={`bg-card p-6 border-2 border-foreground ${layoutClass}`}>
        {pattern.pattern.map((item, i) => (
          <div key={i} className="flex justify-center items-center">
            {item === null ? (
              // The placeholder for the missing pattern item
              <div className="w-24 h-24 border-2 border-dashed border-gray-400 flex items-center justify-center font-bold text-4xl">
                ?
              </div>
            ) : (
              // Hand off the data to the renderer
              <ShapeRenderer testId={pattern.id} item={item} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatternDisplay;
