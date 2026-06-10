-- Her paket grubu için 3·6·9·12·15·24 ay süreleri yoksa ekle (gün: 90, 180, 270, 365, 450, 730)
-- Tekrar çalıştırılabilir: aynı grup + aynı gün satırı zaten varsa atlanır.

INSERT INTO public.customer_packages (group_id, group_name, name, days, price, sort_order, is_active)
SELECT pt.id,
       pt.name,
       v.name,
       v.days,
       v.price,
       v.sort_order,
       true
FROM public.package_types pt
CROSS JOIN (
  VALUES
    ('3 Ay'::text, 90::int, 0::numeric, 1::int),
    ('6 Ay', 180, 0, 2),
    ('9 Ay', 270, 0, 3),
    ('12 Ay', 365, 0, 4),
    ('15 Ay', 450, 0, 5),
    ('24 Ay', 730, 0, 6)
) AS v(name, days, price, sort_order)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.customer_packages cp
  WHERE cp.group_id = pt.id
    AND cp.days = v.days
);
