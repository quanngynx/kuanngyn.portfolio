# Chapter 10: Model Context Protocol

## Core Idea

Model Context Protocol (MCP) standardizes how a host discovers and communicates with external tools, resources, and prompt templates. MCP is an integration protocol; it does not replace tool design, authorization, error handling, or agent-friendly APIs.

## Problem / Intent

Ad hoc integrations couple each model host to each external service. A client–server protocol can make capabilities discoverable and reusable across hosts while keeping external systems behind explicit contracts.

## When to Use

- Multiple hosts need reusable access to the same capability domain.
- Tool/resource discovery should happen without embedding every integration in one application.
- Local or remote services require a standard transport and message contract.
- An organization wants independently deployable capability servers.

## When Not to Use

- One application has a small fixed set of direct functions.
- The underlying API is not safe or understandable for an agent.
- Dynamic discovery creates unacceptable supply-chain or authorization risk.
- Protocol overhead exceeds the integration’s reuse value.

## Implementation Structure

1. **Host/LLM** decides that external context or action may be needed.
2. **MCP client** discovers server capabilities and sends standardized requests.
3. **MCP server** exposes narrow tools, resources, and prompts.
4. **Underlying service** performs the actual data access or action.
5. The server returns a structured result or error; the host updates trusted state.

```text
Host -> MCP client -> authenticated MCP server -> domain service
  ^             discovery / request / response             |
  +---------------- bounded observation -------------------+
```

## MCP Versus Direct Tool Calling

| Concern | Direct tool calling | MCP |
| --- | --- | --- |
| Integration | Application-specific | Standard client–server interface |
| Discovery | Tools supplied directly | Capabilities can be discovered |
| Reuse | Often coupled to one host | Server can serve multiple clients |
| Best fit | Small, fixed tool set | Evolving, interoperable capability ecosystem |

Both still require the [Tool Use](ch05-tool-use.md) controls: schema validation, authorization, least privilege, idempotency, timeouts, and trustworthy observations.

## Agent-Friendly Interface Design

- Expose filtered, sortable, bounded operations rather than wrapping inefficient legacy endpoints blindly.
- Return parseable text or structured data instead of inaccessible binary documents.
- Keep read and write capabilities separate.
- Authenticate clients and authorize every resource/action independently.
- Pin or approve servers; discovery must not imply trust.
- Normalize typed errors so planners can retry, fall back, or stop safely.
- Constrain local filesystem/process servers more strongly than ordinary data APIs.

## Worked Example: Ticketing Capability Server

Instead of exposing `get_ticket(id)` and forcing hundreds of calls, provide a bounded `list_tickets(priority, updatedAfter, limit)` resource/tool plus a separate `update_ticket_status` write tool. The client discovers both, but trusted policy decides which users and agents may invoke the write capability.

## Trade-offs

MCP improves interoperability, discovery, and component reuse, but adds another trust boundary, protocol lifecycle, server inventory, compatibility surface, and potential supply-chain exposure.

## Failure Modes

- **Legacy wrapper illusion**: protocol compliance masks a poor underlying API.
- **Discovery equals trust**: newly visible servers or tools become executable automatically.
- **Binary/unbounded results**: data cannot fit or be interpreted by the agent.
- **Server authority creep**: one server exposes unrelated high-impact capabilities.
- **Version drift**: client and server assumptions diverge.
- **Transport confusion**: local and remote deployments receive identical trust treatment.
- **Protocol/tool conflation**: MCP is treated as authorization or orchestration.

## Pattern Interactions

- [Tool Use](ch05-tool-use.md): MCP transports/discovers capabilities; Tool Use governs invocation.
- [Routing](ch02-routing.md): narrow discovered capabilities before model selection.
- [Planning](ch06-planning.md): planners may discover capabilities but remain constrained by policy.
- Exception Handling: standardize unavailable server, invalid request, timeout, and execution errors.
- Guardrails: enforce approved servers, arguments, resources, and destinations.

## Verification Checklist

- Is every server/domain boundary explicit and authenticated?
- Are discovered capabilities approved before use?
- Are inputs, outputs, limits, and errors agent-readable?
- Would direct tool calling be simpler for this use case?
- Can servers be versioned, audited, disabled, and revoked?

Framework and transport references in the source are historical examples unless separately verified as current.
