import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { clearSurvey, saveAnswer, startSurvey, userStates } from "../src/state.js";

describe("survey state", () => {
  beforeEach(() => userStates.clear());

  it("создаёт новый опрос с первого шага", () => {
    const state = startSurvey(42);

    assert.deepEqual(state, { step: 0, answers: {} });
    assert.equal(userStates.get(42), state);
  });

  it("сохраняет ответ и переходит к следующему вопросу", () => {
    startSurvey(42);

    const state = saveAnswer(42, "companyName", "Альфа");

    assert.deepEqual(state, { step: 1, answers: { companyName: "Альфа" } });
  });

  it("не сохраняет ответ без активного опроса", () => {
    assert.throws(() => saveAnswer(42, "companyName", "Альфа"), /не найдено/i);
  });

  it("удаляет прогресс", () => {
    startSurvey(42);

    clearSurvey(42);

    assert.equal(userStates.has(42), false);
  });
});
