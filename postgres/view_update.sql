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
	) as sd WHERE pos=1),
	inc_quantity_items as (
	SELECT * FROM (
		SELECT data->>'product_id' as product_id, global_id, data->>'list_id' as list_id, count(*) OVER (PARTITION BY data->>'product_id') as incr FROM events WHERE data->>'type'='quantity_inc'	
	) as iqi),
	dec_quantity_items as (
	SELECT * FROM (
		SELECT data->>'product_id' as product_id, global_id, data->>'list_id' as list_id, count(*) OVER (PARTITION BY data->>'product_id') as decr FROM events WHERE data->>'type'='quantity_dec'	
	) as dqi)
SELECT 
	DISTINCT ON (added_items.product_id, added_items.list_id) 
	added_items.list_id,added_items.product_id, products.product_name, products.category, added_items.global_id,
	(checked_items.product_id IS NOT NULL AND (unchecked_items.product_id IS NULL OR checked_items.global_id > unchecked_items.global_id)) as checked
	, checked_items.global_id as cgid, unchecked_items.global_id as ugid,
	incr, decr, COALESCE(incr,0) - COALESCE(decr,0) + 1 as quantity 
	FROM added_items
	LEFT JOIN products ON products.id=added_items.product_id::integer 	
	LEFT JOIN removed_items ON added_items.product_id=removed_items.product_id AND added_items.list_id=removed_items.list_id
	LEFT JOIN checked_items ON added_items.product_id=checked_items.product_id AND added_items.list_id=checked_items.list_id
	LEFT JOIN unchecked_items ON added_items.product_id=unchecked_items.product_id AND added_items.list_id=unchecked_items.list_id
	LEFT JOIN dec_quantity_items ON added_items.product_id=dec_quantity_items.product_id AND added_items.list_id=dec_quantity_items.list_id
	LEFT JOIN inc_quantity_items ON added_items.product_id=inc_quantity_items.product_id AND added_items.list_id=inc_quantity_items.list_id

	WHERE removed_items.product_id IS NULL OR added_items.global_id>removed_items.global_id
);