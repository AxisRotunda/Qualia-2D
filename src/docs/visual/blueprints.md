# [T1] Component Blueprints: Skeletons
ID: VISUAL_BLUEPRINTS_V1.0 | Role: Implementation Templates.

## 1. PROPERTY CARD SKELETON
Use for new data inputs in the Inspector.
```html
<div class="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-1">
   <span class="text-[8px] text-slate-500 uppercase font-black tracking-tighter">[LABEL]</span>
   <input type="number" class="w-full bg-transparent border-none p-0 text-xl font-mono font-bold text-white outline-none">
</div>
```

## 2. LOG ENTRY SKELETON
Use for telemetry or console output.
```html
<div class="flex items-center gap-2 px-2 py-1 hover:bg-white/5 transition-colors">
   <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
   <span class="text-[10px] font-mono text-slate-300 truncate">[DATA_STREAM]</span>
</div>
```

## 3. ACTION PILL SKELETON
Use for floating contextual tools.
```html
<button class="px-5 h-10 flex items-center text-[10px] font-black text-white uppercase tracking-widest bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 transition-all active:scale-95">
  [VERB_LABEL]
</button>
```
