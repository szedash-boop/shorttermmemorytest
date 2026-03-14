import { useState, useEffect, useCallback, useRef } from "react";
import { PRE_DATA, POST_DATA } from "@/data/testData";
import { saveResult, hasCompleted, type ParticipantResult } from "@/lib/storage";
import Grid3x3 from "@/components/Grid3x3";
import ProgressBar from "@/components/ProgressBar";
import Timer from "@/components/Timer";
import PatternDisplay from "@/components/PatternDisplay";
import PatternOptions from "@/components/PatternOptions";

// Phases of the test
type Phase =
  | "landing"
  | "pre-pattern"
  | "pre-digit"
  | "pre-word"
  | "break"
  | "post-pattern"
  | "post-digit"
  | "post-word"
  | "closing";

const PHASE_ORDER: Phase[] = [
  "landing",
  "pre-pattern",
  "pre-digit",
  "pre-word",
  "break",
  "post-pattern",
  "post-digit",
  "post-word",
  "closing",
];

const Index = () => {
  const [phase, setPhase] = useState<Phase>("landing");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  // Pattern state
  const [patternIndex, setPatternIndex] = useState(0);
  const [patternSubPhase, setPatternSubPhase] = useState<"display" | "answer">("display");

  // Digit state
  const [digitIndex, setDigitIndex] = useState(0);
  const [digitSubPhase, setDigitSubPhase] = useState<"display" | "answer">("display");
  const [digitInput, setDigitInput] = useState("");

  // Word state
  const [wordSubPhase, setWordSubPhase] = useState<"display" | "recall">("display");
  const [wordRecall, setWordRecall] = useState("");

  // Timer
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Section timing
  const sectionStartRef = useRef(Date.now());
  const [sectionTimes, setSectionTimes] = useState<Record<string, number>>({});

  // Results accumulator
  const [results, setResults] = useState<ParticipantResult>({
    nickname: "",
    timestamp: "",
    completed: false,
    sections: {
      prePatterns: { answers: [], timeTaken: 0 },
      preDigits: { answers: [], timeTaken: 0 },
      preWords: { words: [], timeTaken: 0 },
      postPatterns: { answers: [], timeTaken: 0 },
      postDigits: { answers: [], timeTaken: 0 },
      postWords: { words: [], timeTaken: 0 },
    },
  });

  // Helper to record section time
  const recordSectionTime = useCallback((section: string) => {
    const elapsed = (Date.now() - sectionStartRef.current) / 1000;
    setSectionTimes((prev) => ({ ...prev, [section]: elapsed }));
    return elapsed;
  }, []);

  const startSectionTimer = useCallback(() => {
    sectionStartRef.current = Date.now();
  }, []);

  // Timer logic
  const startTimer = useCallback((seconds: number) => {
    setTimer(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Get current test data based on phase
  const getData = useCallback(() => {
    return phase.startsWith("pre") ? PRE_DATA : POST_DATA;
  }, [phase]);

  const getSectionKey = useCallback(() => {
    if (phase === "pre-pattern") return "prePatterns";
    if (phase === "pre-digit") return "preDigits";
    if (phase === "pre-word") return "preWords";
    if (phase === "post-pattern") return "postPatterns";
    if (phase === "post-digit") return "postDigits";
    if (phase === "post-word") return "postWords";
    return "";
  }, [phase]);

  // Advance to next phase
  const advancePhase = useCallback(() => {
    const idx = PHASE_ORDER.indexOf(phase);
    if (idx < PHASE_ORDER.length - 1) {
      const next = PHASE_ORDER[idx + 1];
      setPhase(next);
    }
  }, [phase]);

  // Auto-save current result
  const autoSave = useCallback(
    (updatedResults: ParticipantResult) => {
      saveResult(updatedResults);
    },
    []
  );

  // Phase initialization
  useEffect(() => {
    if (phase === "pre-pattern" || phase === "post-pattern") {
      setPatternIndex(0);
      setPatternSubPhase("display");
      startSectionTimer();
      startTimer(20);
    } else if (phase === "pre-digit" || phase === "post-digit") {
      setDigitIndex(0);
      setDigitSubPhase("display");
      setDigitInput("");
      startSectionTimer();
      startTimer(5);
    } else if (phase === "pre-word" || phase === "post-word") {
      setWordSubPhase("display");
      setWordRecall("");
      startSectionTimer();
      startTimer(30);
    } else if (phase === "break") {
      startTimer(300);
    } else if (phase === "closing") {
      stopTimer();
      const finalResult = {
        ...results,
        completed: true,
      };
      setResults(finalResult);
      autoSave(finalResult);
    }
  }, [phase]);

  // Timer-driven transitions
  useEffect(() => {
    if (timer !== 0) return;

    if ((phase === "pre-pattern" || phase === "post-pattern") && patternSubPhase === "display") {
      setPatternSubPhase("answer");
    }

    if ((phase === "pre-digit" || phase === "post-digit") && digitSubPhase === "display") {
      setDigitSubPhase("answer");
    }

    if ((phase === "pre-word" || phase === "post-word") && wordSubPhase === "display") {
      setWordSubPhase("recall");
      startTimer(90);
    } else if ((phase === "pre-word" || phase === "post-word") && wordSubPhase === "recall") {
      handleWordSubmit();
    }
  }, [timer]);

  // Section time cap for digit-span (1.5 min = 90s)
  useEffect(() => {
    if (phase === "pre-digit" || phase === "post-digit") {
      const elapsed = (Date.now() - sectionStartRef.current) / 1000;
      if (elapsed >= 90) {
        handleDigitSectionEnd();
      }
    }
  }, [timer, phase]);

  // --- HANDLERS ---

  const handleStart = () => {
    if (!nickname.trim()) {
      setError("Please enter a nickname.");
      return;
    }
    if (hasCompleted(nickname.trim())) {
      setError("You have already completed the test.");
      return;
    }
    setError("");
    const r = {
      ...results,
      nickname: nickname.trim(),
      timestamp: new Date().toISOString(),
    };
    setResults(r);
    autoSave(r);
    setPhase("pre-pattern");
  };

  const handlePatternAnswer = (optionIndex: number) => {
    const key = getSectionKey() as "prePatterns" | "postPatterns";
    const newAnswers = [...results.sections[key].answers, optionIndex];

    const updatedResults = {
      ...results,
      sections: {
        ...results.sections,
        [key]: { ...results.sections[key], answers: newAnswers },
      },
    };
    setResults(updatedResults);
    autoSave(updatedResults);

    const data = getData();
    if (patternIndex < data.patterns.length - 1) {
      setPatternIndex(patternIndex + 1);
      setPatternSubPhase("display");
      startTimer(20);
    } else {
      const elapsed = recordSectionTime(key);
      const finalResults = {
        ...updatedResults,
        sections: {
          ...updatedResults.sections,
          [key]: { ...updatedResults.sections[key], answers: newAnswers, timeTaken: elapsed },
        },
      };
      setResults(finalResults);
      autoSave(finalResults);
      advancePhase();
    }
  };

  const handleDigitSubmit = () => {
    const key = getSectionKey() as "preDigits" | "postDigits";
    const data = getData();
    const newAnswers = [...results.sections[key].answers, digitInput];

    const updatedResults = {
      ...results,
      sections: {
        ...results.sections,
        [key]: { ...results.sections[key], answers: newAnswers },
      },
    };
    setResults(updatedResults);
    autoSave(updatedResults);
    setDigitInput("");

    if (digitIndex < data.digits.length - 1) {
      setDigitIndex(digitIndex + 1);
      setDigitSubPhase("display");
      startTimer(5);
    } else {
      handleDigitSectionEnd(updatedResults);
    }
  };

  const handleDigitSectionEnd = (currentResults?: ParticipantResult) => {
    const key = getSectionKey() as "preDigits" | "postDigits";
    const elapsed = recordSectionTime(key);
    const r = currentResults || results;
    const finalResults = {
      ...r,
      sections: {
        ...r.sections,
        [key]: { ...r.sections[key], timeTaken: elapsed },
      },
    };
    setResults(finalResults);
    autoSave(finalResults);
    stopTimer();
    advancePhase();
  };

  const handleWordSubmit = () => {
    const key = getSectionKey() as "preWords" | "postWords";
    const elapsed = recordSectionTime(key);
    const words = wordRecall
      .split("\n")
      .map((w) => w.trim().toUpperCase())
      .filter((w) => w.length > 0);

    const updatedResults = {
      ...results,
      sections: {
        ...results.sections,
        [key]: { words, timeTaken: elapsed },
      },
    };
    setResults(updatedResults);
    autoSave(updatedResults);
    stopTimer();
    advancePhase();
  };

  // --- PROGRESS ---
  const getProgress = () => {
    const idx = PHASE_ORDER.indexOf(phase);
    return ((idx) / (PHASE_ORDER.length - 1)) * 100;
  };

  // --- RENDER ---
  const data = getData();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-card text-card-foreground p-8 md:p-12 border-2 border-foreground">
        {/* LANDING */}
        {phase === "landing" && (
          <div className="space-y-8">
            <div className="border-b-4 border-card-foreground pb-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
                Short-Term Memory Lab
              </h1>
              <p className="mt-2 text-muted-foreground font-mono text-sm">
                STML-CORE-V1.0
              </p>
            </div>
            <p className="text-lg leading-relaxed">
              Welcome to this 15-minute Short-term Memory Test! Please take your
              time and attention in answering each item of the test, and ensure
              you are in a quiet environment to minimize distractions. Good luck!
            </p>
            <div className="space-y-4">
              <label className="block uppercase font-bold text-sm tracking-widest">
                Participant Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                className="w-full border-2 border-card-foreground p-4 text-xl bg-card text-card-foreground focus:outline-none focus:bg-card-foreground focus:text-card transition-colors placeholder:text-muted-foreground"
                placeholder="ENTER ALIAS..."
              />
              {error && (
                <p className="text-card-foreground font-bold border-2 border-card-foreground p-3 bg-accent text-accent-foreground">
                  ⚠ {error}
                </p>
              )}
              <button
                onClick={handleStart}
                disabled={!nickname.trim()}
                className="w-full bg-card-foreground text-card p-6 text-xl font-bold hover:opacity-80 disabled:opacity-30 transition-opacity flex items-center justify-center gap-2"
              >
                BEGIN TEST →
              </button>
            </div>
          </div>
        )}

        {/* TEST PHASES */}
        {phase !== "landing" && phase !== "closing" && (
          <div className="min-h-[400px] flex flex-col">
            <div className="flex justify-between items-end mb-4">
              <span className="font-bold uppercase tracking-tighter text-sm">
                {phase.replace("-", " ").toUpperCase()}
              </span>
              <Timer seconds={timer} />
            </div>
            <ProgressBar progress={getProgress()} />

            {/* PATTERN RECOGNITION */}
            {(phase === "pre-pattern" || phase === "post-pattern") && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-sm text-muted-foreground mb-4 font-mono">
                  ITEM {patternIndex + 1} / {data.patterns.length}
                </p>
                {patternSubPhase === "display" ? (
                  <PatternDisplay pattern={data.patterns[patternIndex]} />
                ) : (
                  <PatternOptions
                    options={data.patterns[patternIndex].options}
                    onSelect={handlePatternAnswer}
                  />
                )}
              </div>
            )}

            {/* DIGIT SPAN */}
            {(phase === "pre-digit" || phase === "post-digit") && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-sm text-muted-foreground mb-4 font-mono">
                  SEQUENCE {digitIndex + 1} / {data.digits.length} ({data.digits[digitIndex].length} DIGITS)
                </p>
                {digitSubPhase === "display" ? (
                  <div className="text-center">
                    <h2 className="text-xl font-bold uppercase tracking-tighter mb-6">
                      MEMORIZE THIS SEQUENCE
                    </h2>
                    <div className="text-6xl md:text-7xl font-mono font-bold tracking-[0.3em] tabular-nums">
                      {data.digits[digitIndex]}
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-tighter text-center">
                      TYPE THE SEQUENCE
                    </h2>
                    <input
                      type="text"
                      value={digitInput}
                      onChange={(e) => setDigitInput(e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => e.key === "Enter" && handleDigitSubmit()}
                      autoFocus
                      className="w-full border-2 border-card-foreground p-4 text-3xl font-mono text-center bg-card text-card-foreground focus:outline-none tabular-nums tracking-[0.3em]"
                      placeholder="..."
                    />
                    <button
                      onClick={handleDigitSubmit}
                      className="w-full bg-card-foreground text-card p-4 font-bold hover:opacity-80 transition-opacity"
                    >
                      SUBMIT
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* WORD LIST */}
            {(phase === "pre-word" || phase === "post-word") && (
              <div className="flex-1">
                {wordSubPhase === "display" ? (
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-tighter mb-6 text-center">
                      MEMORIZE THESE WORDS
                    </h2>
                    <div className="grid grid-cols-4 gap-3">
                      {data.words.map((w, i) => (
                        <div
                          key={i}
                          className="border border-card-foreground p-3 text-center font-bold tracking-tight text-sm"
                        >
                          {w}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-tighter">
                      TYPE ALL WORDS YOU RECALL (ONE PER LINE)
                    </h2>
                    <textarea
                      value={wordRecall}
                      onChange={(e) => setWordRecall(e.target.value)}
                      className="w-full h-64 border-2 border-card-foreground p-4 font-mono text-lg bg-card text-card-foreground focus:outline-none"
                      autoFocus
                      placeholder="Type one word per line..."
                    />
                    <button
                      onClick={handleWordSubmit}
                      className="w-full bg-card-foreground text-card p-4 font-bold hover:opacity-80 transition-opacity"
                    >
                      SUBMIT RECALL
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* BREAK */}
            {phase === "break" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">
                  MANDATORY BREAK
                </h2>
                <p className="text-lg max-w-md">
                  You are given a 5-minute break. Please wait for further verbal
                  instructions from the testers. Thank you!
                </p>
                <div className="text-7xl md:text-8xl font-mono font-bold tabular-nums">
                  {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </div>
                {timer === 0 && (
                  <button
                    onClick={advancePhase}
                    className="bg-card-foreground text-card px-12 py-4 font-bold text-xl hover:opacity-80 transition-opacity"
                  >
                    CONTINUE TO PART 2 →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* CLOSING */}
        {phase === "closing" && (
          <div className="text-center space-y-8 py-8">
            <div className="text-6xl mb-4">✓</div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">
              Test Complete
            </h1>
            <p className="text-lg leading-relaxed max-w-lg mx-auto">
              Thank you for your time and participation in answering this
              short-term memory test! Your effort is truly appreciated. Please
              turn back to the Zoom meeting for some closing remarks and
              announcements from the testers.
            </p>
            <div className="pt-8 border-t border-muted text-sm font-mono text-muted-foreground">
              SESSION_ID:{" "}
              {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
