import { NextResponse } from 'next/server';

// 强制路由为动态路由
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // 创建响应对象
    const response = NextResponse.redirect(
      new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    );
    
    // 使用响应对象的 cookies 来删除 Supabase 身份验证 cookie
    // 设置过期时间为过去的时间，实际上就是删除 cookie
    const options = {
      expires: new Date(0),
      path: '/',
    };
    
    // 删除主要的 Supabase 身份验证 cookie
    response.cookies.set('sb-rxiqowwjimgmjipwmteh-auth-token', '', options);
    response.cookies.set('sb-rxiqowwjimgmjipwmteh-auth-token.0', '', options);
    response.cookies.set('sb-rxiqowwjimgmjipwmteh-auth-token-code-verifier', '', options);
    response.cookies.set('sb-rxiqowwjimgmjipwmteh-auth-token-code-verifier.0', '', options);
    
    return response;
  } catch (error) {
    console.error('注销处理错误:', error);
    // 发生错误时仍然重定向到首页
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }
}
