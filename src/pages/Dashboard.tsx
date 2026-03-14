import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MOD_CODE, PRE_DATA, POST_DATA } from "@/data/testData";
import { getResults, type ParticipantResult } from "@/lib/storage";

const Dashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<ParticipantResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      const load = () => setResults(getResults());
      load();
      const interval = setInterval(load, 3000); // poll every 3s
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  const handleAuth = () => {
    if (code === MOD_CODE) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Invalid mod code.");
    }
  };

  const scorePatterns = (answers: number[], phase: "pre" | "post") => {
    const data = phase === "pre" ? PRE_DATA : POST_DATA;
    return answers.filter((a, i) => data.patterns[i] && a === data.patterns[i].correct).length;
  };

  const scoreDigitSpan = (answers: string[], phase: "pre" | "post") => {
    const data = phase === "pre" ? PRE_DATA : POST_DATA;
    let maxSpan = 0;
    answers.forEach((a, i) => {
      if (data.digits[i] && a === data.digits[i]) {
        maxSpan = Math.max(maxSpan, data.digits[i].length);
      }
    });
    return maxSpan;
  };

  const scoreWords = (words: string[], phase: "pre" | "post") => {
    const data = phase === "pre" ? PRE_DATA : POST_DATA;
    const correct = data.words.map((w) => w.toUpperCase());
    return words.filter((w) => correct.includes(w.toUpperCase())).length;
  };

  const exportCSV = () => {
    const headers = [
    "Nickname",
    "Timestamp",
    "Completed",
    "Pre-Pattern Answers",
    "Pre-Pattern Score",
    "Pre-Pattern Time(s)",
    "Pre-Digit Answers",
    "Pre-Digit Span",
    "Pre-Digit Time(s)",
    "Pre-Word Recall",
    "Pre-Word Score",
    "Pre-Word Time(s)",
    "Post-Pattern Answers",
    "Post-Pattern Score",
    "Post-Pattern Time(s)",
    "Post-Digit Answers",
    "Post-Digit Span",
    "Post-Digit Time(s)",
    "Post-Word Recall",
    "Post-Word Score",
    "Post-Word Time(s)",
    "Total Score"];


    const rows = results.map((r) => {
      const pp = scorePatterns(r.sections.prePatterns.answers, "pre");
      const pd = scoreDigitSpan(r.sections.preDigits.answers, "pre");
      const pw = scoreWords(r.sections.preWords.words, "pre");
      const opp = scorePatterns(r.sections.postPatterns.answers, "post");
      const opd = scoreDigitSpan(r.sections.postDigits.answers, "post");
      const opw = scoreWords(r.sections.postWords.words, "post");

      return [
      r.nickname,
      r.timestamp,
      r.completed ? "Yes" : "No",
      r.sections.prePatterns.answers.map((a) => String.fromCharCode(65 + a)).join(","),
      `${pp}/3`,
      r.sections.prePatterns.timeTaken.toFixed(1),
      r.sections.preDigits.answers.join(","),
      pd,
      r.sections.preDigits.timeTaken.toFixed(1),
      `"${r.sections.preWords.words.join(", ")}"`,
      `${pw}/16`,
      r.sections.preWords.timeTaken.toFixed(1),
      r.sections.postPatterns.answers.map((a) => String.fromCharCode(65 + a)).join(","),
      `${opp}/3`,
      r.sections.postPatterns.timeTaken.toFixed(1),
      r.sections.postDigits.answers.join(","),
      opd,
      r.sections.postDigits.timeTaken.toFixed(1),
      `"${r.sections.postWords.words.join(", ")}"`,
      `${opw}/16`,
      r.sections.postWords.timeTaken.toFixed(1),
      pp + pd + pw + opp + opd + opw].
      join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stml_results_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen text-foreground font-sans flex items-center justify-center p-4 bg-primary">
        <div className="w-full max-w-md bg-card text-card-foreground p-8 border-2 border-foreground space-y-6">
          <h1 className="text-3xl font-bold tracking-tighter uppercase">
            TESTER ACCESS
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter the moderator code to access the dashboard.
          </p>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            className="w-full border-2 border-card-foreground p-4 text-xl bg-card text-card-foreground focus:outline-none"
            placeholder="MOD CODE" />
          
          {error &&
          <p className="font-bold border-2 border-card-foreground p-3 bg-accent text-accent-foreground">
              ⚠ {error}
            </p>
          }
          <button
            onClick={handleAuth}
            className="w-full bg-card-foreground text-card p-4 font-bold hover:opacity-80 transition-opacity">
            
            AUTHENTICATE
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full border-2 border-card-foreground text-card-foreground p-3 font-bold hover:bg-card-foreground hover:text-card transition-colors text-sm">
            
            ← BACK TO TEST
          </button>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen text-foreground font-sans p-4 md:p-8 bg-primary">
      <div className="max-w-[1400px] mx-auto border-2 border-foreground p-4 md:p-8 bg-card text-card-foreground">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-4 border-card-foreground pb-4 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">
              LAB DASHBOARD
            </h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              {results.length} PARTICIPANT{results.length !== 1 ? "S" : ""} •
              LIVE UPDATES EVERY 3S
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="border-2 border-card-foreground px-4 py-2 font-bold hover:bg-card-foreground hover:text-card transition-colors text-sm flex items-center gap-2">
              
              ↓ EXPORT CSV
            </button>
            <button
              onClick={() => navigate("/")}
              className="border-2 border-card-foreground px-4 py-2 font-bold hover:bg-card-foreground hover:text-card transition-colors text-sm">
              
              ← TEST
            </button>
          </div>
        </div>

        {results.length === 0 ?
        <div className="text-center py-16 text-muted-foreground">
            <p className="text-xl font-mono">NO RESULTS YET</p>
            <p className="text-sm mt-2">
              Results will appear here as participants complete the test.
            </p>
          </div> :

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-card-foreground bg-card-foreground text-card">
                  <th className="p-2 font-bold">NICKNAME</th>
                  <th className="p-2 font-bold">TIME</th>
                  <th className="p-2 font-bold">STATUS</th>
                  <th className="p-2 font-bold">PRE-PAT</th>
                  <th className="p-2 font-bold">PRE-DIG</th>
                  <th className="p-2 font-bold">PRE-WRD</th>
                  <th className="p-2 font-bold">POST-PAT</th>
                  <th className="p-2 font-bold">POST-DIG</th>
                  <th className="p-2 font-bold">POST-WRD</th>
                  <th className="p-2 font-bold">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                const pp = scorePatterns(r.sections.prePatterns.answers, "pre");
                const pd = scoreDigitSpan(r.sections.preDigits.answers, "pre");
                const pw = scoreWords(r.sections.preWords.words, "pre");
                const opp = scorePatterns(r.sections.postPatterns.answers, "post");
                const opd = scoreDigitSpan(r.sections.postDigits.answers, "post");
                const opw = scoreWords(r.sections.postWords.words, "post");
                const total = pp + pd + pw + opp + opd + opw;

                return (
                  <tr key={i} className="border-b border-card-foreground hover:bg-accent">
                      <td className="p-2 font-bold">{r.nickname}</td>
                      <td className="p-2 font-mono text-xs">
                        {new Date(r.timestamp).toLocaleString()}
                      </td>
                      <td className="p-2">
                        {r.completed ? "✓ DONE" : "⏳ IN PROGRESS"}
                      </td>
                      <td className="p-2">
                        <div>{pp}/3</div>
                        <div className="text-xs text-muted-foreground">
                          {r.sections.prePatterns.answers.map((a) => String.fromCharCode(65 + a)).join(",")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {r.sections.prePatterns.timeTaken.toFixed(0)}s
                        </div>
                      </td>
                      <td className="p-2">
                        <div>Span: {pd}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.sections.preDigits.answers.join(", ")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {r.sections.preDigits.timeTaken.toFixed(0)}s
                        </div>
                      </td>
                      <td className="p-2">
                        <div>{pw}/16</div>
                        <div className="text-xs text-muted-foreground break-all max-w-[120px]">
                          {r.sections.preWords.words.join(", ")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {r.sections.preWords.timeTaken.toFixed(0)}s
                        </div>
                      </td>
                      <td className="p-2">
                        <div>{opp}/3</div>
                        <div className="text-xs text-muted-foreground">
                          {r.sections.postPatterns.answers.map((a) => String.fromCharCode(65 + a)).join(",")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {r.sections.postPatterns.timeTaken.toFixed(0)}s
                        </div>
                      </td>
                      <td className="p-2">
                        <div>Span: {opd}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.sections.postDigits.answers.join(", ")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {r.sections.postDigits.timeTaken.toFixed(0)}s
                        </div>
                      </td>
                      <td className="p-2">
                        <div>{opw}/16</div>
                        <div className="text-xs text-muted-foreground break-all max-w-[120px]">
                          {r.sections.postWords.words.join(", ")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {r.sections.postWords.timeTaken.toFixed(0)}s
                        </div>
                      </td>
                      <td className="p-2 font-bold text-lg">{total}</td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>);

};

export default Dashboard;