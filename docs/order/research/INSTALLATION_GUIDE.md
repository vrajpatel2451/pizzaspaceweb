# Installation & Setup Guide

**Quick Setup Time:** 5 minutes
**Status:** Ready to Install

---

## One-Command Installation

Copy and paste this entire command into your terminal:

```bash
npx shadcn@latest add @shadcn/progress @shadcn/toggle-group @shadcn/badge @shadcn/accordion @shadcn/alert @shadcn/collapsible @shadcn/select @shadcn/dropdown-menu @shadcn/card && npm install framer-motion
```

**What it does:**
- Installs 9 UI components from shadcn registry
- Adds all Radix UI dependencies automatically
- Installs framer-motion for animations
- Creates component files in `/components/ui/`

---

## Step-by-Step Installation

### Step 1: Navigate to Project Root
```bash
cd /Users/vrajpatel/Documents/personal/pizzaspace_web
```

### Step 2: Run Installation
```bash
npx shadcn@latest add @shadcn/progress @shadcn/toggle-group @shadcn/badge @shadcn/accordion @shadcn/alert @shadcn/collapsible @shadcn/select @shadcn/dropdown-menu @shadcn/card
```

### Step 3: Install Animation Library
```bash
npm install framer-motion
```

### Step 4: Verify Installation
Check that these files exist in `/components/ui/`:
```
progress.tsx
toggle-group.tsx
badge.tsx
accordion.tsx
alert.tsx
collapsible.tsx
select.tsx
dropdown-menu.tsx
card.tsx
```

Command to verify:
```bash
ls -la /Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/ | grep -E "progress|toggle|badge|accordion|alert|collapsible|select|dropdown|card"
```

---

## Phased Installation (If Preferred)

### Phase 1: Essential Components (Install First)
```bash
npx shadcn@latest add @shadcn/card @shadcn/badge @shadcn/select @shadcn/toggle-group @shadcn/dropdown-menu
```

### Phase 2: Display Components (Install After Testing Phase 1)
```bash
npx shadcn@latest add @shadcn/accordion @shadcn/alert @shadcn/progress
```

### Phase 3: Optional Enhancements (Install When Ready)
```bash
npx shadcn@latest add @shadcn/collapsible @shadcn/sonner
npm install framer-motion
```

---

## What Gets Installed

### Components in `/components/ui/`
| Component | File | Size | Purpose |
|-----------|------|------|---------|
| Progress | progress.tsx | ~2 KB | Order completion indicator |
| Toggle Group | toggle-group.tsx | ~3 KB | Status filter buttons |
| Badge | badge.tsx | ~2 KB | Status indicators |
| Accordion | accordion.tsx | ~4 KB | Expandable sections |
| Alert | alert.tsx | ~2 KB | Success/error messages |
| Collapsible | collapsible.tsx | ~2 KB | Toggle sections |
| Select | select.tsx | ~8 KB | Dropdown menus |
| Dropdown Menu | dropdown-menu.tsx | ~5 KB | Action menus |
| Card | card.tsx | ~2 KB | Card layouts |

### Dependencies Added to package.json
```
@radix-ui/react-progress
@radix-ui/react-toggle-group
@radix-ui/react-slot
@radix-ui/react-accordion
@radix-ui/react-collapsible
@radix-ui/react-select
@radix-ui/react-dropdown-menu
framer-motion
```

---

## Verification Checklist

After installation, verify:

- [ ] All 9 component files exist in `/components/ui/`
- [ ] `framer-motion` is in `package.json`
- [ ] No TypeScript errors in components
- [ ] Next.js dev server still runs without errors
- [ ] Can import components: `import { Card } from "@/components/ui/card"`

---

## If Installation Fails

### Issue: "Command not found: npx"
**Solution:** Update Node.js to latest version
```bash
node --version  # Should be 16+
npm install -g npm@latest
```

