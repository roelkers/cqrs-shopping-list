DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS shopping_lists CASCADE;
DROP TABLE IF EXISTS shopping_lists_products CASCADE;
DROP TRIGGER IF EXISTS event_trigger ON events;
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
WITH added_items as ( SELECT data->>'product_id' as product_id, global_id, list_id FROM events WHERE data->>'type'='item_added'),
     removed_items as ( SELECT data->>'product_id' as product_id, global_id, list_id FROM events WHERE data->>'type'='item_removed')	
SELECT 
	DISTINCT ON (added_items.product_id, added_items.list_id) 
	added_items.list_id,added_items.product_id, products.product_name, products.category, added_items.global_id 
	FROM added_items
	LEFT JOIN products ON products.id=added_items.product_id::integer 	
	LEFT JOIN removed_items ON added_items.product_id=removed_items.product_id AND added_items.list_id=removed_items.list_id
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