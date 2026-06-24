import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 不做任何处理，直接放行，完全不影响网站功能
  return NextResponse.next();
}

export const config = {
  // 匹配所有路径，强制Next.js生成中间件清单文件
  matcher: "/:path*",
};