-- Bookings table for storing all booking information
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    experience_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    responses JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL CHECK (status IN ('booked', 'confirmed', 'completed', 'cancelled')) DEFAULT 'booked',
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    booking_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    human_handoff_at TIMESTAMPTZ,
    artisan_id TEXT,
    -- Analytics fields
    booking_source TEXT DEFAULT 'cultural_match_assistant',
    user_agent TEXT,
    session_id TEXT,
    -- Extracted booking details for easy querying
    craft_type TEXT,
    group_size TEXT,
    preferred_date TEXT,
    preferred_time TEXT,
    special_requests TEXT
);

-- Booking analytics table for tracking events and metrics
CREATE TABLE IF NOT EXISTS public.booking_analytics (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_agent TEXT,
    session_id TEXT,
    booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE
);

-- Artisan notifications table for managing communication
CREATE TABLE IF NOT EXISTS public.artisan_notifications (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    artisan_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('new_booking', 'booking_update', 'cancellation', 'reminder')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    -- Communication channels
    phone_sent BOOLEAN DEFAULT FALSE,
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    push_sent BOOLEAN DEFAULT FALSE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_experience_id ON public.bookings(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_artisan_id ON public.bookings(artisan_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_craft_type ON public.bookings(craft_type);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_booking_analytics_event_type ON public.booking_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_booking_analytics_timestamp ON public.booking_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_artisan_notifications_artisan_id ON public.artisan_notifications(artisan_id);
CREATE INDEX IF NOT EXISTS idx_artisan_notifications_status ON public.artisan_notifications(status);

-- Create updated_at trigger for bookings table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for basic access (adjust based on your auth requirements)
CREATE POLICY "Allow all operations for demo" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Allow all operations for demo" ON public.booking_analytics FOR ALL USING (true);
CREATE POLICY "Allow all operations for demo" ON public.artisan_notifications FOR ALL USING (true);

-- Insert sample data for testing
INSERT INTO public.bookings (
    id, experience_id, user_id, responses, status, total_price, booking_date,
    artisan_id, craft_type, group_size, preferred_date, preferred_time
) VALUES 
    ('booking_sample_001', 'exp1', 'user_demo', '{"group_size": "Just me (1 person)", "experience_level": "Complete beginner"}', 'booked', 75.00, NOW() + INTERVAL '7 days', 'artisan_hassan_pottery', 'pottery', 'Just me (1 person)', 'Next Friday', 'Morning'),
    ('booking_sample_002', 'exp3', 'user_demo', '{"group_size": "2 people", "dietary_preferences": ["No restrictions"], "spice_level": "Medium spice"}', 'confirmed', 130.00, NOW() + INTERVAL '3 days', 'artisan_aicha_cooking', 'cooking', '2 people', 'This Wednesday', 'Afternoon')
ON CONFLICT (id) DO NOTHING;

-- Insert sample analytics events
INSERT INTO public.booking_analytics (
    id, event_type, event_data, booking_id
) VALUES 
    ('analytics_001', 'booking_completed', '{"craft_type": "pottery", "group_size": "Just me (1 person)", "total_price": 75}', 'booking_sample_001'),
    ('analytics_002', 'artisan_notification_created', '{"artisan_id": "artisan_hassan_pottery", "notification_type": "new_booking"}', 'booking_sample_001')
ON CONFLICT (id) DO NOTHING; 