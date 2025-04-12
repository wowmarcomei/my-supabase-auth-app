'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 定义异步函数来获取用户信息
    const fetchUserData = async () => {
      try {
        // 刷新会话
        const { data: { session } } = await supabase.auth.getSession();
        
        // 如果没有会话，重定向到登录页面
        if (!session) {
          console.log('没有会话，重定向到登录页面');
          router.push('/auth/login');
          return;
        }
        
        // 获取最新的用户信息
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('没有用户信息，重定向到登录页面');
          router.push('/auth/login');
          return;
        }
        
        console.log('当前登录用户:', user);
        setUser(user);
        setLoading(false);
      } catch (error) {
        console.error('获取用户信息时出错:', error);
        router.push('/auth/login');
      }
    };
    
    // 调用异步函数
    fetchUserData();
    
    // 监听身份验证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('身份验证状态变化:', event, session?.user?.id);
      
      if (session?.user) {
        setUser(session.user);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        router.push('/auth/login');
      }
    });
    
    // 清理订阅
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('退出登录时出错:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl">加载中...</p>
        </div>
      </div>
    );
  }

  // 确保用户存在
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl">未找到用户信息</p>
          <Link href="/auth/login" className="text-blue-500 hover:text-blue-700 mt-4 block">
            返回登录页面
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">用户仪表板</h1>
        
        <div className="mb-6">
          {user.email && (
            <p className="text-lg mb-2"><strong>邮箱:</strong> {user.email}</p>
          )}
          
          {user.app_metadata?.provider && (
            <p className="text-lg mb-2"><strong>登录方式:</strong> {user.app_metadata.provider}</p>
          )}
          
          {user.user_metadata?.avatar_url && (
            <div className="mb-4 flex justify-center">
              <img 
                src={user.user_metadata.avatar_url} 
                alt="用户头像" 
                className="w-20 h-20 rounded-full"
              />
            </div>
          )}
          
          {user.user_metadata?.full_name && (
            <p className="text-lg mb-2"><strong>姓名:</strong> {user.user_metadata.full_name}</p>
          )}
          
          {user.user_metadata?.name && (
            <p className="text-lg mb-2"><strong>姓名:</strong> {user.user_metadata.name}</p>
          )}
          
          {user.user_metadata?.user_name && (
            <p className="text-lg mb-2"><strong>用户名:</strong> {user.user_metadata.user_name}</p>
          )}
          
          <p className="text-lg mb-2"><strong>用户ID:</strong> {user.id}</p>
          
          {user.last_sign_in_at && (
            <p className="text-lg mb-2"><strong>最后登录:</strong> {new Date(user.last_sign_in_at).toLocaleString()}</p>
          )}
          
          <p className="text-lg mb-2"><strong>邮箱已验证:</strong> {user.email_confirmed_at ? '是' : '否'}</p>
          
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="font-semibold mb-2">用户元数据:</p>
            <pre className="text-xs overflow-auto max-h-40">
              {JSON.stringify(user.user_metadata, null, 2)}
            </pre>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleSignOut}
            className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            退出登录
          </button>
          
          <Link href="/" className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
