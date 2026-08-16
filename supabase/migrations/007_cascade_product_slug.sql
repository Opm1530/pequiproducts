-- Allow slug changes to cascade to course_modules and user_products
ALTER TABLE course_modules
  DROP CONSTRAINT IF EXISTS course_modules_product_slug_fkey;

ALTER TABLE course_modules
  ADD CONSTRAINT course_modules_product_slug_fkey
  FOREIGN KEY (product_slug) REFERENCES products(slug) ON UPDATE CASCADE ON DELETE CASCADE;

-- user_products may also reference slug
ALTER TABLE user_products
  DROP CONSTRAINT IF EXISTS user_products_product_slug_fkey;

ALTER TABLE user_products
  ADD CONSTRAINT user_products_product_slug_fkey
  FOREIGN KEY (product_slug) REFERENCES products(slug) ON UPDATE CASCADE ON DELETE CASCADE;
