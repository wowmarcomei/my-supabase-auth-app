'use client';

import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [origin, setOrigin] = useState('');

  // 在客户端组件挂载后获取 origin
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // 监听身份验证状态变化
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // 登录成功后重定向到仪表板
        router.push('/dashboard');
      }
    });

    // 清理订阅
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">登录</h1>
        
        {origin && (
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={['github', 'google']}
            redirectTo={`${origin}/auth/callback`}
            onlyThirdPartyProviders={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: '邮箱',
                  password_label: '密码',
                  button_label: '登录',
                  loading_button_label: '登录中...',
                  social_provider_text: '使用{{provider}}登录',
                  link_text: '已有账号？登录',
                },
                sign_up: {
                  email_label: '邮箱',
                  password_label: '密码',
                  button_label: '注册',
                  loading_button_label: '注册中...',
                  social_provider_text: '使用{{provider}}注册',
                  link_text: '没有账号？注册',
                },
              },
            }}
          />
        )}
        
        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
