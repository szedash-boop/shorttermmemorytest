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

export async function getResults(modCode: string): Promise<ParticipantResult[]> {
  try {
    const { data, error } = await supabase.functions.invoke("dashboard-data", {
      body: { action: "list", modCode },
    });
    if (error || !data?.data) return [];
    return data.data.map((row: any) => ({
      nickname: row.nickname,
      timestamp: row.timestamp,
      completed: row.completed,
      sections: row.sections as ParticipantResult["sections"],
    }));
  } catch {
    return [];
  }
}

export async function saveResult(result: ParticipantResult) {
  try {
    const { error } = await supabase.functions.invoke("participant-results", {
      body: { action: "save", result },
    });
    if (error) {
      console.error("Failed to save result:", error);
    }
  } catch (e) {
    console.error("Failed to save result:", e);
  }
}

export async function deleteResult(nickname: string, modCode: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("dashboard-data", {
      body: { action: "delete", modCode, nickname },
    });
    if (error) return false;
    return data?.success === true;
  } catch {
    return false;
  }
}

export async function markComplete(nickname: string, modCode: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("dashboard-data", {
      body: { action: "mark-complete", modCode, nickname },
    });
    if (error) return false;
    return data?.success === true;
  } catch {
    return false;
  }
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
