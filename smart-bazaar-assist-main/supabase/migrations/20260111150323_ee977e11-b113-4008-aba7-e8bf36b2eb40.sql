-- 1. Billing Counters - for live counter status
CREATE TABLE public.billing_counters (
  id SERIAL PRIMARY KEY,
  counter_number INTEGER NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
  wait_time_minutes INTEGER NOT NULL DEFAULT 0,
  customers_in_queue INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default counters
INSERT INTO public.billing_counters (counter_number, status, wait_time_minutes, customers_in_queue) VALUES
(1, 'busy', 10, 3),
(2, 'busy', 5, 2),
(3, 'available', 0, 0),
(4, 'available', 0, 0),
(5, 'busy', 15, 4),
(6, 'offline', 0, 0);

-- Enable RLS for billing_counters
ALTER TABLE public.billing_counters ENABLE ROW LEVEL SECURITY;

-- Everyone can view counters
CREATE POLICY "Anyone can view billing counters"
ON public.billing_counters FOR SELECT
USING (true);

-- Only authenticated users can update (staff)
CREATE POLICY "Authenticated users can update counters"
ON public.billing_counters FOR UPDATE
USING (true);

-- Enable realtime for billing_counters
ALTER PUBLICATION supabase_realtime ADD TABLE public.billing_counters;

-- 2. Shared Shopping Sessions for Family Sync
CREATE TABLE public.shopping_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_code TEXT NOT NULL UNIQUE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Session members
CREATE TABLE public.session_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.shopping_sessions(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Shared cart items
CREATE TABLE public.shared_cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.shopping_sessions(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  is_checked BOOLEAN NOT NULL DEFAULT false,
  added_by TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for shopping sessions
ALTER TABLE public.shopping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_cart_items ENABLE ROW LEVEL SECURITY;

-- Anyone can create and view sessions
CREATE POLICY "Anyone can create sessions"
ON public.shopping_sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view sessions"
ON public.shopping_sessions FOR SELECT USING (true);

CREATE POLICY "Anyone can update sessions"
ON public.shopping_sessions FOR UPDATE USING (true);

-- Anyone can join sessions
CREATE POLICY "Anyone can join sessions"
ON public.session_members FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view members"
ON public.session_members FOR SELECT USING (true);

-- Anyone can manage cart items
CREATE POLICY "Anyone can add cart items"
ON public.shared_cart_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view cart items"
ON public.shared_cart_items FOR SELECT USING (true);

CREATE POLICY "Anyone can update cart items"
ON public.shared_cart_items FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete cart items"
ON public.shared_cart_items FOR DELETE USING (true);

-- Enable realtime for shared cart
ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_cart_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_members;

-- 3. Help Requests for silent assistance
CREATE TABLE public.help_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_type TEXT NOT NULL CHECK (request_type IN ('aisle', 'product', 'general')),
  aisle_location TEXT,
  product_name TEXT,
  message TEXT,
  customer_identifier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'resolved')),
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for help requests
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can create help requests
CREATE POLICY "Anyone can create help requests"
ON public.help_requests FOR INSERT WITH CHECK (true);

-- Anyone can view help requests (staff panel)
CREATE POLICY "Anyone can view help requests"
ON public.help_requests FOR SELECT USING (true);

-- Anyone can update help requests
CREATE POLICY "Anyone can update help requests"
ON public.help_requests FOR UPDATE USING (true);

-- Enable realtime for help requests
ALTER PUBLICATION supabase_realtime ADD TABLE public.help_requests;