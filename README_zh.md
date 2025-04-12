# 基于 Next.js 的 Supabase 身份验证演示

这是一个使用 [Next.js](https://nextjs.org/) 和 [Supabase](https://supabase.com/) 实现的身份验证演示项目，包括电子邮件/密码、GitHub 和 Google 登录方式。

## 开始使用

首先，克隆仓库并安装依赖：

```bash
git clone https://github.com/wowmarcomei/my-supabase-auth-app.git
cd my-supabase-auth-app
npm install
```

然后，在根目录创建一个 `.env.local` 文件，包含以下变量：

```
NEXT_PUBLIC_SUPABASE_URL=你的-supabase-项目-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的-supabase-匿名-密钥
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

你可以从 Supabase 项目设置中获取这些值。

接下来，运行开发服务器：

```bash
npm run dev
```

使用浏览器打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 设置 Supabase 身份验证

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/) 并注册或登录
2. 创建一个新项目
3. 项目创建完成后，进入项目设置并复制 URL 和匿名密钥到你的 `.env.local` 文件中

### 2. 配置身份验证提供商

#### 电子邮件/密码身份验证

1. 在 Supabase 仪表板中，进入 Authentication > Settings
2. 确保 "Email" 提供商已启用

#### GitHub 身份验证

1. 访问 [GitHub 开发者设置](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写以下详细信息：
   - Application name: 你的应用名称
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `https://你的-supabase-项目.supabase.co/auth/v1/callback`
4. 注册应用程序并复制 Client ID
5. 生成一个新的 Client Secret 并复制它
6. 在 Supabase 仪表板中，进入 Authentication > Providers > Github
7. 启用 GitHub 提供商并粘贴 Client ID 和 Client Secret
8. 保存更改

#### Google 身份验证

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建一个新项目或选择现有项目
3. 进入 "APIs & Services" > "Credentials"
4. 点击 "Create Credentials" 并选择 "OAuth client ID"
5. 对于应用类型，选择 "Web application"
7. 添加 `https://你的-supabase-项目.supabase.co/auth/v1/callback` 作为授权重定向 URI
8. 创建客户端并复制 Client ID 和 Client Secret
9. 在 Supabase 仪表板中，进入 Authentication > Providers
10. 启用 Google 提供商并粘贴 Client ID 和 Client Secret
11. 保存更改

## 项目结构

- `src/app`: 使用 Next.js App Router 的主要应用代码
- `src/app/page.tsx`: 首页
- `src/app/dashboard/page.tsx`: 仪表板页面（受保护路由）
- `src/app/auth/login/page.tsx`: 登录页面
- `src/app/auth/callback/route.ts`: 身份验证回调处理程序
- `src/app/auth/logout/route.ts`: 注销处理程序
- `src/lib/supabase.ts`: 用于客户端操作的 Supabase 客户端
- `src/lib/supabase-server.ts`: 用于服务器端操作的 Supabase 客户端
- `src/middleware.ts`: 用于身份验证的 Next.js 中间件

## 功能特性

- 电子邮件/密码身份验证
- 使用 GitHub 和 Google 的社交登录
- 受保护路由
- 用户资料显示
- 会话管理

## 了解更多

要了解更多关于 Next.js 和 Supabase 的信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 功能和 API。
- [Supabase 文档](https://supabase.com/docs) - 了解 Supabase 功能。
- [Next.js 的 Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) - 了解 Supabase Auth Helpers。

## 在 Vercel 上部署

部署 Next.js 应用的最简单方法是使用 Next.js 创建者提供的 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)。

在部署到 Vercel 时，确保在 Vercel 项目设置中添加环境变量。

## 许可证

本项目是开源的，根据 [MIT 许可证](LICENSE) 提供。
