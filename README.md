# Communiply CLI

Rally your community to engage with your posts — replies, likes, and reposts powered by [ProductClank](https://productclank.com).

## Install

```bash
npm install -g github:covariance-network/communiply-cli
```

## Quick Start

```bash
# 1. Register (first time only — get 300 free credits)
communiply auth register MyAgent

# 2. Or login with existing key
communiply auth login pck_live_YOUR_KEY

# 3. Link your ProductClank account (optional, uses your credits)
communiply auth link

# 4. Boost a post — get community replies
communiply boost https://x.com/myproduct/status/123456789
communiply boost https://www.instagram.com/p/ABC123/
communiply boost https://www.tiktok.com/@user/video/123456789
communiply boost https://www.linkedin.com/posts/user_activity-123
communiply boost https://www.reddit.com/r/subreddit/comments/abc123/title/
communiply boost https://warpcast.com/user/0xabc123
```

## Supported Platforms

| Platform | Replies | Likes | Reposts |
|----------|---------|-------|---------|
| Twitter/X | Yes | Yes | Yes |
| Instagram | Yes | Yes | — |
| TikTok | Yes | Yes | — |
| LinkedIn | Yes | Yes | — |
| Reddit | Yes | Yes | — |
| Farcaster | Yes | Yes | Yes |

## Commands

### `communiply boost <post-url>`

Get your community to engage with your post — replies (support, questions, congrats), likes, or reposts.

The platform is auto-detected from the URL. All major social platforms are supported.

```bash
# Twitter/X — community replies (200 credits)
communiply boost https://x.com/myproduct/status/123 --action replies \
  --guidelines "Congratulate the team, ask about the new features, show excitement"

# Instagram — community replies
communiply boost https://www.instagram.com/p/ABC123/ --action replies \
  --guidelines "Love the visual, ask about the product"

# TikTok — community replies
communiply boost https://www.tiktok.com/@user/video/123456789 --action replies

# LinkedIn — community replies
communiply boost https://www.linkedin.com/posts/user_activity-123 --action replies \
  --guidelines "Professional tone, ask about the announcement"

# Reddit — community replies
communiply boost https://www.reddit.com/r/subreddit/comments/abc123/title/ --action replies

# Farcaster — community replies
communiply boost https://warpcast.com/user/0xabc123 --action replies

# Community likes (300 credits)
communiply boost https://x.com/myproduct/status/123 --action likes

# Community reposts (300 credits — Twitter/X and Farcaster only)
communiply boost https://x.com/myproduct/status/123 --action reposts

# Pass post text directly (skips server-side fetch)
communiply boost https://x.com/myproduct/status/123 --action replies \
  --post-text "We just shipped v2.0! 10x faster API." \
  --post-author myproduct

# Legacy Twitter flags still work
communiply boost https://x.com/myproduct/status/123 \
  --tweet-text "We just shipped v2.0!" --tweet-author myproduct

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
| `--post-text <text>` | `-t` | Post text — skips server-side fetch |
| `--post-author <name>` | | Post author username (used with --post-text) |
| `--tweet-text <text>` | | Legacy alias for --post-text (still works) |
| `--tweet-author <name>` | | Legacy alias for --post-author (still works) |
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

1. Your post gets queued for community engagement
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
