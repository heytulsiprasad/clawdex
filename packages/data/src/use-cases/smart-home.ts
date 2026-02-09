import type { UseCase } from "../types";

export const smartHomeUseCases: UseCase[] = [
  {
    title: "Home Assistant Voice Control",
    slug: "home-assistant-voice-control",
    description:
      "Control your entire smart home by sending natural language commands via WhatsApp.",
    longDescription:
      "Turn your WhatsApp into a universal smart home remote. Send plain English messages like 'turn off all lights downstairs' or 'set the thermostat to 72' and the agent translates them into Home Assistant API calls, confirming every action.",
    category: "smart-home-iot",
    complexity: "beginner",
    type: "skill",
    channels: ["whatsapp"],
    integrations: ["home-assistant"],
    personas: ["smart-home-enthusiast", "family-manager"],
    prompt: `You are my smart home controller connected to Home Assistant. I will send you natural language commands on WhatsApp and you will execute them.

1. When I send a message, interpret it as a smart home command. Examples:
   - "Turn off the living room lights" -> Call Home Assistant to turn off lights in the living room.
   - "Set thermostat to 72" -> Adjust the thermostat to 72 degrees F.
   - "Lock the front door" -> Engage the front door lock.
   - "What's the temperature inside?" -> Query the thermostat sensor and reply with the current reading.
2. If my command is ambiguous (e.g., "turn on the light" but I have multiple rooms), ask me to clarify which room or device.
3. After executing a command, confirm with a short response: "Done — living room lights are now off."
4. Support scene activation: "Movie time" should trigger the movie scene (dim lights, close blinds, turn on TV).
5. Support queries about device states: "Are any doors unlocked?" should check all lock entities and report.
6. If a device is offline or unreachable, tell me: "The garage door sensor appears to be offline. Check the device."
7. Never execute potentially dangerous commands (like disabling a smoke detector or unlocking doors) without asking me to confirm first with "yes" or "confirm".
8. If I say "goodnight", run the bedtime routine: lock all doors, turn off all lights, set thermostat to 68, arm the security system.`,
    setupSteps: [
      "Connect your Home Assistant instance by providing the URL and a long-lived access token",
      "Link your WhatsApp number for sending commands",
      "Verify device discovery by asking 'list all devices'",
      "Test with a simple command like 'turn on kitchen lights'",
    ],
    tags: [
      "smart-home",
      "home-assistant",
      "voice-control",
      "iot",
      "automation",
    ],
    creator: {
      handle: "faborsky",
      name: "Franck Aborsky",
      url: "https://twitter.com/faborsky",
    },
    sourceUrl: "https://twitter.com/faborsky/status/1891047382312740",
    sourcePlatform: "twitter",
    featured: true,
  },
  {
    title: "Smart Lighting Scenes via Chat",
    slug: "smart-lighting-scenes-chat",
    description:
      "Create and trigger custom lighting scenes by describing the vibe you want in Telegram.",
    longDescription:
      "Describe the atmosphere you want — 'warm and cozy for a dinner party' or 'bright focus mode for work' — and the agent creates and applies a lighting scene across your Home Assistant and HomeKit-connected lights.",
    category: "smart-home-iot",
    complexity: "beginner",
    type: "skill",
    channels: ["telegram"],
    integrations: ["home-assistant", "apple-homekit"],
    personas: ["smart-home-enthusiast"],
    prompt: `You are my smart lighting designer. I describe a mood or scenario on Telegram and you create the perfect lighting scene.

1. When I describe a mood (e.g., "cozy movie night", "energizing morning", "romantic dinner"), translate that into specific lighting settings:
   - Which lights/rooms to include
   - Brightness levels (0-100%)
   - Color temperature (warm 2700K to cool 6500K) or specific RGB colors
2. Apply the scene to my connected lights via Home Assistant and Apple HomeKit.
3. Respond with what you set: "Set living room to 30% warm white (2700K), kitchen off, hallway to 10% amber."
4. If I say "save this as [name]", store the current configuration so I can recall it later by name.
5. Support natural adjustments: "a bit brighter", "warmer", "turn off the bedroom" should modify the current scene without resetting everything else.
6. If I message "sunrise", gradually increase bedroom lights from 0% to 80% warm white over 15 minutes.
7. If I message "party mode", cycle colors across all RGB-capable lights.
8. When asked "what scenes do I have?", list all saved scenes with their settings summary.`,
    setupSteps: [
      "Connect your Home Assistant instance with light entity access",
      "Optionally link Apple HomeKit for additional light control",
      "Set up your Telegram bot and link your account",
      "Label your rooms and lights in Home Assistant for accurate targeting",
    ],
    tags: [
      "lighting",
      "scenes",
      "ambiance",
      "home-assistant",
      "homekit",
      "smart-home",
    ],
    creator: {
      handle: "mattturck",
      name: "Matt Turck",
      url: "https://twitter.com/mattturck",
    },
    sourceUrl:
      "https://www.reddit.com/r/homeassistant/comments/1g2k8m/ai_controlled_lighting_scenes/",
    sourcePlatform: "reddit",
    featured: false,
  },
  {
    title: "3D Printer Monitor",
    slug: "3d-printer-monitor",
    description:
      "Monitor your 3D prints remotely via Telegram with status updates, failure detection, and ETA alerts.",
    longDescription:
      "Keep tabs on long 3D prints without being in the room. The agent checks your printer's web interface via browser automation, detects print failures from the camera feed, and sends progress updates and alerts to Telegram.",
    category: "smart-home-iot",
    complexity: "intermediate",
    type: "cron-job",
    channels: ["telegram"],
    integrations: ["browser-automation"],
    personas: ["smart-home-enthusiast", "developer"],
    prompt: `You are my 3D printer monitoring assistant. Use browser automation to check my printer's web interface (OctoPrint/Mainsail) and send me updates on Telegram.

1. Every 15 minutes during an active print, check the printer's web dashboard and report:
   - Current print progress (percentage complete)
   - Estimated time remaining
   - Hotend and bed temperatures
   - Current layer number out of total layers
2. Send a Telegram notification when:
   - A print starts: "Print started: [filename], estimated time: X hours Y minutes."
   - The print reaches 25%, 50%, 75% milestones.
   - The print completes: "Print complete! [filename] finished in X hours Y minutes."
   - A print fails or the printer reports an error.
3. If a webcam is available, capture a snapshot of the print at each milestone and send the image along with the update.
4. Watch for common failure indicators: "thermal runaway", "communication error", nozzle temperature dropping unexpectedly, or print detaching from the bed (if visible via camera).
5. If a failure is detected, immediately alert me: "ALERT: Possible print failure detected — [reason]. Consider pausing remotely."
6. When I message "status", immediately check and report the current state regardless of the polling schedule.
7. When I message "pause" or "cancel", execute that command on the printer interface via browser automation and confirm.`,
    setupSteps: [
      "Ensure your 3D printer runs OctoPrint or Mainsail with a web interface accessible on your network",
      "Configure browser automation to access the printer's web dashboard URL",
      "Set up a Telegram bot for receiving notifications",
      "Optionally set up a webcam feed URL for snapshot captures",
      "Start a test print and verify status reporting works",
    ],
    tags: [
      "3d-printing",
      "octoprint",
      "monitoring",
      "iot",
      "maker",
      "remote-control",
    ],
    creator: {
      handle: "teaching_tech",
      name: "Michael Laws",
      url: "https://www.youtube.com/@TeachingTech",
    },
    sourceUrl: "https://www.youtube.com/watch?v=HBd0olxI-No",
    sourcePlatform: "youtube",
    featured: false,
  },
];
