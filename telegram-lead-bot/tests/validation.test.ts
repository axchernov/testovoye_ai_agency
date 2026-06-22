import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { validateEmail, validatePhone, validateText } from "../src/validation.js";

describe("validation", () => {
  it("отклоняет пустой текст и обрезает непустой", () => {
    assert.deepEqual(validateText("   "), { ok: false });
    assert.deepEqual(validateText("  Альфа  "), { ok: true, value: "Альфа" });
  });

  it("проверяет email", () => {
    assert.equal(validateEmail("ivan@example.ru"), true);
    assert.equal(validateEmail("ivan@"), false);
    assert.equal(validateEmail("@example.ru"), false);
    assert.equal(validateEmail("ivan@example"), false);
    assert.equal(validateEmail("ivan @example.ru"), false);
  });

  it("принимает телефон с обычным оформлением", () => {
    assert.equal(validatePhone("+7 (999) 123-45-67"), true);
    assert.equal(validatePhone("89991234567"), true);
  });

  it("отклоняет телефон с буквами или неверным числом цифр", () => {
    assert.equal(validatePhone("+7 CALL ME"), false);
    assert.equal(validatePhone("123456789"), false);
    assert.equal(validatePhone("1234567890123456"), false);
  });
});
