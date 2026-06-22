import type { AnswerKey, SurveyState } from "./types.js";

export const userStates = new Map<number, SurveyState>();

export function startSurvey(userId: number): SurveyState {
  const state: SurveyState = { step: 0, answers: {} };
  userStates.set(userId, state);
  return state;
}

export function saveAnswer(userId: number, key: AnswerKey, value: string): SurveyState {
  const state = userStates.get(userId);
  if (!state) {
    throw new Error("Состояние опроса не найдено");
  }

  state.answers[key] = value;
  state.step += 1;
  return state;
}

export function clearSurvey(userId: number): void {
  userStates.delete(userId);
}
