import { AuthService } from './auth.service';
import type { SocialLoginRequest } from '@/types/auth';

export class SocialAuthService {
  private static instance: SocialAuthService;
  private authService: AuthService;

  private constructor() {
    this.authService = AuthService.getInstance();
  }

  public static getInstance(): SocialAuthService {
    if (!SocialAuthService.instance) {
      SocialAuthService.instance = new SocialAuthService();
    }
    return SocialAuthService.instance;
  }

  public async loginWithGoogle(googleToken: string): Promise<void> {
    const socialLoginRequest: SocialLoginRequest = {
      accessToken: googleToken,
      provider: 'GOOGLE'
    };
    await this.authService.socialLogin(socialLoginRequest);
  }

  public async loginWithFacebook(facebookToken: string): Promise<void> {
    const socialLoginRequest: SocialLoginRequest = {
      accessToken: facebookToken,
      provider: 'FACEBOOK'
    };
    await this.authService.socialLogin(socialLoginRequest);
  }
} 