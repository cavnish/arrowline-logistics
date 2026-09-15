# Service Pages Developer's Guide

## Architecture Overview

The service pages system uses a **data-driven, component-driven architecture** that separates concerns:

### Data Layer (`logisticsData.ts`)
- Defines service structure via TypeScript interface
- Contains all service content in CORE_SERVICES array
- No business logic, pure data

### Component Layer (`ServiceDetailView.tsx`)
- Receives service object as prop
- Renders all page sections generically
- Uses fallback logic for missing optional fields
- Handles interactive elements (FAQ accordion, quote modal)

### Routing Layer (`App.tsx`)
- Extracts service slug from URL
- Finds matching service in CORE_SERVICES
- Passes service object to component
- No changes needed for new services

---

## Data Structure Explained

### Required Fields (For All Services)

```typescript
id: string;              // Unique identifier (e.g., "full-truck-load")
slug: string;            // URL slug (e.g., "full-truck-load-ftl")
title: string;           // Display name (e.g., "Full Truck Load (FTL)")
category: string;        // Service category (e.g., "Direct Road Transport")
keyCapability: string;   // Short tagline (e.g., "Dedicated Vehicle Movement")
shortDesc: string;       // 1-2 sentence overview
longDesc: string;        // Detailed explanation (2-3 paragraphs)
image: string;           // Hero image path (e.g., "/images/road-transport.jpg")
features: string[];      // Generic features (6+ items)
benefits: string[];      // Generic benefits (4 items)
seoTitle: string;        // Meta title for SEO
seoDesc: string;         // Meta description for SEO
```

### Optional Enhanced Fields (For Premium Pages)

```typescript
// Hero Section Customization
heroHeadline?: string;         // If not provided, uses 'title'
heroSubheadline?: string;      // If not provided, uses 'keyCapability'

// Capabilities Section (Premium)
capabilities?: Array<[string, string]>;
// Format: [title, description]
// Example:
// [
//   ["Dedicated Full Truck Load", "One dedicated vehicle moves your shipment..."],
//   ["Factory-to-Warehouse Transportation", "Specialized movement of goods..."],
//   ...
// ]
// If provided: renders instead of features
// If omitted: renders first 6 items from 'features' array

// Process Section (Premium)
process?: Array<[string, string, string]>;
// Format: [step_number, step_title, step_description]
// Example:
// [
//   ["01", "Requirement", "Share your pickup, destination, cargo details..."],
//   ["02", "Vehicle Planning", "We match the vehicle to your cargo..."],
//   ...
// ]
// If provided: renders 6-step process
// If omitted: renders generic 4-step fallback process

// FAQs Section (Premium)
faqs?: Array<[string, string]>;
// Format: [question, answer]
// Example:
// [
//   ["What is FTL transportation?", "FTL means Full Truck Load..."],
//   ["When should I choose FTL?", "Choose FTL when you have large shipments..."],
//   ...
// ]
// If provided: renders these FAQs
// If omitted: renders generic 2 FAQ fallback

// Industries Section (Premium)
industries?: string[];
// Format: array of industry names
// Example: ["Manufacturing", "FMCG & Retail", "Automotive", ...]
// If provided: renders industry badges with check marks
// If omitted: section doesn't render at all

// Future Enhancement Fields (Not Yet Used)
ctaText?: string;        // Custom CTA button text
ctaSubtext?: string;     // Custom CTA description
```

---

## Component Rendering Logic

### Capabilities Rendering

```typescript
const capabilitiesData = service.capabilities && service.capabilities.length > 0
  ? service.capabilities.map(([title, text]) => [title, text, Check])
  : service.features.slice(0, 6).map((feature) => [feature, service.longDesc, Check]);
```

**Flow**:
1. Check if `service.capabilities` exists and has items
2. If yes → Map each `[title, description]` to `[title, description, Icon]`
3. If no → Use first 6 items from `service.features` array
4. Add Check icon to all items
5. Render with animation

