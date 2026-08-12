# Chapter 9: Bit Manipulation

## 1. Core Concepts

Bit manipulation treats an integer as a compact fixed-width vector of booleans. It is most useful when the domain is bounded and operations align with masks, shifts, parity, or XOR cancellation.

- `&` selects shared set bits; `|` sets bits; `^` toggles differing bits.
- `~` inverts within the language's integer width.
- Left and right shifts move bit positions, but signed and unsigned shifts differ.
- Two's-complement negative values require explicit width assumptions.

## 2. Recognition Signals

- Small fixed set membership -> bit set/mask.
- Flags or subsets -> one bit per property.
- Paired duplicates with one exception -> XOR cancellation.
- Power-of-two structure -> single-set-bit tests.
- Need to set, clear, test, or replace a range -> construct masks.
- Enumerating all subsets -> masks from `0` through `2^n - 1` when `n` is small.

## 3. Common Data Structures / Algorithms

| Operation | Expression | Meaning |
|---|---|---|
| Test bit `i` | `(x & (1 << i)) !== 0` | Is position `i` set? |
| Set bit `i` | `x | (1 << i)` | Force position `i` on |
| Clear bit `i` | `x & ~(1 << i)` | Force position `i` off |
| Toggle bit `i` | `x ^ (1 << i)` | Flip position `i` |
| Remove lowest set bit | `x & (x - 1)` | Clears one set bit |

These expressions assume a compatible fixed integer width.

## 4. Problem-Solving Patterns

### Build the Mask in Words

Describe which positions must be ones and zeros before writing operators. Parenthesize shifts and masks to make precedence explicit.

### XOR Cancellation

Use associativity and `a ^ a = 0` only when the input multiplicity contract supports cancellation. It does not solve arbitrary frequency counting.

### Fixed-Width Discipline

State width, signedness, and overflow behavior. In TypeScript, ordinary bitwise operators coerce numbers to signed 32-bit integers; use `bigint` or another representation for wider masks.

## 5. Complexity Targets

- One machine-word mask operation is normally `O(1)` under a fixed-width model.
- Counting set bits with repeated `x & (x - 1)` takes `O(k)` for `k` set bits.
- Enumerating subsets is inherently `O(2^n)` outputs or states.
- A bit set may reduce space constants without changing asymptotic complexity.

## 6. Typical Traps

- Confusing logical operators with bitwise operators.
- Ignoring sign extension in right shifts.
- Shifting beyond the language's effective width.
- Using `x & (x - 1) === 0` without excluding zero.
- Omitting parentheses around mixed comparisons and bit operations.
- Treating a clever mask as clearer when a set better expresses an unbounded domain.

## 7. Testing Strategy

Test zero, one, highest supported bit, all bits set, alternating bits, negative values if permitted, duplicated values for XOR, and shift counts at both boundaries. Write binary representations with a fixed width during manual traces.

## 8. Interview Communication Strategy

State the numeric model first. Derive a mask visually, then translate it into operators. Explain the identity that makes an optimization correct instead of presenting it as a memorized trick.

## 9. Representative Transformed Examples

Count flags in a non-negative 32-bit value:

```ts
function countSetBits32(value: number): number {
  let remaining = value >>> 0;
  let count = 0;
  while (remaining !== 0) {
    remaining = (remaining & (remaining - 1)) >>> 0;
    count++;
  }
  return count;
}
```

Each iteration removes exactly one set bit, so the loop count equals the answer.

## 10. Practice Routing

- Operator mistakes -> translate mask diagrams one operator at a time.
- Signedness bugs -> compare arithmetic and logical right shifts.
- Trick memorization -> prove each identity with a small truth table.
- Overuse -> solve once with a set, then justify whether bounded-domain compression helps.

## Connects To

- [Big O](ch02-big-o.md): machine-width assumptions.
- [Math and Logic](ch10-math-and-logic-puzzles.md): binary identities and invariants.
- [Recursion and DP](ch11-recursion-and-dynamic-programming.md): subset masks and state compression.

