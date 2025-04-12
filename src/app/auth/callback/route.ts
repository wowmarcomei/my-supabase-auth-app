import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// 强制路由为动态路由
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (code) {
      // 创建响应对象
      const response = NextResponse.redirect(new URL('/dashboard', req.url));
      
      // 创建 Supabase 客户端
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // 使用授权码交换会话
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('交换会话时出错:', error);
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
      
      // 从 data 中提取会话信息
      const { session } = data;
      
      if (session) {
        // 设置会话 cookie
        const cookieOptions = {
          path: '/',
          maxAge: 60 * 60 * 24 * 365, // 1 年
          sameSite: 'lax' as const, // 使用类型断言
          secure: process.env.NODE_ENV === 'production',
        };
        
        // 设置主要的 Supabase 身份验证 cookie
        const cookiePrefix = 'sb-rxiqowwjimgmjipwmteh';
        response.cookies.set(`${cookiePrefix}-auth-token`, session.access_token, cookieOptions);
      }
      
      return response;
    }

    // 如果没有 code 参数，重定向到登录页面
    return NextResponse.redirect(new URL('/auth/login', req.url));
  } catch (error) {
    console.error('回调处理错误:', error);
    // 发生错误时重定向到登录页面
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}
