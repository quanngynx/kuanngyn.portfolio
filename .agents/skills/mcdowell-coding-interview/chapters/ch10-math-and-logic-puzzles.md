# Chapter 10: Math and Logic Puzzles

## 1. Core Concepts

These problems evaluate modeling more than formula recall. Convert prose into variables, constraints, invariants, and observable outcomes before calculating.

- Divisibility and modular arithmetic capture cycles and parity.
- Counting arguments avoid enumerating every arrangement.
- Probability requires a clear sample space and independence assumptions.
- Invariants prove that some states are reachable or impossible.
- Information gained per observation can give a lower bound on decisions.

## 2. Recognition Signals

- Repeating schedule or wraparound -> modular arithmetic.
- Pairing, toggling, or coloring -> parity/invariant.
- Random trials -> define outcomes and conditional information.
- Few measurements or queries -> information-theoretic partitioning.
- Primes/factors -> test only through the square root or sieve a range.
- Huge case count with symmetry -> combinations, complementary counting, or equivalence classes.

## 3. Common Data Structures / Algorithms

| Tool | Use |
|---|---|
| Greatest common divisor | Period alignment and reducible ratios |
| Sieve | Many prime queries over a bounded range |
| Frequency table | Count equivalent outcomes |
| State table/tree | Track information after observations |
| Simulation | Validate a derivation, not replace one |

## 4. Problem-Solving Patterns

### Define the Sample Space

List equally likely atomic outcomes. If they are not equally likely, weight them explicitly. Test whether events are independent before multiplying probabilities.

### Find an Invariant

Choose a quantity preserved by every legal move: parity, sum modulo `k`, coloring, or permutation sign. Compare initial and target states.

### Count the Complement

When the desired event has overlapping cases, count all outcomes minus the simpler forbidden event.

### Partition by Information

Design observations so possible states divide as evenly as constraints allow. A decision tree makes the lower bound visible.

## 5. Complexity Targets

- Trial division for one value needs checks only to `sqrt(n)`.
- A sieve preprocesses a range in roughly `O(n log log n)` time.
- Enumerating all subsets or assignments remains exponential unless symmetry or state compression removes cases.
- A simulation cost must include number of trials and work per trial.

## 6. Typical Traps

- Multiplying probabilities without independence.
- Double-counting overlapping cases.
- Assuming observations reveal more information than they do.
- Generalizing from a few simulated trials.
- Using floating point for exact divisibility or equality.
- Finding a pattern without proving it persists.

## 7. Testing Strategy

Enumerate tiny sample spaces completely, verify probabilities sum to one, test boundary values for number algorithms, compare a formula with brute force for small `n`, and attempt to construct counterexamples to every proposed invariant.

## 8. Interview Communication Strategy

Name variables and assumptions aloud. Separate derivation from arithmetic. If stuck, show a smaller instance and explain which pattern is conjecture versus proven. A correct proof with simple computation is stronger than an unexplained formula.

## 9. Representative Transformed Examples

Suppose a process toggles exactly two switches per move. The parity of the number of active switches cannot change by an odd amount. Therefore, any target whose active-count parity differs from the initial state is unreachable. This transformed example demonstrates the proof method without relying on a puzzle-specific answer.

For probability, a safe workflow is:

```text
define atomic outcomes -> assign weights -> describe event -> count/aggregate -> normalize -> sanity-check
```

## 10. Practice Routing

- Probability errors -> build explicit sample-space tables.
- Pattern without proof -> search for an invariant or induction step.
- Too many cases -> look for symmetry and complementary counting.
- Measurement puzzles -> draw the decision tree and balance branches.
- Number-theory slowness -> practice divisibility bounds and sieves.

## Connects To

- [Bit Manipulation](ch09-bit-manipulation.md): parity and binary state.
- [Recursion and DP](ch11-recursion-and-dynamic-programming.md): combinatorial state spaces.
- [Big O](ch02-big-o.md): counting possible states and lower bounds.

