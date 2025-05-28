
import { supabase } from '@/integrations/supabase/client';

export interface ClickUpAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface ClickUpTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export class ClickUpAuth {
  private static instance: ClickUpAuth;
  private authConfig: ClickUpAuthConfig;

  static getInstance(): ClickUpAuth {
    if (!ClickUpAuth.instance) {
      ClickUpAuth.instance = new ClickUpAuth();
    }
    return ClickUpAuth.instance;
  }

  constructor() {
    this.authConfig = {
      clientId: '', // Will be configured via Supabase secrets
      clientSecret: '', // Will be configured via Supabase secrets
      redirectUri: `${window.location.origin}/integrations/clickup/callback`
    };
  }

  generateAuthUrl(): string {
    if (!this.authConfig.clientId) {
      throw new Error('ClickUp Client ID not configured. Please configure it in Supabase secrets.');
    }

    const params = new URLSearchParams({
      client_id: this.authConfig.clientId,
      redirect_uri: this.authConfig.redirectUri,
      response_type: 'code'
    });

    return `https://app.clickup.com/api?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string): Promise<ClickUpTokens> {
    try {
      if (!this.authConfig.clientId || !this.authConfig.clientSecret) {
        throw new Error('ClickUp credentials not configured. Please configure them in Supabase secrets.');
      }

      const response = await fetch('https://api.clickup.com/api/v2/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.authConfig.clientId,
          client_secret: this.authConfig.clientSecret,
          code: code
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`ClickUp OAuth error: ${data.error_description || data.error}`);
      }

      const tokens: ClickUpTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_in ? Date.now() + (data.expires_in * 1000) : undefined
      };

      await this.storeTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('ClickUp token exchange failed:', error);
      throw error;
    }
  }

  async setPersonalAccessToken(token: string): Promise<ClickUpTokens> {
    try {
      // Test the token by making a simple API call
      const testResponse = await fetch('https://api.clickup.com/api/v2/user', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!testResponse.ok) {
        throw new Error('Invalid ClickUp Personal Access Token');
      }

      const tokens: ClickUpTokens = {
        accessToken: token
      };

      await this.storeTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('ClickUp token validation failed:', error);
      throw error;
    }
  }

  async getValidAccessToken(): Promise<string> {
    try {
      const tokens = await this.getStoredTokens();
      
      if (!tokens) {
        throw new Error('No tokens found - authentication required');
      }

      // For personal access tokens, no refresh needed
      if (!tokens.expiresAt) {
        return tokens.accessToken;
      }

      // Check if token is expired (with 5 minute buffer)
      if (Date.now() >= (tokens.expiresAt - 300000)) {
        if (tokens.refreshToken) {
          const refreshedTokens = await this.refreshAccessToken();
          return refreshedTokens.accessToken;
        } else {
          throw new Error('Token expired and no refresh token available');
        }
      }

      return tokens.accessToken;
    } catch (error) {
      console.error('Failed to get valid access token:', error);
      throw error;
    }
  }

  private async refreshAccessToken(): Promise<ClickUpTokens> {
    try {
      const storedTokens = await this.getStoredTokens();
      if (!storedTokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      if (!this.authConfig.clientId || !this.authConfig.clientSecret) {
        throw new Error('ClickUp credentials not configured. Please configure them in Supabase secrets.');
      }

      const response = await fetch('https://api.clickup.com/api/v2/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.authConfig.clientId,
          client_secret: this.authConfig.clientSecret,
          refresh_token: storedTokens.refreshToken,
          grant_type: 'refresh_token'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`ClickUp token refresh error: ${data.error_description || data.error}`);
      }

      const tokens: ClickUpTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || storedTokens.refreshToken,
        expiresAt: data.expires_in ? Date.now() + (data.expires_in * 1000) : undefined
      };

      await this.storeTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('ClickUp token refresh failed:', error);
      throw error;
    }
  }

  // Load configuration from Supabase secrets
  async loadConfiguration(): Promise<void> {
    try {
      // In a real implementation, you would call a Supabase edge function
      // that securely retrieves the configuration from Supabase secrets
      // For now, we'll use placeholder values
      console.log('Loading ClickUp configuration from Supabase secrets...');
      
      // TODO: Implement actual configuration loading from Supabase secrets
      // This would typically involve calling an edge function that has access to secrets
    } catch (error) {
      console.error('Failed to load ClickUp configuration:', error);
    }
  }

  private async storeTokens(tokens: ClickUpTokens): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Use type assertion for the new table
      const { error } = await (supabase as any)
        .from('crm_integrations')
        .upsert({
          user_id: user.id,
          provider: 'clickup',
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
          expires_at: tokens.expiresAt ? new Date(tokens.expiresAt).toISOString() : null,
          is_active: true
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to store ClickUp tokens:', error);
      throw error;
    }
  }

  private async getStoredTokens(): Promise<ClickUpTokens | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Use type assertion for the new table
      const { data, error } = await (supabase as any)
        .from('crm_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'clickup')
        .eq('is_active', true)
        .single();

      if (error || !data) return null;

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at ? new Date(data.expires_at).getTime() : undefined
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

      // Use type assertion for the new table
      await (supabase as any)
        .from('crm_integrations')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('provider', 'clickup');
    } catch (error) {
      console.error('Failed to disconnect ClickUp:', error);
      throw error;
    }
  }
}

export const clickUpAuth = ClickUpAuth.getInstance();
