# SciLayer published content

Committed scholarly manuscripts served on the public site. Each article lives in `content/articles/{slug}/`:

- `metadata.json` — title, authors, ORCID, article type, version, status
- `manuscript.md` (or `manuscript-v1.md`, `manuscript-v2.md`) — Markdown body

**Article catalog:** [`content/articles/catalog.json`](articles/catalog.json) and [`content/articles/README.md`](articles/README.md) — conceptual groupings (ASRA foundations, phases 1–9, specs, comparisons, NFM, platform essays). The `/articles` browse page renders these collections.

`content/kaggle-notebooks/` — archived ASRA Kaggle notebooks linked from related articles (Phase 1–9; upstream: [asra/kaggle-notebooks](https://github.com/ilakkmanoharan/asra/tree/main/kaggle-notebooks)).

`content/asra/` — phase research bundles (manuscripts, metadata, notebooks) plus the [ASRA memory monograph](asra/asra-theory-of-memory.md).

Source copies may also exist under `private/my-papers/`; the site reads from `content/articles/` only.

**Author:** Ilakkuvaselvi Manoharan (`0009-0008-8073-5416`)
