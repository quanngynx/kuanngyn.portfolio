# Chapter 2: Routing

## Core Idea

Routing selects one of several known paths based on input or state. It decides **where control goes next**; it does not itself perform the selected tool call, workflow, or delegation.

## Problem / Intent

A linear chain cannot respond efficiently when requests require different capabilities. Routing introduces a bounded conditional decision so the system can dispatch work to the appropriate workflow, tool, agent, clarification step, or human escalation path.

## When to Use

- Inputs belong to distinct intents or processing classes.
- The next action depends on current state or a previous observation.
- A large tool catalog should be narrowed before selection.
- Requests must be triaged by risk, urgency, language, modality, or ownership.
- An unclear request needs a defined clarification or fallback route.

## When Not to Use

- Every request follows the same dependent sequence; use [Prompt Chaining](ch01-prompt-chaining.md).
- The route must be invented rather than selected from known destinations; use [Planning](ch06-planning.md).
- Stable structured fields or rules can choose the route deterministically without a model.
- Route labels overlap so heavily that no reliable decision boundary exists.

## Implementation Structure

1. Define mutually understandable route identifiers and ownership.
2. Choose the lightest reliable selector: rules, classifier, embeddings, or LLM.
3. Require a structured decision with confidence and relevant evidence.
4. Validate that the destination is allowed and available.
5. Dispatch through trusted code.
6. Provide fallback, clarification, rejection, and escalation routes.

```ts
type RouteDecision = {
  route: "orders" | "catalog" | "technical_support" | "clarify";
  confidence: number;
  reasonCode: string;
};

function dispatch(decision: RouteDecision, request: Request) {
  if (decision.confidence < 0.75) return clarify(request);
  const handler = allowedRoutes[decision.route];
  if (!handler) return rejectUnknownRoute(decision.route);
  return handler(request);
}
```

The confidence threshold is an application policy, not a universal value. Calibrate it from routing errors and their consequences.

## Selector Trade-offs

| Selector | Prefer when | Main limitation |
| --- | --- | --- |
| Rules | Inputs and boundaries are structured and stable | Brittle for novel language |
| Classifier | Labeled examples and stable categories exist | Requires training and drift monitoring |
| Embeddings | Semantic proximity maps well to destinations | Similar routes may be hard to separate |
| LLM | Nuanced language and contextual judgment matter | More latency, cost, and nondeterminism |

## Worked Example: Support Triage

Classify a request into order status, product information, technical support, or clarification. The router returns only a typed decision. Trusted orchestration then:

- sends order requests to an account-authorized order workflow,
- sends catalog questions to retrieval,
- sends technical issues to a diagnostic chain,
- asks a bounded clarifying question when confidence is low.

The router does not receive database credentials and does not decide whether a consequential support action is authorized.

## Trade-offs

Routing improves adaptability and limits unnecessary context, but adds a classification boundary that must be evaluated. Misrouting can be more damaging than ordinary generation errors because it selects the wrong capability or authority domain.

## Failure Modes

- **Overlapping routes**: destinations have unclear or duplicated responsibilities.
- **No fallback**: low-confidence inputs are forced into a known class.
- **Free-form decisions**: generated route names do not match executable handlers.
- **Hidden policy routing**: the model makes authorization or safety decisions that trusted code should own.
- **Distribution drift**: real inputs change while route evaluation remains static.
- **Router cascade**: too many nested routers obscure ownership and latency.
- **Routing/tool conflation**: selecting a capability is treated as permission to execute it.

## Pattern Interactions

- [Tool Use](ch05-tool-use.md): route to a bounded tool set, then independently validate and authorize the selected call.
- [Prompt Chaining](ch01-prompt-chaining.md): insert routing at explicit branch points inside a known workflow.
- [Multi-Agent Collaboration](ch07-multi-agent-collaboration.md): dispatch to a specialist only when its role boundary is real.
- [Planning](ch06-planning.md): planners may select among routes repeatedly, but routing itself chooses from known paths.
- Evaluation and Monitoring: measure confusion matrices, fallbacks, latency, cost, and harmful misroutes.

## Verification Checklist

- Are route labels mutually clear and executable?
- Is there an explicit unknown/clarify path?
- Is selection separate from authorization and execution?
- Are harmful misroutes tested, not just aggregate accuracy?
- Can each destination reject work outside its contract?

See [patterns.md](../patterns.md) and [cheatsheet.md](../cheatsheet.md).
