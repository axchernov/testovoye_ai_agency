export type AnswerKey =
  | "companyName"
  | "website"
  | "industry"
  | "employeeCount"
  | "annualRevenue"
  | "supportPayroll"
  | "painPoint"
  | "startTime"
  | "budget"
  | "contactName"
  | "phone"
  | "email"
  | "otherContacts";

export interface TextQuestion {
  key: AnswerKey;
  type: "text";
  text: string;
  hint?: string;
  validation?: "phone" | "email";
}

export interface ChoiceQuestion {
  key: AnswerKey;
  type: "choice";
  text: string;
  options: readonly string[];
}

export type Question = TextQuestion | ChoiceQuestion;

export type LeadAnswers = Partial<Record<AnswerKey, string>>;

export interface SurveyState {
  step: number;
  answers: LeadAnswers;
}

export interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
}
