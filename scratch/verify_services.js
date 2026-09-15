import {
  MAIN_SERVICES,
  getAllMainServices,
  getMainServiceBySlug,
  getSubServiceBySlug,
  getRelatedServices,
} from "../src/data/servicesData.ts";

console.log("=================================================");
console.log("🔍 ARROWLINE SERVICES SYSTEM INTEGRITY AUDIT");
console.log("=================================================\n");

const mainServices = getAllMainServices();
console.log(`✅ Total Main Services Loaded: ${mainServices.length} (Expected: 4)`);

if (mainServices.length !== 4) {
  console.error("❌ ERROR: Expected exactly 4 main services!");
  process.exit(1);
}

let totalSubServices = 0;
let errors = [];

mainServices.forEach((main, mIndex) => {
  console.log(`\n--- [${mIndex + 1}/4] Main Vertical: "${main.title}" (/${main.slug}) ---`);

  if (!main.heroHeadline || !main.heroImage || !main.shortDesc) {
    errors.push(`Main service "${main.slug}" is missing essential hero/overview copy.`);
  }
  if (!main.highlights || main.highlights.length < 4) {
    errors.push(`Main service "${main.slug}" has fewer than 4 highlights (${main.highlights?.length}).`);
  }
  const advantages = main.whyArrowline || main.advantages;
  if (!advantages || advantages.length < 4) {
    errors.push(`Main service "${main.slug}" has fewer than 4 advantages (${advantages?.length}).`);
  }
  const steps = main.processSteps || main.process;
  if (!steps || steps.length !== 6) {
    errors.push(`Main service "${main.slug}" has ${steps?.length} process steps (Expected: 6).`);
  }
  if (!main.faqs || main.faqs.length < 5) {
    errors.push(`Main service "${main.slug}" has fewer than 5 FAQs (${main.faqs?.length}).`);
  }
  if (!main.subServices || main.subServices.length === 0) {
    errors.push(`Main service "${main.slug}" has no sub-services!`);
  }

  const subCount = main.subServices?.length || 0;
  totalSubServices += subCount;
  console.log(`   ↳ Contains ${subCount} specialized Sub-Services`);
  console.log(`   ↳ Highlights: ${main.highlights?.length} | Advantages: ${advantages?.length} | Process Steps: ${steps?.length} | FAQs: ${main.faqs?.length}`);

  // Check each sub-service
  main.subServices?.forEach((sub, sIndex) => {
    // Test slug lookup
    const resolvedSub = getSubServiceBySlug(main.slug, sub.slug);
    if (!resolvedSub) {
      errors.push(`Failed getSubServiceBySlug("${main.slug}", "${sub.slug}")`);
    }

    if (!sub.title || !sub.slug || !sub.heroHeadline || !sub.shortDesc) {
      errors.push(`Sub-service "${main.slug}/${sub.slug}" missing critical header content.`);
    }
    if (!sub.capabilities || sub.capabilities.length < 4) {
      errors.push(`Sub-service "${main.slug}/${sub.slug}" has fewer than 4 capabilities (${sub.capabilities?.length}).`);
    }
    const subAdvantages = sub.whyArrowline || sub.advantages;
    if (!subAdvantages || subAdvantages.length < 4) {
      errors.push(`Sub-service "${main.slug}/${sub.slug}" has fewer than 4 advantages (${subAdvantages?.length}).`);
    }
    const subSteps = sub.processSteps || sub.process;
    if (!subSteps || subSteps.length !== 6) {
      errors.push(`Sub-service "${main.slug}/${sub.slug}" has ${subSteps?.length} process steps (Expected: 6).`);
    }
    if (!sub.faqs || sub.faqs.length < 5) {
      errors.push(`Sub-service "${main.slug}/${sub.slug}" has fewer than 5 FAQs (${sub.faqs?.length}).`);
    }
  });

  // Test related services
  const relatedMain = getRelatedServices(main.slug);
  if (relatedMain.otherMain.length !== 3) {
    errors.push(`Related services for "${main.slug}" expected 3 other main verticals, got ${relatedMain.otherMain.length}`);
  }
});

console.log(`\n=================================================`);
console.log(`📊 TOTAL SUMMARY:`);
console.log(`- Main Services: ${mainServices.length}`);
console.log(`- Sub-Services:  ${totalSubServices} (Expected: 22)`);
console.log(`- Total Pages:   ${mainServices.length + totalSubServices} (Expected: 26)`);

if (totalSubServices !== 22) {
  errors.push(`Total sub-services count is ${totalSubServices}, expected 22.`);
}

if (errors.length > 0) {
  console.error(`\n❌ FOUND ${errors.length} ISSUES:`);
  errors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
  process.exit(1);
} else {
  console.log(`\n🎉 ALL 26 PAGES AND DATA MODELS PASSED 100% INTEGRITY AUDIT!`);
  console.log(`=================================================`);
}
