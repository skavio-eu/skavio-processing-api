# Skavio Processing MCP — Cursor & Claude Desktop connection

**Provided by:** [Skavio LLC](https://www.skavio.eu/)
**Authenticated remote endpoint:** `https://www.skavio.eu/processing/mcp` (MCP Streamable HTTP).
**Separate USDC micro-APIs:** `https://www.skavio.eu/mcp`.

Use the company's **MCP OAuth flow or an explicitly issued company MCP credential**; a generic Skavio Processing API key is **not** the MCP credential.

## Cursor — copyable `.cursor/mcp.json`

[Download the JSON example](examples/cursor-processing-mcp.json) or copy:

```json
{
  "mcpServers": {
    "skavio-processing": {
      "type": "http",
      "url": "https://www.skavio.eu/processing/mcp"
    },
    "skavio-paid-tools": {
      "type": "http",
      "url": "https://www.skavio.eu/mcp"
    }
  }
}
```

Place it in `.cursor/mcp.json` inside your project or `~/.cursor/mcp.json` for your account. Open Cursor MCP settings and complete any required OAuth login. Processing returns HTTP 401 without proper authorization; do not override its security controls.

## Claude Desktop / claude.ai — preferred native remote connector

In **Settings → Connectors → Add custom connector**, create:

- **Skavio Processing** with URL `https://www.skavio.eu/processing/mcp`; complete the service's OAuth login.
- **Skavio Paid Tools** with URL `https://www.skavio.eu/mcp`; free capability discovery is public.

No local JSON or API key is needed for adding these *remote connectors*. Authentication is still required to execute Processing tools. Native connector availability depends on the Claude client/account.

For local STDIO compatibility in Claude Desktop, [this sample JSON](examples/claude-desktop-processing-mcp.json) uses the `mcp-remote` Node.js adapter:

```json
{
  "mcpServers": {
    "skavio-processing": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://www.skavio.eu/processing/mcp"]
    },
    "skavio-paid-tools": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://www.skavio.eu/mcp"]
    }
  }
}
```

Save in `claude_desktop_config.json` and restart Claude Desktop. This is an optional local adapter, *not* a payment gateway or substitute for real OAuth. Prefer the native remote connector where possible.

## Claude Code

```bash
claude mcp add --transport http skavio-processing https://www.skavio.eu/processing/mcp
claude mcp add --transport http skavio-paid-tools https://www.skavio.eu/mcp
```

Perform OAuth and review tool permissions in the client.

## Current capabilities & billing

- **Processing**: invoice and document extraction/OCR, PDFs, file and media operations, transcription and meeting workflows. Customers use their Skavio company account and shared **prepaid Processing credits**. Query the current catalog before processing. Processing tools and availability are not implied by an unauthenticated discovery check.
- **Paid Agent Tools / x402**: the `/mcp` endpoint currently advertises 18 tools, including free catalog/status, native USDC verification, exact matching, PDF evidence, DNS/TLS audits and separately authenticated web/document/audio Agent Tools. Some operations need an Agent Tools Bearer credential.
- **x402 payment**: USDC micro-APIs use native USDC on Base. A plain MCP client or the `mcp-remote` adapter does **not** automatically sign or pay an x402 challenge. Use a compatible payment client and explicit wallet authorization.
- **Never** store secrets in `.cursor/mcp.json` committed to a public repository or paste keys into a chat.

Official details: [MCP overview](https://www.skavio.eu/processing/docs/mcp/), [processing credits](https://www.skavio.eu/processing/docs/mcp/pricing.html), [Agent Tools install and examples](https://github.com/skavio-eu/skavio-agent-tools/blob/main/MCP_CLIENT_SETUP.md), [official MCP Registry](https://registry.modelcontextprotocol.io/v0/servers?search=skavio) and [PayAPI Market](https://payapi.market/) (third-party marketplace; Skavio submissions still awaiting approval).

**Verification 2026-10-16:** `/processing/mcp` enforces HTTP 401 with OAuth resource metadata for anonymous calls; `/mcp` answered MCP `initialize` and returned 18 tool definitions. A successful paid settlement, client OAuth UI completion, or funded customer call **has not been established** by those probes.
