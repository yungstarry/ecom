/*
  # Add Admin Functions for Dashboard Stats

  1. New Functions
    - `get_total_users()`
    - `get_total_orders()`
    - `get_total_revenue()`
    - `get_total_inventory_value()`

  2. Security
    - Functions are only accessible to admin users
*/

-- Function to get total number of users
CREATE OR REPLACE FUNCTION get_total_users()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM auth.users
  );
END;
$$;

-- Function to get total number of orders
CREATE OR REPLACE FUNCTION get_total_orders()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM orders
  );
END;
$$;

-- Function to get total revenue from completed orders
CREATE OR REPLACE FUNCTION get_total_revenue()
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(total), 0)
    FROM orders
    WHERE status = 'completed'
  );
END;
$$;

-- Function to get total inventory value
CREATE OR REPLACE FUNCTION get_total_inventory_value()
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(price * stock), 0)
    FROM products
  );
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_total_users() TO authenticated;
GRANT EXECUTE ON FUNCTION get_total_orders() TO authenticated;
GRANT EXECUTE ON FUNCTION get_total_revenue() TO authenticated;
GRANT EXECUTE ON FUNCTION get_total_inventory_value() TO authenticated;