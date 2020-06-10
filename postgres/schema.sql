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


INSERT INTO products(   product_name, category) VALUES ( 'Brot', 'Backwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Brötchen', 'Backwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Knäckebrot', 'Backwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Toast', 'Backwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Ciabatta', 'Backwaren');

INSERT INTO products(   product_name, category) VALUES ( 'Milch', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Schlagsahne', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Saure Sahne', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Butter', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Buttermilch', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Quark', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Joghurt', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Käse', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Wurst', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Reibekäse', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Mozzarella', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Hefe', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Parmesan', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Hühnchen', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Hackfleisch', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Bacon', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Räucherfisch', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Frischkäse', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Grillkäse', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Kräuterbutter', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Eier', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Feta', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Zaziki', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Crème Fraiche', 'Kühlwaren');
INSERT INTO products(   product_name, category) VALUES ( 'Schmand', 'Kühlwaren');

INSERT INTO products(   product_name, category) VALUES ( 'Spinat', 'TK');
INSERT INTO products(   product_name, category) VALUES ( 'Himbeeren', 'TK');
INSERT INTO products(   product_name, category) VALUES ( 'Fisch', 'TK');
INSERT INTO products(   product_name, category) VALUES ( 'Scampi', 'TK');
INSERT INTO products(   product_name, category) VALUES ( 'Eis', 'TK');
INSERT INTO products(   product_name, category) VALUES ( 'Pizza', 'TK');

INSERT INTO products(   product_name, category) VALUES ( 'Sekt', 'Getränke');
INSERT INTO products(   product_name, category) VALUES ( 'Apfelsaft', 'Getränke');
INSERT INTO products(   product_name, category) VALUES ( 'Aperol', 'Getränke');
INSERT INTO products(   product_name, category) VALUES ( 'Bier', 'Getränke');
INSERT INTO products(   product_name, category) VALUES ( 'Kaffeebohnen', 'Getränke');
INSERT INTO products(   product_name, category) VALUES ( 'Schwarzer Tee', 'Getränke');
INSERT INTO products(   product_name, category) VALUES ( 'Sodastream-Kartusche', 'Getränke');
INSERT INTO products(   product_name, category) VALUES ( 'Orangensaft', 'Getränke');

INSERT INTO products(   product_name, category) VALUES ( 'Müsli', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Mehl', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Salz', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Zucker', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Backpulver', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Vanillezucker', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Nutella', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Marmelade', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Honig', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Rübensirup', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Spaghetti', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Nudeln', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Reis', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Milchreis', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Senf', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Ketchup', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Dosentomaten', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Mais', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Kidneybohnen', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Zitronensaft', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Passierte Tomaten', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Tomatenmark', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Kokosmilch', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Milchreis', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Saure Gurken', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Olivenöl', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Sonnenblumenöl', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Semmelbrösel', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Baked beans', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Zitronensaft', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Pesto', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Pfeffer', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Sojasoße', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Thunfisch', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Balsamico', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Kichererbsen', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Hühnerbrühe', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Rinderbrühe', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Gemüsebrühe', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Oliven', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Mayonnaise', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Gemüsebrühe', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Getrocknete Tomaten', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Puderzucker', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Chiasamen', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Sonnenblumenkerne', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Kürbiskerne', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Leinsamen', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Apfelessig', 'Trockenware');
INSERT INTO products(   product_name, category) VALUES ( 'Popcornmais', 'Trockenware');

INSERT INTO products(   product_name, category) VALUES ('Bananen', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Zitronen', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Trauben', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Avocado', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Melone', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Heidelbeeren', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Erdbeeren', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Himbeeren', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Limetten', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Pfirsiche', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Birnen', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Ananas', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Kartoffeln', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Gurke', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Zucchini', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Zwiebeln', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Cherrytomaten', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Strauchtomaten', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Rote Beete', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Zwiebeln', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Lauchzwiebeln', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Suppengemüse', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Rucola', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Radieschen', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Knoblauch', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Möhren', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Ingwer', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Paprika', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Blumenkohl', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Salat', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Fenchel', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Aubergine', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Champignons', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Bohnen', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Weißkohl', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Maiskolben', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Pak Choi', 'Obst & Gemüse');
INSERT INTO products(   product_name, category) VALUES ('Orangen', 'Obst & Gemüse');

INSERT INTO products(   product_name, category) VALUES ('Duschgel', 'Drogerie');
INSERT INTO products(   product_name, category) VALUES ('Shampoo', 'Drogerie');
INSERT INTO products(   product_name, category) VALUES ('Zahnpasta', 'Drogerie');
INSERT INTO products(   product_name, category) VALUES ('Feuchtteucher', 'Drogerie');
INSERT INTO products(   product_name, category) VALUES ('Toilettenpapier', 'Drogerie');
INSERT INTO products(   product_name, category) VALUES ('Scheuermilch', 'Drogerie');
INSERT INTO products(   product_name, category) VALUES ('Geschirrspültabs', 'Drogerie');
INSERT INTO products(   product_name, category) VALUES ('Vollwaschmittel', 'Drogerie');
INSERT INTO products(   product_name, category) VALUES ('Schwämme', 'Drogerie');
INSERT INTO products(   product_name, category) VALUES ('Müllsäcke', 'Drogerie');
INSERT INTO products(   product_name, category) VALUES ('Spülmaschinensalz', 'Drogerie');
INSERT INTO products(   product_name, category) VALUES ('Spüli', 'Drogerie');
INSERT INTO products(   product_name, category) VALUES ('WC-Reiniger', 'Drogerie');
INSERT INTO products(   product_name, category) VALUES ('Colorwaschmittel', 'Drogerie');

INSERT INTO products(   product_name, category) VALUES ('Salzstangen', 'Snacks');
INSERT INTO products(   product_name, category) VALUES ('Chips', 'Snacks');
INSERT INTO products(   product_name, category) VALUES ('Schokolade', 'Snacks');
INSERT INTO products(   product_name, category) VALUES ('Studentenfutter', 'Snacks');
INSERT INTO products(   product_name, category) VALUES ('Kekse', 'Snacks');