-- Fix security definer functions by setting search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, wallet_balance)
  VALUES (new.id, new.email, new.email, 1000.00);
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_market()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.price_history (market_id, yes_price, no_price)
  VALUES (NEW.id, NEW.yes_price, NEW.no_price);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_market_price_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.yes_price <> OLD.yes_price OR NEW.no_price <> OLD.no_price THEN
    INSERT INTO public.price_history (market_id, yes_price, no_price)
    VALUES (NEW.id, NEW.yes_price, NEW.no_price);
  END IF;
  RETURN NEW;
END;
$$;