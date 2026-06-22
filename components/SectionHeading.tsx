type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
};

export function SectionHeading({ eyebrow, title, description, light = false }: SectionHeadingProps) {
  return (
    <div className={`section-heading${light ? " section-heading--light" : ""}`}>
      <p className="section-heading__eyebrow">{eyebrow}</p>
      <div>
        <h2>{title}</h2>
        {description ? <p className="section-heading__description">{description}</p> : null}
      </div>
    </div>
  );
}
