# Chapter 16: C and C++

## 1. Core Concepts

C and C++ questions emphasize memory, lifetime, value/reference semantics, and undefined behavior. Exact language-standard and library details can change; verify them when a current-version answer matters.

- Pointers hold addresses; references alias objects under language-specific rules.
- Stack, static, and dynamic storage have different lifetimes.
- Construction, copying/moving, and destruction define resource ownership.
- RAII ties resource lifetime to object lifetime.
- Arrays often decay to pointers, losing length information at interfaces.

## 2. Recognition Signals

- Crash or corruption -> lifetime, bounds, initialization, aliasing, ownership.
- Resource leak -> missing owner or exceptional cleanup path.
- Unexpected copy -> value semantics, copy/move operations, slicing.
- Polymorphic deletion -> virtual destructor and ownership contract.
- String/buffer manipulation -> capacity, terminator, overlap, bounds.
- Concurrent native code -> data race and memory-model questions.

## 3. Common Data Structures / Algorithms

| Tool | Use | Caution |
|---|---|---|
| Automatic object | Scope-bound lifetime | Do not return references to expired locals |
| `std::unique_ptr` | Exclusive dynamic ownership | Move-only ownership transfer |
| `std::shared_ptr` | Shared ownership | Cycles and atomic-control overhead |
| `std::vector` | Contiguous resizable sequence | Reallocation can invalidate references |
| `std::string` | Owned text buffer | Encoding and view lifetime remain separate issues |
| `std::span` / view | Non-owning bounded access | Underlying storage must outlive view |

## 4. Problem-Solving Patterns

### Name the Owner

For every resource, identify who acquires, transfers, and releases it. Prefer value/RAII ownership over manual cleanup.

### Lifetime Trace

Draw creation, alias creation, mutation, invalidation, and destruction. This exposes dangling pointers and iterator invalidation.

### Rule-of-Zero First

Compose resource-owning standard types so custom destructors/copy/move operations are unnecessary. Implement special members only when ownership semantics require them.

## 5. Complexity Targets

Know container-operation costs and invalidation behavior. `vector` append is amortized `O(1)` but reallocation is linear; linked-container insertion is constant only with a known position; ordered maps are commonly logarithmic; hash containers provide expected constant lookup under stated assumptions.

## 6. Typical Traps

- Returning a pointer/reference/view to expired storage.
- Reading uninitialized memory or crossing array bounds.
- Mismatching allocation and deallocation forms.
- Double deletion or ambiguous shared ownership.
- Base-class destruction without an appropriate virtual destructor.
- Shallow-copying a raw owning pointer.
- Relying on undefined evaluation order or integer overflow behavior.

## 7. Testing Strategy

Test empty and maximum buffers, copy/move/self-assignment if custom semantics exist, exceptions during construction, ownership transfer, polymorphic destruction, iterator invalidation, and sanitizers/static analysis when available. Separate memory safety from logical correctness.

## 8. Interview Communication Strategy

State the language-version assumption if relevant. Use ownership and lifetime vocabulary precisely. Prefer safe standard abstractions in production-style code, while explaining the lower-level mechanism when that is what the interviewer is evaluating.

## 9. Representative Transformed Examples

Instead of returning an uncertain raw buffer, return an owning value:

```cpp
std::vector<int> doubled(const std::vector<int>& input) {
    std::vector<int> result;
    result.reserve(input.size());
    for (int value : input) result.push_back(value * 2);
    return result;
}
```

The important design is explicit input borrowing and output ownership. This code is semantically reconstructed, not copied from OCR.

## 10. Practice Routing

- Pointer confusion -> draw ownership and lifetime timelines.
- Copy bugs -> compare value, reference, move, and owning-pointer semantics.
- Container surprises -> drill cost and invalidation tables.
- Buffer bugs -> use length-aware interfaces and boundary tests.
- Version trivia -> verify current standard documentation separately.

## Connects To

- [Arrays and Strings](ch05-arrays-and-strings.md): contiguous storage and buffer costs.
- [Object-Oriented Design](ch12-object-oriented-design.md): polymorphism and ownership.
- [Threads and Locks](ch19-threads-and-locks.md): data races and synchronization.

