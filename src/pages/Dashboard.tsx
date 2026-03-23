import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PRE_DATA, POST_DATA } from "@/data/testData";
import { getResults, deleteResult, type ParticipantResult } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<ParticipantResult[]>([]);
  const navigate = useNavigate();

  // Check existing session on mount
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authenticated) {
      const load = async () => {
        const data = await getResults();
        setResults(data);
      };
      load();
      const interval = setInterval(load, 3000);
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  const handleAuth = async () => {
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (authError) {
      setError(authError.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthenticated(false);
  };

  const scorePatterns = (answers: number[], phase: "pre" | "post") => {
    const data = phase === "pre" ? PRE_DATA : POST_DATA;
    return answers.filter((a, i) => data.patterns[i] && a === data.patterns[i].correct).length;
  };

  const patternCorrectMap = (answers: number[], phase: "pre" | "post") => {
    const data = phase === "pre" ? PRE_DATA : POST_DATA;
    return answers.map((a, i) => {
      const p = data.patterns[i];
      return {
        selected: a === -1 ? "—" : (p ? p.optionLabels[a] ?? String.fromCharCode(65 + a) : String.fromCharCode(65 + a)),
        correct: p ? p.optionLabels[p.correct] ?? String.fromCharCode(65 + p.correct) : "?",
        isCorrect: p ? a === p.correct : false,
      };
    });
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

  const digitDetailMap = (answers: string[], phase: "pre" | "post") => {
    const data = phase === "pre" ? PRE_DATA : POST_DATA;
    return answers.map((a, i) => ({
      typed: a || "—",
      correct: data.digits[i] || "?",
      isCorrect: data.digits[i] ? a === data.digits[i] : false,
      length: data.digits[i]?.length || 0,
    }));
  };

  const scoreWords = (words: string[], phase: "pre" | "post") => {
    const data = phase === "pre" ? PRE_DATA : POST_DATA;
    const correct = data.words.map((w) => w.toUpperCase());
    return words.filter((w) => correct.includes(w.toUpperCase())).length;
  };

  const wordDetailMap = (recalled: string[], phase: "pre" | "post") => {
    const data = phase === "pre" ? PRE_DATA : POST_DATA;
    const correct = data.words.map((w) => w.toUpperCase());
    const recalledUpper = recalled.map((w) => w.toUpperCase());
    return {
      matched: correct.filter((w) => recalledUpper.includes(w)),
      missed: correct.filter((w) => !recalledUpper.includes(w)),
      extra: recalledUpper.filter((w) => !correct.includes(w)),
    };
  };

  const getTotalTime = (r: ParticipantResult) => {
    const { prePatterns, preDigits, preWords, postPatterns, postDigits, postWords } = r.sections;
    const total = prePatterns.timeTaken + preDigits.timeTaken + preWords.timeTaken +
      postPatterns.timeTaken + postDigits.timeTaken + postWords.timeTaken;
    return total;
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.round(s % 60);
    return `${m}m ${sec}s`;
  };

  const exportCSV = () => {
    const headers = [
      "Nickname", "Timestamp", "Status", "Completion Time",
      "Pre-Pat-1", "Pre-Pat-1-Correct", "Pre-Pat-2", "Pre-Pat-2-Correct", "Pre-Pat-3", "Pre-Pat-3-Correct",
      "Pre-Pattern Score", "Pre-Pattern Time(s)",
      ...PRE_DATA.digits.map((_, i) => `Pre-Dig-${i + 1}-Typed`),
      ...PRE_DATA.digits.map((_, i) => `Pre-Dig-${i + 1}-Correct`),
      "Pre-Digit Max Span", "Pre-Digit Time(s)",
      "Pre-Words Recalled", "Pre-Words Matched", "Pre-Words Missed", "Pre-Word Score", "Pre-Word Time(s)",
      "Post-Pat-1", "Post-Pat-1-Correct", "Post-Pat-2", "Post-Pat-2-Correct", "Post-Pat-3", "Post-Pat-3-Correct",
      "Post-Pattern Score", "Post-Pattern Time(s)",
      ...POST_DATA.digits.map((_, i) => `Post-Dig-${i + 1}-Typed`),
      ...POST_DATA.digits.map((_, i) => `Post-Dig-${i + 1}-Correct`),
      "Post-Digit Max Span", "Post-Digit Time(s)",
      "Post-Words Recalled", "Post-Words Matched", "Post-Words Missed", "Post-Word Score", "Post-Word Time(s)",
      "Total Score",
    ];

    const rows = results.map((r) => {
      const pp = scorePatterns(r.sections.prePatterns.answers, "pre");
      const pd = scoreDigitSpan(r.sections.preDigits.answers, "pre");
      const pw = scoreWords(r.sections.preWords.words, "pre");
      const opp = scorePatterns(r.sections.postPatterns.answers, "post");
      const opd = scoreDigitSpan(r.sections.postDigits.answers, "post");
      const opw = scoreWords(r.sections.postWords.words, "post");
      const prePatDetail = patternCorrectMap(r.sections.prePatterns.answers, "pre");
      const postPatDetail = patternCorrectMap(r.sections.postPatterns.answers, "post");
      const preDigDetail = digitDetailMap(r.sections.preDigits.answers, "pre");
      const postDigDetail = digitDetailMap(r.sections.postDigits.answers, "post");
      const preWordDetail = wordDetailMap(r.sections.preWords.words, "pre");
      const postWordDetail = wordDetailMap(r.sections.postWords.words, "post");

      const row = [
        r.nickname,
        r.timestamp,
        r.completed ? "Completed" : "In Progress",
        formatTime(getTotalTime(r)),
        ...prePatDetail.flatMap((d) => [d.selected, d.isCorrect ? "✓" : "✗"]),
        ...(prePatDetail.length < 3 ? Array((3 - prePatDetail.length) * 2).fill("") : []),
        `${pp}/3`, r.sections.prePatterns.timeTaken.toFixed(1),
        ...PRE_DATA.digits.map((_, i) => preDigDetail[i]?.typed || ""),
        ...PRE_DATA.digits.map((_, i) => preDigDetail[i]?.isCorrect ? "✓" : (preDigDetail[i] ? "✗" : "")),
        pd, r.sections.preDigits.timeTaken.toFixed(1),
        `"${r.sections.preWords.words.join(", ")}"`,
        `"${preWordDetail.matched.join(", ")}"`,
        `"${preWordDetail.missed.join(", ")}"`,
        `${pw}/16`, r.sections.preWords.timeTaken.toFixed(1),
        ...postPatDetail.flatMap((d) => [d.selected, d.isCorrect ? "✓" : "✗"]),
        ...(postPatDetail.length < 3 ? Array((3 - postPatDetail.length) * 2).fill("") : []),
        `${opp}/3`, r.sections.postPatterns.timeTaken.toFixed(1),
        ...POST_DATA.digits.map((_, i) => postDigDetail[i]?.typed || ""),
        ...POST_DATA.digits.map((_, i) => postDigDetail[i]?.isCorrect ? "✓" : (postDigDetail[i] ? "✗" : "")),
        opd, r.sections.postDigits.timeTaken.toFixed(1),
        `"${r.sections.postWords.words.join(", ")}"`,
        `"${postWordDetail.matched.join(", ")}"`,
        `"${postWordDetail.missed.join(", ")}"`,
        `${opw}/16`, r.sections.postWords.timeTaken.toFixed(1),
        pp + pd + pw + opp + opd + opw,
      ];
      return row.join(",");
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
          <h1 className="text-3xl font-bold tracking-tighter uppercase">TESTER ACCESS</h1>
          <p className="text-muted-foreground text-sm">Enter the moderator code to access the dashboard.</p>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            className="w-full border-2 border-card-foreground p-4 text-xl bg-card text-card-foreground focus:outline-none"
            placeholder="MOD CODE"
          />
          {error && (
            <p className="font-bold border-2 border-card-foreground p-3 bg-accent text-accent-foreground">
              ⚠ {error}
            </p>
          )}
          <button
            onClick={handleAuth}
            className="w-full bg-card-foreground text-card p-4 font-bold hover:opacity-80 transition-opacity"
          >
            AUTHENTICATE
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full border-2 border-card-foreground text-card-foreground p-3 font-bold hover:bg-card-foreground hover:text-card transition-colors text-sm"
          >
            ← BACK TO TEST
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground font-sans p-4 md:p-8 bg-primary">
      <div className="max-w-[1800px] mx-auto border-2 border-foreground p-4 md:p-8 bg-card text-card-foreground">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-4 border-card-foreground pb-4 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">LAB DASHBOARD</h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              {results.length} PARTICIPANT{results.length !== 1 ? "S" : ""} • LIVE UPDATES EVERY 3S
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="border-2 border-card-foreground px-4 py-2 font-bold hover:bg-card-foreground hover:text-card transition-colors text-sm flex items-center gap-2"
            >
              ↓ EXPORT CSV
            </button>
            <button
              onClick={() => navigate("/")}
              className="border-2 border-card-foreground px-4 py-2 font-bold hover:bg-card-foreground hover:text-card transition-colors text-sm"
            >
              ← TEST
            </button>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-xl font-mono">NO RESULTS YET</p>
            <p className="text-sm mt-2">Results will appear here as participants complete the test.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {results.map((r, ri) => {
              const pp = scorePatterns(r.sections.prePatterns.answers, "pre");
              const pd = scoreDigitSpan(r.sections.preDigits.answers, "pre");
              const pw = scoreWords(r.sections.preWords.words, "pre");
              const opp = scorePatterns(r.sections.postPatterns.answers, "post");
              const opd = scoreDigitSpan(r.sections.postDigits.answers, "post");
              const opw = scoreWords(r.sections.postWords.words, "post");
              const total = pp + pd + pw + opp + opd + opw;
              const prePatDetail = patternCorrectMap(r.sections.prePatterns.answers, "pre");
              const postPatDetail = patternCorrectMap(r.sections.postPatterns.answers, "post");
              const preDigDetail = digitDetailMap(r.sections.preDigits.answers, "pre");
              const postDigDetail = digitDetailMap(r.sections.postDigits.answers, "post");
              const preWordDetail = wordDetailMap(r.sections.preWords.words, "pre");
              const postWordDetail = wordDetailMap(r.sections.postWords.words, "post");

              return (
                <div key={ri} className="border-2 border-card-foreground p-6 space-y-6">
                  {/* Header */}
                  <div className="flex flex-wrap gap-6 items-center justify-between border-b border-muted pb-4">
                    <div>
                      <span className="text-2xl font-bold">{r.nickname}</span>
                      <span className="ml-4 font-mono text-xs text-muted-foreground">
                        {new Date(r.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className={`px-3 py-1 border-2 font-bold text-sm ${r.completed ? "border-card-foreground bg-card-foreground text-card" : "border-muted text-muted-foreground"}`}>
                        {r.completed ? "✓ COMPLETED" : "⏳ IN PROGRESS"}
                      </span>
                      <span className="font-mono text-sm text-muted-foreground">
                        Total Time: {formatTime(getTotalTime(r))}
                      </span>
                      <span className="text-2xl font-bold">
                        SCORE: {total}
                      </span>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete report for "${r.nickname}"?`)) {
                            const ok = await deleteResult(r.nickname);
                            if (ok) setResults((prev) => prev.filter((_, idx) => idx !== ri));
                          }
                        }}
                        className="border-2 border-destructive text-destructive px-3 py-1 font-bold text-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        ✕ DELETE
                      </button>
                    </div>
                  </div>

                  {/* Per-section scores summary */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
                    <div className="border border-muted p-3">
                      <div className="text-xs text-muted-foreground font-mono">PRE PATTERN</div>
                      <div className="text-xl font-bold">{pp}/3</div>
                      <div className="text-xs text-muted-foreground">{r.sections.prePatterns.timeTaken.toFixed(0)}s</div>
                    </div>
                    <div className="border border-muted p-3">
                      <div className="text-xs text-muted-foreground font-mono">PRE DIGIT</div>
                      <div className="text-xl font-bold">Span {pd}</div>
                      <div className="text-xs text-muted-foreground">{r.sections.preDigits.timeTaken.toFixed(0)}s</div>
                    </div>
                    <div className="border border-muted p-3">
                      <div className="text-xs text-muted-foreground font-mono">PRE WORD</div>
                      <div className="text-xl font-bold">{pw}/16</div>
                      <div className="text-xs text-muted-foreground">{r.sections.preWords.timeTaken.toFixed(0)}s</div>
                    </div>
                    <div className="border border-muted p-3">
                      <div className="text-xs text-muted-foreground font-mono">POST PATTERN</div>
                      <div className="text-xl font-bold">{opp}/3</div>
                      <div className="text-xs text-muted-foreground">{r.sections.postPatterns.timeTaken.toFixed(0)}s</div>
                    </div>
                    <div className="border border-muted p-3">
                      <div className="text-xs text-muted-foreground font-mono">POST DIGIT</div>
                      <div className="text-xl font-bold">Span {opd}</div>
                      <div className="text-xs text-muted-foreground">{r.sections.postDigits.timeTaken.toFixed(0)}s</div>
                    </div>
                    <div className="border border-muted p-3">
                      <div className="text-xs text-muted-foreground font-mono">POST WORD</div>
                      <div className="text-xl font-bold">{opw}/16</div>
                      <div className="text-xs text-muted-foreground">{r.sections.postWords.timeTaken.toFixed(0)}s</div>
                    </div>
                  </div>

                  {/* Granular details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pattern details */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-sm uppercase tracking-widest border-b border-muted pb-2">Pattern Answers</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-muted">
                              <th className="py-2 px-3 text-left font-mono text-xs text-muted-foreground">PHASE</th>
                              <th className="py-2 px-3 text-left font-mono text-xs text-muted-foreground">ITEM</th>
                              <th className="py-2 px-3 text-left font-mono text-xs text-muted-foreground">SELECTED</th>
                              <th className="py-2 px-3 text-left font-mono text-xs text-muted-foreground">CORRECT</th>
                              <th className="py-2 px-3 text-left font-mono text-xs text-muted-foreground">RESULT</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prePatDetail.map((d, i) => (
                              <tr key={`pre-${i}`} className="border-b border-muted/50">
                                <td className="py-2 px-3">PRE</td>
                                <td className="py-2 px-3">{i + 1}</td>
                                <td className="py-2 px-3 font-bold">{d.selected}</td>
                                <td className="py-2 px-3">{d.correct}</td>
                                <td className="py-2 px-3 font-bold">{d.isCorrect ? "✓" : "✗"}</td>
                              </tr>
                            ))}
                            {postPatDetail.map((d, i) => (
                              <tr key={`post-${i}`} className="border-b border-muted/50">
                                <td className="py-2 px-3">POST</td>
                                <td className="py-2 px-3">{i + 1}</td>
                                <td className="py-2 px-3 font-bold">{d.selected}</td>
                                <td className="py-2 px-3">{d.correct}</td>
                                <td className="py-2 px-3 font-bold">{d.isCorrect ? "✓" : "✗"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Digit details */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-sm uppercase tracking-widest border-b border-muted pb-2">Digit-Span Answers</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-muted">
                              <th className="py-2 px-3 text-left font-mono text-xs text-muted-foreground">PHASE</th>
                              <th className="py-2 px-3 text-left font-mono text-xs text-muted-foreground">LEN</th>
                              <th className="py-2 px-3 text-left font-mono text-xs text-muted-foreground">TYPED</th>
                              <th className="py-2 px-3 text-left font-mono text-xs text-muted-foreground">CORRECT</th>
                              <th className="py-2 px-3 text-left font-mono text-xs text-muted-foreground">RESULT</th>
                            </tr>
                          </thead>
                          <tbody>
                            {preDigDetail.map((d, i) => (
                              <tr key={`pre-${i}`} className="border-b border-muted/50">
                                <td className="py-2 px-3">PRE</td>
                                <td className="py-2 px-3">{d.length}</td>
                                <td className="py-2 px-3 font-mono">{d.typed}</td>
                                <td className="py-2 px-3 font-mono">{d.correct}</td>
                                <td className="py-2 px-3 font-bold">{d.isCorrect ? "✓" : "✗"}</td>
                              </tr>
                            ))}
                            {postDigDetail.map((d, i) => (
                              <tr key={`post-${i}`} className="border-b border-muted/50">
                                <td className="py-2 px-3">POST</td>
                                <td className="py-2 px-3">{d.length}</td>
                                <td className="py-2 px-3 font-mono">{d.typed}</td>
                                <td className="py-2 px-3 font-mono">{d.correct}</td>
                                <td className="py-2 px-3 font-bold">{d.isCorrect ? "✓" : "✗"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Word details */}
                    <div className="space-y-3 lg:col-span-2">
                      <h3 className="font-bold text-sm uppercase tracking-widest border-b border-muted pb-2">Word Recall Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(["pre", "post"] as const).map((phase) => {
                          const detail = phase === "pre" ? preWordDetail : postWordDetail;
                          const recalled = phase === "pre" ? r.sections.preWords.words : r.sections.postWords.words;
                          const score = phase === "pre" ? pw : opw;
                          return (
                            <div key={phase} className="border border-muted p-4 space-y-2">
                              <div className="font-bold text-xs uppercase tracking-widest">{phase.toUpperCase()}-BREAK ({score}/16)</div>
                              <div className="text-xs space-y-1">
                                <div>
                                  <span className="text-muted-foreground">Recalled: </span>
                                  <span className="font-mono">{recalled.join(", ") || "—"}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Matched: </span>
                                  <span className="font-mono">{detail.matched.join(", ") || "—"}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Missed: </span>
                                  <span className="font-mono">{detail.missed.join(", ") || "—"}</span>
                                </div>
                                {detail.extra.length > 0 && (
                                  <div>
                                    <span className="text-muted-foreground">Extra (wrong): </span>
                                    <span className="font-mono">{detail.extra.join(", ")}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
