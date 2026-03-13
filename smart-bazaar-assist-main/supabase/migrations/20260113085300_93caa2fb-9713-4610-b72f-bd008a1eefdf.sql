-- Customer Profiles table (extends auth.users for Magic Link auth)
CREATE TABLE public.customer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone_number TEXT,
  profile_completed BOOLEAN DEFAULT false,
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'blocked', 'guest')),
  membership_tier TEXT DEFAULT 'bronze' CHECK (membership_tier IN ('bronze', 'silver', 'gold')),
  custom_tags TEXT[] DEFAULT '{}',
  admin_notes TEXT,
  total_lifetime_value NUMERIC(10,2) DEFAULT 0,
  visit_count INTEGER DEFAULT 0,
  last_visit_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Billing History table
CREATE TABLE public.billing_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_profile_id UUID REFERENCES public.customer_profiles(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  bill_number TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  gst NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'digital',
  pdf_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

-- Customer Profiles RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.customer_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.customer_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Service role can insert profiles (for auto-creation)
CREATE POLICY "Service role can insert profiles"
ON public.customer_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Billing History RLS Policies
-- Users can view their own billing history
CREATE POLICY "Users can view their own bills"
ON public.billing_history
FOR SELECT
USING (
  customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR customer_profile_id IN (SELECT id FROM public.customer_profiles WHERE user_id = auth.uid())
);

-- Service role can insert bills
CREATE POLICY "Authenticated users can insert bills"
ON public.billing_history
FOR INSERT
WITH CHECK (
  customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customer_profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_customer_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for timestamp updates
CREATE TRIGGER update_customer_profiles_updated_at
BEFORE UPDATE ON public.customer_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_customer_profile_updated_at();

-- Enable realtime for billing updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.billing_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_profiles;