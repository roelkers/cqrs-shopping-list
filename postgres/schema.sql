DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS shopping_lists CASCADE;
DROP VIEW IF EXISTS shopping_list;
DROP VIEW IF EXISTS lists;
DROP SEQUENCE IF EXISTS list_id_seq;

CREATE TABLE events(
    global_id SERIAL PRIMARY KEY,
    data JSONB NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    product_name TEXT NOT NULL
);
CREATE SEQUENCE list_id_seq START WITH 2;

CREATE OR REPLACE VIEW lists AS
(
	WITH
	added_lists as (
	SELECT * FROM (
		SELECT data->>'list_id' as id,  data->>'name' as name, global_id, rank() OVER (PARTITION BY data->>'list_id' ORDER BY global_id DESC) as pos FROM events WHERE data->>'type'='list_added'
    ) as ss WHERE pos=1),
	removed_lists as (
	SELECT * FROM (
		SELECT data->>'list_id' as id , global_id, rank() OVER (PARTITION BY data->>'list_id' ORDER BY global_id DESC) as pos FROM events WHERE data->>'type'='list_removed'
    ) as sx WHERE pos=1)
	SELECT added_lists.id, added_lists.name 
	FROM added_lists 
	LEFT JOIN removed_lists ON added_lists.id=removed_lists.id 
	WHERE removed_lists.id IS NULL OR added_lists.global_id>removed_lists.global_id
);

CREATE OR REPLACE VIEW shopping_list AS
(
	WITH
	added_items as (
	SELECT * FROM (
		SELECT data->>'product_id' as product_id, global_id, data->>'list_id' as list_id, rank() OVER (PARTITION BY data->>'product_id' ORDER BY global_id DESC) as pos FROM events WHERE data->>'type'='item_added'
  ) as ss WHERE pos=1),
	removed_items as (
	SELECT * FROM (
		SELECT data->>'product_id' as product_id, global_id, data->>'list_id' as list_id, rank() OVER (PARTITION BY data->>'product_id' ORDER BY global_id DESC) as pos FROM events WHERE data->>'type'='item_removed'	
	) as sd WHERE pos=1),
	checked_items as (
	SELECT * FROM (
		SELECT data->>'product_id' as product_id, global_id, data->>'list_id' as list_id, rank() OVER (PARTITION BY data->>'product_id' ORDER BY global_id DESC) as pos FROM events WHERE data->>'type'='item_checked'
  ) as ss WHERE pos=1),
	unchecked_items as (
	SELECT * FROM (
		SELECT data->>'product_id' as product_id, global_id, data->>'list_id' as list_id, rank() OVER (PARTITION BY data->>'product_id' ORDER BY global_id DESC) as pos FROM events WHERE data->>'type'='item_unchecked'	
	) as sd WHERE pos=1)
SELECT 
	DISTINCT ON (added_items.product_id, added_items.list_id) 
	added_items.list_id,added_items.product_id, products.product_name, products.category, added_items.global_id,
	(checked_items.product_id IS NOT NULL AND (unchecked_items.product_id IS NULL OR checked_items.global_id > unchecked_items.global_id)) as checked
	, checked_items.global_id as cgid, unchecked_items.global_id as ugid
	FROM added_items
	LEFT JOIN products ON products.id=added_items.product_id::integer 	
	LEFT JOIN removed_items ON added_items.product_id=removed_items.product_id AND added_items.list_id=removed_items.list_id
	LEFT JOIN checked_items ON added_items.product_id=checked_items.product_id AND added_items.list_id=checked_items.list_id
	LEFT JOIN unchecked_items ON added_items.product_id=unchecked_items.product_id AND added_items.list_id=unchecked_items.list_id

	WHERE removed_items.product_id IS NULL OR added_items.global_id>removed_items.global_id
);

