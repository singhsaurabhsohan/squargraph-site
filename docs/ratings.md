# Homepage ratings

Ratings are omitted completely unless the official source returns at least one
review and a valid score. No empty stars, zero counts or rating placeholders.
The heading and platform description remain neutral regardless of review count.

## Trustpilot connection

Set `TRUSTPILOT_API_KEY` as a secret on the **squargraph-site** Cloudflare Worker
(not squargraph-chat). Use an authorized key with Business Units API access.
Do not commit the key or put it in browser JavaScript.

The Worker requests the exact squargraph.com business from Trustpilot's official
find endpoint. The browser requests the same-origin `/api/ratings` endpoint when
the section enters view and refreshes hourly while visible. CDN responses cache
for up to one hour; no manual score edits are required after connection.
Missing keys, API failures, zero reviews and invalid data all keep scores hidden.

## Other platforms

Clutch and DesignRush remain logo links until their authorized widget/data
integration is connected. They do not currently update ratings automatically.
The Org is a company directory, not a rating source.

Docs: https://developers.trustpilot.com/business-units-api-(public)
https://help.clutch.co/en/knowledge/add-clutch-widget-to-site
