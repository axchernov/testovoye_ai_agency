const commands = [
  ["$", "ai-agent", "qualify lead"],
  ["$", "bot", "collect answers"],
  ["$", "send", "request to admin"],
] as const;

export function TerminalCard() {
  return (
    <div className="terminal-scene" aria-label="Схема работы AI-автоматизации">
      <span className="sticker sticker--ai">AI</span>
      <span className="sticker sticker--bot">BOT</span>
      <span className="sticker sticker--fast">×5 FASTER</span>
      <span className="sticker sticker--vibe">CLAUDE CODE VIBE</span>
      <span className="starburst" aria-hidden="true">✦</span>
      <div className="terminal">
        <div className="terminal__bar">
          <span className="terminal__dots" aria-hidden="true"><i /><i /><i /></span>
          <span>automation.sh</span>
        </div>
        <div className="terminal__body">
          <p className="terminal__label">// LIVE WORKFLOW</p>
          {commands.map(([prompt, action, result]) => (
            <div className="terminal__command" key={action}>
              <span className="terminal__prompt">{prompt}</span>
              <span className="terminal__action">{action}</span>
              <span>{result}</span>
              <b aria-label="готово">DONE</b>
            </div>
          ))}
          <div className="terminal__status"><span /> System is working while you are not</div>
        </div>
      </div>
    </div>
  );
}
