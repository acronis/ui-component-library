# Cyber Ecosystem — Discussion Board (RFCs)

This is where the [ecosystem vision](../README.md) is debated and decided **in
the open**. Every open question is one numbered RFC. Nothing in the vision docs
becomes a blocking rule (`must`) until the RFC that proposes it is **Accepted**.

## How it works

1. **Propose.** Copy [`TEMPLATE.md`](TEMPLATE.md) to `NNNN-short-slug.md`, fill
   it in, open a PR. The PR is the discussion thread for developers.
2. **Discuss.** PMs and designers who don't live in git use the mirrored
   **Confluence page** for the same RFC (link in each RFC's header). Comments
   flow both ways; the RFC file is the source of truth for the _decision_.
3. **Decide.** The listed **Deciders** ratify. Record the outcome in the RFC's
   `Status` and a dated **Decision** section. Severity that blocks CI (`must`)
   **requires a named human** per the grammar's `must`-is-human rule.
4. **Land.** Implement behind the existing gates: schema first, then `should`,
   then `must` once the detector proves it doesn't cry wolf. Cross-link the
   ledger entry if the RFC came from a finding.

## Status lifecycle

`Draft` → `In review` → `Accepted` / `Rejected` / `Superseded` → `Implemented`

## Index

| RFC                                         | Title                                                | Status | Deciders                        |
| ------------------------------------------- | ---------------------------------------------------- | ------ | ------------------------------- |
| [0001](0001-adopt-layer-model.md)           | Adopt the 8-layer ecosystem model                    | Draft  | Kit maintainers + platform lead |
| [0002](0002-template-layer.md)              | Add the Template layer (`template.yaml`)             | Draft  | Kit maintainers                 |
| [0003](0003-require-pattern-enforcement.md) | `require-pattern` ESLint rule + rollout              | Draft  | Kit maintainers + app leads     |
| [0004](0004-screen-spec-adoption.md)        | Adopt `screen.yaml` as the design-time screen source | Draft  | App leads + PMs                 |
| [0005](0005-cross-repo-governance.md)       | Cross-repo governance & package-scope reconciliation | Draft  | Platform lead + kit maintainers |

## Confluence mirror

The narrative vision and this board are mirrored to Confluence (space **CYB —
Cyber Console**) for PMs and designers. The mirror is **read-for-discussion**;
decisions are recorded here in git.

- Vision: <https://adn.acronis.work/pages/viewpage.action?pageId=301062259>
- Discussion board: <https://adn.acronis.work/pages/viewpage.action?pageId=301062260>

## Ground rules

- **Disagree with the vision, not the person.** These docs are drafts on purpose.
- **One decision per RFC.** Keep threads focused; split if it grows two heads.
- **Bring the failure mode.** "This blocks legitimate UI X" beats "I don't like it."
- **`must` is a commitment.** Proposing `must` means you'll help fix the false
  positives it finds. If you won't, propose `should`.
