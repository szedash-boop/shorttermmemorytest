const Timer = ({ seconds }: { seconds: number }) => (
  <div className="font-mono text-2xl tabular-nums">
    {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
  </div>
);

export default Timer;
