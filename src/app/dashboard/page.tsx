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
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }
      
      setUser(user);
      setLoading(false);
    }
    
    getUser();
  }, [router]);

  const handleSignOut = async () => {
    await fetch('/auth/logout', { method: 'POST' });
    router.push('/');
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">用户仪表板</h1>
        
        <div className="mb-6">
          <p className="text-lg mb-2"><strong>邮箱:</strong> {user.email}</p>
          <p className="text-lg mb-2"><strong>用户ID:</strong> {user.id}</p>
          <p className="text-lg mb-2"><strong>最后登录:</strong> {new Date(user.last_sign_in_at).toLocaleString()}</p>
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
