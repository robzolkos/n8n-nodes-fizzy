# n8n-nodes-fizzy

[![n8n.io - Workflow Automation](https://img.shields.io/badge/n8n-community%20node-ff6d5a)](https://n8n.io)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![CI](https://github.com/robzolkos/n8n-nodes-fizzy/actions/workflows/ci.yml/badge.svg)](https://github.com/robzolkos/n8n-nodes-fizzy/actions/workflows/ci.yml)

This is an n8n community node that lets you integrate [Fizzy](https://fizzy.do) into your n8n workflows.

Fizzy is 37signals' simple, opinionated kanban tool that helps teams focus on what matters. With this node, you can automate your Fizzy boards, cards, comments, and more—connecting them to hundreds of other services in n8n.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## What You Can Do

### Automate Your Workflow
- **Create cards automatically** from emails, Slack messages, or form submissions
- **Sync cards** with your CRM, helpdesk, or other project tools
- **Get notified** in Slack, Discord, or email when cards are assigned or completed
- **Generate reports** by pulling card data into spreadsheets or dashboards

### React to Events in Real-Time
The **Fizzy Trigger** node listens for webhook events, so your workflows fire instantly when:
- A new card is added
- A card is moved to a column
- Someone is assigned or unassigned
- A card is moved to "Done", reopened, or moved to "Not Now"
- A comment is added

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

**Quick install via npm:**
```bash
npm install n8n-nodes-fizzy
```

## Nodes

### Fizzy

The main node for interacting with your Fizzy data. Supports full CRUD operations across all Fizzy resources.

| Resource | Operations |
|----------|------------|
| **Board** | Get, Get Many, Create, Update, Delete |
| **Card** | Get, Get Many, Create, Update, Delete, Close, Reopen, Move to Column, Move to Not Now, Send to Triage, Toggle Tag, Toggle Assignment, Watch, Unwatch |
| **Column** | Get, Get Many, Create, Update, Delete |
| **Comment** | Get, Get Many, Create, Update, Delete |
| **Reaction** | Get Many, Create, Delete |
| **Step** | Get, Create, Update, Delete |
| **Tag** | Get Many |
| **User** | Get, Get Many, Update, Deactivate |
| **Notification** | Get Many, Mark as Read, Mark as Unread, Mark All as Read |

### Fizzy Trigger

A webhook-based trigger node that starts workflows when events happen in Fizzy.

| Event | Description |
|-------|-------------|
| Card Added | A new card is created |
| Card Assigned | Someone is assigned to a card |
| Card Board Changed | A card is moved to a different board |
| Card Column Changed | A card is moved to a column |
| Card Moved Back to "Maybe?" | A card is sent back to triage |
| Card Moved to "Done" | A card is closed |
| Card Moved to "Not Now" | A card is postponed |
| Card Moved to "Not Now" Due to Inactivity | A card is automatically postponed due to inactivity |
| Card Reopened | A card is reopened from Done |
| Card Unassigned | Someone is removed from a card |
| Comment Added | A comment is added to a card |

Webhook payloads can be verified using HMAC-SHA256 signature verification for security.

## Credentials

To connect n8n to Fizzy, you'll need:

1. **API Token** - Generate a personal access token from your Fizzy account settings
2. **Base URL** (optional) - Defaults to `https://app.fizzy.do`. Change this if you're using a self-hosted instance.

### Setting Up Credentials

1. In n8n, go to **Credentials** → **New Credential**
2. Search for "Fizzy API"
3. Enter your API token
4. (Optional) Update the base URL if self-hosting
5. Click **Test Connection** to verify

## Compatibility

- **Minimum n8n version:** 1.0.0
- **Node.js:** v20 or higher
- **Tested with:** n8n 1.70.0+

## Development

### Setup

```bash
git clone https://github.com/robzolkos/n8n-nodes-fizzy.git
cd n8n-nodes-fizzy
npm install
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run lint` | Validate node structure against n8n requirements |
| `npm run lintfix` | Auto-fix linting issues |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run dev` | Start n8n with hot-reload for development |

### Testing with Docker

Run n8n in Docker with your local node mounted:

```bash
# Build the node first
npm run build

# Start n8n with the custom node
docker run -it --rm -p 5678:5678 \
  -v $(pwd)/dist:/home/node/.n8n/custom/n8n-nodes-fizzy \
  -e N8N_CUSTOM_EXTENSIONS="/home/node/.n8n/custom" \
  n8nio/n8n

# Open http://localhost:5678 and search for "Fizzy"
```

## Example Workflows

### Slack → Fizzy Card
Create a Fizzy card whenever someone posts in a specific Slack channel.

### Fizzy → Google Sheets Report
When a card is closed, append its details to a Google Sheet for tracking completed work.

### Email → Fizzy Triage
Forward emails to a webhook that creates cards in your Fizzy triage column.

### Fizzy Assignment → Slack DM
Notify team members via Slack DM when they're assigned to a card.

## Resources

- [Fizzy](https://fizzy.do) - Official Fizzy website
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Community Forum](https://community.n8n.io/)

## License

[MIT](LICENSE)

---

<sub>Fizzy is a trademark of 37signals, LLC. The Fizzy logo is used with permission.</sub>
