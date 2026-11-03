## Current free-plan integration

The homepage uses the official Review Collector TrustBox obtained from the
SQUARGRAPH dashboard (business ID 6ac905dcca514bb722fef8d2). It collects reviews
and does not display scores. No subscription, API key or paid widget is used.
The custom API rating code below is dormant; its browser script is not loaded.

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

## Free Clutch Feedback Widget

The homepage uses the official type 7 Feedback Widget for company 2688540,
obtained from the signed-in SQUARGRAPH Free Profile dashboard. It collects
reviews without displaying scores. No paid customization or subscription used.

DesignRush was rechecked on 2026-11-03. Its public company page is the
publication confirmed by the owner; no separate article or authorized free
widget was supplied. Retain the original logo/profile link without any score.
