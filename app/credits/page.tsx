const photos = [
  [
    "lounge",
    "25857376",
    "Pușcaș Adryan",
    "beige-armchair-on-a-white-stand-in-front-of-the-white-background",
  ],
  [
    "hero",
    "29149090",
    "Pexels contributor",
    "modern-living-room-interior-with-beige-sofa",
  ],
  [
    "cabinet",
    "8251247",
    "PNW Production",
    "brown-wooden-cabinet-beside-white-wall",
  ],
  [
    "console",
    "6758235",
    "Max Vakhtbovych",
    "minimalist-wooden-cabinet-with-rounded-edges-in-room",
  ],
  [
    "table",
    "30440152",
    "Jyoti Mishra",
    "modern-living-room-with-wooden-coffee-table",
  ],
  [
    "chair",
    "11112728",
    "Ksenia Chernaya",
    "a-brown-wooden-chair-on-a-white-surface",
  ],
  ["dining", "10847177", "Đỗ Huy Hoàng", "brown-wooden-dining-table"],
  ["shelf", "8146216", "Max Vakhtbovych", "brown-wooden-shelf-in-a-white-room"],
  ["craft", "5710747", "Anna Shvets", "focused-craftsman-working-with-wood"],
];
export default function Credits() {
  return (
    <main className="notes-page">
      <a className="wordmark" href="/">
        sora<span>FURNITURE & OBJECTS</span>
      </a>
      <p className="eyebrow">THE DETAILS BEHIND THE CONCEPT</p>
      <h1>
        Photography &<br />
        <em>concept notes.</em>
      </h1>
      <p>
        SORA is an illustrative furniture studio catalog. Product names,
        dimensions, materials, PHP pricing, and collections are sample content.
        The photographs depict independent stock subjects and are design
        references, not SORA-manufactured products, verified inventory, or exact
        material specifications.
      </p>
      <p>
        Material and color swatches are stylized guides. They do not recolor the
        photography. Confirm physical samples, engineering, product drawings,
        delivery, tax, and installation with the actual maker before placing an
        order. Inquiries are saved for review; no payment, production
        commitment, or email notification is made.
      </p>
      <h2>Photography</h2>
      <p>
        Stock imagery sourced from Pexels. Images are cropped for layout and
        detail views. The lounge chair reference is a stock rendering by its
        contributor.
      </p>
      <div className="credits-grid">
        {photos.map(([name, id, by, slug]) => (
          <a
            key={id}
            href={`https://www.pexels.com/photo/${slug}-${id}/`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={`/images/${name}.jpg`}
              alt={`${name} reference photograph`}
            />
            <span>
              {by}
              <small>Pexels · Photo {id} ↗</small>
            </span>
          </a>
        ))}
      </div>
      <p>
        <a
          className="underlink"
          href="https://www.pexels.com/license/"
          target="_blank"
          rel="noreferrer"
        >
          Pexels license ↗
        </a>
      </p>
      <a className="button dark" href="/">
        Back to the collection ↗
      </a>
    </main>
  );
}
