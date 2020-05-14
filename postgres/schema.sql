DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS shopping_lists CASCADE;
DROP TABLE IF EXISTS shopping_lists_products CASCADE;
DROP VIEW IF EXISTS shopping_list;

CREATE TABLE shopping_lists (
    id SERIAL PRIMARY KEY,
    event_seq_no SERIAL
);

CREATE TABLE events(
    list_id INTEGER REFERENCES shopping_lists(id),
    global_id SERIAL PRIMARY KEY,
    data JSONB NOT NULL
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    category TEXT NOT NULL,
    product_name TEXT NOT NULL
);

DROP VIEW IF EXISTS shopping_list;
CREATE OR REPLACE VIEW shopping_list AS
(
	WITH
	added_items as (
	SELECT * FROM (
		SELECT data->>'product_id' as product_id, global_id, list_id, rank() OVER (PARTITION BY data->>'product_id' ORDER BY global_id DESC) as pos FROM events WHERE data->>'type'='item_added'
    ) as ss WHERE pos=1),
	removed_items as (
	SELECT * FROM (
		SELECT data->>'product_id' as product_id, global_id, list_id, rank() OVER (PARTITION BY data->>'product_id' ORDER BY global_id DESC) as pos FROM events WHERE data->>'type'='item_removed'	
	) as sd WHERE pos=1),
	checked_items as (
	SELECT * FROM (
		SELECT data->>'product_id' as product_id, global_id, list_id, rank() OVER (PARTITION BY data->>'product_id' ORDER BY global_id DESC) as pos FROM events WHERE data->>'type'='item_checked'
    ) as ss WHERE pos=1),
	unchecked_items as (
	SELECT * FROM (
		SELECT data->>'product_id' as product_id, global_id, list_id, rank() OVER (PARTITION BY data->>'product_id' ORDER BY global_id DESC) as pos FROM events WHERE data->>'type'='item_unchecked'	
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
INSERT INTO shopping_lists(id) VALUES (1);
INSERT INTO events(list_id, data) VALUES (1, '{"type": "item_added", "product_id": "3"}');
INSERT INTO events(list_id, data) VALUES (1, '{"type": "item_added", "product_id": "4"}');
INSERT INTO events(list_id, data) VALUES (1, '{"type": "item_removed", "product_id": "3"}');
INSERT INTO events(list_id, data) VALUES (1, '{"type": "item_checked", "product_id": "3"}');
INSERT INTO events(list_id, data) VALUES (1, '{"type": "item_unchecked", "product_id": "3"}');
INSERT INTO events(list_id, data) VALUES (1, '{"type": "item_checked", "product_id": "3"}');