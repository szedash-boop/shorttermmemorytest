import { supabase } from "@/integrations/supabase/client";

export interface ParticipantResult {
  nickname: string;
  timestamp: string;
  completed: boolean;
  sections: {
    prePatterns: { answers: number[]; timeTaken: number };
    preDigits: { answers: string[]; timeTaken: number };
    preWords: { words: string[]; timeTaken: number };
    postPatterns: { answers: number[]; timeTaken: number };
    postDigits: { answers: string[]; timeTaken: number };
    postWords: { words: string[]; timeTaken: number };
  };
}

export async function getResults(): Promise<ParticipantResult[]> {
  const { data, error } = await supabase
    .from("participant_results")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    nickname: row.nickname,
    timestamp: row.timestamp,
    completed: row.completed,
    sections: row.sections as unknown as ParticipantResult["sections"],
  }));
}

export async function saveResult(result: ParticipantResult) {
  // Try upsert: insert or update on nickname conflict
  const { error } = await supabase
    .from("participant_results")
    .upsert(
      {
        nickname: result.nickname,
        timestamp: result.timestamp,
        completed: result.completed,
        sections: result.sections as unknown as Record<string, unknown>,
      },
      { onConflict: "nickname" }
    );

  if (error) {
    console.error("Failed to save result:", error);
  }
}

export async function hasCompleted(nickname: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("participant_results")
    .select("completed")
    .ilike("nickname", nickname)
    .eq("completed", true)
    .limit(1);

  if (error || !data) return false;
  return data.length > 0;
}
