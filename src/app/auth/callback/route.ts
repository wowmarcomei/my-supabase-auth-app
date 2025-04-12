import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // 使用 createRouteHandlerClient 时直接传递 cookies 函数，而不是调用它
  const supabase = createRouteHandlerClient({ cookies });
  
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 身份验证完成后重定向到仪表板
  return NextResponse.redirect(new URL('/dashboard', req.url));
}
