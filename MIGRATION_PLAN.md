# Migration Plan

## Completed Architecture Step

The migration externalized only page-owned inline CSS where ownership was certain. CSS text was moved verbatim into the requested `assets/css/pages/` files and linked at the same location in each HTML document to preserve cascade order.

## Rules Applied

- No selector removals.
- No legacy file deletions or renames.
- `css/creative-agency-delhi.css` left untouched.
- No JavaScript edits.
- No body HTML structure edits.
- Page-specific selectors moved only from their owning page into its matching page stylesheet.

## Target Files

| Destination | Source page | Status |
| --- | --- | --- |
| assets/css/pages/home.css | index.html | migrated verbatim |
| assets/css/pages/audit.css | audit.html | migrated verbatim |
| assets/css/pages/discovery.css | discovery.html | migrated verbatim |
| assets/css/pages/sprint.css | brand-foundation-sprint.html | migrated verbatim |
| assets/css/pages/website.css | websites-digital-experiences.html | migrated verbatim |
| assets/css/pages/creative-agency-delhi.css | creative-agency-delhi.html | migrated verbatim |

## Deferred Work

| Area | Reason |
| --- | --- |
| form and intl-tel-input overrides | retained in-place unless a shared override is proven identical across all form pages |
| legacy css/ directory | retained untouched by rule |
| unused candidates | not removed because usage is not proven absent at runtime |
| duplicated shared declarations | documented but not consolidated because visual equivalence requires browser-level regression coverage per page |