**Result**: Always 6-8 capability cards, no errors if data missing

### Process Rendering

```typescript
const processData = service.process && service.process.length > 0
  ? service.process.map(([step, title, text]) => [step, title, text])
  : [
      ["01", "Plan", "Share your cargo, route and delivery requirements."],
      ["02", "Coordinate", "Our operations team arranges the right movement plan."],
      ["03", "Move", "Cargo is handled safely with milestone communication."],
      ["04", "Deliver", "We complete delivery and provide confirmation."]
    ];
```

**Flow**:
1. Check if `service.process` exists and has items
2. If yes → Return as-is (already `[step, title, text]` format)
3. If no → Return generic 4-step fallback
4. Render each step with numbered badge and left border accent

**Result**: Always 4-6 process steps, automatically animated

### FAQs Rendering

```typescript
const faqsData = service.faqs && service.faqs.length > 0
  ? service.faqs.map(([question, answer]) => [question, answer])
  : [
      ["Can I request a customized quote?", "Yes. Share your cargo, route and timeline..."],
      ["Do you provide shipment updates?", "Yes. Milestone updates are provided..."]
    ];
```

**Flow**:
1. Check if `service.faqs` exists and has items
2. If yes → Return as-is (already `[question, answer]` format)
3. If no → Return generic 2 FAQ fallback
4. Render as expandable accordion with chevron icon

**Result**: Always at least 2 FAQs, working accordion functionality

### Industries Rendering

```typescript
const industriesData = service.industries || [];

// Later in JSX:
{industriesData.length > 0 && (
  <Reveal>
    <section className="mt-20 grid gap-8 lg:grid-cols-2">
      {/* Industries section */}
    </section>
  </Reveal>
)}
```

**Flow**:
1. Extract `industries` array or use empty array
2. Check if array has items
3. If yes → Render industries section with badges
4. If no → Don't render section at all

**Result**: Cleaner UI for services without industries, no wasted space

---

## Common Development Tasks

### Task 1: Update Service Content

**Scenario**: Client provides new FAQs for FTL service

**Steps**:
1. Open `src/data/logisticsData.ts`
2. Find service with `id: "full-truck-load"`
3. Update `faqs` array:
```typescript
faqs: [
  ["New question?", "New answer"],
  // ... keep existing FAQs
]
```
4. Run `npm run build`
5. Test at `#/services/full-truck-load-ftl`

**Time**: < 2 minutes

### Task 2: Add New Service

**Scenario**: Add "Warehousing & Storage" service

**Steps**:

1. Add new service object to CORE_SERVICES array:
```typescript
{
  id: "warehousing-storage",
  slug: "warehousing-storage",
  title: "Warehousing & Storage",
  category: "Distribution Services",
  keyCapability: "Climate-Controlled Facilities Across India",
  shortDesc: "Secure, climate-controlled warehousing with inventory management.",
  longDesc: "Our modern warehouses offer...",
  image: "/images/warehouse.jpg",
  features: ["Feature 1", "Feature 2", ...],
  benefits: ["Benefit 1", "Benefit 2", ...],
  seoTitle: "Warehousing & Storage Services in India | Arrowline",
  seoDesc: "Climate-controlled warehousing and storage with inventory management...",

  // Optional: Add premium features
  heroHeadline: "Modern Warehousing Solutions Built for Your Inventory",
  capabilities: [
    ["Climate Control", "Temperature and humidity controlled..."],
    ...
  ],
  process: [
    ["01", "Assessment", "..."],
    ...
  ],
  faqs: [...],
  industries: ["Manufacturing", "FMCG", ...]
}
```

2. Add hero image to `/public/images/warehouse.jpg`
3. Run `npm run build`
4. Test at `#/services/warehousing-storage`
5. Verify navigation shows new service

**Time**: < 5 minutes

### Task 3: Add Hero Image

**Scenario**: Update FTL service hero image

