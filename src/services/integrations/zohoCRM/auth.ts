
import { supabase } from '@/integrations/supabase/client';

export interface ZohoAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
}

export interface ZohoTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export class ZohoAuth {
  private static instance: ZohoAuth;
  private authConfig: ZohoAuthConfig;

  static getInstance(): ZohoAuth {
    if (!ZohoAuth.instance) {
      ZohoAuth.instance = new ZohoAuth();
    }
    return ZohoAuth.instance;
  }

  constructor() {
    this.authConfig = {
      clientId: process.env.ZOHO_CLIENT_ID || '',
      clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
      redirectUri: `${window.location.origin}/integrations/zoho/callback`,
      scope: 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL'
    };
  }

  generateAuthUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.authConfig.clientId,
      scope: this.authConfig.scope,
      redirect_uri: this.authConfig.redirectUri,
      access_type: 'offline'
    });

    return `https://accounts.zoho.com/oauth/v2/auth?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string): Promise<ZohoTokens> {
    try {
      const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.authConfig.clientId,
          client_secret: this.authConfig.clientSecret,
          redirect_uri: this.authConfig.redirectUri,
          code: code
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Zoho OAuth error: ${data.error_description || data.error}`);
      }

      const tokens: ZohoTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + (data.expires_in * 1000)
      };

      await this.storeTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('Zoho token exchange failed:', error);
      throw error;
    }
  }

  async refreshAccessToken(): Promise<ZohoTokens> {
    try {
      const storedTokens = await this.getStoredTokens();
      if (!storedTokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.authConfig.clientId,
          client_secret: this.authConfig.clientSecret,
          refresh_token: storedTokens.refreshToken
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Zoho token refresh error: ${data.error_description || data.error}`);
      }

      const tokens: ZohoTokens = {
        accessToken: data.access_token,
        refreshToken: storedTokens.refreshToken, // Keep existing refresh token
        expiresAt: Date.now() + (data.expires_in * 1000)
      };

      await this.storeTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('Zoho token refresh failed:', error);
      throw error;
    }
  }

  async getValidAccessToken(): Promise<string> {
    try {
      const tokens = await this.getStoredTokens();
      
      if (!tokens) {
        throw new Error('No tokens found - authentication required');
      }

      // Check if token is expired (with 5 minute buffer)
      if (Date.now() >= (tokens.expiresAt - 300000)) {
        const refreshedTokens = await this.refreshAccessToken();
        return refreshedTokens.accessToken;
      }

      return tokens.accessToken;
    } catch (error) {
      console.error('Failed to get valid access token:', error);
      throw error;
    }
  }

  private async storeTokens(tokens: ZohoTokens): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await supabase
        .from('crm_integrations')
        .upsert({
          user_id: user.id,
          provider: 'zoho',
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
          expires_at: new Date(tokens.expiresAt).toISOString(),
          is_active: true
        });
    } catch (error) {
      console.error('Failed to store Zoho tokens:', error);
      throw error;
    }
  }

  private async getStoredTokens(): Promise<ZohoTokens | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'zoho')
        .eq('is_active', true)
        .single();

      if (error || !data) return null;

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(data.expires_at).getTime()
      };
    } catch (error) {
      console.error('Failed to get stored tokens:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const tokens = await this.getStoredTokens();
      return !!tokens;
    } catch {
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('crm_integrations')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('provider', 'zoho');
    } catch (error) {
      console.error('Failed to disconnect Zoho:', error);
      throw error;
    }
  }
}

export const zohoAuth = ZohoAuth.getInstance();
