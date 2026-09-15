-- _fix_core_values.sql
-- Idempotent: safe to run multiple times.
-- Deletes all rows from core_values and inserts the 5 correct canonical values.

BEGIN;

DELETE FROM public.core_values;

INSERT INTO public.core_values (title, description, icon, display_order, is_published) VALUES
  (
    'Safe & Secure Cargo',
    'Every shipment is handled with rigorous safety protocols, GPS tracking, and secure containerization to ensure zero-damage delivery across all transit modes.',
    'ShieldCheck',
    1,
    true
  ),
  (
    'Optimized Cost & Routes',
    'We leverage route analytics, multimodal networks, and hub optimization to minimize freight costs while maintaining the fastest transit timelines.',
    'TrendingDown',
    2,
    true
  ),
  (
    'Transparent Live Tracking',
    'Real-time GPS visibility and proactive status updates keep you informed from pickup to final-mile delivery at every checkpoint.',
    'Activity',
    3,
    true
  ),
  (
    'End-to-End Coordination',
    'From port clearance to warehouse staging to last-mile dispatch, our operations team manages every handoff as a single coordinated movement.',
    'Workflow',
    4,
    true
  ),
  (
    'Pan-India Network Reach',
    'With 10+ regional hubs, 250+ fleet network, and strategic port partnerships, we cover every major industrial corridor across India.',
    'Globe',
    5,
    true
  );

COMMIT;
