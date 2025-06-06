-- WhatsApp QR Auto-Validation Sessions Table
-- Tracks QR code sessions for automatic verification via webhook

CREATE TABLE IF NOT EXISTS whatsapp_qr_sessions (
  id SERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  qr_data TEXT NOT NULL,
  whatsapp_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_qr_sessions_session_id ON whatsapp_qr_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_qr_sessions_phone ON whatsapp_qr_sessions(phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_qr_sessions_status ON whatsapp_qr_sessions(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_qr_sessions_expires_at ON whatsapp_qr_sessions(expires_at);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_whatsapp_qr_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_whatsapp_qr_sessions_updated_at
  BEFORE UPDATE ON whatsapp_qr_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_whatsapp_qr_sessions_updated_at();

-- RLS (Row Level Security) policies
ALTER TABLE whatsapp_qr_sessions ENABLE ROW LEVEL SECURITY;

-- Policy for service role (full access)
CREATE POLICY "Service role can manage all QR sessions" ON whatsapp_qr_sessions
  FOR ALL TO service_role USING (true);

-- Policy for authenticated users (can only see their own sessions)
CREATE POLICY "Users can view their own QR sessions" ON whatsapp_qr_sessions
  FOR SELECT TO authenticated USING (phone = current_setting('app.current_user_phone', true));

-- Clean up expired sessions (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_qr_sessions()
RETURNS void AS $$
BEGIN
  UPDATE whatsapp_qr_sessions 
  SET status = 'expired' 
  WHERE status = 'pending' 
    AND expires_at < NOW();
  
  -- Optionally delete old expired sessions (older than 24 hours)
  DELETE FROM whatsapp_qr_sessions 
  WHERE status = 'expired' 
    AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE whatsapp_qr_sessions IS 'Tracks WhatsApp QR code auto-validation sessions';
COMMENT ON COLUMN whatsapp_qr_sessions.session_id IS 'Unique session identifier for QR validation';
COMMENT ON COLUMN whatsapp_qr_sessions.phone IS 'Phone number being verified';
COMMENT ON COLUMN whatsapp_qr_sessions.verification_code IS 'Generated verification code';
COMMENT ON COLUMN whatsapp_qr_sessions.qr_data IS 'JSON data for QR code generation';
COMMENT ON COLUMN whatsapp_qr_sessions.whatsapp_url IS 'WhatsApp URL with pre-filled message';
COMMENT ON COLUMN whatsapp_qr_sessions.status IS 'Current status: pending, verified, or expired'; 