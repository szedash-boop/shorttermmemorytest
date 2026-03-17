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
  // Check if exists first
  const { data: existing } = await supabase
    .from("participant_results")
    .select("id")
    .ilike("nickname", result.nickname)
    .limit(1);

  const payload = {
    nickname: result.nickname,
    timestamp: result.timestamp,
    completed: result.completed,
    sections: JSON.parse(JSON.stringify(result.sections)),
  };

  let error;
  if (existing && existing.length > 0) {
    ({ error } = await supabase
      .from("participant_results")
      .update(payload)
      .eq("id", existing[0].id));
  } else {
    ({ error } = await supabase
      .from("participant_results")
      .insert(payload));
  }

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
