import { SocialAuthService } from '@/services/social-auth.service';
import { ref } from 'vue';

export function useSocialAuth() {
  const socialAuthService = SocialAuthService.getInstance();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loginWithGoogle = async (googleToken: string) => {
    loading.value = true;
    error.value = null;
    try {
      await socialAuthService.loginWithGoogle(googleToken);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Đăng nhập bằng Google thất bại';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const loginWithFacebook = async (facebookToken: string) => {
    loading.value = true;
    error.value = null;
    try {
      await socialAuthService.loginWithFacebook(facebookToken);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Đăng nhập bằng Facebook thất bại';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loginWithGoogle,
    loginWithFacebook,
    loading,
    error
  };
} 