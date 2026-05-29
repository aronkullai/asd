type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
};

export function SectionHeader({ eyebrow, title, description, center = false }: SectionHeaderProps) {
  return (
    <div className={`mb-8 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-accent-dark">{eyebrow}</p> : null}
      <h1 className="text-4xl font-black tracking-normal text-navy md:text-5xl">{title}</h1>
      {description ? <p className="mt-4 text-lg text-muted">{description}</p> : null}
    </div>
  );
}
