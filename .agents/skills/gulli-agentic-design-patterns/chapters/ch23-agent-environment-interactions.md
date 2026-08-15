# Chapter 23: Agent-Environment Interactions

## Intent

Connect an agent to a digital or physical environment through a perception-action loop whose authority, observations, and hazards are explicit.

## When to Use

- No reliable API exists and a graphical interface is the only practical boundary.
- Multimodal perception is essential to the task.
- The environment changes after each action and must be re-observed.

## When Not to Use

- A stable typed API or deterministic automation surface exists.
- The action is irreversible but the interface cannot confirm target and effect.
- Perception uncertainty cannot be bounded to an acceptable risk.

## Interaction Loop

```text
observe -> parse elements/state -> interpret against goal
        -> propose bounded action -> authorize -> execute
        -> observe resulting state -> verify or recover
```

Capture both semantic and visual state when available. A DOM, accessibility tree, sensor schema, or API result is usually more reliable than coordinates or raw pixels. Use screenshots or raw media when they contribute information unavailable through structured channels.

## Interface Choice

| Surface | Prefer when | Main risk |
| --- | --- | --- |
| Typed API/tool | Stable supported contract exists | Excess authority or schema drift |
| DOM/accessibility tree | Web or desktop semantics are exposed | Dynamic identity and stale handles |
| Screenshot/GUI coordinates | Visual-only application must be operated | Perception error and layout drift |
| Audio/video/sensors | Environment meaning is inherently multimodal | Privacy, latency, and ambiguity |
| Physical actuator | Real-world state must change | Safety, reversibility, and human proximity |

## Implementation Structure

1. Define environment state, observable signals, actions, and prohibited transitions.
2. Attach confidence and freshness to perceptions.
3. Resolve action targets immediately before execution.
4. Require confirmation for high-impact actions and keep an emergency stop.
5. Verify postconditions from a new observation rather than assuming success.
6. Record action, authorization, before/after state, and recovery evidence.

Products and model capabilities named in the source are historical illustrations of computer-use and multimodal systems, not current capability claims.

## Trade-offs

GUI and multimodal control can reach systems without integrations but is slower and more brittle than typed interfaces. Physical interaction adds real safety and calibration concerns. Rich observations improve context while increasing privacy exposure and token/compute cost.

## Failure Modes

- Acting on a stale screenshot or moved element.
- Treating visual resemblance as confirmed identity.
- Infinite observe-act loops around pop-ups or loading states.
- Destructive action without target revalidation.
- Sensitive content leaking through screenshots, audio, or logs.
- Declaring success from the action command rather than the resulting state.

## Pattern Interactions

- [Tool Use](ch05-tool-use.md): environment controls are tools with stricter observation and authorization contracts.
- [Planning](ch06-planning.md): re-plan when environmental feedback invalidates later steps.
- [Exception Handling](ch12-exception-handling-and-recovery.md): reconcile uncertain execution before retrying.
- [HITL](ch13-human-in-the-loop.md): require accountable confirmation around consequential physical or digital actions.
- [Guardrails](ch18-guardrails-safety-patterns.md): enforce least privilege, isolation, and prohibited-action rules.

## Verification Checklist

- [ ] Structured interfaces are preferred where available.
- [ ] Perception includes freshness and uncertainty.
- [ ] Action targets and authority are checked at execution time.
- [ ] Postconditions are observed independently.
- [ ] Privacy, recovery, and emergency-stop behavior are tested.
