import { PatternItem } from "@/data/testData";
import { PATTERN_IMAGES } from "@/lib/patternImages";

interface PatternDisplayProps {
  pattern: PatternItem;
}

const PatternDisplay = ({ pattern }: PatternDisplayProps) => {
  const imgSrc = PATTERN_IMAGES[pattern.image];

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-bold uppercase tracking-tighter">
        STUDY THE PATTERN
      </h2>
      <div className="bg-white p-4 border-2 border-foreground">
        <img
          src={imgSrc}
          alt="Pattern sequence"
          className="max-w-full max-h-[400px] object-contain"
        />
      </div>
    </div>
  );
};

export default PatternDisplay;
