# 存储适配器规范：SqljsAdapter 演进 (SqljsAdapter Evolution)

## 1. 原理与背景
SqljsAdapter 作为本地开发与离线沙盒的核心适配器，承载了 WASM 环境下的 SQL 引擎运行。其稳定性直接影响应用的离线可用性。

## 2. 核心改进策略

### 2.1 多 CDN 冗余加载 (Multi-CDN Redundancy)
为应对网络波动、地域限制及潜在的 CDN MIME 类型配置错误，`SqljsAdapter` 废弃了单一来源加载策略。

*   **策略**: 按优先级顺序链式请求。
*   **顺序**:
    1.  `Unpkg`
    2.  `jsDelivr`
    3.  `Cloudflare (cdnjs)`
*   **行为**: 当触发 `Failed to fetch` 或其他加载错误时，系统自动捕捉异常并触发下一个 CDN 的请求，直至成功。

### 2.2 版本对齐 (Version Alignment)
*   **变更**: CDN 引用从 `1.12.0` 升级至 `1.14.1`。
*   **必要性**: 确保 CDN 加载的 JavaScript 逻辑与应用本地 `package.json` 中配置的 `sql.js` 环境完全一致，杜绝因 WASM 二进制格式或 API 签名版本不匹配导致的问题。

### 2.3 初始化韧性 (Initialization Resilience)
优化了 `initPromise` 的重试机制：
*   如果所有 CDN 均加载失败，将当前的 `initPromise` 状态重置。
*   允许应用在用户下一次触发业务逻辑（如进入“发现页”或执行 SQL 动作）时重新发起初始化请求，解决了旧版本卡死在错误状态的问题。
