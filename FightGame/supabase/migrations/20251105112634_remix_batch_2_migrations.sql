
-- Migration: 20251105110556

-- Migration: 20251105085926

-- Migration: 20251104190734
-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  wallet_address TEXT UNIQUE NOT NULL,
  wallet_type TEXT NOT NULL CHECK (wallet_type IN ('hashpack', 'metamask')),
  username TEXT,
  avatar_url TEXT,
  hedera_account_id TEXT,
  total_nfts INTEGER DEFAULT 0,
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create NFTs table for real NFT data
CREATE TABLE IF NOT EXISTS public.nfts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_address TEXT NOT NULL,
  token_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  rarity TEXT CHECK (rarity IN ('Common', 'Rare', 'Epic', 'Legendary')),
  price DECIMAL(10, 2),
  collection TEXT,
  minted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create game_sessions table for tracking game progress
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  score INTEGER NOT NULL,
  kills INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  nft_earned BOOLEAN DEFAULT FALSE,
  session_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leaderboard view
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT 
  p.wallet_address,
  p.username,
  p.avatar_url,
  COALESCE(SUM(gs.score), 0) as total_score,
  COALESCE(SUM(gs.kills), 0) as total_kills,
  COUNT(gs.id) as games_played,
  p.total_nfts,
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(gs.score), 0) DESC) as rank
FROM public.profiles p
LEFT JOIN public.game_sessions gs ON p.wallet_address = gs.wallet_address
GROUP BY p.wallet_address, p.username, p.avatar_url, p.total_nfts;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles (anyone can read, only owner can update)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- RLS Policies for NFTs (anyone can read, only owner can update)
CREATE POLICY "NFTs are viewable by everyone"
  ON public.nfts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert NFTs"
  ON public.nfts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners can update their NFTs"
  ON public.nfts FOR UPDATE
  USING (owner_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- RLS Policies for game_sessions
CREATE POLICY "Game sessions are viewable by everyone"
  ON public.game_sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert game sessions"
  ON public.game_sessions FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_wallet ON public.profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_nfts_owner ON public.nfts(owner_address);
CREATE INDEX IF NOT EXISTS idx_game_sessions_wallet ON public.game_sessions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_game_sessions_date ON public.game_sessions(session_date DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();



-- Migration: 20251105111038
-- Create blockchain transactions table
CREATE TABLE IF NOT EXISTS public.blockchain_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('mint', 'transfer', 'reward', 'update_score')),
  transaction_hash TEXT,
  hedera_tx_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  token_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blockchain_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.blockchain_transactions;
DROP POLICY IF EXISTS "Anyone can insert transactions" ON public.blockchain_transactions;
DROP POLICY IF EXISTS "Anyone can update transactions" ON public.blockchain_transactions;

-- Transactions are viewable by everyone for transparency
CREATE POLICY "Transactions are viewable by everyone" 
ON public.blockchain_transactions 
FOR SELECT 
USING (true);

-- Anyone can insert transactions
CREATE POLICY "Anyone can insert transactions" 
ON public.blockchain_transactions 
FOR INSERT 
WITH CHECK (true);

-- Anyone can update transactions
CREATE POLICY "Anyone can update transactions" 
ON public.blockchain_transactions 
FOR UPDATE 
USING (true);

-- Create NFT rewards table
CREATE TABLE IF NOT EXISTS public.nft_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  token_id TEXT NOT NULL,
  serial_number BIGINT,
  reward_type TEXT NOT NULL,
  metadata JSONB,
  transaction_id UUID REFERENCES public.blockchain_transactions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nft_rewards ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "NFT rewards are viewable by everyone" ON public.nft_rewards;
DROP POLICY IF EXISTS "System can insert NFT rewards" ON public.nft_rewards;

-- NFT rewards are viewable by everyone for leaderboard
CREATE POLICY "NFT rewards are viewable by everyone" 
ON public.nft_rewards 
FOR SELECT 
USING (true);

-- System can insert NFT rewards
CREATE POLICY "System can insert NFT rewards" 
ON public.nft_rewards 
FOR INSERT 
WITH CHECK (true);

-- Update game_sessions to link to profiles
ALTER TABLE public.game_sessions 
ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_profile_id ON public.blockchain_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_status ON public.blockchain_transactions(status);
CREATE INDEX IF NOT EXISTS idx_nft_rewards_profile_id ON public.nft_rewards(profile_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_profile_id ON public.game_sessions(profile_id);

-- Create trigger for automatic timestamp updates on blockchain_transactions
DROP TRIGGER IF EXISTS update_blockchain_transactions_updated_at ON public.blockchain_transactions;
CREATE TRIGGER update_blockchain_transactions_updated_at
BEFORE UPDATE ON public.blockchain_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for activity feed
ALTER PUBLICATION supabase_realtime ADD TABLE public.blockchain_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.nft_rewards;
