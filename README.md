# 218751-GMW Campaign Toolkit FVTT

A powerful and streamlined Foundry VTT module designed to help Game Masters track notes, manage combat flow, and keep essential actor information at their fingertips.

## 🚀 Overview

**218751-GMW Campaign Toolkit FVTT** provides an integrated interface for managing both general session notes and specific actor-related information. It automates turn markers in combat and whispers relevant notes to the GM when an actor's turn begins, ensuring you never miss a crucial detail.

![Foundry V14 Verified](https://img.shields.io/badge/Foundry-V14-green)
![Compatibility](https://img.shields.io/badge/Compatibility-V12+-blue)

## ✨ Key Features

-   **Centralized Notes App:** Accessible via a new Scene Control button, allowing you to manage "General Notes" or notes specific to any actor in the current combat.
-   **Automated Turn Markers:** Automatically posts "Start of Turn" and "End of Turn" markers to the chat log to clearly demarcate combat flow.
-   **Contextual Note Whispers:** When a combatant's turn starts, the module whispers their specific notes to the GM, along with vital stats like HP, Active Effects, and Death Saves.
-   **Interactive Chat Cards:** 
    -   Add new notes directly from a chat card.
    -   Delete notes with a single click.
    -   Disable Active Effects directly from the turn marker or notes card.
-   **Session Summary & Career Stats:** 
    -   Generate a beautifully styled "Session Summary" card with one click.
    -   Automatically tracks **Total Combats Resolved** and **Total Enemies Defeated** across your entire campaign.
    -   Persistent career totals that don't reset at the end of an encounter.
-   **Integrated World Info:** Manage your campaign name, logo, and session number within a unified configuration dialog.
-   **Foundry V14 Ready:** Built using the modern `ApplicationV2` framework for a smooth, responsive experience.
-   **Highly Configurable:** Control where HP/Effects appear, toggle turn markers for defeated combatants, and more.

## 🛠️ Installation

1.  Open the Foundry VTT Setup screen.
2.  Go to the **Add-on Modules** tab.
3.  Click **Install Module**.
4.  Paste the following manifest URL:
    `https://github.com/gmwintermute/218751-GMW-Campaign-Toolkit-FVTT/releases/latest/download/module.json`
5.  Click **Install**.

## 📖 How to Use

### Managing Notes
1.  Click the **GM Tracker Notes** icon (clipboard) in the left-hand Scene Controls sidebar.
2.  Select **General Notes** or a specific combatant from the dropdown.
3.  Use the **Add Note** button to enter new information.
4.  Toggle between **Edit** and **View** modes to keep your notes organized.

### Combat Integration
-   As soon as a combatant's turn starts, a whisper is sent to the GM containing all notes associated with that actor.
-   You can quickly disable an active effect by clicking the "X" next to it in the chat card—perfect for tracking expired conditions.
-   Turn markers will appear for all players to help everyone track whose turn it is.

## ⚙️ Configuration

Available in **Module Settings**:
-   **Display HP and Effects Location:** Choose to show status info in Turn Markers, the Notes Card, both, or neither.
-   **Skip Turn Markers for Defeated:** Prevent chat clutter by disabling markers for defeated foes.
-   **Skip Note Cards for Defeated:** Silence note whispers for actors who are out of the fight.
-   **Display Turn Marker Token Image:** Toggle the visual flair of token images in chat markers.

## 🏗️ For Developers

This repository includes a local, offline copy of the **Foundry VTT V14 API Documentation** in the `api/` directory for easy reference during development.

### Technical Stack
-   **Framework:** Foundry VTT `ApplicationV2`
-   **Templates:** Handlebars (.hbs)
-   **Styling:** Custom CSS
-   **Data Storage:** `game.settings` (Global) and Actor `flags` (Per-actor)

## 🗺️ Roadmap

-   [ ] **Rich Text Support:** Integration of ProseMirror for formatted notes.
-   [ ] **Categorization:** Adding tabs for NPCs, Locations, and Plot Points.
-   [ ] **Quick Links:** Support for `@UUID` mentions and drag-and-drop linking.
-   [ ] **Enhanced Styling:** Further integration with the core Foundry VTT aesthetic.


