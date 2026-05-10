# GM Tracker Notes - Next Steps

Following the successful implementation of the Scene Control button and the basic `ApplicationV2` dialog, here are the proposed next steps for the development of the **218749-gm-tracker-notes** module:

## 1. Rich Text Editor
- **Goal:** Allow GMs to write and format complex notes directly within the popup.
- **Implementation:** Integrate a `ProseMirror` editor using Foundry's built-in editor components.

## 2. Persistent Storage
- **Goal:** Ensure notes are saved across sessions and browser refreshes.
- **Implementation:** Use `game.settings` (for simple data) or create a custom `DataModel` / `Document` (for more complex structures) to store note content in the database.

## 3. Categories and Tabs
- **Goal:** Organize notes into logical groups like NPCs, Locations, and Plot Points.
- **Implementation:** Utilize the `tabs` feature of `ApplicationV2` to provide a clean, navigable interface.

## 4. Enhanced UI & Styling
- **Goal:** Make the tool feel integrated with the Foundry VTT aesthetic.
- **Implementation:** Add custom CSS in `styles/module.css` and use Foundry's standard CSS classes for consistent layout and interactable elements.

## 5. Quick Links & Mentions
- **Goal:** Allow notes to reference Actors, Items, or Journal Entries.
- **Implementation:** Implement "drag and drop" support and content enrichment to allow `@UUID` links within the notes.
