import type {
  ShapeItem,
  GridCells,
  ArrowDir,
  TriangleShape,
  CrosshairShape,
  PetalShape,
  MultiArrowItem,
} from "@/data/testData";

// --- Grid 3x3 (FIXED: Explicitly checks for 1) ---
const Grid3x3Shape = ({ cells }: { cells: GridCells }) => (
  <div className="grid grid-cols-3 w-24 h-24 border-2 border-foreground">
    {cells.map((val, i) => (
      <div
        key={i}
        className={`border border-muted-foreground ${
          val === 1 ? "bg-foreground" : "bg-card"
        }`}
      />
    ))}
  </div>
);

// --- Directional Arrow ---
const DirectionalArrow = ({ dir }: { dir: ArrowDir }) => {
  const rotations: Record<ArrowDir, string> = {
    up: "rotate-0",
    right: "rotate-90",
    down: "rotate-180",
    left: "-rotate-90",
  };
  return (
    <div className="w-16 h-16 flex items-center justify-center border border-foreground p-2">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`w-8 h-8 ${rotations[dir]}`}
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </div>
  );
};

// --- Split Triangle ---
const SplitTriangle = ({ invert, leftFilled, rightFilled }: TriangleShape) => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 border border-foreground p-2">
    {invert ? (
      <>
        <polygon points="0,0 50,100 50,0" fill={leftFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="4" />
        <polygon points="100,0 50,100 50,0" fill={rightFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="4" />
      </>
    ) : (
      <>
        <polygon points="0,100 50,0 50,100" fill={leftFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="4" />
        <polygon points="100,100 50,0 50,100" fill={rightFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="4" />
      </>
    )}
  </svg>
);

// --- Crosshair ---
const Crosshair = ({ vOffset, hOffset }: CrosshairShape) => (
  <div className="w-16 h-16 border border-foreground p-1 bg-card">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1={50 + vOffset} y1="4" x2={50 + vOffset} y2="96" stroke="currentColor" strokeWidth="2" />
      <line x1="4" y1={50 + hOffset} x2="96" y2={50 + hOffset} stroke="currentColor" strokeWidth="2" />
    </svg>
  </div>
);

// --- Petals ---
const Petals = ({ count, isTopMinus }: PetalShape) => {
  const angles = [0, 180, 90, 270, 45, 315];
  const petalElements = [];
  for (let i = 0; i < count; i++) {
    petalElements.push(
      <ellipse
        key={i} cx="50" cy="25" rx="10" ry="24"
        fill="none" stroke="currentColor" strokeWidth="4"
        transform={`rotate(${angles[i]} 50 50)`}
      />
    );
  }
  return (
    <div className="w-20 h-20 border-2 border-foreground relative bg-card flex items-center justify-center">
      <span className="absolute top-0 left-1.5 font-bold text-lg text-foreground">{isTopMinus ? "−" : "+"}</span>
      <span className="absolute bottom-0 right-1.5 font-bold text-lg text-foreground">{isTopMinus ? "+" : "−"}</span>
      <svg viewBox="0 0 100 100" className="w-12 h-12">{petalElements}</svg>
    </div>
  );
};

// --- Multi Arrow Cell ---
const MultiArrowCell = ({ arrows }: { arrows: MultiArrowItem[] }) => {
  const getRotation = (dir: ArrowDir) => {
    switch (dir) {
      case "right": return "rotate-90";
      case "down": return "rotate-180";
      case "left": return "-rotate-90";
      default: return "rotate-0";
    }
  };
  return (
    <div className="w-20 h-20 border border-foreground flex items-end justify-center gap-1 bg-card p-2">
      {arrows.map((arr, i) => (
        <svg
          key={i} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
          className={`text-foreground origin-center ${arr.size === "lg" ? "w-8 h-14" : "w-5 h-8"} ${getRotation(arr.dir)}`}
        >
          <path d="M12 21V3M5 10l7-7 7 7" />
        </svg>
      ))}
    </div>
  );
};

// --- Question Mark ---
const QuestionMark = ({ isGrid = false }: { isGrid?: boolean }) => (
  <div className={`${isGrid ? "w-24 h-24" : "w-16 h-16"} flex items-center justify-center border-2 border-dashed border-muted-foreground`}>
    <span className="text-4xl font-bold text-foreground">?</span>
  </div>
);

// --- Universal renderer ---
interface ShapeRendererProps {
  testId: string;
  item: ShapeItem;
}

const ShapeRenderer = ({ testId, item }: ShapeRendererProps) => {
  if (item === null) return <QuestionMark isGrid={testId.includes("grid") && !testId.includes("arrow")} />;
  
  // Note the explicit cast or checking for the grid-based IDs
  if (testId.includes("grid") && !testId.includes("arrow"))
    return <Grid3x3Shape cells={item as GridCells} />;
  if (testId.includes("arrows") && !testId.includes("arrow-grids"))
    return <DirectionalArrow dir={item as ArrowDir} />;
  if (testId.includes("triangles"))
    return <SplitTriangle {...(item as TriangleShape)} />;
  if (testId.includes("crosshairs"))
    return <Crosshair {...(item as CrosshairShape)} />;
  if (testId.includes("petals"))
    return <Petals {...(item as PetalShape)} />;
  if (testId.includes("arrow-grids"))
    return <MultiArrowCell arrows={item as MultiArrowItem[]} />;
    
  return null;
};

export default ShapeRenderer;
