# SQUARGRAPH App

Universal Expo application for Android, iOS, and the web.

## Included MVP flows

- Brand and engagement overview
- Capability discovery
- Project-reference and status experience
- Secure handoff to SQUARGRAPH OS
- Project Direction handoff
- WhatsApp, email, phone, calendar, and LinkedIn contact actions
- Responsive tablet and web layouts

The project-status screen uses preview data until it is connected to the authenticated SQUARGRAPH OS API.

## Run locally

```bash
npm install
npm run android
npm run ios
npm run web
```

The iOS simulator requires macOS and Xcode. On Windows, use Expo Go on a physical iPhone or an EAS cloud build.

## Production integration required

Before release, connect the project lookup to an authenticated OS endpoint. Do not place Supabase service-role keys or other private credentials in the app bundle.
