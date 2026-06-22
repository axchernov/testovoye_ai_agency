import { CtaLink } from "@/components/CtaLink";
import { SectionHeading } from "@/components/SectionHeading";
import { TerminalCard } from "@/components/TerminalCard";
import { audiences, processSteps, services } from "@/lib/site-content";

const scenario = ["Клиент", "Telegram-бот", "13 вопросов", "Готовая заявка", "Администратор"];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="AI Automation — наверх">
          <span className="brand__mark">A<span>I</span></span>
          <span>AI AUTOMATION</span>
        </a>
        <nav className="site-nav" aria-label="Основная навигация">
          <a href="#services">Что делаем</a>
          <a href="#process">Процесс</a>
          <a href="#audiences">Для кого</a>
        </nav>
        <CtaLink compact>Анкета</CtaLink>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__copy">
            <p className="kicker"><span>AI × BUSINESS</span> Убираем рутину из процессов</p>
            <h1 id="hero-title">AI-автоматизация, которая работает <span className="marker">быстрее отдела</span></h1>
            <p className="hero__lead">Собираем ботов, AI-агентов и внутренние автоматизации для бизнеса: от квалификации лидов до ассистентов для команды.</p>
            <div className="hero__actions">
              <CtaLink>Заполнить анкету</CtaLink>
              <p><strong>13 вопросов</strong><br />и мы поймём, что можно автоматизировать</p>
            </div>
          </div>
          <TerminalCard />
          <p className="hero__side-note" aria-hidden="true">BUILD / TEST / AUTOMATE / REPEAT</p>
        </section>

        <section className="marquee" aria-label="Направления работы">
          <div>AI AGENTS <span>✳</span> TELEGRAM BOTS <span>✳</span> AUTOMATION <span>✳</span> NO MORE ROUTINE</div>
        </section>

        <section className="section services" id="services" aria-labelledby="services-title">
          <SectionHeading eyebrow="01 / Что делаем" title="Автоматизируем то, что съедает время" description="Не продаём магию. Разбираем конкретный процесс и собираем рабочий инструмент под вашу команду." />
          <div className="services-grid">
            {services.map((service, index) => (
              <article className={`service-card service-card--${index + 1}`} key={service.id}>
                <div className="service-card__top"><span>{service.number}</span><b>{service.tag}</b></div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="service-card__plus" aria-hidden="true">＋</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section process" id="process" aria-labelledby="process-title">
          <SectionHeading eyebrow="02 / Процесс" title="От хаоса до работающего сценария" description="Короткими итерациями: сначала ценность, затем всё остальное." light />
          <ol className="process-list">
            {processSteps.map((step, index) => (
              <li key={step.id} style={{ "--step": index } as React.CSSProperties}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                {index < processSteps.length - 1 ? <i aria-hidden="true">↘</i> : null}
              </li>
            ))}
          </ol>
        </section>

        <section className="section audiences" id="audiences" aria-labelledby="audiences-title">
          <SectionHeading eyebrow="03 / Для кого" title="Когда людей нужно освободить для важного" />
          <div className="audience-cloud">
            {audiences.map((audience, index) => (
              <span className={`audience-tag audience-tag--${index + 1}`} key={audience.id}>{audience.label}</span>
            ))}
          </div>
          <p className="audiences__note"><span>NOTE:</span> Если процесс повторяется по правилам — скорее всего, его можно автоматизировать.</p>
        </section>

        <section className="section scenario" id="scenario" aria-labelledby="scenario-title">
          <SectionHeading eyebrow="04 / Живой пример" title="Лид не теряется. Менеджер получает готовую заявку." description="Лендинг отправляет клиента в бота, а бот задаёт вопросы и передаёт структурированные ответы администратору." />
          <div className="scenario-flow">
            {scenario.map((item, index) => (
              <div className="scenario-step" key={item}>
                <span className="scenario-step__number">0{index + 1}</span>
                <strong>{item}</strong>
                {index < scenario.length - 1 ? <span className="scenario-step__arrow" aria-hidden="true">→</span> : null}
              </div>
            ))}
          </div>
          <div className="scenario__result"><span aria-hidden="true">✓</span><p><strong>Результат:</strong> команда видит не «новый лид», а контекст, задачу и следующий шаг.</p></div>
        </section>

        <section className="final-cta" id="contact" aria-labelledby="contact-title">
          <div className="final-cta__stamp" aria-hidden="true">LET&apos;S<br />BUILD</div>
          <p className="kicker kicker--light">05 / START HERE</p>
          <h2 id="contact-title">Хотите понять, что можно <span>автоматизировать у вас?</span></h2>
          <div className="final-cta__bottom">
            <p>Заполните короткую анкету в Telegram-боте — по ответам будет понятно, с чего начать.</p>
            <CtaLink>Заполнить анкету</CtaLink>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>AI AUTOMATION <span>© 2026</span></p>
        <p>Боты / Агенты / Интеграции</p>
        <a href="#top">Наверх ↑</a>
      </footer>
    </>
  );
}
