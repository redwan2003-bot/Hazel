-- Seeds the production catalog with the 7 genuinely distinct products found
-- among the images in /public (several files were duplicate photos of the
-- same physical bag and were intentionally left out — see chat for the list).

insert into public.products (name, description, price, category, image_url) values
('Forest Suede Shoulder Bag',
 'A structured little shoulder bag in brushed forest-green suede, finished with contrast tan leather trim and a signature donut charm. Roomy enough for the essentials, small enough to feel effortless.',
 6500, 'Shoulder Bags', '/bag1.jpg'),

('Houndstooth Crossbody',
 'Classic houndstooth canvas meets warm cognac leather trim on this compact crossbody. An adjustable strap and flap-over magnetic closure make it the easiest bag to grab on your way out.',
 5200, 'Crossbody', '/bag2.jpg'),

('Pewter Pebbled Leather Tote',
 'An oversized pebbled-leather tote in a warm pewter tone, with dual rolled handles and a soft, slouchy silhouette. Built to carry a full day without losing its shape.',
 9800, 'Tote', '/bag3.jpg'),

('Chocolate Pebbled Leather Tote',
 'The same beloved slouchy tote silhouette in a deep chocolate pebbled leather, finished with brushed gold hardware and dual rolled handles.',
 9800, 'Tote', '/bag9.jpg'),

('Woven Canvas & Leather Tote',
 'Two-tone woven canvas paired with honey-brown leather trim and a drawstring top. A lighter, warm-weather take on the everyday tote.',
 7500, 'Tote', '/bag6.jpg'),

('Taupe Croc-Embossed Clutch',
 'A compact top-handle clutch in croc-embossed taupe leather, anchored by a sculptural black clasp. Evening-ready, but easy enough for daytime too.',
 4200, 'Clutch', '/bag11.jpg'),

('Ivory Half-Moon Shoulder Bag',
 'A soft half-moon silhouette in pebbled ivory leather with brushed gold hardware -- a quiet, versatile piece that pairs with almost everything.',
 5800, 'Shoulder Bags', '/bag17.jpg');
