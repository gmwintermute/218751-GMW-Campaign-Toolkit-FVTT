# Release Notes - 14.2.28

## New Features
- **Give Inspiration**: Added a "Give Inspiration" button (green plus icon) to the Combat Summary card for characters who do not currently have inspiration.
  - Posts a chat announcement when inspiration is given.
  - Automatically updates the actor's character sheet.

# Release Notes - 14.2.27

## Improvements & Refinement
- **Two-Column Notes Layout**: Note items in chat cards now use a two-column grid. The first column displays the note content, while the second column provides a dedicated, right-aligned space for the "Rounds Remaining" countdown.

# Release Notes - 14.2.26

## Bug Fixes
- **Notes Card Layout**: Fixed a layout issue where note items and duration badges were not rendering correctly. The notes list now uses improved flexbox alignment for better visual consistency.

# Release Notes - 14.2.25

## New Features
- **Inspiration Usage**: Added a new "Use Inspiration" button (bolt icon) next to the inspiration display on all chat cards.
  - Posts a dedicated chat card announcing the usage.
  - Automatically toggles the Inspiration off on the actor's character sheet.
  - Provides visual feedback by dimming the inspiration display once used.

# Release Notes - 14.2.24

## Documentation
- **Updated README.md**: Comprehensive update to the project README to include documentation for all recently added features, including the Encounter Log, automated Visibility Headers, round-based Note Expiration, and expanded stat displays.

# Release Notes - 14.2.23

## New Features
- **Dedicated Encounter Stats Button**: Added a new "Post Encounter Stats" tool to the Scene Controls (chart icon). This allows GMs to post the full encounter history to chat at any time.

## Improvements & Refinement
- **Refined Encounter Log Layout**: Updated the encounter history display to use a vertical list format for better readability.
- **Micro NPC Font**: Reduced the font size for defeated NPCs in the encounter log to 0.5em to create a clear visual hierarchy.
- **Streamlined Session Summary**: Removed the detailed encounter history from the Session Summary card to keep it focused on high-level statistics, as the detailed log is now available via its own dedicated button.
- **Refactored Posting Logic**: Modularized the chat card generation logic into static methods for better maintainability and accessibility across the module.

# Release Notes - 14.2.22

## New Features
- **Persistent Encounter Log**: The module now keeps a history of all resolved encounters. Each entry records the encounter number and a list of all defeated monsters.
- **Encounter History in Session Summary**: The Session Summary card now includes an "Encounter Log" section, displaying the detailed history of combats for the session.

# Release Notes - 14.2.21

## Bug Fixes
- **Combat Summary Card**: Fixed an issue where the summary card would not appear when combat ended. The logic now ensures the full combat object is available during the tear-down process.

## Improvements & Refinement
- **HP Display Clarity**: Added a "Hit Points:" label to the combat summary status rows to improve data readability.

# Release Notes - 14.2.20

## Improvements & Refinement
- **Enhanced Combat Summary**: The end-of-combat summary card now includes a dedicated section for "Defeated Enemies", listing all NPCs that were defeated during the encounter.
- **Improved Data Collection**: Refined the `postCombatSummaryCard` logic to fetch the specific combat encounter data for more accurate summary reporting.

# Release Notes - 14.2.19

## Repository Maintenance
- **Author Update**: Updated the module author to GM Wintermute in `module.json`.

# Release Notes - 14.2.18

## New Features
- **Combat Summary Card**: Added an automated chat card that posts when combat ends, providing a snapshot of HP and active effects for all Player Characters.
- **Enhanced Combat Hooks**: Implemented support for `combatTearDown` to ensure end-of-combat summaries are posted reliably.

## Improvements & Refinement
- **Effect Management**: Added actor ID data attributes to turn markers and effect items to improve the reliability of effect-related interactions.
- **Repository Maintenance**: Updated `.gitignore` to exclude local API documentation assets.

