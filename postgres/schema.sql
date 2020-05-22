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
    id INTEGER PRIMARY KEY,
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

INSERT INTO products(id, product_name, category) VALUES (1,'Brot', 'Backwaren');
INSERT INTO products(id, product_name, category) VALUES (2,'Milch', 'Milchprodukte');
INSERT INTO products(id, product_name, category) VALUES (3,'Bananen', 'Obst & Gemüse');
INSERT INTO products(id, product_name, category) VALUES (4,'Äpfel', 'Obst & Gemüse');
INSERT INTO events(data) VALUES ('{"list_id": "1","type": "list_added", "name": "my list"}');
INSERT INTO events(data) VALUES ('{"list_id": "1","type": "item_added", "product_id": "3"}');
INSERT INTO events(data) VALUES ('{"list_id": "1","type": "item_added", "product_id": "4"}');
INSERT INTO events(data) VALUES ('{"list_id": "1","type": "item_removed", "product_id": "3"}');
INSERT INTO events(data) VALUES ('{"list_id": "1","type": "item_checked", "product_id": "3"}');
INSERT INTO events(data) VALUES ('{"list_id": "1","type": "item_unchecked", "product_id": "3"}');
INSERT INTO events(data) VALUES ('{"list_id": "1","type": "item_checked", "product_id": "3"}');