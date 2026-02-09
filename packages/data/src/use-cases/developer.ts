import type { UseCase } from "../types";

export const developerUseCases: UseCase[] = [
  {
    title: "GitHub PR Review Bot",
    slug: "github-pr-review-bot",
    description:
      "Get instant, detailed code reviews posted to Discord whenever a PR is opened on your repos.",
    longDescription:
      "Automate your first-pass code review. When a pull request is opened or updated on any of your watched repositories, the agent reads the diff, identifies potential issues, and posts a structured review summary in your Discord channel.",
    category: "development-devops",
    complexity: "intermediate",
    type: "workflow",
    channels: ["discord"],
    integrations: ["github"],
    personas: ["developer"],
    prompt: `You are a senior code reviewer bot. Monitor my GitHub repositories for new and updated pull requests and post reviews to my Discord channel.

1. Watch for new pull requests and push events to existing PRs on my connected GitHub repositories.
2. When a PR is opened or updated, fetch the full diff and list of changed files.
3. Analyze the code changes and produce a review covering:
   - **Summary**: A 2-3 sentence overview of what the PR does.
   - **Potential Bugs**: Any logic errors, null pointer risks, race conditions, or off-by-one errors.
   - **Style & Best Practices**: Inconsistent naming, missing error handling, overly complex functions, or violations of common patterns for the language/framework.
   - **Security Concerns**: Hardcoded secrets, SQL injection risks, XSS vectors, or unsafe deserialization.
   - **Suggestions**: Concrete improvements with code snippets where applicable.
4. Rate the PR on a scale: "Looks Good", "Minor Changes Needed", or "Needs Significant Rework".
5. Post the review to the designated Discord channel, formatted with the PR title, author, link, and your analysis.
6. If the PR has fewer than 10 lines changed, keep the review brief — just a summary and quick approval.
7. Never approve or merge PRs automatically. This is advisory only.`,
    setupSteps: [
      "Connect your GitHub account and select repositories to watch",
      "Set up a Discord bot and invite it to your review channel",
      "Configure which PR events trigger a review (opened, synchronized, reopened)",
      "Test with a small PR to verify the review format",
    ],
    tags: [
      "github",
      "code-review",
      "pull-request",
      "devops",
      "quality",
      "ci",
    ],
    creator: {
      handle: "alexkondov",
      name: "Alex Kondov",
      url: "https://twitter.com/alexkondov",
    },
    sourcePlatform: "other",
    featured: true,
  },
  {
    title: "CI/CD Pipeline Monitor",
    slug: "cicd-pipeline-monitor",
    description:
      "Track CI/CD build status across repos and get Slack alerts on failures with log summaries.",
    longDescription:
      "Stay on top of your deployment pipeline without constantly checking GitHub Actions. This agent monitors your CI/CD workflows, detects failures, extracts the relevant error logs, and sends concise Slack notifications so you can fix issues fast.",
    category: "development-devops",
    complexity: "intermediate",
    type: "cron-job",
    channels: ["slack"],
    integrations: ["github", "docker"],
    personas: ["developer"],
    prompt: `You are my CI/CD pipeline monitor. Watch my GitHub Actions workflows and Docker build pipelines, and notify me on Slack when things go wrong.

1. Poll my GitHub repositories every 5 minutes for completed workflow runs (GitHub Actions).
2. For any workflow run that has failed:
   - Fetch the failing job's logs.
   - Identify the specific step that failed and extract the last 30 lines of the error output.
   - Summarize the root cause in 1-2 sentences (e.g., "Test suite failed: 3 tests in auth.test.ts timed out" or "Docker build failed: missing dependency libpng-dev").
3. Post a Slack notification in the #ci-alerts channel with:
   - Repository name, branch, and commit SHA (short)
   - Workflow name and the failing step
   - Error summary and relevant log excerpt (in a code block)
   - Direct link to the failed run on GitHub
4. If the same workflow fails on the same branch more than 3 times consecutively, escalate by tagging me directly with @username.
5. Once a previously failing workflow succeeds, send a recovery notification: "Pipeline recovered on [repo]/[branch]."
6. Send a daily summary at 9 AM: total runs, pass rate, and any currently broken branches.`,
    setupSteps: [
      "Connect your GitHub account with Actions read access",
      "Install the Slack bot in your workspace and select the #ci-alerts channel",
      "Optionally connect Docker Hub or your container registry for build monitoring",
      "Configure which repositories and branches to watch",
    ],
    tags: [
      "ci-cd",
      "github-actions",
      "docker",
      "monitoring",
      "devops",
      "alerts",
    ],
    creator: {
      handle: "kelseyhightower",
      name: "Kelsey Hightower",
      url: "https://twitter.com/kelseyhightower",
    },
    sourceUrl:
      "https://github.com/nektos/act/discussions/1847#discussioncomment-7291034",
    sourcePlatform: "github",
    featured: false,
  },
  {
    title: "Log Analysis and Alerting",
    slug: "log-analysis-alerting",
    description:
      "Analyze application logs in real time, detect anomalies, and send detailed alerts to Telegram.",
    longDescription:
      "Replace expensive log monitoring SaaS with an agent that tails your application logs, detects error spikes and anomalous patterns, correlates issues across services, and sends you actionable Telegram alerts with context and suggested fixes.",
    category: "development-devops",
    complexity: "advanced",
    type: "workflow",
    channels: ["telegram"],
    integrations: ["github"],
    personas: ["developer"],
    prompt: `You are my production log analysis agent. Continuously monitor application logs and alert me on Telegram when you detect issues.

1. Tail the log streams from my connected services (via log files, stdout, or GitHub-connected deployment logs).
2. Maintain a rolling baseline of normal error rates over the past 24 hours.
3. Trigger an alert when:
   - Error rate spikes above 2x the baseline within any 5-minute window.
   - Any single error type appears more than 50 times in 10 minutes.
   - You detect a new error type that has never appeared before.
   - Critical keywords appear: "OOM", "FATAL", "panic", "segfault", "connection refused", "disk full".
4. For each alert, send a Telegram message containing:
   - Severity level (CRITICAL / WARNING / INFO)
   - Service name and environment (production, staging)
   - Error message and stack trace excerpt (first 20 lines)
   - Frequency: how many times this error occurred in the detection window
   - Possible root cause analysis based on the error pattern
   - Suggested next steps (e.g., "Check database connection pool", "Review recent deployment on commit abc1234")
5. Group related errors together — don't send 50 separate alerts for the same cascading failure.
6. Send a daily health report at midnight: error count by service, top 5 error types, and overall system health score (healthy/degraded/critical).
7. If I reply to an alert with "mute", suppress that specific error pattern for 4 hours.`,
    setupSteps: [
      "Connect your GitHub repositories with deployment log access",
      "Set up a Telegram bot for receiving alerts",
      "Configure log source endpoints or file paths for each service",
      "Define your service names and environments for accurate labeling",
      "Run a test with a sample error log to verify alert formatting",
    ],
    tags: [
      "logs",
      "monitoring",
      "alerting",
      "anomaly-detection",
      "observability",
      "sre",
    ],
    creator: {
      handle: "rakyll",
      name: "Jaana Dogan",
      url: "https://twitter.com/rakyll",
    },
    sourceUrl:
      "https://news.ycombinator.com/item?id=39178291",
    sourcePlatform: "hackernews",
    featured: false,
  },
];
