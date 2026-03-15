import { useState, useEffect, useCallback, useRef } from "react";
import { PRE_DATA, POST_DATA } from "@/data/testData";
import { saveResult, hasCompleted, type ParticipantResult } from "@/lib/storage";
import Grid3x3 from "@/components/Grid3x3";
import ProgressBar from "@/components/ProgressBar";
import Timer from "@/components/Timer";
import PatternDisplay from "@/components/PatternDisplay";
import PatternOptions from "@/components/PatternOptions";

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
  const [patternSelected, setPatternSelected] = useState<number | null>(null);

  // Digit state
  const [digitIndex, setDigitIndex] = useState(0);
  const [digitSubPhase, setDigitSubPhase] = useState<"display" | "answer">("display");
  const [digitInput, setDigitInput] = useState("");
  const [digitSubmitted, setDigitSubmitted] = useState(false);

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

  const recordSectionTime = useCallback((section: string) => {
    const elapsed = (Date.now() - sectionStartRef.current) / 1000;
    setSectionTimes((prev) => ({ ...prev, [section]: elapsed }));
    return elapsed;
  }, []);

  const startSectionTimer = useCallback(() => {
    sectionStartRef.current = Date.now();
  }, []);

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

  const advancePhase = useCallback(() => {
    const idx = PHASE_ORDER.indexOf(phase);
    if (idx < PHASE_ORDER.length - 1) {
      setPhase(PHASE_ORDER[idx + 1]);
    }
  }, [phase]);

  const autoSave = useCallback((updatedResults: ParticipantResult) => {
    saveResult(updatedResults);
  }, []);

  // Phase initialization
  useEffect(() => {
    if (phase === "pre-pattern" || phase === "post-pattern") {
      setPatternIndex(0);
      setPatternSubPhase("display");
      setPatternSelected(null);
      startSectionTimer();
      startTimer(20);
    } else if (phase === "pre-digit" || phase === "post-digit") {
      setDigitIndex(0);
      setDigitSubPhase("display");
      setDigitInput("");
      setDigitSubmitted(false);
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
      const finalResult = { ...results, completed: true };
      setResults(finalResult);
      autoSave(finalResult);
    }
  }, [phase]);

  // Use refs to access latest state in timer callbacks
  const phaseRef = useRef(phase);
  const patternSubPhaseRef = useRef(patternSubPhase);
  const patternSelectedRef = useRef(patternSelected);
  const patternIndexRef = useRef(patternIndex);
  const digitSubPhaseRef = useRef(digitSubPhase);
  const digitIndexRef = useRef(digitIndex);
  const digitInputRef = useRef(digitInput);
  const digitSubmittedRef = useRef(digitSubmitted);
  const wordSubPhaseRef = useRef(wordSubPhase);
  const resultsRef = useRef(results);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { patternSubPhaseRef.current = patternSubPhase; }, [patternSubPhase]);
  useEffect(() => { patternSelectedRef.current = patternSelected; }, [patternSelected]);
  useEffect(() => { patternIndexRef.current = patternIndex; }, [patternIndex]);
  useEffect(() => { digitSubPhaseRef.current = digitSubPhase; }, [digitSubPhase]);
  useEffect(() => { digitIndexRef.current = digitIndex; }, [digitIndex]);
  useEffect(() => { digitInputRef.current = digitInput; }, [digitInput]);
  useEffect(() => { digitSubmittedRef.current = digitSubmitted; }, [digitSubmitted]);
  useEffect(() => { wordSubPhaseRef.current = wordSubPhase; }, [wordSubPhase]);
  useEffect(() => { resultsRef.current = results; }, [results]);

  // Timer-driven transitions
  useEffect(() => {
    if (timer !== 0) return;
    const p = phaseRef.current;

    // Pattern: display phase ends → show answer for 10s
    if ((p === "pre-pattern" || p === "post-pattern") && patternSubPhaseRef.current === "display") {
      setPatternSubPhase("answer");
      setPatternSelected(null);
      startTimer(10);
      return;
    }

    // Pattern: answer phase ends → record answer & advance
    if ((p === "pre-pattern" || p === "post-pattern") && patternSubPhaseRef.current === "answer") {
      commitPatternAnswer();
      return;
    }

    // Digit: display phase ends → show answer for 10s
    if ((p === "pre-digit" || p === "post-digit") && digitSubPhaseRef.current === "display") {
      setDigitSubPhase("answer");
      setDigitInput("");
      setDigitSubmitted(false);
      startTimer(10);
      return;
    }

    // Digit: answer phase ends → record answer & advance
    if ((p === "pre-digit" || p === "post-digit") && digitSubPhaseRef.current === "answer") {
      commitDigitAnswer();
      return;
    }

    // Word: display → recall
    if ((p === "pre-word" || p === "post-word") && wordSubPhaseRef.current === "display") {
      setWordSubPhase("recall");
      startTimer(90);
      return;
    }

    // Word: recall ends
    if ((p === "pre-word" || p === "post-word") && wordSubPhaseRef.current === "recall") {
      handleWordSubmit();
      return;
    }
  }, [timer]);

  // Commit pattern answer (called when 10s answer timer expires)
  const commitPatternAnswer = () => {
    const p = phaseRef.current;
    const key = p === "pre-pattern" ? "prePatterns" : "postPatterns";
    const selected = patternSelectedRef.current;
    const answer = selected !== null ? selected : -1; // -1 = no answer
    const currentResults = resultsRef.current;
    const newAnswers = [...currentResults.sections[key].answers, answer];
    const data = p.startsWith("pre") ? PRE_DATA : POST_DATA;

    const updatedResults = {
      ...currentResults,
      sections: {
        ...currentResults.sections,
        [key]: { ...currentResults.sections[key], answers: newAnswers },
      },
    };

    if (patternIndexRef.current < data.patterns.length - 1) {
      setResults(updatedResults);
      autoSave(updatedResults);
      setPatternIndex((prev) => prev + 1);
      setPatternSubPhase("display");
      setPatternSelected(null);
      startTimer(20);
    } else {
      const elapsed = (Date.now() - sectionStartRef.current) / 1000;
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

  // Commit digit answer (called when 10s answer timer expires)
  const commitDigitAnswer = () => {
    const p = phaseRef.current;
    const key = p === "pre-digit" ? "preDigits" : "postDigits";
    const typed = digitInputRef.current;
    const currentResults = resultsRef.current;
    const newAnswers = [...currentResults.sections[key].answers, typed];
    const data = p.startsWith("pre") ? PRE_DATA : POST_DATA;

    const updatedResults = {
      ...currentResults,
      sections: {
        ...currentResults.sections,
        [key]: { ...currentResults.sections[key], answers: newAnswers },
      },
    };

    if (digitIndexRef.current < data.digits.length - 1) {
      // Check section time cap (90s)
      const elapsed = (Date.now() - sectionStartRef.current) / 1000;
      if (elapsed >= 90) {
        const finalResults = {
          ...updatedResults,
          sections: {
            ...updatedResults.sections,
            [key]: { ...updatedResults.sections[key], answers: newAnswers, timeTaken: elapsed },
          },
        };
        setResults(finalResults);
        autoSave(finalResults);
        stopTimer();
        advancePhase();
        return;
      }
      setResults(updatedResults);
      autoSave(updatedResults);
      setDigitIndex((prev) => prev + 1);
      setDigitSubPhase("display");
      setDigitInput("");
      setDigitSubmitted(false);
      startTimer(5);
    } else {
      const elapsed = (Date.now() - sectionStartRef.current) / 1000;
      const finalResults = {
        ...updatedResults,
        sections: {
          ...updatedResults.sections,
          [key]: { ...updatedResults.sections[key], answers: newAnswers, timeTaken: elapsed },
        },
      };
      setResults(finalResults);
      autoSave(finalResults);
      stopTimer();
      advancePhase();
    }
  };

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

  const handlePatternSelect = (optionIndex: number) => {
    if (patternSelected === null) {
      setPatternSelected(optionIndex);
    }
  };

  const handleDigitInputChange = (val: string) => {
    if (!digitSubmitted) {
      setDigitInput(val.replace(/\D/g, ""));
    }
  };

  const handleDigitEarlySubmit = () => {
    // Lock the input but don't advance — wait for timer
    setDigitSubmitted(true);
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

  const getProgress = () => {
    const idx = PHASE_ORDER.indexOf(phase);
    return (idx / (PHASE_ORDER.length - 1)) * 100;
  };

  const data = getData();

  return (
    <div className="min-h-screen text-foreground font-sans flex items-center justify-center p-4 bg-primary">
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
                  <div className="w-full">
                    <PatternOptions
                      pattern={data.patterns[patternIndex]}
                      onSelect={handlePatternSelect}
                      selectedIndex={patternSelected}
                    />
                    {patternSelected !== null && (
                      <p className="text-center text-sm text-muted-foreground mt-4 font-mono">
                        ANSWER LOCKED — WAITING FOR TIMER...
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* DIGIT SPAN */}
            {(phase === "pre-digit" || phase === "post-digit") && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-sm text-muted-foreground mb-4 font-mono">
                  SEQUENCE {digitIndex + 1} / {data.digits.length} (
                  {data.digits[digitIndex].length} DIGITS)
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
                      onChange={(e) => handleDigitInputChange(e.target.value)}
                      autoFocus
                      disabled={digitSubmitted}
                      className="w-full border-2 border-card-foreground p-4 text-3xl font-mono text-center bg-card text-card-foreground focus:outline-none tabular-nums tracking-[0.3em] disabled:opacity-50"
                      placeholder="..."
                    />
                    {digitSubmitted && (
                      <p className="text-center text-sm text-muted-foreground font-mono">
                        ANSWER LOCKED — WAITING FOR TIMER...
                      </p>
                    )}
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