COPY public.products (id, category, product_name) FROM stdin;
1	Backwaren	Brot
2	Backwaren	Brötchen
3	Backwaren	Knäckebrot
4	Backwaren	Toast
5	Backwaren	Ciabatta
6	Kühlwaren	Milch
7	Kühlwaren	Schlagsahne
8	Kühlwaren	Saure Sahne
9	Kühlwaren	Butter
10	Kühlwaren	Buttermilch
11	Kühlwaren	Quark
12	Kühlwaren	Joghurt
13	Kühlwaren	Käse
15	Kühlwaren	Reibekäse
16	Kühlwaren	Mozzarella
17	Kühlwaren	Hefe
18	Kühlwaren	Parmesan
23	Kühlwaren	Frischkäse
24	Kühlwaren	Grillkäse
25	Kühlwaren	Kräuterbutter
26	Kühlwaren	Eier
27	Kühlwaren	Feta
28	Kühlwaren	Zaziki
29	Kühlwaren	Crème Fraiche
30	Kühlwaren	Schmand
31	TK	Spinat
33	TK	Fisch
34	TK	Scampi
35	TK	Eis
36	TK	Pizza
37	Getränke	Sekt
38	Getränke	Apfelsaft
39	Getränke	Aperol
40	Getränke	Bier
41	Getränke	Kaffeebohnen
42	Getränke	Schwarzer Tee
43	Getränke	Sodastream-Kartusche
44	Getränke	Orangensaft
45	Trockenware	Müsli
51	Trockenware	Nutella
52	Trockenware	Marmelade
53	Trockenware	Honig
54	Trockenware	Rübensirup
55	Trockenware	Spaghetti
56	Trockenware	Nudeln
57	Trockenware	Reis
58	Trockenware	Milchreis
62	Trockenware	Mais
68	Trockenware	Milchreis
72	Trockenware	Semmelbrösel
89	Trockenware	Chiasamen
90	Trockenware	Sonnenblumenkerne
91	Trockenware	Kürbiskerne
92	Trockenware	Leinsamen
94	Trockenware	Popcornmais
133	Drogerie	Duschgel
134	Drogerie	Shampoo
135	Drogerie	Zahnpasta
136	Drogerie	Feuchtteucher
137	Drogerie	Toilettenpapier
138	Drogerie	Scheuermilch
139	Drogerie	Geschirrspültabs
140	Drogerie	Vollwaschmittel
141	Drogerie	Schwämme
99	Obst	Melone
101	Obst	Erdbeeren
32	Obst	Himbeeren
102	Obst	Himbeeren
103	Obst	Limetten
104	Obst	Pfirsiche
105	Obst	Birnen
98	Gemüse	Avocado
107	Gemüse	Kartoffeln
108	Gemüse	Gurke
109	Gemüse	Zucchini
110	Gemüse	Zwiebeln
111	Gemüse	Cherrytomaten
112	Gemüse	Strauchtomaten
63	Konserven	Kidneybohnen
65	Konserven	Passierte Tomaten
66	Konserven	Tomatenmark
69	Konserven	Saure Gurken
73	Konserven	Baked beans
87	Konserven	Getrocknete Tomaten
78	Konserven	Thunfisch
46	Backzutaten	Mehl
48	Backzutaten	Zucker
49	Backzutaten	Backpulver
50	Backzutaten	Vanillezucker
88	Backzutaten	Puderzucker
80	Konserven	Kichererbsen
61	Konserven	Dosentomaten
84	Konserven	Oliven
67	Konserven	Kokosmilch
14	Fleisch	Wurst
19	Fleisch	Hühnchen
20	Fleisch	Hackfleisch
21	Fleisch	Bacon
22	Fleisch	Räucherfisch
47	Würzwaren	Salz
59	Würzwaren	Senf
60	Würzwaren	Ketchup
64	Würzwaren	Zitronensaft
70	Würzwaren	Olivenöl
71	Würzwaren	Sonnenblumenöl
75	Würzwaren	Pesto
76	Würzwaren	Pfeffer
77	Würzwaren	Sojasoße
79	Würzwaren	Balsamico
81	Würzwaren	Hühnerbrühe
82	Würzwaren	Rinderbrühe
83	Würzwaren	Gemüsebrühe
85	Würzwaren	Mayonnaise
93	Würzwaren	Apfelessig
142	Drogerie	Müllsäcke
143	Drogerie	Spülmaschinensalz
144	Drogerie	Spüli
145	Drogerie	WC-Reiniger
146	Drogerie	Colorwaschmittel
147	Snacks	Salzstangen
148	Snacks	Chips
149	Snacks	Schokolade
150	Snacks	Studentenfutter
151	Snacks	Kekse
155	Backwaren	Burgerbrötchen
157	Kühlwaren	Würstchen 
159	Trockenware	Erdnussbutter
160	Kühlwaren	Tempeh
161	Getränke	Entkoffeiniert Kaffee 
162	Trockenware	Lorbeerblätter 
163	Trockenware	Haferflocken 
164	Trockenware	Soba-Nudeln
165	Backwaren	Wraps
166	Getränke	Wein
168	Drogerie	Hygienewaschmittel ohne Duft 
169	Getränke	Hafermilch
95	Obst	Bananen
96	Obst	Zitronen
97	Obst	Trauben
100	Obst	Heidelbeeren
106	Obst	Ananas
132	Obst	Orangen
113	Gemüse	Rote Beete
115	Gemüse	Lauchzwiebeln
116	Gemüse	Suppengemüse
117	Gemüse	Rucola
118	Gemüse	Radieschen
119	Gemüse	Knoblauch
120	Gemüse	Möhren
121	Gemüse	Ingwer
122	Gemüse	Paprika
123	Gemüse	Blumenkohl
124	Gemüse	Salat
125	Gemüse	Fenchel
126	Gemüse	Aubergine
127	Gemüse	Champignons
128	Gemüse	Bohnen
129	Gemüse	Weißkohl
130	Gemüse	Maiskolben
131	Gemüse	Pak Choi
154	Gemüse	Äpfel 
158	Gemüse	Koriander
153	Backzutaten	Roggenmehl
156	Fleisch	Bratwurst
152	Würzwaren	Ahornsirup
170	Trockenware	Lasagneplatten
171	Snacks	weiße Schokolade
172	TK	TK Himbeeren
173	Drogerie	Wattestäbchen
174	Trockenware	Paprikapulver
176	TK	TK Bohnen
177	Snacks	Haribo 
178	Kühlwaren	Mascarpone
179	Backwaren	Löffelbisquit 
180	Drogerie	Backpapier
181	Snacks	Nachos
175	Gemüse	Basilikum
182	Trockenware	Pistazien 
183	Snacks	Baiser
184	Gemüse	Mandarinen
185	Gemüse	Erdbeeren
186	Trockenware	Mandeln
187	Gemüse	Salbei
188	Trockenware	Speisestärke
189	Trockenware	Vollkornmehl
222	Trockenware	Kakao 
223	Gemüse	Rhabarber 
224	Drogerie	Corona-Schnelltest 
225	Drogerie	Fliegen-klebefalle 
226	Kühlwaren	Schweinefilet
227	Kühlwaren	Veggie-Hack 
228	Kühlwaren	Hühnerbrust-Wurst 
229	Trockenware	Linsen
230	Trockenware	Dinkelvollkornmehl
231	Trockenware	Pepperoni
232	Gemüse	Stangensellerie
233	Kühlwaren	Veganer Käse
234	Trockenware	Röstzwiebeln
235	Drogerie	Kerzen 
236	Drogerie	Deo
237	Trockenware	Artischocken
238	Kühlwaren	Ziegenfrischkäse
239	Getränke	Prosecco 
240	Trockenware	Cornflakes 
241	Kühlwaren	TK-Erbsen
242	Gemüse	Süßkartoffel
243	Gemüse	Getrocknete Tomaten
244	Trockenware	Polenta
245	Trockenware	Dosenmais
246	Gemüse	Kürbis
247	Backwaren	Haselnüsse gemahlen
248	Snacks	Ferrero
\.
