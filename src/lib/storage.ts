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

export async function validateCode(code: string, type: "participant" | "mod"): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("validate-code", {
      body: { code, type },
    });
    if (error) return false;
    return data?.valid === true;
  } catch {
    return false;
  }
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
  try {
    const { data, error } = await supabase.functions.invoke("participant-results", {
      body: { action: "save", result },
    });
    if (error) {
      console.error("Failed to save result:", error);
    }
  } catch (e) {
    console.error("Failed to save result:", e);
  }
}

export async function deleteResult(nickname: string): Promise<boolean> {
  const { error } = await supabase
    .from("participant_results")
    .delete()
    .ilike("nickname", nickname);

  if (error) {
    console.error("Failed to delete result:", error);
    return false;
  }
  return true;
}

export async function hasCompleted(nickname: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("participant-results", {
      body: { action: "has-completed", nickname },
    });
    if (error) return false;
    return data?.completed === true;
  } catch {
    return false;
  }
}
