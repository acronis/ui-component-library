---
'@constructor-lab/icons-react': minor
---

**Icons**: fixed stroke-join spikes on refetched icons, and `CirclesMulti` is
now `ShapesMulti`.

`shapes-multi` rendered with a large spike jutting out of the triangle and the
diamond. The paths were geometrically correct — the defect was the stroke join
at the point where each subpath closes.

SVGO's `convertPathData` writes compact **relative** commands. Accumulating
those deltas as IEEE-754 doubles does not always land exactly back on the
subpath's start point: the triangle drifted by 2.5e-15, and rounding to
`floatPrecision: 4` left the diamond a real 1e-4 short. The trailing `Z` then
closed a segment of near-zero but non-zero length, and Skia derived a join
tangent from that garbage direction — with the default
`stroke-linejoin="miter"` it drew a spike at the subpath start. Figma's own
renderer does not, which is why the icon looked correct in the design file and
broken once imported.

`@constructor-lab/figma-icons-fetcher` now snaps those closes shut after SVGO,
rewriting only the final segment into absolute form so `Z` becomes a true
zero-length close that renderers skip. A relative delta cannot express a
2.5e-15 correction, hence absolute. Gaps above 1e-3 are left alone — those are
intentionally open shapes that `Z` legitimately closes (`house-server`,
`sparkle`, `message-sparkle`).

Twelve icons changed on refetch; only `shapes-multi` changes visually. The
other eleven (`bolt`, `circle-user`, `cloud-user`, `pc-tower-small`,
`postgresql`, `server`, `servers`, `smartphone`, `tablet`, `tapes`, `tv`) had
sub-epsilon gaps that never produced a visible spike, and render pixel-identical
before and after.

**Breaking for anyone importing `CirclesMulti`.** Upstream Figma renamed
`circles-multi` to `shapes-multi` and redrew it — four coloured circles became a
circle, triangle, diamond and circle. This lands as a minor bump because the
icon set is treated as generated data rather than hand-authored API surface, but
the old export is gone: switch to `ShapesMulti`, and note the artwork differs.