### Issue: "Couldn't find component"
**Solution:** Make sure you're running from project root
```bash
pwd  # Should show .../pizzaspace_web
ls components.json  # Should exist
```

### Issue: Dependency conflicts
**Solution:** Clear package lock and reinstall
```bash
rm package-lock.json
npm install
npx shadcn@latest add @shadcn/card
```

### Issue: TypeScript errors after install
**Solution:** Restart TypeScript server in your editor
- VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
- Or: Close and reopen editor

---

## Post-Installation Setup

### 1. Create Custom Components Directory
```bash
mkdir -p /Users/vrajpatel/Documents/personal/pizzaspace_web/components/features/order
```

### 2. Create Base Order Components
Create these files (code templates in SUMMARY.md):
- `components/features/order/order-card.tsx`
- `components/features/order/order-status-badge.tsx`
- `components/features/order/order-timeline.tsx`
- `components/features/order/order-filters.tsx`

### 3. Test Installation
```tsx
// Quick test file - create and run
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function InstallTest() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Installation Test</CardTitle>
      </CardHeader>
      <Badge>Success!</Badge>
    </Card>
  )
}
```

---

## Import Examples

After installation, you can import like this:

```typescript
// Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

// Utilities
import { cn } from "@/lib/utils"

// Animations
import { motion } from "framer-motion"

// Icons
import { ChevronDown, MoreVertical, CheckCircle, AlertCircle } from "lucide-react"
```

---

## Environment Variables

No additional environment variables needed. All components work with existing setup.

---

## Next Steps After Installation

1. **Read SUMMARY.md** for quick start code examples
2. **Review STATUS_VARIANTS.md** for badge configuration
3. **Copy code snippets** from component-research.md
4. **Create order components** in `/components/features/order/`
5. **Build order pages** in `/app/(authenticated)/orders/`
6. **Connect to API** and test with real data

---

## Performance Notes

### Bundle Size Impact
- Core components: ~5-10 KB
- Radix UI deps: ~20-30 KB
- Framer Motion: ~40 KB
- **Total: ~70-80 KB** (minified + gzipped)

### Loading Performance
All components are:
- Tree-shakeable (only used components loaded)
- Code-split by Next.js automatically
- Optimized for production builds
- No runtime overhead

### Optimization Tips
1. Use dynamic imports for heavy components
2. Lazy load animations on demand
3. Use CSS animations instead of JS when possible
4. Profile bundle with `npm run build`

---

## Troubleshooting Commands

```bash
# Clear Next.js cache
rm -rf .next

# Check TypeScript
npx tsc --noEmit

# Verify all components installed
ls -la components/ui/ | grep -c ".tsx"  # Should show 9+

# Test build
npm run build

# Start dev server
npm run dev
```

---

## Getting Help

If something goes wrong:

1. **Check installation:** `ls components/ui/`
2. **Check dependencies:** `npm list @radix-ui/react-*`
3. **Review error:** Look at full error message
4. **Search docs:** SUMMARY.md and component-research.md
5. **Check shadcn docs:** https://ui.shadcn.com

---

## Success Indicators

You'll know installation was successful when:

✓ All 9 component files exist in `/components/ui/`
✓ `npm run dev` starts without errors
✓ Components import without errors
✓ TypeScript recognizes all component props
✓ No console warnings about missing dependencies

---

## Installation Complete! 🎉

Once you see these files:
- `/components/ui/progress.tsx`
- `/components/ui/toggle-group.tsx`
- `/components/ui/badge.tsx`
- `/components/ui/accordion.tsx`
- `/components/ui/alert.tsx`
- `/components/ui/collapsible.tsx`
- `/components/ui/select.tsx`
- `/components/ui/dropdown-menu.tsx`
- `/components/ui/card.tsx`

You're ready to start building! Head to SUMMARY.md for code examples.

---

**Installation Guide Version:** 1.0
**Last Updated:** December 2, 2025
**Status:** Ready to Install
