import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 刷新会话，如果存在的话
  await supabase.auth.getSession();

  return res;
}

// 指定哪些路径应该运行此中间件
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
