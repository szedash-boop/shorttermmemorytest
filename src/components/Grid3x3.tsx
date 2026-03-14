interface Grid3x3Props {
  activeIndices: number[];
  size?: string;
}

const Grid3x3 = ({ activeIndices, size = "w-24 h-24" }: Grid3x3Props) => (
  <div className={`${size} grid grid-cols-3 border border-foreground`}>
    {[...Array(9)].map((_, i) => (
      <div
        key={i}
        className={`border-[0.5px] border-foreground ${
          activeIndices.includes(i) ? "bg-foreground" : "bg-card"
        }`}
      />
    ))}
  </div>
);

export default Grid3x3;
