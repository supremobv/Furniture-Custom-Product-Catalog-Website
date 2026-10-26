"use client";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Search,
  Heart,
  Download,
  Check,
  SlidersHorizontal,
  Plus,
  Minus,
} from "lucide-react";
import {
  products,
  materials,
  finishes,
  categories,
  collections,
  money,
  estimate,
  budgets,
  timelines,
  type Product,
} from "./catalog-data";

function Modal({
  children,
  title,
  onClose,
  wide = false,
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={`modal ${wide ? "wide" : ""}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className="close" onClick={onClose} aria-label="Close dialog">
        <X size={20} />
      </button>
      {children}
    </dialog>
  );
}
export default function Catalog() {
  const [menu, setMenu] = useState(false),
    [category, setCategory] = useState("All pieces"),
    [collection, setCollection] = useState("All collections"),
    [query, setQuery] = useState(""),
    [sort, setSort] = useState("featured"),
    [all, setAll] = useState(false),
    [savedOnly, setSavedOnly] = useState(false),
    [saved, setSaved] = useState<string[]>([]),
    [loaded, setLoaded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null),
    [gallery, setGallery] = useState(0),
    [material, setMaterial] = useState(""),
    [finish, setFinish] = useState(""),
    [qty, setQty] = useState(1),
    [inquiry, setInquiry] = useState(false),
    [inquiryId, setInquiryId] = useState("custom"),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [reference, setReference] = useState(""),
    [materialTab, setMaterialTab] = useState("oak");
  useEffect(() => {
    try {
      const value = JSON.parse(localStorage.getItem("sora-shortlist") || "[]");
      if (Array.isArray(value))
        setSaved(
          value.filter(
            (v: unknown) =>
              typeof v === "string" && products.some((p) => p.id === v),
          ),
        );
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded)
      try {
        localStorage.setItem("sora-shortlist", JSON.stringify(saved));
      } catch {}
  }, [saved, loaded]);
  function toggleSave(id: string) {
    setSaved((s) => (s.includes(id) ? s.filter((i) => i !== id) : [...s, id]));
  }
  function openProduct(p: Product) {
    setProduct(p);
    setMaterial(p.materials[0]);
    setFinish(p.finishes[0]);
    setQty(1);
    setGallery(0);
  }
  function startInquiry(p?: Product) {
    setProduct(null);
    setInquiryId(p?.id || "custom");
    if (!p) {
      setMaterial("oak");
      setFinish("natural");
      setQty(1);
    }
    setError("");
    setReference("");
    setInquiry(true);
  }
  function chooseInquiry(id: string) {
    setInquiryId(id);
    const p = products.find((p) => p.id === id);
    setMaterial(p?.materials[0] || "oak");
    setFinish(p?.finishes[0] || "natural");
  }
  const filtered = products
    .filter(
      (p) =>
        (category === "All pieces" || p.category === category) &&
        (collection === "All collections" || p.collection === collection) &&
        (!savedOnly || saved.includes(p.id)) &&
        `${p.name} ${p.category} ${p.collection}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : sort === "name"
            ? a.name.localeCompare(b.name)
            : 0,
    );
  const shown = all ? filtered : filtered.slice(0, 6),
    selectedProduct = products.find((p) => p.id === inquiryId),
    sample = estimate(inquiryId, material, qty);
  const activeMaterial = materials.find((m) => m.id === materialTab)!;
  function resetFilters() {
    setCategory("All pieces");
    setCollection("All collections");
    setQuery("");
    setSavedOnly(false);
    setAll(false);
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          productId: inquiryId,
          material,
          finish,
          quantity: qty,
        }),
      });
      const json = (await res.json()) as { error?: string; reference: string };
      if (!res.ok)
        throw new Error(
          json.error || "Your inquiry could not be saved. Please try again.",
        );
      setReference(json.reference);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  function browseCollection(value: string) {
    resetFilters();
    setCollection(value);
  }
  return (
    <>
      <div className="announcement">
        Furniture with a little more thought.{" "}
        <a href="#bespoke">
          Explore made-to-measure <ArrowUpRight size={12} />
        </a>
      </div>
      <header className="site-header">
        <a href="#" className="wordmark" aria-label="SORA home">
          sora<span>FURNITURE & OBJECTS</span>
        </a>
        <nav className={menu ? "open" : ""} aria-label="Main navigation">
          <a href="#pieces" onClick={() => setMenu(false)}>
            The collection
          </a>
          <a href="#materials" onClick={() => setMenu(false)}>
            Materials & finishes
          </a>
          <a href="#bespoke" onClick={() => setMenu(false)}>
            Made for you
          </a>
          <a href="#story" onClick={() => setMenu(false)}>
            Our approach
          </a>
        </nav>
        <div className="header-actions">
          <a
            href="#pieces"
            className={`shortlist ${savedOnly ? "active" : ""}`}
            aria-label={`View shortlist, ${saved.length} saved pieces`}
            onClick={() => {
              setSavedOnly(!savedOnly);
              setMenu(false);
            }}
          >
            <Heart size={18} />
            <span>{saved.length}</span>
          </a>
          <button
            className="text-button header-inquiry"
            onClick={() => startInquiry()}
          >
            Start a project <ArrowUpRight size={16} />
          </button>
          <button
            className="menu-button"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle navigation"
            aria-expanded={menu}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="dot" /> THE ART OF EVERYDAY LIVING
            </p>
            <h1>
              Made for life.
              <br />
              <em>Made for you.</em>
            </h1>
            <p className="hero-intro">
              Thoughtful furniture. Natural textures.
              <br />
              Pieces that feel right, wherever life happens.
            </p>
            <a className="button dark" href="#pieces">
              Explore the collection <ArrowUpRight size={18} />
            </a>
            <div className="hero-foot">
              <span>
                A considered home
                <br />
                starts with a single piece.
              </span>
              <a href="#collections" aria-label="Discover the collections">
                <ArrowDown size={19} />
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="/images/lounge.jpg"
              alt="Sculptural cream chair with dark frame in warm sunlight"
              fetchPriority="high"
            />
            <span className="vertical-label">THE SOFT EDIT / VOL. 01</span>
            <button
              className="hero-product"
              onClick={() => openProduct(products[0])}
            >
              <span>
                <small>IN FOCUS</small>Forma lounge chair
              </span>
              <span className="round-arrow">
                <ArrowUpRight size={20} />
              </span>
            </button>
          </div>
        </section>
        <div className="values-strip">
          <span>Considered forms</span>
          <i>✳</i>
          <span>Material possibilities</span>
          <i>✳</i>
          <span>Room for your ideas</span>
          <i>✳</i>
          <span>Objects with purpose</span>
        </div>
        <section className="section collection-section" id="collections">
          <div className="section-top">
            <p className="eyebrow">01 / FIND YOUR EVERYDAY</p>
            <p className="aside-note">Different rooms. Shared sensibilities.</p>
          </div>
          <div className="section-heading">
            <h2>
              A place for
              <br />
              <em>every possibility.</em>
            </h2>
            <p>
              From the first cup to the last chapter.
              <br />
              Discover pieces for the way you live.
            </p>
          </div>
          <div className="collection-grid">
            <a
              href="#pieces"
              onClick={() => browseCollection("The Soft Edit")}
              className="collection-card"
            >
              <img
                src="/images/hero.jpg"
                alt="Soft neutral upholstery beside a sunlit window"
                loading="lazy"
              />
              <div>
                <span>
                  <small>01 / SEATING & SOFT FORMS</small>
                  <h3>The Soft Edit</h3>
                </span>
                <ArrowUpRight />
              </div>
            </a>
            <a
              href="#pieces"
              onClick={() => browseCollection("Natural Form")}
              className="collection-card"
            >
              <img
                src="/images/cabinet.jpg"
                alt="Simple wood cabinet and natural textures"
                loading="lazy"
              />
              <div>
                <span>
                  <small>02 / WOOD & EVERYDAY RITUALS</small>
                  <h3>Natural Form</h3>
                </span>
                <ArrowUpRight />
              </div>
            </a>
            <a
              href="#pieces"
              onClick={() => browseCollection("Spaces, Considered")}
              className="collection-card"
            >
              <img
                src="/images/shelf.jpg"
                alt="Wall shelving and integrated work surface"
                loading="lazy"
              />
              <div>
                <span>
                  <small>03 / STORAGE & CUSTOM SPACES</small>
                  <h3>Spaces, Considered</h3>
                </span>
                <ArrowUpRight />
              </div>
            </a>
          </div>
        </section>
        <section className="section pieces-section" id="pieces">
          <div className="section-top">
            <p className="eyebrow">02 / THE COLLECTION</p>
            <a
              className="underlink"
              href="/catalogs/sora-collection.pdf"
              download
            >
              Download the catalog <Download size={15} />
            </a>
          </div>
          <div className="section-heading">
            <h2>
              Good company
              <br />
              <em>for your home.</em>
            </h2>
            <p>
              A small collection of considered starting points.
              <br />
              Choose a piece. Make it your own.
            </p>
          </div>
          <div
            className="catalog-tabs"
            role="group"
            aria-label="Product categories"
          >
            {categories.map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                className={category === c ? "selected" : ""}
                onClick={() => {
                  setCategory(c);
                  setAll(false);
                }}
              >
                {c}
                {c === "All pieces" && <sup>08</sup>}
              </button>
            ))}
            <button
              className={`saved-tab ${savedOnly ? "selected" : ""}`}
              onClick={() => setSavedOnly(!savedOnly)}
              aria-pressed={savedOnly}
            >
              <Heart size={15} /> Shortlist ({saved.length})
            </button>
          </div>
          <div className="catalog-tools">
            <label className="search">
              <Search size={17} />
              <input
                type="search"
                placeholder="Find your next piece"
                aria-label="Search products"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <div className="selects">
              <label>
                <SlidersHorizontal size={14} />
                <span className="sr-only">Collection</span>
                <select
                  aria-label="Filter collection"
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                >
                  {collections.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">Sort products</span>
                <select
                  aria-label="Sort products"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="featured">Featured first</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  <option value="name">Name: A–Z</option>
                </select>
              </label>
            </div>
          </div>
          <div className="results-note" aria-live="polite">
            <span>
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} to
              explore{savedOnly ? " in your shortlist" : ""}
            </span>
            {(query ||
              category !== "All pieces" ||
              collection !== "All collections" ||
              savedOnly) && (
              <button onClick={resetFilters}>
                Clear filters <X size={12} />
              </button>
            )}
            <span>Concept pieces · sample PHP prices</span>
          </div>
          <div className="product-grid">
            {shown.map((p) => (
              <article key={p.id} className="product-card">
                <div className="product-image">
                  <button
                    className="image-open"
                    onClick={() => openProduct(p)}
                    aria-label={`Explore ${p.name}`}
                  >
                    <img
                      src={`/images/${p.image}.jpg`}
                      alt={p.alt}
                      loading="lazy"
                    />
                    <span className="view-piece">
                      Discover the piece <ArrowUpRight size={17} />
                    </span>
                  </button>
                  {p.tag && <span className="product-tag">{p.tag}</span>}
                  <button
                    className={`save ${saved.includes(p.id) ? "is-saved" : ""}`}
                    aria-label={`${saved.includes(p.id) ? "Remove" : "Save"} ${p.name}`}
                    aria-pressed={saved.includes(p.id)}
                    onClick={() => toggleSave(p.id)}
                  >
                    <Heart
                      size={17}
                      fill={saved.includes(p.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <div className="product-meta">
                  <p>
                    {p.category} <span>{p.code}</span>
                  </p>
                  <button onClick={() => openProduct(p)}>
                    <h3>{p.name}</h3>
                    <ArrowUpRight size={17} />
                  </button>
                  <div>
                    <span>From {money(p.price)}</span>
                    <span className="mini-swatches">
                      {p.finishes.map((id) => (
                        <i
                          key={id}
                          style={{
                            background: finishes.find((f) => f.id === id)
                              ?.color,
                          }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty">
              <h3>A little room to start again.</h3>
              <p>
                {savedOnly
                  ? "Save pieces with the heart icon to build your shortlist."
                  : "Try a different search or clear your filters."}
              </p>
              <button className="button dark" onClick={resetFilters}>
                Explore all pieces <ArrowRight size={16} />
              </button>
            </div>
          )}
          {!all && filtered.length > 6 && (
            <div className="center">
              <button className="button outline" onClick={() => setAll(true)}>
                Discover all {filtered.length} pieces <Plus size={17} />
              </button>
            </div>
          )}
          <p className="catalog-note">
            An illustrative catalog, thoughtfully put together. Stock imagery
            represents design directions; dimensions, materials, and prices are
            sample specifications.
          </p>
        </section>
        <section className="materials-section" id="materials">
          <div className="material-visual">
            <div
              className={`material-sample ${activeMaterial.id === "upholstery" ? "fabric" : ""}`}
              style={{ backgroundColor: activeMaterial.color }}
            >
              <span>
                SORA
                <br />
                <small>MATERIAL LIBRARY</small>
              </span>
              <b>
                {String(
                  materials.findIndex((m) => m.id === materialTab) + 1,
                ).padStart(2, "0")}
              </b>
            </div>
            <div className="sample-caption">
              <span>TEXTURE STUDY / {activeMaterial.name.toUpperCase()}</span>
              <span>ILLUSTRATIVE SWATCH</span>
            </div>
          </div>
          <div className="material-copy">
            <p className="eyebrow">03 / THE BEAUTY IS IN THE DETAILS</p>
            <h2>
              Start with
              <br />
              <em>what feels right.</em>
            </h2>
            <p>
              A warmer grain. A softer tone. A little contrast.
              <br />
              Material choices set the mood for everything else.
            </p>
            <div
              className="material-buttons"
              role="group"
              aria-label="Explore materials"
            >
              {materials.map((m) => (
                <button
                  key={m.id}
                  className={m.id === materialTab ? "selected" : ""}
                  onClick={() => setMaterialTab(m.id)}
                  aria-pressed={m.id === materialTab}
                  aria-label={`Explore ${m.name}`}
                >
                  <i style={{ backgroundColor: m.color }} />
                  {m.name}
                </button>
              ))}
            </div>
            <div className="material-description" aria-live="polite">
              <h3>{activeMaterial.name}</h3>
              <p>{activeMaterial.note}</p>
            </div>
            <p className="small-note">
              On-screen swatches are a guide. Confirm physical samples,
              composition, construction, and finish before ordering.
            </p>
            <button className="underlink" onClick={() => startInquiry()}>
              Let’s find your finish <ArrowUpRight size={17} />
            </button>
          </div>
        </section>
        <section className="section bespoke-section" id="bespoke">
          <div className="bespoke-copy">
            <p className="eyebrow">04 / A LITTLE MORE PERSONAL</p>
            <h2>
              Your space.
              <br />
              Your story.
              <br />
              <em>Your piece.</em>
            </h2>
            <p>
              Some ideas don’t come in a standard size.
              <br />
              From a cabinet that fits just right to a table that brings
              everyone together, start with what you have in mind.
            </p>
            <button className="button dark" onClick={() => startInquiry()}>
              Let’s make it yours <ArrowUpRight size={17} />
            </button>
            <span className="small-note">
              Furniture · Cabinetry · Custom product concepts
            </span>
          </div>
          <div className="bespoke-photo">
            <img
              src="/images/console.jpg"
              alt="Warm wood cabinet with rounded corners and a dark frame"
              loading="lazy"
            />
            <div>
              <span>THE QUIET CURVE</span>
              <button onClick={() => openProduct(products[3])}>
                Explore the direction <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </section>
        <section className="section process-section" id="story">
          <div className="section-top">
            <p className="eyebrow">
              05 / GOOD THINGS START WITH A CONVERSATION
            </p>
          </div>
          <div className="process-intro">
            <h2>
              Considered.
              <br />
              <em>At every step.</em>
            </h2>
            <p>
              SORA is a furniture studio concept built around one simple idea:
              the right piece should fit your life as well as your space.
            </p>
          </div>
          <div className="process-grid">
            {[
              {
                n: "01",
                title: "Share your idea.",
                text: "A favourite piece, a room to solve, or a sketch on paper. Tell us where you want to begin.",
              },
              {
                n: "02",
                title: "Find the right fit.",
                text: "Explore dimensions, material directions, and finishes. Review a proposal before making a commitment.",
              },
              {
                n: "03",
                title: "Agree the details.",
                text: "Confirm samples, drawings, cost, and timeline with the maker before production begins.",
              },
            ].map((s) => (
              <div key={s.n}>
                <span>{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="catalog-download" id="catalog">
          <div className="catalog-cover">
            <span>sora</span>
            <div>
              Objects for
              <br />
              <em>everyday living.</em>
            </div>
            <img
              src="/images/lounge.jpg"
              alt="Preview of SORA furniture catalog cover"
              loading="lazy"
            />
            <small>THE CONCEPT COLLECTION / 2026</small>
          </div>
          <div className="download-copy">
            <p className="eyebrow">A LITTLE INSPIRATION, TO KEEP.</p>
            <h2>
              Take a slower look.
              <br />
              <em>Make room for ideas.</em>
            </h2>
            <p>
              The collection, sample dimensions, and material possibilities.
              <br />
              All in one place, for whenever inspiration finds you.
            </p>
            <a
              className="button light"
              href="/catalogs/sora-collection.pdf"
              download
            >
              Download collection catalog <Download size={17} />
            </a>
            <span className="download-detail">
              PDF · 8 concept pieces · No sign-up needed
            </span>
          </div>
        </section>
        <section className="section faq-section">
          <div>
            <p className="eyebrow">BEFORE WE BEGIN</p>
            <h2>
              A few
              <br />
              <em>good questions.</em>
            </h2>
          </div>
          <div className="faq-list">
            {[
              {
                q: "Can I change the size or finish?",
                a: "Yes. Use a product’s inquiry form to share your preferred dimensions and finish direction. All custom specifications must be reviewed and confirmed by the maker; selections here are a starting brief.",
              },
              {
                q: "Are these ready-to-order products?",
                a: "This is an illustrative furniture studio catalog. Product names, specifications, and PHP prices are samples. Photography shows design inspiration, not verified inventory or manufacturing results.",
              },
              {
                q: "Does an inquiry confirm an order?",
                a: "No. Your inquiry is saved for review. It does not take payment, reserve stock, or confirm production. A maker should provide a written quote and agreed specifications before an order is placed.",
              },
              {
                q: "Will the color match what I see on screen?",
                a: "Screens, lighting, and natural grain all change how a finish appears. Swatches are illustrative and do not recolor the reference photography. Ask for physical samples before approving materials.",
              },
            ].map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <Plus size={16} />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="final-cta">
          <p className="eyebrow">SOMETHING ON YOUR MIND?</p>
          <h2>
            Let’s make
            <br />
            <em>room for it.</em>
          </h2>
          <button
            className="circle-cta"
            aria-label="Start a custom order inquiry"
            onClick={() => startInquiry()}
          >
            <ArrowUpRight size={36} />
          </button>
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <a className="wordmark" href="#">
            sora<span>FURNITURE & OBJECTS</span>
          </a>
          <p>
            Objects for everyday living.
            <br />
            Possibilities for your own space.
          </p>
          <div>
            <a href="#pieces">The collection</a>
            <a href="#materials">Material library</a>
            <a href="/catalogs/sora-collection.pdf" download>
              Download catalog
            </a>
          </div>
          <div>
            <button onClick={() => startInquiry()}>
              Start a conversation <ArrowUpRight size={14} />
            </button>
            <a href="/credits">Photography & concept notes</a>
            <a href="/studio">Studio inbox</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SORA. A furniture studio concept.</span>
          <span>Sample products & pricing. Made to inspire.</span>
          <a href="#">Back to top ↑</a>
        </div>
      </footer>
      {product && (
        <Modal title={product.name} onClose={() => setProduct(null)} wide>
          <div className="product-dialog">
            <div className="detail-gallery">
              <div className={`detail-photo view-${gallery}`}>
                <img
                  src={`/images/${product.image}.jpg`}
                  alt={`${product.alt}${gallery === 1 ? " — detail crop" : ""}`}
                />
              </div>
              <div className="gallery-bar">
                <button
                  aria-label="Previous product image"
                  onClick={() => setGallery((g) => (g === 0 ? 1 : 0))}
                >
                  <ChevronLeft size={17} />
                </button>
                <span>
                  {gallery === 0 ? "01 / FULL VIEW" : "02 / DETAIL CROP"}
                </span>
                <button
                  aria-label="Next product image"
                  onClick={() => setGallery((g) => (g === 0 ? 1 : 0))}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
              <p>
                Reference image · stock photography. Color selections do not
                change this image.
              </p>
            </div>
            <div className="detail-copy">
              <p className="eyebrow">
                {product.collection} / {product.code}
              </p>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <div className="detail-specs">
                <span>Sample dimensions</span>
                <strong>{product.dimensions}</strong>
                <span>Category</span>
                <strong>{product.category}</strong>
              </div>
              <label className="field">
                Material direction
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                >
                  {materials
                    .filter((m) => product.materials.includes(m.id))
                    .map((m) => (
                      <option value={m.id} key={m.id}>
                        {m.name}
                        {m.extra > 0 && m.id !== product.materials[0]
                          ? ` (+${money(m.extra)})`
                          : ""}
                      </option>
                    ))}
                </select>
              </label>
              <fieldset className="finish-picker">
                <legend>
                  Finish direction{" "}
                  <strong>{finishes.find((f) => f.id === finish)?.name}</strong>
                </legend>
                {finishes
                  .filter((f) => product.finishes.includes(f.id))
                  .map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={finish === f.id ? "chosen" : ""}
                      onClick={() => setFinish(f.id)}
                      aria-label={`Choose ${f.name} finish`}
                      aria-pressed={finish === f.id}
                      style={{ backgroundColor: f.color }}
                    >
                      {finish === f.id && <Check size={17} />}
                    </button>
                  ))}
              </fieldset>
              <div className="estimate-row">
                <div>
                  <small>SAMPLE STARTING ESTIMATE</small>
                  <strong>
                    {money(estimate(product.id, material, qty) || 0)}
                  </strong>
                </div>
                <div className="quantity">
                  <button
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                    onClick={() => setQty((q) => q - 1)}
                  >
                    <Minus size={14} />
                  </button>
                  <span aria-label="Quantity">{qty}</span>
                  <button
                    aria-label="Increase quantity"
                    disabled={qty >= 50}
                    onClick={() => setQty((q) => q + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <button
                className="button dark full"
                onClick={() => startInquiry(product)}
              >
                Make it yours <ArrowUpRight size={17} />
              </button>
              <button
                className="detail-save"
                onClick={() => toggleSave(product.id)}
              >
                <Heart
                  size={16}
                  fill={saved.includes(product.id) ? "currentColor" : "none"}
                />
                {saved.includes(product.id)
                  ? "Saved to your shortlist"
                  : "Save to your shortlist"}
              </button>
              <p className="small-note">
                Sample specifications and prices, subject to maker review. Final
                scope, construction, delivery, tax, and installation are quoted
                separately.
              </p>
            </div>
          </div>
        </Modal>
      )}
      {inquiry && (
        <Modal
          title="Custom order inquiry"
          onClose={() => setInquiry(false)}
          wide
        >
          {reference ? (
            <div className="success">
              <span className="success-check">
                <Check size={30} />
              </span>
              <p className="eyebrow">A GOOD PLACE TO START</p>
              <h2>
                Your idea
                <br />
                <em>has a home.</em>
              </h2>
              <p>Your inquiry has been saved for studio review.</p>
              <div className="reference">
                YOUR REFERENCE <strong>{reference}</strong>
              </div>
              <p className="small-note">
                This is an inquiry, not a confirmed order. No payment was taken.
                Email notifications are not configured in this concept site.
              </p>
              <button className="button dark" onClick={() => setInquiry(false)}>
                Back to the collection <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="inquiry-form">
              <div className="form-intro">
                <p className="eyebrow">LET’S MAKE IT PERSONAL</p>
                <h2>
                  A piece of
                  <br />
                  <em>your imagination.</em>
                </h2>
                <p>
                  Tell us a little about your space and what you have in mind.
                  We’ll save your brief for review.
                </p>
                <div className="form-reference">
                  {selectedProduct ? (
                    <img
                      src={`/images/${selectedProduct.image}.jpg`}
                      alt={selectedProduct.alt}
                    />
                  ) : (
                    <img
                      src="/images/cabinet.jpg"
                      alt="Pale wood cabinetry inspiration"
                    />
                  )}
                  <p>
                    {selectedProduct?.name || "Your custom project"}
                    <span>
                      {selectedProduct?.code || "A fresh starting point"}
                    </span>
                  </p>
                </div>
                <div className="form-estimate">
                  <small>
                    {sample !== null
                      ? "SAMPLE STARTING ESTIMATE"
                      : "CUSTOM SCOPE"}
                  </small>
                  <strong>
                    {sample !== null ? money(sample) : "Let’s talk."}
                  </strong>
                  <p>
                    {sample !== null
                      ? `${qty} piece${qty > 1 ? "s" : ""} · ${materials.find((m) => m.id === material)?.name} · ${finishes.find((f) => f.id === finish)?.name}`
                      : "A quote follows the conversation."}
                  </p>
                </div>
                <p className="small-note">
                  Selections describe your preferences. Final dimensions,
                  materials, quote, and timeline require maker confirmation. No
                  payment or order is placed here.
                </p>
              </div>
              <div className="form-fields">
                <div className="two-fields">
                  <label className="field">
                    Your name *
                    <input
                      name="name"
                      required
                      maxLength={100}
                      autoComplete="name"
                    />
                  </label>
                  <label className="field">
                    Email address *
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={180}
                      autoComplete="email"
                    />
                  </label>
                </div>
                <div className="two-fields">
                  <label className="field">
                    Phone number
                    <input
                      name="phone"
                      type="tel"
                      maxLength={35}
                      autoComplete="tel"
                    />
                  </label>
                  <label className="field">
                    City / delivery area *
                    <input
                      name="location"
                      required
                      maxLength={140}
                      placeholder="e.g. Quezon City"
                      autoComplete="address-level2"
                    />
                  </label>
                </div>
                <label className="field">
                  Your starting point
                  <select
                    value={inquiryId}
                    onChange={(e) => chooseInquiry(e.target.value)}
                  >
                    <option value="custom">
                      A custom piece / cabinetry project
                    </option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="two-fields">
                  <label className="field">
                    Material direction
                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                    >
                      {materials
                        .filter(
                          (m) =>
                            !selectedProduct ||
                            selectedProduct.materials.includes(m.id),
                        )
                        .map((m) => (
                          <option value={m.id} key={m.id}>
                            {m.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label className="field">
                    Finish direction
                    <select
                      value={finish}
                      onChange={(e) => setFinish(e.target.value)}
                    >
                      {finishes
                        .filter(
                          (f) =>
                            !selectedProduct ||
                            selectedProduct.finishes.includes(f.id),
                        )
                        .map((f) => (
                          <option value={f.id} key={f.id}>
                            {f.name}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
                <div className="two-fields">
                  <label className="field">
                    Quantity *
                    <input
                      type="number"
                      min={1}
                      max={50}
                      step={1}
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      required
                    />
                  </label>
                  <label className="field">
                    Preferred dimensions
                    <input
                      name="dimensions"
                      maxLength={160}
                      placeholder="W × D × H in cm, if known"
                    />
                  </label>
                </div>
                <div className="two-fields">
                  <label className="field">
                    Budget direction
                    <select name="budget" defaultValue="To be discussed">
                      {budgets.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    Ideal timeline
                    <select name="timeline" defaultValue="Flexible / exploring">
                      {timelines.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="field">
                  Tell us about your idea *
                  <textarea
                    name="message"
                    rows={3}
                    required
                    minLength={10}
                    maxLength={2500}
                    placeholder="Your room, intended use, design ideas, or anything we should know…"
                  />
                </label>
                <label className="consent">
                  <input type="checkbox" name="consent" required />I agree to
                  have my details saved for responding to this inquiry.
                </label>
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <button className="button dark full" disabled={busy}>
                  {busy ? "Saving your inquiry…" : "Send my inquiry"}
                  <ArrowUpRight size={17} />
                </button>
                <p className="small-note">
                  Required fields are marked *. Inquiry only. No confirmed
                  order.
                </p>
              </div>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
