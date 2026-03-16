# Communiply CLI

Rally your community to engage with your tweets — replies, likes, and reposts powered by [ProductClank](https://productclank.com).

## Install

```bash
npm install -g @productclank/communiply-cli
```

## Quick Start

```bash
# 1. Register (first time only — get 300 free credits)
communiply auth register MyAgent

# 2. Or login with existing key
communiply auth login pck_live_YOUR_KEY

# 3. Link your ProductClank account (optional, uses your credits)
communiply auth link

# 4. Boost a tweet — get community replies
communiply boost https://x.com/myproduct/status/123456789
```

## Commands

### `communiply boost <tweet-url>`

Get your community to engage with your tweet — replies (support, questions, congrats), likes, or reposts.

```bash
# Community replies showing support and asking questions (200 credits)
communiply boost https://x.com/myproduct/status/123 --action replies \
  --guidelines "Congratulate the team, ask about the new features, show excitement"

# Community likes (300 credits)
communiply boost https://x.com/myproduct/status/123 --action likes

# Community reposts (300 credits)
communiply boost https://x.com/myproduct/status/123 --action reposts

# Pass tweet text directly (skips server-side fetch — useful when Twitter API is down)
communiply boost https://x.com/myproduct/status/123 --action replies \
  --tweet-text "We just shipped v2.0! 10x faster API." \
  --tweet-author myproduct

# Skip confirmation prompt (for scripting/automation)
communiply boost https://x.com/myproduct/status/123 --yes

# Skip product prompt if you have a default set
communiply boost https://x.com/myproduct/status/123 --product YOUR_PRODUCT_ID
```

| Action | What You Get | Credits |
|--------|-------------|---------|
| Replies (default) | 10 community replies (support, questions, congrats) | 200 |
| Likes | 30 community likes | 300 |
| Reposts | 10 community reposts | 300 |

**Flags:**

| Flag | Short | Description |
|------|-------|-------------|
| `--action <type>` | `-a` | Action type: replies, likes, or reposts (default: replies) |
| `--product <id>` | `-p` | Product ID (or use default from config) |
| `--guidelines <text>` | `-g` | Custom reply guidelines (e.g., "ask about features, show excitement") |
| `--tweet-text <text>` | `-t` | Tweet text — skips server-side fetch |
| `--tweet-author <name>` | | Tweet author username (used with --tweet-text) |
| `--json` | | Output raw JSON (for scripting) |
| `--yes` | `-y` | Skip confirmation prompt |

### `communiply auth`

```bash
communiply auth register MyAgent   # Create new agent + get API key + 300 free credits
communiply auth login [key]        # Save API key
communiply auth status             # Check auth + credits
communiply auth link               # Link to ProductClank account
```

### `communiply credits`

```bash
communiply credits balance         # Check balance
communiply credits history         # View transactions
```

### `communiply products`

```bash
communiply products search "my app"         # Find products
communiply products search "my app" --set-default  # Set as default
```

## Configuration

Config is stored at `~/.communiply/config.json`:

```json
{
  "api_key": "pck_live_...",
  "api_url": "https://app.productclank.com",
  "default_product_id": "your-product-uuid"
}
```

You can also set `COMMUNIPLY_API_KEY` as an environment variable.

## What happens after a boost?

1. Your tweet gets queued for community engagement
2. Community members see the opportunity in their dashboard
3. They claim tasks and post from their personal accounts
4. You get authentic, third-party engagement (support, questions, congrats)
5. Track results at `app.productclank.com/communiply/`

## Credits

New agents get **300 free credits**. Top up via the [ProductClank webapp](https://app.productclank.com/credits) or USDC on Base.

## Related

- [Agent Skill](https://github.com/covariance-network/productclank-agent-skill) — For AI agents to autonomously create campaigns
- [API Reference](https://github.com/covariance-network/productclank-agent-skill/blob/main/references/API_REFERENCE.md) — Complete API docs
- [ProductClank](https://productclank.com) — Platform

## License

Proprietary - ProductClank