# Release Notes - 14.2.16

## Combat Flow Improvements
- **Optimized Round Transitions**: Reordered combat update logic to ensure the "Round X Started" card is always posted *before* the first actor's turn start card.
- **Round 1 Support**: Improved detection to reliably display the "Round 1 Started" card when combat begins.
- **Improved Hook Reliability**: Updated the combat hook to explicitly watch for the `started` state, ensuring round markers are posted correctly in all combat initialization scenarios.

# Release Notes - 14.2.12

## Standardized Module ID
- **Valid Slug Format**: Renamed the module ID to `218751-gmw-campaign-toolkit-fvtt` (lowercase, no spaces) to comply with Foundry VTT V14 standards.
- **Full Refactor**: Updated all internal settings, flags, and template path references to use the new ID.
- **Folder Rename Required**: Users must rename their module directory to `218751-gmw-campaign-toolkit-fvtt` for Foundry to properly detect the module.

# Release Notes - 14.2.9

## Project Rebranding
- **Module ID and Title Rename**: Renamed the module ID to `218751-GMW Campaign Toolkit FVTT` and the title to `218751-GMW Campaign Toolkit FVTT` to match the project repository and folder naming conventions.
- **Global Identity Update**: Updated all references to the module ID and name across the codebase, including settings keys, flag scopes, localization files, and documentation.

# Release Notes - 14.2.8

## Improvements & Refinement
- **Round Numbers in Turn Labels**: Turn Start and Turn End chat markers now include the current combat round number for better context (e.g., "Turn Start (Round 1)").
- **Unified Header Information**: Ensured consistency between public turn markers and private GM notes regarding round information.

# Release Notes - 14.2.7

## Improvements & Refinement
- **Dark Theme Campaign Info**: Re-styled the Campaign Information dialog with a modern dark theme to match the core 218751-GMW Campaign Toolkit FVTT aesthetic.
- **Improved Dialog Layout**: Refactored the configuration layout to mirror the card-based design of note entries, improving visual hierarchy.
- **Sidebar Tool Fix**: Resolved a Foundry V14 error where the "open-notes" sidebar tool was incorrectly defined as both a toggle and a button.

# Release Notes - 14.2.6

## New Features
- **Sidebar Access for Campaign Info**: Added a new "Campaign Information" tool to the 218751-GMW Campaign Toolkit FVTT sidebar category (Scene Controls), providing quick access to world settings without opening the main app.

# Release Notes - 14.2.5

## New Features
- **Integrated World Name Display**: The functionality of the World Name Display module has been merged directly into 218751-GMW Campaign Toolkit FVTT.
- **Native Campaign Information**: Set and manage campaign names, session numbers, and logos directly within the tracker.
- **Persistent Session Cards**: A new "World Info" button in the tracker header allows for quick configuration, and a session information card is automatically posted and updated in the chat.
- **Major Version Bump**: This release marks a significant expansion of the module's core features.

# Release Notes - 14.2.4

## Improvements & Refinement
- **Turn-End Note Expiration**: Refined the timing for temporary notes. Actor-specific notes now have their duration decremented and are automatically deleted at the **end of their own turn**, aligning better with standard TTRPG mechanics.
- **General Note Timing**: General notes (not tied to a specific actor) continue to expire at the beginning of each new combat round.
- **App Responsiveness**: The 218751-GMW Campaign Toolkit FVTT application now automatically refreshes when a note expires due to turn or round changes, ensuring the GM always sees the most current information.

# Release Notes - v1.2.2

## New Features
- **Round-Based Note Expiration**: You can now set a duration (in rounds) for any note. Notes will automatically count down at the start of every new round and delete themselves once the duration reaches zero.
- **Expiration Input**: A new "Duration (Rounds)" field has been added to the "Add Note" dialog and the main 218751-GMW Campaign Toolkit FVTT editing interface. Setting the duration to 0 (default) makes the note permanent.
- **Visual Countdown**: Notes with a duration now display a subtle "Rounds Remaining" badge in both the chat cards and the main 218751-GMW Campaign Toolkit FVTT app, providing GMs with immediate feedback on temporary effects.