**Steps**:
1. Save image as `/public/images/ftl-hero.jpg` (or WebP for performance)
2. Update service in `logisticsData.ts`:
```typescript
{
  id: "full-truck-load",
  // ... other fields
  image: "/images/ftl-hero.jpg",  // Changed from "/images/road-transport.jpg"
}
```
3. Run `npm run build`
4. Clear browser cache and test

**Note**: Images are served from `/public/` directory in Vite

### Task 4: Fix Display Issues

**Scenario**: Capabilities not showing on a service page

**Debugging**:
1. Open browser DevTools → Network tab
2. Check if page loads (should be 200 OK)
3. Check if capabilities array exists in service data
4. Verify format: `Array<[string, string]>` (tuples)
5. Look for console errors
6. Check if fallback is being used (uses features array)

**Solution**:
```typescript
// Check if capabilities is properly formatted:
capabilities: [
  ["Title", "Description"],  // ✅ Correct format
  "Just a string",           // ❌ Wrong format
]
```

### Task 5: Update SEO Metadata

**Scenario**: Improve SEO for Container Transportation page

**Steps**:
1. Open `logisticsData.ts`
2. Find service with `slug: "container-transportation"`
3. Update SEO fields:
```typescript
seoTitle: "20ft & 40ft Container Transportation | Import-Export Logistics | Arrowline",
seoDesc: "Professional 20-ft and 40-ft container transportation with CFS coordination..."
```
4. Run `npm run build`
5. Test with SEO checker tool
6. Deploy

**Tips**:
- Keep title under 60 characters
- Keep description under 160 characters
- Include primary keyword
- Include company name
- Include location if relevant

---

## Performance Considerations

### Bundling
- **ServiceDetailView** component is relatively small (~80 KB uncompressed)
- Component is shared across all 10 services → good code reuse
- No per-service code duplication → smaller bundle

### Runtime
- **Data lookup**: O(n) where n = number of services (10 currently)
  - Optimization: Could use slug-keyed map for O(1) lookup if 100+ services
- **Rendering**: All sections use React.map() → optimized rendering
- **Animations**: Reveal component uses Intersection Observer API (performant)

### Bundle Breakdown
```
dist/index.html        1,676.13 kB (gzipped: 490.81 kB)
  - Including: React, Tailwind, all pages, all services
  - No per-service code splitting (not needed, small bundle)
```

---

## Testing Strategy

### Unit Tests (Not Currently Implemented)

Could test:
- Fallback logic works when optional fields missing
- Industries section doesn't render if array empty
- All 10 services load without errors

### Integration Tests

Manual testing checklist:
- [ ] All service URLs load
- [ ] Navigation shows all services
- [ ] Each service displays unique content
- [ ] Fallback rendering works for older services
- [ ] FAQs accordion works
- [ ] Quote button opens modal
- [ ] Contact links work
- [ ] Mobile responsive

### Performance Tests

- PageSpeed Insights (for desktop & mobile)
- Lighthouse audits (performance, accessibility, SEO)
- Network tab in DevTools (check load times)

### SEO Tests

- Google Search Console (index status, keywords)
- Structured data validators (schema.org)
- Meta tag checkers (title, description, OG tags)

---

## Extending the Component

### Add New Section Type

**Scenario**: Add testimonials section to each service

**Implementation**:

1. Add to ServiceDetail interface:
```typescript
testimonials?: Array<[string, string, string]>;  // [name, role, quote]
```

2. Add to service data:
```typescript
testimonials: [
  ["John Doe", "Logistics Manager", "Great service, highly recommend!"],
  ...
]
```

3. Add rendering logic in component:
```typescript
const testimonialsData = service.testimonials || [];

// In JSX:
{testimonialsData.length > 0 && (
  <section className="mt-20">
    {/* Render testimonials */}
  </section>
)}
```

4. Style and test

### Add Service-Specific Styling

