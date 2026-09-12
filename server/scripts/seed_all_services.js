import pg from 'pg';
const { Client } = pg;
import { getAllMainServices } from '../../src/data/servicesData.ts';

const connStr = 'postgresql://postgres.vsbircholpdlhyznlrgi:Arrowline%401234@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function seed() {
  console.log('Connecting to database...');
  const client = new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  const mainServices = getAllMainServices();
  console.log(`Found ${mainServices.length} main services to seed.`);

  for (let i = 0; i < mainServices.length; i++) {
    const main = mainServices[i];
    console.log(`\nSeeding main service: ${main.title} (${main.slug})...`);

    // Upsert main service
    const serviceRes = await client.query(`
      insert into public.services (
        slug, title, short_description, full_description,
        hero_image, hero_video, hero_fallback_image,
        is_published, display_order,
        meta_title, meta_description, canonical_url,
        capabilities, benefits, category, key_capability,
        hero_badge, hero_headline, hero_subheadline, hero_description,
        highlights, about_badge, about_heading, about_description,
        about_bullet_points, about_image, why_arrowline, process_steps,
        applications, industries, network_description, faqs, gallery,
        video_url, video_poster, cta_headline, seo_title, seo_desc
      ) values (
        $1, $2, $3, $4,
        $5, $6, $7,
        $8, $9,
        $10, $11, $12,
        $13, $14, $15, $16,
        $17, $18, $19, $20,
        $21, $22, $23, $24,
        $25, $26, $27, $28,
        $29, $30, $31, $32, $33,
        $34, $35, $36, $37, $38
      )
      on conflict (slug) do update set
        title = excluded.title,
        short_description = excluded.short_description,
        full_description = excluded.full_description,
        hero_image = excluded.hero_image,
        is_published = true,
        display_order = excluded.display_order,
        meta_title = excluded.meta_title,
        meta_description = excluded.meta_description,
        capabilities = excluded.capabilities,
        benefits = excluded.benefits,
        hero_headline = excluded.hero_headline,
        hero_subheadline = excluded.hero_subheadline,
        about_heading = excluded.about_heading,
        about_description = excluded.about_description,
        about_bullet_points = excluded.about_bullet_points,
        about_image = excluded.about_image,
        why_arrowline = excluded.why_arrowline,
        process_steps = excluded.process_steps,
        applications = excluded.applications,
        industries = excluded.industries,
        faqs = excluded.faqs,
        gallery = excluded.gallery,
        seo_title = excluded.seo_title,
        seo_desc = excluded.seo_desc,
        updated_at = now()
      returning id;
    `, [
      main.slug,
      main.title,
      main.shortDesc || '',
      main.heroDescription || main.aboutDescription || '',
      main.heroImage || null,
      main.heroVideo || null,
      main.heroFallbackImage || null,
      true, // is_published = true
      main.displayOrder || (i + 1),
      main.seoTitle || null,
      main.seoDesc || null,
      main.canonicalUrl || null,
      JSON.stringify(main.keyCapability ? [main.keyCapability] : []),
      JSON.stringify(main.highlights || []),
      main.category || null,
      main.keyCapability || null,
      main.heroBadge || null,
      main.heroHeadline || null,
      main.heroSubheadline || null,
      main.heroDescription || null,
      JSON.stringify(main.highlights || []),
      main.aboutBadge || null,
      main.aboutHeading || null,
      main.aboutDescription || null,
      JSON.stringify(main.aboutBulletPoints || []),
      main.aboutImage || null,
      JSON.stringify(main.whyArrowline || []),
      JSON.stringify(main.processSteps || []),
      JSON.stringify(main.applications || []),
      JSON.stringify(main.industries || []),
      main.networkDescription || null,
      JSON.stringify(main.faqs || []),
      JSON.stringify(main.gallery || []),
      main.videoUrl || null,
      main.videoPoster || null,
      main.ctaHeadline || null,
      main.seoTitle || null,
      main.seoDesc || null
    ]);

    const serviceId = serviceRes.rows[0].id;
    console.log(`  ✓ Main service saved with ID: ${serviceId}`);

    // Seed sub-services if any
    const subServices = main.subServices || [];
    console.log(`  Seeding ${subServices.length} sub-services...`);

    for (let j = 0; j < subServices.length; j++) {
      const sub = subServices[j];
      const subRes = await client.query(`
        insert into public.service_items (
          service_id, slug, title, short_description, full_description,
          hero_image, hero_video, hero_fallback_image,
          is_published, display_order,
          meta_title, meta_description, canonical_url,
          capabilities, benefits, parent_slug, parent_name,
          hero_badge, hero_headline, hero_subheadline,
          about_badge, about_heading, about_description,
          about_bullet_points, about_image, why_arrowline,
          process_steps, applications, industries,
          faqs, gallery, video_url, video_poster,
          cta_headline, seo_title, seo_desc, keywords
        ) values (
          $1, $2, $3, $4, $5,
          $6, $7, $8,
          $9, $10,
          $11, $12, $13,
          $14, $15, $16, $17,
          $18, $19, $20,
          $21, $22, $23,
          $24, $25, $26,
          $27, $28, $29,
          $30, $31, $32, $33,
          $34, $35, $36, $37
        )
        on conflict (service_id, slug) do update set
          title = excluded.title,
          short_description = excluded.short_description,
          full_description = excluded.full_description,
          hero_image = excluded.hero_image,
          is_published = true,
          display_order = excluded.display_order,
          meta_title = excluded.meta_title,
          meta_description = excluded.meta_description,
          capabilities = excluded.capabilities,
          benefits = excluded.benefits,
          hero_headline = excluded.hero_headline,
          hero_subheadline = excluded.hero_subheadline,
          about_heading = excluded.about_heading,
          about_description = excluded.about_description,
          about_bullet_points = excluded.about_bullet_points,
          about_image = excluded.about_image,
          why_arrowline = excluded.why_arrowline,
          process_steps = excluded.process_steps,
          applications = excluded.applications,
          industries = excluded.industries,
          faqs = excluded.faqs,
          gallery = excluded.gallery,
          seo_title = excluded.seo_title,
          seo_desc = excluded.seo_desc,
          updated_at = now()
        returning id;
      `, [
        serviceId,
        sub.slug,
        sub.title,
        sub.shortDesc || '',
        sub.aboutDescription || '',
        sub.heroImage || null,
        sub.heroVideo || null,
        sub.heroFallbackImage || null,
        true, // is_published = true
        j + 1,
        sub.seoTitle || null,
        sub.seoDesc || null,
        sub.canonicalUrl || null,
        JSON.stringify(sub.capabilities || []),
        JSON.stringify(sub.aboutBulletPoints || []),
        main.slug,
        main.title,
        sub.heroBadge || null,
        sub.heroHeadline || null,
        sub.heroSubheadline || null,
        sub.aboutBadge || null,
        sub.aboutHeading || null,
        sub.aboutDescription || null,
        JSON.stringify(sub.aboutBulletPoints || []),
        sub.aboutImage || null,
        JSON.stringify(sub.whyArrowline || []),
        JSON.stringify(sub.processSteps || []),
        JSON.stringify(sub.applications || []),
        JSON.stringify(sub.industries || []),
        JSON.stringify(sub.faqs || []),
        JSON.stringify(sub.gallery || []),
        sub.videoUrl || null,
        sub.videoPoster || null,
        sub.ctaHeadline || null,
        sub.seoTitle || null,
        sub.seoDesc || null,
        JSON.stringify(sub.keywords || [])
      ]);

      const subItemId = subRes.rows[0].id;
      console.log(`    ✓ Sub-service saved: ${sub.title} (${subItemId})`);
    }

    // Seed FAQs into normalized table
    if (main.faqs && main.faqs.length > 0) {
      await client.query('delete from public.service_faqs where service_id = $1;', [serviceId]);
      for (let k = 0; k < main.faqs.length; k++) {
        const f = main.faqs[k];
        await client.query(`
          insert into public.service_faqs (service_id, question, answer, display_order, is_published)
          values ($1, $2, $3, $4, true);
        `, [serviceId, f.q, f.a, k + 1]);
      }
    }

    // Seed process steps into normalized table
    if (main.processSteps && main.processSteps.length > 0) {
      await client.query('delete from public.service_process_steps where service_id = $1;', [serviceId]);
      for (let s = 0; s < main.processSteps.length; s++) {
        const step = main.processSteps[s];
        await client.query(`
          insert into public.service_process_steps (service_id, step, title, subtitle, description, icon, display_order, is_published)
          values ($1, $2, $3, $4, $5, $6, $7, true);
        `, [serviceId, step.step, step.title, '', step.desc, step.icon || null, s + 1]);
      }
    }
  }

  console.log('\n🎉 ALL SERVICES AND SUB-SERVICES SEEDED SUCCESSFULLY!');
  await client.end();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
