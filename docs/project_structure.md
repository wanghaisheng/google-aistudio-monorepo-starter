# Project Package Structure Specification

本系统采用 Monorepo 架构，实现了站点无关的业务逻辑分层（core/）、站点感知的 API 处理（api/）、独立的服务单元（auth/, video-service/）及共享的 UI 与类型定义。

## 目录结构概览

```text
/
├── apps/
│   └── web/            # 主要 Web 应用项目 (Express + Vite)
├── packages/
│   ├── ui/             # 通用 UI 组件 (React)
│   ├── core/           # 核心业务逻辑 (i18n, Analytics, Config)
│   ├── api/            # 业务 API 服务
│   ├── shared/         # 跨端共享逻辑
│   └── types/          # 共享 TypeScript 类型定义
├── src/                # 根目录代理层 (桥接至 apps/web/src)
│   ├── main.tsx        # 代理入口，指向 apps/web/src/main.tsx
│   ├── App.tsx         # 代理入口，指向 apps/web/src/App.tsx
│   └── index.css       # 代理入口，指向 apps/web/src/index.css
├── index.html          # 根级 HTML 模板，供开发/预览环境直接使用
├── vite.config.ts      # 根级 Vite 配置，管理多包 Alias 与构建
├── package.json        # 根级依赖管理与 Turbo 任务配置
└── ...
```

---

## 模块详细说明

### 0. 根目录代理层 (`/src/`, `/index.html`, `/vite.config.ts`)
*   **职责**：为了确保开发预览工具 (如 AI Studio) 能够顺畅识别 React SPA 结构，我们在根目录建立了代理层。
*   **实现**：
    *   `src/` 下的文件作为“伪根目录”，仅包含指向 `apps/web/src/` 的导入。
    *   `index.html` 包含了环境加固脚本，防止第三方 polyfill (如 `formdata-polyfill`) 在 `window.fetch` 受限的环境中尝试非法修改。
    *   `vite.config.ts` 配置了跨包路径别名，并将 `node-fetch` 重定向至原生的 `native-fetch` 适配器。

### 1. `packages/ui/` - 通用 UI 组件库
*   **职责**：封装按钮、表单、视频播放器、定价卡片等高复用组件。
*   **技术栈**：支持 React。
*   **核心设计**：
    *   组件应完全解耦，不依赖特定站点逻辑。
    *   **外观差异化**：通过 `props` 接收站点配置（如主题色、Logo），实现多站点定制。

### 2. `packages/core/` - 核心业务逻辑层
此包专注于业务规则，不感知运行平台。
*   `i18n/`：多语言国际化支持。
*   `AnalyticsService.ts`：抽象的分析服务入口。
*   `config.ts`：应用运行时配置管理。
*   **准则**：所有函数必须通过参数或环境变量获取配置，严禁硬编码。

### 3. `packages/api/` - 业务 API 中心
*   **核心设计**：处理与后端的交互逻辑。
*   **依赖**：通过 `@core` 访问业务配置与逻辑。

### 4. `packages/auth/` - 独立认证中心
*   **职责**：作为一个独立部署的 Hono Worker。
*   **功能**：处理用户的注册、登录、Token 刷新。
*   **实现**：调用 `@repo/core` 中的密码工具及 `auth-db` 客户端。
*   **输出**：登录后颁发含有 `user_id`, `site_id`, `role` 的 JWT。

### 5. `packages/video-service/` - 异步服务 Worker
*   **职责**：处理长时异步任务。
*   **工作流**：
    1.  消费队列消息。
    2.  调用第三方 API (如 Kling) 创建视频任务。
    3.  轮询或通过 Webhook 处理任务状态更新。
*   **配置**：从数据库读取站点特定的 API 配置（如 API Key 映射），密钥存储在环境变量中。

### 6. `packages/types/` - 共享类型定义
*   **内容**：存放 `Site`, `User`, `VideoTask` 等全局通用型 TS 定义。
*   **准则**：供本 Monorepo 内的其他所有包直接引用。

### 7. `packages/config/` - 基础构建配置
*   **内容**：共享的 ESLint 规则、Prettier 格式化规范、基础 tsconfig 等配置。
*   **使用方式**：其他模块通过 `extends` 引用中心化配置，确保代码风格统一。