**Scenario**: Each service has its own color scheme

**Current approach**: All services use same colors (orange #FF6B1A, navy #062B3A)

**Future approach**:
```typescript
interface ServiceDetail {
  // ... existing fields
  brandColor?: string;        // e.g., "#FF6B1A"
  accentColor?: string;       // e.g., "#062B3A"
  // ... rest of fields
}
```

Then in component:
```typescript
<section style={{
  backgroundColor: service.brandColor || "#062B3A"
}}>
```

---

## Common Pitfalls & How to Avoid Them

| Pitfall | Cause | Solution |
|---------|-------|----------|
| Service doesn't appear in nav | Slug mismatch | Ensure `slug` field matches URL segment |
| Page shows wrong content | Service data copied incorrectly | Use copy-paste carefully, verify field names |
| Capabilities not showing | Array format wrong (not tuples) | Use `[title, desc]` tuples, not objects or strings |
| Process shows 4 steps instead of 6 | `process` array missing | Add `process` field with 6 `[step, title, desc]` items |
| Industries section empty | Array not provided | Add `industries` field to service object |
| SEO metadata generic | Used fallback values | Set unique `seoTitle` and `seoDesc` |
| Image not loading | Path incorrect | Use `/images/filename.jpg`, ensure file exists in public/ |
| Console errors | TypeScript errors ignored during build | Run `npm run build` and check for errors |
| Styling looks wrong | Tailwind classes not recognized | Ensure all classes in ServiceDetailView.tsx are valid |

---

## Git Workflow for Service Updates

### Typical Flow

```bash
# 1. Create feature branch
git checkout -b add-warehousing-service

# 2. Update service data
# Edit src/data/logisticsData.ts

# 3. Add image
# Copy image to public/images/

# 4. Test locally
npm run dev
# Visit #/services/warehousing-storage

# 5. Build
npm run build

# 6. Commit
git add .
git commit -m "Add Warehousing & Storage service page"

# 7. Push
git push origin add-warehousing-service

# 8. Create PR and get review
# After approval, merge to main
```

### Commit Message Example
```
feat: add Warehousing & Storage service page

- Added warehousing service to CORE_SERVICES
- Includes 8 capabilities, 6-step process, 7 FAQs
- Added hero image
- Unique SEO metadata for discoverability
- Industries: Manufacturing, FMCG, Retail, E-commerce
```

---

## Monitoring & Maintenance

### Monthly Checklist

- [ ] Review service page analytics (which are most viewed)
- [ ] Check for broken links on service pages
- [ ] Verify all hero images load correctly
- [ ] Review FAQ performance (which questions get most clicks)
- [ ] Check page speed scores in Google Lighthouse
- [ ] Review search console for query clicks/impressions per service
- [ ] Update outdated contact information if needed

### Quarterly Review

- [ ] Consider adding new services based on client feedback
- [ ] Evaluate if any services need content updates
- [ ] Check competitor service pages for ideas
- [ ] Review mobile responsiveness across all services
- [ ] Audit SEO rankings for service keywords

---

## Helpful Resources

- **Component Library**: Lucide React icons (lucide.dev)
- **Styling**: Tailwind CSS (tailwindcss.com)
- **Animation**: Custom Reveal component in codebase
- **Router**: Hash routing via window.location.hash
- **Data Fetch**: App.tsx handles service lookup

---

## Support

For questions or issues:
1. Check [SERVICE_PAGES_QUICK_REFERENCE.md](./SERVICE_PAGES_QUICK_REFERENCE.md)
2. Check [SERVICE_PAGES_UPGRADE_SUMMARY.md](./SERVICE_PAGES_UPGRADE_SUMMARY.md)
3. Review examples in `src/data/logisticsData.ts` (existing 6 new services)
4. Check component implementation in `src/components/ServiceDetailView.tsx`

---

**Document Version**: 1.0
**Last Updated**: 2024
**Maintainer**: Development Team
