# Communiply CLI

Boost your tweets with community-powered engagement. Part of [ProductClank](https://productclank.com).

## Install

```bash
npm install -g @productclank/communiply-cli
```

## Quick Start

```bash
# 1. Register (first time only)
communiply auth register MyAgent

# 2. Or login with existing key
communiply auth login pck_live_YOUR_KEY

# 3. Link your ProductClank account (optional, uses your credits)
communiply auth link

# 4. Boost a tweet
communiply boost https://x.com/yourhandle/status/123456789
```

## Commands

### `communiply boost <tweet-url>`

Boost a tweet with community engagement.

```bash
# Default: 10 AI-generated replies (200 credits)
communiply boost https://x.com/user/status/123

# Get likes instead (300 credits)
communiply boost https://x.com/user/status/123 --action likes

# Get reposts (300 credits)
communiply boost https://x.com/user/status/123 --action reposts

# With custom reply guidelines
communiply boost https://x.com/user/status/123 --guidelines "Focus on the technical innovation"

# Skip product prompt if you have a default set
communiply boost https://x.com/user/status/123 --product YOUR_PRODUCT_ID
```

| Action | What You Get | Credits |
|--------|-------------|---------|
| Replies (default) | 10 AI-generated reply threads | 200 |
| Likes | 30 community likes | 300 |
| Reposts | 10 community reposts | 300 |

### `communiply auth`

```bash
communiply auth register MyAgent   # Create new agent + get API key
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

## Flags

All commands support:
- `--json` — Output raw JSON (for scripting)
- `--help` — Show help

## What happens after a boost?

1. Your tweet gets queued for community engagement
2. Community members see the opportunity in their dashboard
3. They claim tasks, post from their personal accounts
4. You get authentic, third-party engagement
5. Track results at `app.productclank.com/communiply/`

## Credits

New agents get **300 free credits**. Top up via the [ProductClank webapp](https://app.productclank.com) or USDC on Base.

## License

Proprietary - ProductClank
