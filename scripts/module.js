const combatStates = new Map();

/**
 * A custom ApplicationV2 for the GM Tracker Notes.
 */
class GMTrackerNotesApp extends foundry.applications.api.ApplicationV2 {
  constructor(options={}) {
    super(options);
    this.isEditing = false;
  }

  /** @override */
  static DEFAULT_OPTIONS = {
    id: "gm-tracker-notes-app",
    tag: "div",
    window: {
      title: "GM Tracker Notes",
      icon: "fa-solid fa-note-sticky",
      resizable: true
    },
    position: {
      width: 450,
      height: 500
    }
  };

  /** @override */
  async _renderHTML(context, options) {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    container.style.height = "100%";
    
    // --- Header Section: Selection and Toggle ---
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.gap = "10px";

    // Create the dropdown
    const select = document.createElement("select");
    select.id = "combat-actor-select";
    select.style.flex = "1";

    const generalOption = document.createElement("option");
    generalOption.value = "general";
    generalOption.innerText = "-- General Notes --";
    select.appendChild(generalOption);

    // Load combatants and always include player characters
    const activeCombat = game.combats?.active;
    const addedActorIds = new Set();
    
    if (activeCombat) {
      activeCombat.combatants.forEach(combatant => {
        if (combatant.actor && !addedActorIds.has(combatant.actor.id)) {
          const option = document.createElement("option");
          option.value = combatant.actor.id;
          option.innerText = `Actor: ${combatant.name || combatant.actor.name}`;
          select.appendChild(option);
          addedActorIds.add(combatant.actor.id);
        }
      });
    }

    // Always include all player characters for persistent notes
    game.actors.filter(a => a.type === "character").forEach(actor => {
        if (!addedActorIds.has(actor.id)) {
            const option = document.createElement("option");
            option.value = actor.id;
            option.innerText = `PC: ${actor.name}`;
            select.appendChild(option);
            addedActorIds.add(actor.id);
        }
    });

    const lastSelected = game.settings.get("218749-gm-tracker-notes", "lastSelected");
    // Ensure lastSelected is valid in the current list, otherwise default to general
    const exists = Array.from(select.options).some(o => o.value === lastSelected);
    select.value = exists ? lastSelected : "general";
    header.appendChild(select);

    // Add Note Button
    const addNoteBtn = document.createElement("button");
    addNoteBtn.innerHTML = this.isEditing ? '<i class="fa-solid fa-check"></i> Done' : '<i class="fa-solid fa-plus"></i> Add Note';
    addNoteBtn.style.width = "auto";
    header.appendChild(addNoteBtn);

    // World Name Display Config Button (Integrated)
    const configBtn = document.createElement("button");
    configBtn.type = "button";
    configBtn.innerHTML = '<i class="fas fa-cog"></i> World Info';
    configBtn.title = "Configure Campaign Information";
    configBtn.style.width = "auto";
    configBtn.style.flexShrink = "0";
    header.appendChild(configBtn);

    configBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      CampaignInformationConfig.open();
    });

    container.appendChild(header);

    // --- Content Section: Display or Editor ---
    const contentArea = document.createElement("div");
    contentArea.style.flex = "1";
    contentArea.style.overflowY = "auto";
    contentArea.style.border = "1px solid #7a7971";
    contentArea.style.padding = "10px";
    contentArea.style.borderRadius = "3px";
    contentArea.style.background = "rgba(0, 0, 0, 0.1)";

    const getCurrentNotes = () => {
      const targetValue = select.value;
      let data = [];
      if (targetValue === "general") {
        try {
          data = JSON.parse(game.settings.get("218749-gm-tracker-notes", "generalNotes") || "[]");
        } catch (e) { data = []; }
      } else {
        const actor = game.actors.get(targetValue);
        data = actor ? (getFlagSafe(actor, "notes") || []) : [];
      }
      
      // Normalize data: ensure it's an array of objects with at least a 'value'
      if (!Array.isArray(data)) {
        if (typeof data === "string") data = [{ value: data }];
        else if (typeof data === "object") {
          data = Object.values(data).map(v => ({ value: typeof v === 'string' ? v : JSON.stringify(v) }));
        } else data = [];
      } else {
          // Convert old {label, value} to just value if label is present, or handle raw strings
          data = data.map(item => {
              if (typeof item === 'string') return { value: item };
              if (item.label && item.value) return { value: `${item.label}: ${item.value}` };
              if (item.value) return { value: item.value };
              return { value: "" };
          });
      }
      return data;
    };

    const notesArray = getCurrentNotes();

    const saveNotes = async (newData) => {
      const targetValue = select.value;
      if (targetValue === "general") {
        await game.settings.set("218749-gm-tracker-notes", "generalNotes", JSON.stringify(newData));
      } else {
        const actor = game.actors.get(targetValue);
        if (actor) await setFlagSafe(actor, "notes", newData);
      }
    };

    if (this.isEditing) {
      const form = document.createElement("div");
      form.style.display = "flex";
      form.style.flexDirection = "column";
      form.style.gap = "15px";

      notesArray.forEach((note, index) => {
        const row = document.createElement("div");
        row.style.border = "1px solid #7a7971";
        row.style.padding = "10px";
        row.style.borderRadius = "3px";
        row.style.background = "rgba(0, 0, 0, 0.05)";
        row.style.position = "relative";

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteBtn.style.position = "absolute";
        deleteBtn.style.top = "5px";
        deleteBtn.style.right = "5px";
        deleteBtn.style.width = "auto";
        deleteBtn.style.padding = "2px 6px";
        deleteBtn.style.color = "#ff4444";
        deleteBtn.title = "Remove Note";
        deleteBtn.onclick = async () => {
          notesArray.splice(index, 1);
          await saveNotes(notesArray);
          this.render();
        };

        const textarea = document.createElement("textarea");
        textarea.value = note.value || "";
        textarea.placeholder = "Enter note content...";
        textarea.style.width = "100%";
        textarea.style.minHeight = "80px";
        textarea.style.marginTop = "15px";
        textarea.addEventListener("input", async (e) => {
          notesArray[index].value = e.target.value;
          await saveNotes(notesArray);
        });

        const durationContainer = document.createElement("div");
        durationContainer.style.display = "flex";
        durationContainer.style.alignItems = "center";
        durationContainer.style.gap = "10px";
        durationContainer.style.marginTop = "5px";

        const durationLabel = document.createElement("label");
        durationLabel.innerText = "Duration (Rounds):";
        durationLabel.style.fontSize = "0.85em";

        const durationInput = document.createElement("input");
        durationInput.type = "number";
        durationInput.value = note.duration || 0;
        durationInput.min = "0";
        durationInput.style.width = "50px";
        durationInput.title = "Number of rounds before expiration. 0 for never.";
        durationInput.addEventListener("change", async (e) => {
          notesArray[index].duration = parseInt(e.target.value) || 0;
          await saveNotes(notesArray);
        });

        durationContainer.appendChild(durationLabel);
        durationContainer.appendChild(durationInput);

        row.appendChild(deleteBtn);
        row.appendChild(textarea);
        row.appendChild(durationContainer);
        form.appendChild(row);
      });

      const addBtn = document.createElement("button");
      addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Note';
      addBtn.onclick = async () => {
        notesArray.push({ value: "" });
        await saveNotes(notesArray);
        this.render();
      };
      form.appendChild(addBtn);

      contentArea.appendChild(form);
    } else {
      const list = document.createElement("div");
      list.style.display = "flex";
      list.style.flexDirection = "column";
      list.style.gap = "15px";

      notesArray.forEach((note, index) => {
        if (note.value) {
          const section = document.createElement("div");
          section.style.position = "relative";
          section.style.paddingRight = "25px";
          section.style.borderBottom = "1px solid rgba(0,0,0,0.1)";
          section.style.paddingBottom = "10px";

          const deleteBtn = document.createElement("a");
          deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
          deleteBtn.style.position = "absolute";
          deleteBtn.style.top = "0";
          deleteBtn.style.right = "0";
          deleteBtn.style.color = "#888"; 
          deleteBtn.style.cursor = "pointer";
          deleteBtn.title = "Delete Note";
          deleteBtn.onmouseenter = () => deleteBtn.style.color = "#ff4444";
          deleteBtn.onmouseleave = () => deleteBtn.style.color = "#888";
          deleteBtn.onclick = async () => {
            const confirm = await Dialog.confirm({
              title: "Delete Note",
              content: `<p>Are you sure you want to delete this note?</p>`,
              yes: () => true,
              no: () => false,
              defaultYes: false
            });
            if (confirm) {
              notesArray.splice(index, 1);
              await saveNotes(notesArray);
              this.render();
            }
          };
          section.appendChild(deleteBtn);

          const body = document.createElement("div");
          body.style.whiteSpace = "pre-wrap";
          
          if (note.duration > 0) {
            const durationSpan = document.createElement("span");
            durationSpan.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> ${note.duration} `;
            durationSpan.style.fontSize = "0.8em";
            durationSpan.style.color = "#666";
            durationSpan.style.background = "rgba(0,0,0,0.05)";
            durationSpan.style.padding = "2px 5px";
            durationSpan.style.borderRadius = "3px";
            durationSpan.style.marginRight = "8px";
            durationSpan.style.display = "inline-block";
            durationSpan.title = "Rounds remaining";
            body.appendChild(durationSpan);
          }

          const textNode = document.createTextNode(note.value);
          body.appendChild(textNode);
          section.appendChild(body);

          list.appendChild(section);
        }
      });

      if (notesArray.length === 0) {
        contentArea.innerHTML = "<em>No notes yet. Click Add Note to add one.</em>";
      } else {
        contentArea.appendChild(list);
      }
    }

    container.appendChild(contentArea);

    // --- Event Listeners ---
    select.addEventListener("change", async (event) => {
      const targetValue = event.target.value;
      await game.settings.set("218749-gm-tracker-notes", "lastSelected", targetValue);
      this.isEditing = false; // Reset to read mode on change
      this.render();
    });

    addNoteBtn.addEventListener("click", async () => {
      if (!this.isEditing) {
          // Automatically add a new empty note when switching to edit mode via "Add Note"
          const currentNotes = getCurrentNotes();
          currentNotes.push({ value: "" });
          await saveNotes(currentNotes);
          this.isEditing = true;
      } else {
          this.isEditing = false;
      }
      this.render();
    });

    return container;
  }

  /** @override */
  _replaceHTML(result, content, options) {
    content.replaceChildren(result);
  }
}

/**
 * A custom ApplicationV2 for adding a single note.
 */
class AddNoteApp extends foundry.applications.api.ApplicationV2 {
  constructor(actor, options={}) {
    super(options);
    this.actor = actor;
  }

  /** @override */
  static DEFAULT_OPTIONS = {
    id: "add-note-app",
    tag: "div",
    window: {
      title: "Add Note",
      icon: "fa-solid fa-plus",
      resizable: true
    },
    position: {
      width: 400,
      height: 300
    }
  };

  /** @override */
  async _renderHTML(context, options) {
    this.options.window.title = `Add Note for ${this.actor.name}`;
    
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    container.style.height = "100%";

    const contentArea = document.createElement("div");
    contentArea.style.flex = "1";
    contentArea.style.overflowY = "auto";
    contentArea.style.border = "1px solid #7a7971";
    contentArea.style.padding = "10px";
    contentArea.style.borderRadius = "3px";
    contentArea.style.background = "rgba(0, 0, 0, 0.1)";

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Enter note content...";
    textarea.style.width = "100%";
    textarea.style.height = "100%";
    textarea.style.minHeight = "120px";
    contentArea.appendChild(textarea);

    const durationContainer = document.createElement("div");
    durationContainer.style.display = "flex";
    durationContainer.style.alignItems = "center";
    durationContainer.style.gap = "10px";
    durationContainer.style.marginTop = "10px";

    const durationLabel = document.createElement("label");
    durationLabel.innerText = "Duration (Rounds):";
    durationLabel.style.fontSize = "0.9em";

    const durationInput = document.createElement("input");
    durationInput.type = "number";
    durationInput.value = "0";
    durationInput.min = "0";
    durationInput.style.width = "60px";
    durationInput.title = "Number of rounds before expiration. 0 for never.";

    durationContainer.appendChild(durationLabel);
    durationContainer.appendChild(durationInput);
    contentArea.appendChild(durationContainer);

    const footer = document.createElement("div");
    footer.style.display = "flex";
    footer.style.gap = "10px";
    footer.style.marginTop = "auto";

    const saveBtn = document.createElement("button");
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Note';
    saveBtn.style.flex = "1";
    saveBtn.onclick = async () => {
      const value = textarea.value;
      if (!value) return;

      const duration = parseInt(durationInput.value) || 0;

      const currentNotes = getFlagSafe(this.actor, "notes") || [];
      currentNotes.push({ value, duration });
      await setFlagSafe(this.actor, "notes", currentNotes);

      ui.notifications.info(`Added note for ${this.actor.name}`);
      
      if (gmTrackerNotesAppInstance) {
          const select = document.getElementById("combat-actor-select");
          if (select && select.value === this.actor.id) {
              gmTrackerNotesAppInstance.render();
          }
      }
      this.close();
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
    cancelBtn.style.flex = "1";
    cancelBtn.onclick = () => this.close();

    footer.appendChild(saveBtn);
    footer.appendChild(cancelBtn);

    container.appendChild(contentArea);
    container.appendChild(footer);

    return container;
  }

  /** @override */
  _replaceHTML(result, content, options) {
    content.replaceChildren(result);
  }
}

/**
 * FormApplication for Campaign Information
 */
class CampaignInformationConfig extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'campaign-information-config',
            title: 'Campaign Information',
            template: 'modules/218749-gm-tracker-notes/templates/campaign-info.hbs',
            width: 400,
            height: 'auto',
            closeOnSubmit: true
        });
    }

    /**
     * Static helper to render the application.
     */
    static open() {
        const instance = new CampaignInformationConfig();
        instance.render(true);
        return instance;
    }

    getData() {
        return {
            campaignName: game.settings.get('218749-gm-tracker-notes', 'campaignName'),
            sessionNumber: game.settings.get('218749-gm-tracker-notes', 'sessionNumber'),
            logoPath: game.settings.get('218749-gm-tracker-notes', 'logoPath'),
            showWorldName: game.settings.get('218749-gm-tracker-notes', 'showWorldName'),
            showLogo: game.settings.get('218749-gm-tracker-notes', 'showLogo')
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.session-control').click(this._onSessionControl.bind(this));
        html.find('.file-picker').click(this._onFilePicker.bind(this));
    }

    _onFilePicker(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const target = button.dataset.target;
        new FilePicker({
            type: "image",
            current: this.element.find(`input[name="${target}"]`).val(),
            callback: path => {
                this.element.find(`input[name="${target}"]`).val(path);
            }
        }).browse();
    }

    _onSessionControl(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const action = button.dataset.action;
        const input = this.element.find('input[name="sessionNumber"]');
        let value = parseInt(input.val()) || 0;

        if (action === 'plus') {
            input.val(value + 1);
        } else if (action === 'minus') {
            input.val(Math.max(0, value - 1));
        }
    }

    async _updateObject(event, formData) {
        await game.settings.set('218749-gm-tracker-notes', 'campaignName', formData.campaignName);
        await game.settings.set('218749-gm-tracker-notes', 'sessionNumber', formData.sessionNumber);
        await game.settings.set('218749-gm-tracker-notes', 'logoPath', formData.logoPath || 'modules/218749-gm-tracker-notes/logo.webp');
        await game.settings.set('218749-gm-tracker-notes', 'showWorldName', formData.showWorldName);
        await game.settings.set('218749-gm-tracker-notes', 'showLogo', formData.showLogo);
        
        if (game.user.isGM) {
            createNewSessionCard();
        }
    }
}

/**
 * Renders the session chat card content based on current settings.
 */
async function getSessionCardContent() {
    return await renderTemplate('modules/218749-gm-tracker-notes/templates/display.hbs', {
        worldName: game.world.title,
        showWorldName: game.settings.get('218749-gm-tracker-notes', 'showWorldName'),
        showLogo: game.settings.get('218749-gm-tracker-notes', 'showLogo'),
        campaignName: game.settings.get('218749-gm-tracker-notes', 'campaignName'),
        sessionNumber: game.settings.get('218749-gm-tracker-notes', 'sessionNumber'),
        logoPath: game.settings.get('218749-gm-tracker-notes', 'logoPath')
    });
}

/**
 * Creates a brand new session chat card.
 */
async function createNewSessionCard() {
    const content = await getSessionCardContent();
    await ChatMessage.create({
        content: content,
        flags: { "218749-gm-tracker-notes": { isSessionCard: true } }
    });
}

/**
 * Updates the existing session chat card if found, otherwise creates a new one.
 */
async function updateOrCreateSessionCard() {
    const content = await getSessionCardContent();
    const existingCard = game.messages.contents
        .slice(-50)
        .find(m => m.getFlag('218749-gm-tracker-notes', 'isSessionCard'));

    if (existingCard) {
        if (existingCard.content !== content) {
            await existingCard.update({ content });
        }
    } else {
        await createNewSessionCard();
    }
}

let gmTrackerNotesAppInstance;

Hooks.once('init', async function() {
  console.log('218749 GM Tracker Notes | Initializing');

  // Register setting for General Notes
  game.settings.register("218749-gm-tracker-notes", "generalNotes", {
    name: "General GM Notes",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  // Register setting for UI State (last selected actor)
  game.settings.register("218749-gm-tracker-notes", "lastSelected", {
    scope: "client",
    config: false,
    type: String,
    default: "general"
  });

  // Turn Marker settings
  game.settings.register("218749-gm-tracker-notes", "displayTurnMarkerToken", {
    name: "Display Turn Marker Token Image",
    hint: "Whether to display the combatant's token image at the beginning of the turn marker chat message.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register("218749-gm-tracker-notes", "hpEffectsLocation", {
    name: "TRACKER_NOTES.Settings.HPEffectsLocation.Name",
    hint: "TRACKER_NOTES.Settings.HPEffectsLocation.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: {
        "markers": "TRACKER_NOTES.Settings.HPEffectsLocation.Markers",
        "notes": "TRACKER_NOTES.Settings.HPEffectsLocation.Notes",
        "both": "TRACKER_NOTES.Settings.HPEffectsLocation.Both",
        "none": "TRACKER_NOTES.Settings.HPEffectsLocation.None"
    },
    default: "markers"
  });

  game.settings.register("218749-gm-tracker-notes", "skipTurnMarkersDefeated", {
    name: "TRACKER_NOTES.Settings.SkipTurnMarkersDefeated.Name",
    hint: "TRACKER_NOTES.Settings.SkipTurnMarkersDefeated.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register("218749-gm-tracker-notes", "skipNoteCardsDefeated", {
    name: "TRACKER_NOTES.Settings.SkipNoteCardsDefeated.Name",
    hint: "TRACKER_NOTES.Settings.SkipNoteCardsDefeated.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register("218749-gm-tracker-notes", "hideTurnMarkersGM", {
    name: "TRACKER_NOTES.Settings.HideTurnMarkersGM.Name",
    hint: "TRACKER_NOTES.Settings.HideTurnMarkersGM.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // --- World Name Display Settings ---
  game.settings.registerMenu('218749-gm-tracker-notes', 'campaignInfoMenu', {
      name: 'Campaign Information',
      label: 'Configure Campaign Info',
      hint: 'Set the campaign name and session number.',
      icon: 'fas fa-cog',
      type: CampaignInformationConfig,
      restricted: true
  });

  game.settings.register('218749-gm-tracker-notes', 'campaignName', {
      name: 'Campaign Name',
      scope: 'world',
      config: false,
      type: String,
      default: 'My Awesome Campaign'
  });

  game.settings.register('218749-gm-tracker-notes', 'sessionNumber', {
      name: 'Session Number',
      scope: 'world',
      config: false,
      type: Number,
      default: 1
  });

  game.settings.register('218749-gm-tracker-notes', 'logoPath', {
      name: 'Logo Image',
      scope: 'world',
      config: false,
      type: String,
      default: 'modules/218749-gm-tracker-notes/logo.webp'
  });

  game.settings.register('218749-gm-tracker-notes', 'showWorldName', {
      name: 'Show World Name',
      scope: 'world',
      config: false,
      type: Boolean,
      default: true
  });

  game.settings.register('218749-gm-tracker-notes', 'showLogo', {
      name: 'Show Logo',
      scope: 'world',
      config: false,
      type: Boolean,
      default: true
  });
});

/**
 * Extract HP, AC, Speed, Spell DC, and Active Effects data from an actor.
 * @param {Actor} actor 
 * @returns {object} {hp, ac, speed, spellDC, effects, deathSaves}
 */
function getActorStatusData(actor) {
    if (!actor) return { hp: null, ac: null, speed: null, spellDC: null, effects: [], deathSaves: null };
    
    let hp = null;
    const hpData = actor.system?.attributes?.hp;
    if (hpData) {
        hp = {
            value: hpData.value ?? 0,
            max: hpData.max ?? 0,
            temp: hpData.temp ?? 0
        };
    }

    const ac = actor.system?.attributes?.ac?.value;
    
    // Try multiple common paths for Spell DC
    let spellDC = actor.system?.attributes?.spelldc ?? actor.system?.attributes?.spellDC;
    if (spellDC && typeof spellDC === 'object') spellDC = spellDC.value;
    if (!spellDC) spellDC = actor.system?.details?.spellDC;

    // Manual calculation for dnd5e if still missing
    if (!spellDC && actor.system?.abilities && (actor.system?.attributes?.prof !== undefined)) {
        const abl = actor.system.attributes.spellcasting || actor.system.details.spellcasting;
        const mod = actor.system.abilities[abl]?.mod;
        const prof = actor.system.attributes.prof;
        if (abl && mod !== undefined && prof !== undefined) {
            spellDC = 8 + mod + prof;
        }
    }
    
    // Ensure it's a number or null
    spellDC = (spellDC !== undefined && spellDC !== null && spellDC !== "") ? Number(spellDC) : null;
    
    let speed = null;
    const movement = actor.system?.attributes?.movement;
    if (movement) {
        const types = ['walk', 'fly', 'swim', 'climb', 'burrow'];
        const primaryType = types.find(t => (movement[t] || 0) > 0) || 'walk';
        const value = movement[primaryType] || 0;
        const label = primaryType === 'walk' ? '' : `${primaryType.charAt(0).toUpperCase() + primaryType.slice(1)} `;
        speed = `${label}${value}${movement.units ? ' ' + movement.units : ''}`;
    }
    
    let deathSaves = null;
    if (actor.type === "character" && hp && hp.value === 0) {
        const ds = actor.system?.attributes?.death;
        if (ds) {
            deathSaves = {
                success: ds.success ?? 0,
                failure: ds.failure ?? 0
            };
        }
    }
    
    const effects = (actor.appliedEffects || [])
        .filter(e => !e.disabled && !e.isSuppressed)
        .map(e => ({
            id: e.id,
            name: e.name || e.label,
            icon: e.icon || e.img
        }));

    return { hp, ac, speed, spellDC, effects, deathSaves };
}

Hooks.once('ready', async function() {
  console.log('218749 GM Tracker Notes | Ready');
  console.log('218749 GM Tracker Notes | Module active check:', game.modules.get('218749-gm-tracker-notes')?.active);

  // Initialize state for any active combats for turn markers
  for (let combat of game.combats) {
    if (combat.started) {
      combatStates.set(combat.id, { turn: combat.turn, round: combat.round });
    }
  }

  // Session Card logic (from merged module)
  if (game.user.isGM) {
      updateOrCreateSessionCard();
  }
});

/**
 * Update or create a chat card for turn markers.
 * @param {string} type - "start-turn" or "end-turn"
 * @param {Combatant} combatant - The combatant for whom the marker is being posted
 * @param {string} [label] - Optional extra label for the marker
 */
async function updateOrCreateChatCard(type, combatant, label = "") {
  const combat = combatant.parent;
  const round = combat?.round || "";
  const message = type === "start-turn" 
      ? `Turn Start (Round ${round})` 
      : `Turn End (Round ${round})${label ? ` - ${label}` : ""}`;

  const actor = combatant.actor;
  const hpEffectsLocation = game.settings.get("218749-gm-tracker-notes", "hpEffectsLocation");
  const showHere = ["markers", "both"].includes(hpEffectsLocation);
  
  const { hp, ac, speed, spellDC, effects, deathSaves } = showHere ? getActorStatusData(actor) : { hp: null, ac: null, speed: null, spellDC: null, effects: [], deathSaves: null };

  const displayToken = game.settings.get("218749-gm-tracker-notes", "displayTurnMarkerToken");
  const tokenImg = displayToken ? (combatant.token?.texture.src || combatant.img || actor?.img) : null;

  const content = await foundry.applications.handlebars.renderTemplate("modules/218749-gm-tracker-notes/templates/turn-marker.hbs", {
      type,
      message,
      tokenImg,
      hp,
      ac,
      speed,
      spellDC,
      effects,
      deathSaves,
      actorId: actor?.id,
      isDefeated: combatant.isDefeated
  });

  return ChatMessage.create({
      content,
      speaker: ChatMessage.getSpeaker({
          actor: actor,
          token: combatant.token,
          scene: combatant.scene,
          alias: combatant.name
      })
  });
}

// Helper for flag operations to handle scope issues
const getFlagSafe = (doc, key) => {
  try {
    return doc.getFlag("218749-gm-tracker-notes", key);
  } catch (e) {
    // Fallback to 'world' scope if the module scope is rejected
    return doc.getFlag("world", `218749-gm-tracker-notes.${key}`);
  }
};

const setFlagSafe = async (doc, key, value) => {
  try {
    return await doc.setFlag("218749-gm-tracker-notes", key, value);
  } catch (e) {
    // Fallback to 'world' scope if the module scope is rejected
    return await doc.setFlag("world", `218749-gm-tracker-notes.${key}`, value);
  }
};

/**
 * Add a button to the left sidebar (Scene Controls).
 */
Hooks.on("getSceneControlButtons", (controls) => {
  if (!game.user.isGM) return;

  // In v14, controls is a Record<string, SceneControl> object.
  // We add our control as a new property.
  controls["gm-tracker-notes"] = {
    name: "gm-tracker-notes",
    title: "GM Tracker Notes",
    icon: "fa-solid fa-clipboard",
    visible: true,
    // Position it after tokens (which usually has order 0 or 10)
    order: (controls.token?.order ?? controls.tokens?.order ?? 0) + 1, 
    tools: {
      "open-notes": {
        name: "open-notes",
        title: "GM Tracker Notes",
        icon: "fa-solid fa-note-sticky",
        toggle: true,
        onClick: (active) => {
           // We will use both for compatibility, but onChange is what v14 wants for toggles.
           // If it's a 'button: true' it should stay onClick, but for toggles it's different.
           // Let's try the most modern approach:
        },
        onChange: (active) => {
          if (active) {
            if (!gmTrackerNotesAppInstance) {
              gmTrackerNotesAppInstance = new GMTrackerNotesApp();
            }
            gmTrackerNotesAppInstance.render(true);
          }
        }
      },
      "campaign-info": {
        name: "campaign-info",
        title: "Campaign Information",
        icon: "fas fa-cog",
        onClick: () => {
          CampaignInformationConfig.open();
        },
        button: true
      }
    }
  };
});

/**
 * Update or create a chat card for GM notes.
 * @param {string} type - "start-turn" or "end-turn"
 * @param {Combatant} combatant - The combatant
 */
async function postNotesCard(type, combatant) {
    const actor = combatant.actor;
    if (!actor) return;

    const skipNoteCards = game.settings.get("218749-gm-tracker-notes", "skipNoteCardsDefeated");
    const isDefeated = combatant.isDefeated;
    if (skipNoteCards && isDefeated) return;

    const notes = getFlagSafe(actor, "notes") || [];
    const hpEffectsLocation = game.settings.get("218749-gm-tracker-notes", "hpEffectsLocation");
    const showHere = ["notes", "both"].includes(hpEffectsLocation);
    
    if (notes.length === 0 && !showHere) return;

    const displayName = combatant.name || actor.name;
    const combat = combatant.parent;
    const round = combat?.round || "";
    const message = type === "start-turn" 
        ? `Turn Start (Round ${round})` 
        : `Turn End (Round ${round})`;

    const { hp, ac, speed, spellDC, effects, deathSaves } = showHere ? getActorStatusData(actor) : { hp: null, ac: null, speed: null, spellDC: null, effects: [], deathSaves: null };

    const displayToken = game.settings.get("218749-gm-tracker-notes", "displayTurnMarkerToken");
    const tokenImg = displayToken ? (combatant.token?.texture.src || combatant.img || actor?.img) : null;

    const content = await foundry.applications.handlebars.renderTemplate("modules/218749-gm-tracker-notes/templates/notes-card.hbs", {
        type,
        message,
        tokenImg,
        hp,
        ac,
        speed,
        spellDC,
        effects,
        deathSaves,
        notes,
        actorId: actor.id,
        isDefeated
    });

    return ChatMessage.create({
        content,
        whisper: ChatMessage.getWhisperRecipients("GM").map(u => u.id),
        speaker: ChatMessage.getSpeaker({actor: actor})
    });
}

/**
 * Display actor notes when their turn starts in combat and handle turn markers.
 */
Hooks.on("updateCombat", async (combat, updateData, options, userId) => {
  // Only proceed if the turn or round has changed
  if (!("turn" in updateData || "round" in updateData)) return;

  // Only the first active GM should trigger to avoid duplicates
  const firstActiveGM = game.users.find(u => u.isGM && u.active);
  if (game.user !== firstActiveGM) return;

  // Ensure combat is active and has started
  if (!combat.started) return;

  // --- Handle Turn Markers and Notes ---
  const combatId = combat.id;
  const prevState = combatStates.get(combatId);
  const skipTurnMarkers = game.settings.get("218749-gm-tracker-notes", "skipTurnMarkersDefeated");
  
  // Handle Previous Combatant (End of Turn)
  if (prevState !== undefined) {
      const prevCombatant = combat.turns[prevState.turn];
      if (prevCombatant) {
          // --- Handle Note Expiration (Actor Notes) ---
          const actor = prevCombatant.actor;
          if (actor) {
              let notes = getFlagSafe(actor, "notes") || [];
              if (Array.isArray(notes) && notes.length > 0) {
                  let changed = false;
                  const updatedNotes = notes.filter(note => {
                      // Only process notes with a duration > 0
                      if (note && typeof note.duration === "number" && note.duration > 0) {
                          note.duration -= 1;
                          changed = true;
                          // If it reached 0, it expires and should be removed
                          if (note.duration <= 0) {
                              console.log(`218749 GM Tracker Notes | Note expired for ${actor.name}: ${note.value}`);
                              return false;
                          }
                      }
                      return true;
                  });

                  if (changed) {
                      await setFlagSafe(actor, "notes", updatedNotes);
                      // Refresh the notes app if it's open and showing this actor
                      if (gmTrackerNotesAppInstance) {
                          const select = document.getElementById("combat-actor-select");
                          if (select && select.value === actor.id) {
                              gmTrackerNotesAppInstance.render();
                          }
                      }
                  }
              }
          }

          // Public Turn Marker
          const skipMarker = skipTurnMarkers && prevCombatant.isDefeated;
          if (!skipMarker) await updateOrCreateChatCard("end-turn", prevCombatant);
          
          // Private Notes Card
          await postNotesCard("end-turn", prevCombatant);
      }
  }

  // Handle Current Combatant (Start of Turn)
  const currentCombatant = combat.combatant;
  if (currentCombatant) {
      // Public Turn Marker
      const skipMarker = skipTurnMarkers && currentCombatant.isDefeated;
      if (!skipMarker) await updateOrCreateChatCard("start-turn", currentCombatant);

      // Private Notes Card
      await postNotesCard("start-turn", currentCombatant);
  }

  // Update the tracked state
  const roundChanged = prevState && combat.round > prevState.round;
  combatStates.set(combatId, { turn: combat.turn, round: combat.round });

  // Handle Round Start Marker
  if (roundChanged) {
      const content = `
      <div class="turn-marker round-start">
          <div class="header-line">
              <div class="round-icon-container">
                  <i class="fa-solid fa-hourglass-start"></i>
              </div>
              <h3>Round ${combat.round} Started</h3>
          </div>
      </div>`;
      await ChatMessage.create({
          content,
          speaker: { alias: "Combat Tracker" }
      });

      // --- Handle General Note Expiration ---
      let generalNotesStr = game.settings.get("218749-gm-tracker-notes", "generalNotes") || "[]";
      let generalNotes = [];
      try {
          generalNotes = JSON.parse(generalNotesStr);
      } catch (e) { generalNotes = []; }

      if (Array.isArray(generalNotes) && generalNotes.length > 0) {
          let changed = false;
          const updatedGeneralNotes = generalNotes.filter(note => {
              if (note && typeof note.duration === "number" && note.duration > 0) {
                  note.duration -= 1;
                  changed = true;
                  if (note.duration <= 0) return false;
              }
              return true;
          });

          if (changed) {
              await game.settings.set("218749-gm-tracker-notes", "generalNotes", JSON.stringify(updatedGeneralNotes));
              if (gmTrackerNotesAppInstance) {
                  const select = document.getElementById("combat-actor-select");
                  if (select && select.value === "general") {
                      gmTrackerNotesAppInstance.render();
                  }
              }
          }
      }
  }
});


Hooks.on("deleteCombat", async (combat) => {
  const firstActiveGM = game.users.find(u => u.isGM && u.active);
  if (game.user !== firstActiveGM) return;

  if (combat.started) {
      const lastCombatant = combat.combatant;
      if (lastCombatant) {
          await updateOrCreateChatCard("end-turn", lastCombatant, "Combat Ended");
          await postNotesCard("end-turn", lastCombatant);
      }
  }

  // Clear notes for NPCs that were in this combat
  for (let combatant of combat.combatants) {
      const actor = combatant.actor;
      // In many systems, "character" is the type for PCs.
      if (actor && actor.type !== "character") {
          await setFlagSafe(actor, "notes", []);
      }
  }

  combatStates.delete(combat.id);
});

Hooks.on("renderChatMessage", (message, html, data) => {
    if (!game.user.isGM) return;

    const htmlElement = html[0];

    // Hide turn markers if the setting is enabled for GM
    if (game.settings.get("218749-gm-tracker-notes", "hideTurnMarkersGM")) {
        if (htmlElement.querySelector(".turn-marker")) {
            htmlElement.style.display = "none";
            return;
        }
    }

    // Handle Add Note button (Turn Markers)
    const addNoteBtn = htmlElement.querySelector(".add-note-btn");
    if (addNoteBtn) {
        addNoteBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            const actorId = addNoteBtn.dataset.actorId;
            const actor = game.actors.get(actorId);
            if (!actor) return;

            new AddNoteApp(actor).render(true);
        });
    }

    // Handle individual note deletion (Notes Cards)
    const deleteNoteBtns = htmlElement.querySelectorAll(".delete-actor-note-chat");
    deleteNoteBtns.forEach(btn => {
        btn.addEventListener("click", async (event) => {
            event.preventDefault();
            const container = btn.closest(".gm-tracker-note-item");
            const actorId = container.dataset.actorId;
            const index = parseInt(container.dataset.noteIndex);
            const actor = game.actors.get(actorId);
            if (!actor) return;

            const confirm = await Dialog.confirm({
                title: "Delete Note",
                content: `<p>Are you sure you want to delete this note?</p>`,
                yes: () => true,
                no: () => false,
                defaultYes: false
            });

            if (confirm) {
                const currentNotes = getFlagSafe(actor, "notes") || [];
                if (currentNotes.length > index) {
                    currentNotes.splice(index, 1);
                    await setFlagSafe(actor, "notes", currentNotes);
                    ui.notifications.info("Note deleted");
                    
                    if (gmTrackerNotesAppInstance) {
                        const select = document.getElementById("combat-actor-select");
                        if (select && select.value === actorId) {
                            gmTrackerNotesAppInstance.render();
                        }
                    }
                    container.style.display = "none";
                }
            }
        });
    });

    // Handle active effect deletion from chat cards
    const deleteEffectBtns = htmlElement.querySelectorAll(".delete-effect-chat");
    deleteEffectBtns.forEach(btn => {
        btn.addEventListener("click", async (event) => {
            event.preventDefault();
            const container = btn.closest(".effect-item");
            const actorId = container.dataset.actorId || container.closest(".turn-marker")?.querySelector(".add-note-btn")?.dataset.actorId;
            const effectId = container.dataset.effectId;
            
            if (!actorId || !effectId) return;
            const actor = game.actors.get(actorId);
            if (!actor) return;

            // Search through all applied effects (including those from items)
            const effect = actor.appliedEffects.find(e => e.id === effectId);
            if (!effect) return;

            const confirm = await Dialog.confirm({
                title: "Disable Effect",
                content: `<p>Are you sure you want to disable the effect <strong>${effect.name || effect.label}</strong> for <strong>${actor.name}</strong>?</p>`,
                yes: () => true,
                no: () => false,
                defaultYes: false
            });

            if (confirm) {
                try {
                    // Always update to disabled: true as requested
                    await effect.update({ disabled: true });
                    ui.notifications.info(`Disabled effect ${effect.name || effect.label}`);
                    
                    // Visually dim the item in the chat card to show it's inactive
                    container.style.opacity = "0.4";
                    btn.style.display = "none";
                } catch (error) {
                    console.error("218749 GM Tracker Notes | Could not disable effect:", error);
                    ui.notifications.error(`Failed to disable effect ${effect.name || effect.label}`);
                }
            }
        });
    });
});

Hooks.on("renderChatMessageHTML", (message, html, context) => {
  let label = "";
  let colorClass = "";

  // V14 optimized visibility checks
  const isWhisper = message.whisper?.length > 0;
  const isBlind = message.blind;
  const isRoll = message.isRoll;

  if (isWhisper) {
    if (isBlind) {
      label = "BLIND ROLL";
      colorClass = "cvs-blind";
    } else if (isRoll) {
      label = "GM ROLL";
      colorClass = "cvs-gm";
    } else {
      label = "WHISPER";
      colorClass = "cvs-whisper";
    }
  } else {
    label = "PUBLIC";
    colorClass = "cvs-public";
  }

  // Prepend the header using native DOM API for V14 compatibility
  const headerHtml = `<div class="cvs-header ${colorClass}">${label}</div>`;
  html.insertAdjacentHTML("afterbegin", headerHtml);
});

