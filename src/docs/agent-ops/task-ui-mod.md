# [OP_04] Task: UI Modification
Context: Qualia2D Engine | Architecture: Angular + Tailwind + Signals

## 1. TARGET FILES
You need access to specific component files in `src/app/ui/`.
- **HUD**: `telemetry`, `command-hub`, `virtual-joypad`.
- **Panels**: `inspector`, `hierarchy`, `settings`.
- **Overlays**: `main-menu`, `scene-browser`.

## 2. VISUAL INVARIANTS (Obsidian Glass)
Any modification MUST adhere to these tokens.

### Colors
- **Background**: `bg-slate-950/xx` (never solid black/slate).
- **Blur**: `backdrop-blur-xl` or `3xl`.
- **Border**: `border-white/5` (passive), `border-white/10` (active).
- **Primary**: `text-indigo-500`, `bg-indigo-600`.
- **Success**: `text-emerald-500`.
- **Warning**: `text-amber-500`.
- **Error**: `text-rose-500`.

### Typography
- **Headers**: `font-black uppercase tracking-tighter`.
- **Labels**: `text-[9px] font-black uppercase tracking-widest`.
- **Data**: `font-mono font-bold`.

## 3. ANGULAR RULES (Strict)
1. **No Zone.js**: Never use `NgZone`.
2. **Signals**: Use `input()`, `output()`, `computed()`.
3. **Control Flow**: `@if`, `@for`, `@switch`.
4. **Binding**: `[class.x]="signal()"` (Do NOT use `ngClass`).

## 4. CODE SKELETON (Component)
```typescript
@Component({
  selector: 'app-my-ui',
  standalone: true,
  template: `
    <div class="bg-slate-950/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
      <h3 class="text-white font-black uppercase tracking-tight">Title</h3>
      <button (click)="action.emit()" class="bg-indigo-600 text-white px-4 py-2 rounded-full">
        Action
      </button>
    </div>
  `
})
export class MyUiComponent {
  state = inject(EngineState2DService);
  action = output<void>();
}
```