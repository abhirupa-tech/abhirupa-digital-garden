---
title: "How I Make AI Handle the Boring Parts of Frontend — So I Could Focus on Real Engineering"
section: "field-notes"
type: "Guide"
description: "Offload the repetitive chaos to AI-powered tools and MCP servers, and save your focus for the tasks that actually make you a better engineer."
tags: ["frontend", "ai-tooling", "developer-workflow", "mcp", "react"]
date: "2025-12-01"
cover: "https://res.cloudinary.com/ra5tg986/image/upload/v1784036620/img1_1_wje0da.webp"
aspect: "wide"
draft: false
---

Frontend work in big tech can often be — well, very boring.

Yes, I said it.

So much of what goes into building a UI is repetitive, mechanical, and sometimes downright annoying. I've had projects where I wrote the same component three times in a week because the product team kept "changing direction."

Honestly, I have a love–hate relationship with CSS. Even as a frontend engineer, I'm not exactly thrilled about spending hours obsessing over tiny styling details.

But now? AI does almost everything for me.

I get to pick the parts I enjoy and offload the rest — all the manual, repetitive nonsense — straight to AI. These days, I barely write code for two hours a day, and honestly? I love it. Because those two hours go into things that actually excite me, things that teach me something new, things that push my career forward.

## Frontend comes with a "boring work" tax

We no longer live in the era where you manually sit and write every line of code. A good engineer's day is mostly PR reviews, cleanup, toggle removals, refactors, and then a small slice of the fun stuff — system design, brainstorming, architecture.

Given how much AI and agents are automating now, it's honestly counterproductive if we don't use that power to our advantage.

<Figure
  alt="A frontend engineer's day split between boring maintenance work and the small slice of fun architecture work"
  ratio="landscape"
/>

<Quote>If you don't use AI, you're simply a slower engineer.</Quote>

The reality is: those who adapt will outperform those who don't. Engineers who prototype faster, clear smaller tasks quicker, and maintain higher throughput will always be preferred.

In today's environment, everything is a race for efficiency — hiding from that reality only hurts your own growth.

But anyway — if you're a frontend developer like me (who openly hates CSS and all the boring stuff), here's how you can make your life easier. There are a lot of tasks you can actually offload to AI while, in parallel, working on things that will serve you.

## 1. Unit tests

This is one of the easiest things you can offload to AI — and in fact, save hours from your bandwidth. AI is extremely good at generating test suites from component code, props, and usage examples, so let it do the heavy lifting.

- AI can build extensive RTL test cases by detecting all the conditional flows and understanding all the happy and worst-case paths. It'll cover edge cases better than a human.
- Generate mocks and stubs for hooks.
- Can emulate the design pattern and code-writing style from existing test files.
- Useful for Jest → Vitest migrations; AI handles 90% of the syntax conversion.

A sample prompt you could use for this would probably look somewhat like this. This runs very well in Cursor:

```
Analyze this React component and list all happy paths, failure states,
and edge cases. Then generate a complete, idiomatic unit test suite
using React Testing Library and Jest/Vitest, covering rendering,
interactions, async logic, conditional branches, and accessibility.
```

## 2. Accessibility improvements

This may be tedious, but it's absolutely essential to support users with diverse capabilities.

AI can quickly suggest missing `aria-*` attributes, keyboard navigation fixes, color contrast improvements, and patch most Lighthouse/axe warnings.

In fact, you can even use it to create screen reader simulations in Playwright.

## 3. Component architecture

AI can propose prop contracts, state models, event flows, and even full architecture variants before you write a single line. It's like having a second engineer give you multiple clean approaches you can choose from.

In this use case, treat AI as your <Highlight>brainstorming partner</Highlight>. It suggests, rather than telling you.

Use it to:

- Generate state machine diagrams for complex interactions (modal stacks, menus, popovers).
- Suggest optimal component splits based on re-render boundaries (React Fiber heuristics).
- Suggest memoization boundaries using `useMemo`, `useCallback`, `React.memo`.

Example prompts that could be helpful:

```
Analyze this component's interactions and produce a complete state
machine diagram. Identify all states, transitions, events, guards,
and side effects.
```

```
Review this React component and determine the ideal splitting
strategy based on re-render boundaries, prop stability, and React
Fiber heuristics. Suggest where to isolate logic, extract
subcomponents, or introduce memoized wrappers to minimize
unnecessary renders.
```

```
Examine this React component and identify where memoization should
be applied. Recommend optimal use of useMemo, useCallback, and
React.memo based on expensive computations, unstable props, derived
state, and callback identity requirements.
```

## 4. Connect with Figma MCP — build components quicker

This is a life saver.

Figma now has an integrated AI coding companion of sorts. In simpler words: you can connect to a Figma MCP server and stop worrying about your code not matching design constraints. Pair it with Figma Make and there's magic for you.

Use these tools to fix the smaller design constraints within the code — layouts, spacing, CSS configs, and variants. You can even use this to generate entire design systems, including typography, palette, and variants.

## 5. Refactoring & cleanup

You cannot escape this. No matter where you work, the cleanup tasks will follow you.

I used to enjoy this part because — let's agree — it's almost meditative. You don't need to think much.

But it does consume time, so why bother doing it manually when AI can sweep through dead code, remove old toggles, fix naming, rewrite utils, migrate JS to TS, and clean an entire codebase faster than you ever could?

There are a billion ways to get it to do this — but here are some examples:

```
Convert this entire JavaScript file into fully typed TypeScript.
Infer all types from usage, create accurate interfaces/types,
eliminate any, and ensure the final code follows modern TS best
practices without changing runtime behavior.
```

```
Perform a full hygiene pass on this codebase: remove unused code,
simplify complex logic, standardize imports, flatten nesting,
improve readability, and ensure all components follow modern React
and TS best practices.
```

```
Analyze this codebase and find inconsistent naming conventions,
mismatched file structures, and duplicated patterns. Suggest a
unified naming scheme and produce a refactored folder/component
structure.
```

<Figure
  alt="A before-and-after of a messy codebase cleaned up by an AI refactoring pass"
  ratio="landscape"
/>

The bonus stuff I make AI do for me, literally, on a daily basis? I make it read up all the failures from my ESLint passes and fix them.

But I always have to keep an eye out. AI is making my work easier, but at the end, it's me and my job — and I cannot let AI sabotage it.
