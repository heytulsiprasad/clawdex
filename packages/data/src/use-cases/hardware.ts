import type { UseCase } from "../types";

export const hardwareUseCases: UseCase[] = [
  {
    title: "Raspberry Pi Home Server Setup",
    slug: "raspberry-pi-home-server-setup",
    description:
      "Manage and monitor a Raspberry Pi home server via Telegram with Docker container controls and health checks.",
    longDescription:
      "Turn a Raspberry Pi into a fully managed home server you control from Telegram. The agent monitors system health (CPU, memory, disk, temperature), manages Docker containers, handles updates, and alerts you when something needs attention — no SSH required.",
    category: "hardware-edge",
    complexity: "advanced",
    type: "hardware",
    channels: ["telegram"],
    integrations: ["home-assistant", "docker"],
    personas: ["developer", "smart-home-enthusiast"],
    prompt: `You are the management agent for my Raspberry Pi home server. I will interact with you via Telegram to monitor and control the server.

1. **Health Monitoring** (run every 10 minutes):
   - Check CPU usage, memory usage, disk space, and CPU temperature.
   - If CPU temperature exceeds 75 degrees C, alert me: "WARNING: Pi CPU temp is [X] C. Consider improving ventilation."
   - If disk usage exceeds 85%, alert me with the largest directories.
   - If any Docker container has restarted more than 3 times in the last hour, alert me.

2. **Docker Management** — respond to these commands:
   - "status" -> List all running containers with their uptime, CPU%, and memory usage.
   - "restart [container]" -> Restart the specified container and confirm.
   - "logs [container]" -> Send the last 50 lines of logs for that container.
   - "update [container]" -> Pull the latest image and recreate the container. Report if the image was already up to date.
   - "update all" -> Update all containers sequentially, reporting results for each.

3. **Home Assistant Integration**:
   - The Pi runs Home Assistant in Docker. Monitor its health specifically.
   - If Home Assistant becomes unresponsive, attempt an automatic restart and notify me.
   - Report Home Assistant add-on update availability weekly.

4. **System Maintenance**:
   - "backup" -> Trigger a backup of Docker volumes and Home Assistant config to the connected USB drive. Report size and duration.
   - "uptime" -> Report system uptime, last boot time, and current OS version.
   - "network" -> Show connected devices on the local network (via arp scan) and current internet speed.

5. **Security**:
   - Monitor SSH login attempts. Alert me on any failed login attempts from unknown IPs.
   - If more than 10 failed attempts from the same IP, suggest blocking it and do so on my confirmation.

6. Send a daily health digest at 8 AM: system uptime, all container statuses, disk/CPU/memory usage, and any warnings.`,
    setupSteps: [
      "Install the agent client on your Raspberry Pi (requires Python 3.9+ and Docker)",
      "Set up a Telegram bot and provide the bot token",
      "Grant the agent Docker socket access for container management",
      "Connect Home Assistant instance URL and access token",
      "Configure the USB backup drive path",
      "Test with 'status' command to verify Docker integration",
    ],
    tags: [
      "raspberry-pi",
      "home-server",
      "docker",
      "monitoring",
      "home-assistant",
      "self-hosted",
      "edge",
    ],
    creator: {
      handle: "networkchuck",
      name: "Chuck Keith",
      url: "https://www.youtube.com/@NetworkChuck",
    },
    sourceUrl: "https://www.youtube.com/watch?v=bKGy4aLGmz0",
    sourcePlatform: "youtube",
    featured: false,
  },
];
