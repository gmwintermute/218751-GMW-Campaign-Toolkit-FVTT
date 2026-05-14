# 218751-GMW Campaign Toolkit FVTT

A powerful and streamlined Foundry VTT module designed to help Game Masters track notes, manage combat flow, and keep essential actor information at their fingertips.

## 🚀 Overview

**218751-GMW Campaign Toolkit FVTT** provides an integrated interface for managing both general session notes and specific actor-related information. It automates turn markers in combat and whispers relevant notes to the GM when an actor's turn begins, ensuring you never miss a crucial detail.

![Foundry V14 Verified](https://img.shields.io/badge/Foundry-V14-green)
![Compatibility](https://img.shields.io/badge/Compatibility-V12+-blue)

## ✨ Key Features

-   **Centralized Notes App:** Accessible via a Scene Control button, allowing you to manage "General Notes" or notes specific to any actor. PC notes persist between combats.
-   **Automated Encounter Log:** Tracks every resolved encounter, recording defeated enemies and encounter numbers. Access the full history at any time via a dedicated "Post Encounter Stats" button.
-   **Visual Visibility Headers:** Automatically styles all chat messages with clear, color-coded headers (PUBLIC, WHISPER, BLIND, etc.), providing immediate visual confirmation of message visibility.
-   **Automated Turn Markers:** Posts "Turn Start" and "Turn End" markers to the chat log, including round numbers for better context.
-   **Contextual Note Whispers:** When a combatant's turn starts, their notes are whispered to the GM along with vital stats like HP, AC, Movement Speed, Spell DC, Active Effects, and Death Saves.
-   **Round-Based Note Expiration:** Set durations for notes (in rounds) that automatically count down and expire at the end of turns or rounds.
-   **Interactive Chat Cards:** 
    -   Add or delete notes directly from cards.
    -   Disable Active Effects with a single click from the turn marker or notes card.
-   **Session Summary:** Generate high-level session statistics with one click, keeping your group informed of their progress.
-   **Integrated World Info:** Manage your campaign name, logo, and session number within a unified configuration dialog.
-   **Foundry V14 Ready:** Built using the modern `ApplicationV2` framework for a smooth, responsive experience.

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
3.  Use the **Add Note** button to enter new information. You can set a **Duration** in rounds for temporary notes.
4.  Toggle between **Edit** and **View** modes to keep your notes organized.

### Combat & Encounter History
-   **Turn Markers:** Appear automatically for all players to help track combat flow.
-   **Note Whispers:** Trigger at the start and end of turns, providing the GM with current stats and notes.
-   **Encounter History:** Click the **Post Encounter Stats** icon (chart) in the Scene Controls to post a detailed history of the session's combats to the chat.

### World Information
-   Click the **Campaign Information** tool (gear/info icon) in the Scene Controls to quickly update your campaign's name, session number, and logo.

## ⚙️ Configuration

Available in **Module Settings**:
-   **Display HP and Effects Location:** Choose to show status info in Turn Markers, the Notes Card, both, or neither.
-   **Skip Turn Markers for Defeated:** Prevent chat clutter by disabling markers for defeated foes.
-   **Hide Turn Markers for GM:** Visually suppress public markers in the GM's log while keeping them visible for players.
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