# Release Notes - v1.2.1

## New Features
- **Persistent Player Character Notes**: Notes for actors of the "character" type (PCs) are now persistent between combats and always accessible in the 218751-GMW Campaign Toolkit FVTT app, even when no combat is active.
- **Automated NPC Notes Cleanup**: To keep encounter data clean, notes for NPCs are now automatically cleared when a combat encounter is deleted.

## Improvements & Refinement
- **Enhanced Actor Selection**: The selection dropdown in the 218751-GMW Campaign Toolkit FVTT app now always includes all Player Characters, categorized with a "PC:" prefix for easy identification.

# Release Notes - v1.2.0

## New Features
- **Expanded Stat Display**: AC, Movement Speed, and Spell Save DC are now displayed alongside HP in combat chat cards (both public markers and private notes).
- **Dynamic Speed Detection**: Automatically detects and displays the actor's primary movement mode (Walk, Fly, Swim, etc.) for more relevant status information.
- **Spell DC Calculation**: Automatically calculates Spell Save DC for dnd5e actors using the standard formula (8 + Proficiency + Ability Modifier) if the value is missing from the system data.
- **Styled Round Start Markers**: Round Start notifications now feature a structural layout consistent with Turn Markers, including a dedicated header line and icon container.

## Improvements & Refinement
- **Stat Consistency**: AC, Speed, and Spell DC are conditionally displayed based on availability, ensuring a clean UI for actors without these stats.
- **Enhanced Handlebars Logic**: Implemented more robust data checks to ensure stats are rendered correctly even if their value is 0.
- **Visual Alignment**: Round Start markers now include an icon container matching the size and border of token images for a cohesive visual experience.
- **Refined Styles**: Added dedicated CSS for the new stat blocks to maintain the established visual hierarchy.

# Release Notes - v1.1.1

## New Features
- **Integrated Chat Visibility Styler**: The functionality of the Chat Visibility Styler module has been merged directly into 218751-GMW Campaign Toolkit FVTT.
- **Automated Visibility Headers**: All chat messages now feature clear, color-coded headers indicating their visibility status:
  - **PUBLIC** (Blue)
  - **WHISPER** (Purple / Orange for GM Notes)
  - **GM ROLL** (Orange/Yellow)
  - **BLIND ROLL** (Red)
- **Round Start Markers**: A new chat card is automatically posted at the beginning of every combat round (e.g., "Round Start #1").
- **Private GM Notes Enhancement**:
  - The "WHISPER" header on private notes cards now features an orange background for immediate identification.
  - Notes cards are now posted at both the **start** and **end** of every turn.
- **Conditional Death Saves**: Character death save results are now automatically hidden unless the character is at 0 HP.

## Improvements & Refinement
- **Template Refactoring**: Note cards and turn markers have been moved to dedicated Handlebars templates for better performance and maintainability.
- **Simplified Labels**: Renamed "Start of Turn" and "End of Turn" to "Turn Start" and "Turn End", and removed redundant actor names from the labels.
- **Card Alignment**: Visual styles for public markers and private notes have been aligned for a consistent, professional appearance.
- **GM UI Controls**: Added a "Hide Turn Markers for GM" setting. This visually suppresses the public markers in the GM's chat log while keeping them visible for players, reducing clutter without affecting visibility for others.
- **Cleaned UI**: Removed the "Add Note" button from public turn markers to focus player-facing cards on status information.

## Bug Fixes
- Resolved an issue where death saves were being displayed for characters with positive HP.
- Fixed inconsistent header styling across different message types.
- Ensured the final "Turn End" and notes cards are posted correctly when a combat encounter is deleted.
