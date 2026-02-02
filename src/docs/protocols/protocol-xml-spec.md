# [T0] XML Mutation Specification
ID: PROTOCOL_XML_SPEC_V1.2 | Role: Structural Integrity Guard.

## 1. THE XML SCHEMA (NON-NEGOTIABLE)
Every update MUST be contained within a single XML block using the following structure. Use `<![CDATA[...]]>` to wrap the content.

```xml
<changes>
  <change>
    <file>[full_path]</file>
    <description>[summary_of_change]</description>
    <content><![CDATA[Full file content]]]]><![CDATA[></content>
  </change>
</changes>
```

## 2. THE CONTAINER INTEGRITY RULE (FATAL GUARD)
An HTML opening tag `<tag>` and its matching closing tag `</tag>` MUST reside within the same scope boundary (braces `{ }`). Separation of tags by block boundaries is a **Fatal Anti-Pattern**.

### 2.1 Visual Anchor: VALID (Containers are Siblings)
```html
<div> <!-- Container Start -->
  @if (condition) {
    <p>Content</p>
  }
</div> <!-- Container End -->
```

### 2.2 Visual Anchor: FATAL ERROR (DO NOT GENERATE)
```html
<!-- CRASH IMMINENT: Opening tag and closing tag are in different blocks -->
@if (condition) {
  <div class="glass">
    <p>Success</p>
} @else {
  <p>Failure</p>
}
</div> <!-- WRONG: This div is orphaned and out of scope -->
```

## 3. ANGULAR v20 HARD STANDARDS
- **Reactivity**: Signals ONLY. Use `input()`, `computed()`, and `output()`.
- **Control Flow**: Use native `@if`, `@for`, `@switch`.
- **@let Declarations**: The `@let` syntax is a declaration and **NEVER** gets a closing brace `}`.
- **Zoneless**: No `NgZone`, no `zone.js`. Use `provideZonelessChangeDetection()`.
- **Bindings**: 
  - Class: Use `[class.name]="signal()"` or `class="name-{{signal()}}"`.
  - Style: Use `[style.property]="signal()"` or `style="property: {{signal()}}"`.
  - **Forbidden**: `ngClass`, `ngStyle`, `*ngIf`, `*ngFor`.

## 4. ANTI-PATTERN REGISTRY (FATAL)
The following code patterns cause immediate application failure:
1. **Template Regex**: No `/regex/.test()` inside HTML.
2. **Template Instantiation**: No `new Date()` or `new Object()` in bindings.
3. **Template Arrows**: No `(click)="() => fn()"` logic in templates.
4. **Invalid Providers**: Never attempt to import `provideFormsModule`.
5. **Base Tags**: Never generate a `<base href="/">`.

## 5. REFINEMENT HEURISTICS
1. **Full Content**: Always provide the 100% complete content of the file.
2. **Minimalism**: Change only what is necessary to satisfy the request.
3. **Zoneless Persistence**: Ensure `provideZonelessChangeDetection()` in `index.tsx` is never removed.]]></content>
 </change>

 <change>
    <file>src/docs/history/memory.md</file>
    <description>Log v1.7: Fixing placeholder errors and generating the Qualia2D Manifesto.</description>
   <content><![CDATA[# Memory Log

## [Init] Qualia2D Genesis
- **Action**: Initial system synthesis. Established Zoneless shell and Rapier2D integration.

## [v1.1 - v1.4] Iterative Hardening
- **Action**: Enhanced interactivity, deployed Protocol Constructor, and restructured docs.

## [v1.5 - v1.6] Meta-Logic Evolution
- **Action**: Created system instructions and XML spec.

## [v1.7] Protocol Correction & Manifesto Genesis
- **Action**: Corrected `protocol-xml-spec.md` and `system-instructions.md` to remove placeholders and provide full technical content.
- **Action**: Generated `qualia2d-manifesto.md` (The Document) to establish the philosophy of the Qualia3D sibling.
- **Action**: Updated `kernel.md` to integrate the manifesto as the primary vision entry point.
- **Outcome**: Engine logic is now fully documented without placeholders, and the sibling relationship is codified.]]></content>
 </change>
</changes>
```