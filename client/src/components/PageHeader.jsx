export default function PageHeader({ eyebrow, title, sub }) {
  return (
    <section className="border-b border-line">
      <div className="container-x py-20 text-center">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-5xl font-bold">{title}</h1>
        {sub && <p className="mx-auto mt-4 max-w-2xl text-muted">{sub}</p>}
      </div>
    </section>
  );
}
