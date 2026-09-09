# Professional game interface completion

## What will be built
- Reposition and rebuild the top HUD so player, coin, gem, pearl, and fish data stays aligned on every phone and desktop size.
- Expand the store into clear sections for ships, weapons, and crews, using original illustrated item artwork and complete item cards.
- Replace the current chat presentation with a richer game-style room: framed header, avatar roster, channel tabs, polished message stream, and mobile drawer.
- Add an account settings screen for sound, motion, display preferences, and sign-out.
- Upgrade Friends into a social command center with Friends and Tribes tabs; tribe creation/joining will be presented as a designed local prototype until backend rules are defined.
- Keep daily login and daily mission panels, polish them, and connect crew/upgrade progress where applicable.
- Prevent browser pinch zoom, double-tap zoom, and accidental page dragging while preserving intended scrolling inside lists and forms.

## Original visual assets
- Create one six-icon weapons atlas: small/medium/large rockets, VIP rocket, atomic bomb, ad bomb.
- Create one nine-icon crew atlas: sailor, luck charm, guide, thief, guard, and four repair tiers.
- Create one avatar atlas for default captain portraits used by chat, friends, and tribes.

## Technical details
- Use sprite-positioned artwork so all item icons have identical visual dimensions and remain lightweight.
- Add `/settings` and integrate it from the home controls; keep all content routes uniquely titled and described.
- Preserve existing authentication and live chat/friend data; visual redesign will not weaken access rules.
- Validate with generated route typing, current build diagnostics, and phone/desktop browser checks for `/`, `/shipyard`, `/chat`, `/friends`, and `/settings`.

## Scope boundary
- Combat, theft, and explosions will be represented as purchasable equipment and crew capabilities in this pass; full battle simulation needs a separate gameplay/state specification.
- Tribe persistence and permissions are not added to the database in this pass; the screen will clearly show the feature as preparing/coming soon rather than pretend data is live.
