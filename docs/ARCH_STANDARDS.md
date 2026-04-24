# 技术架构与零硬编码规范 (Architecture & Decoupling Standards)

## 1. 核心分层架构：动作契约化
系统不再区分传统的 Hooks 和 Services，而是统一抽象为 **API 层 (Action Layer)**。UI 仅通过契约调用动作，不关心是本地执行还是远程执行。

### 1.1 分层职责
*   **表现层 (React/RN UI)**: 纯视图。通过统一的 API 客户端发起动作，接收 `Result` 对象。
*   **API 层 (Actions/Procedures)**: 【契约中心】定义所有可执行的操作（如 `getUser`, `updateHealthLog`）。
    *   **tRPC 实现**: 用于 Web/PWA，提供端到端类型安全的远程调用，直接连接 Cloudflare Workers。
    *   **HTTP/REST 实现**: 用于兼容性场景或第三方集成。
    *   **Local 实现**: 用于 React Native 或 PWA 离线模式，直接在本地运行业务逻辑。
*   **持久层 (Storage Adapters)**: 【存储契约】API 层不直接操作数据库，而是调用 `StorageAdapter` 实现增删改查。

## 2. 存储适配器模式 (Storage Adapter Pattern)
为了支持从 Supabase 到 Cloudflare D1 的无缝迁移，存储层必须契约化：
*   **实现类**: `SupabaseAdapter`, `D1Adapter`, `SqliteAdapter` (RN/Local)。
*   **原则**: 业务逻辑仅通过 `IStorageAdapter` 接口操作数据，屏蔽具体厂商 SDK。

## 3. 渲染与入口点：代理桥接模式 (Proxy Bridge Pattern)
为了兼容 AI Studio 等开发工具对标准 React SPA 结构的识别要求，同时保留 Monorepo 的灵活性，我们采用了代理桥接模式：
*   **根目录代理 (`/src/`)**: 映射到具体的应用子目录（如 `apps/web/src`）。
*   **统一解析 (`vite.config.ts`)**: 在根级 Vite 配置中处理跨包别名解析。
*   **双重入口**: 根目录 `index.html` 用于预览/开发工具，`apps/web/server.ts` 负责生产环境的 SSR/静态托管。

## 4. 零硬编码准则 (Zero Hardcoding Policy)
*   **配置化**: 所有的 API Endpoint、存储提供商标识、功能开关必须存储在 `packages/core/src/config.ts` 中。
*   **设计令牌 (Design Tokens)**: 样式必须使用 Token（如 `theme.spacing.md`），以便 Web (Tailwind) 与 RN (StyleSheet) 共享一套视觉逻辑。
*   **文案国际化**: 严禁在 UI 中硬编码文本，必须通过 `packages/core/src/i18n` 引用。

## 5. 环境加固与 Polyfill 隔离 (Environment Hardening)
在特定的预览环境（如 AI Studio iframe）中，全局对象的部分属性（如 `window.fetch`）具有受限的访问权限（getter-only）。
*   **全局拦截**：在 `index.html` 顶部注入保护脚本，拦截对 `window.fetch` 的非法赋值操作。
*   **模块别名**：在 Vite 配置中将 `node-fetch` 软链接至 `native-fetch.ts`，强制客户端使用浏览器原生实现。

---

## 6. RN 迁移就绪清单
- [ ] API 层是否实现了双端适配（tRPC 远程 / Local 运行）？
- [ ] 所有的样式是否基于 Token 抽象，而非硬编码 CSS？
- [ ] 是否存在逻辑层直接引用 `window` 或 `localStorage` 的情况？
