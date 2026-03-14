import { PatternItem } from "@/data/testData";
import Grid3x3 from "./Grid3x3";

interface PatternDisplayProps {
  pattern: PatternItem;
}

const PatternDisplay = ({ pattern }: PatternDisplayProps) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold uppercase tracking-tighter">
        MEMORIZE THE SEQUENCE
      </h2>
      <div className="border border-foreground p-4">
        <div className="grid grid-cols-3 gap-4">
          {pattern.matrix.flat().map((cells, i) => {
            const isQuestion = cells.length === 1 && cells[0] === -1;
            if (isQuestion) {
              return (
                <div
                  key={i}
                  className="w-20 h-20 border-2 border-foreground flex items-center justify-center"
                >
                  <span className="text-4xl font-bold">?</span>
                </div>
              );
            }
            return <Grid3x3 key={i} activeIndices={cells} size="w-20 h-20" />;
          })}
        </div>
      </div>
    </div>
  );
};

export default PatternDisplay;
