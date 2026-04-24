# 类型安全最佳实践 (Type Safety Guidelines)

## 1. 类型驱动开发 (Type-Driven Development)
类型是系统架构的“契约”，必须先定义类型，后实现逻辑。

## 2. 边界防卫：运行时校验
*   **零信任入口**: 所有的外部数据（API 响应、Storage 读取、用户输入）必须经过 `Zod` Schema 校验。
*   **类型自动推导**: 严禁手写重复的 Interface。使用 `type Data = z.infer<typeof Schema>` 确保校验逻辑与类型定义合一。

## 3. 结果对象模式 (Result Pattern)
为了消除异步操作中的不确定性（尤其在移动端不稳定网络下），统一使用 `Result` 类型包装返回值：
```typescript
type Result<T, E = Error> = 
  | { ok: true; data: T; source: 'network' | 'cache' | 'local' } 
  | { ok: false; error: E };
```
*   此模式强制在 UI 层处理 `ok: false` 的情况，避免应用崩溃。

## 4. 存储层类型契约
```typescript
interface IStorageAdapter {
  /** 泛型查询，确保从不同存储引擎返回相同形状的数据 */
  query<T>(collection: string, query: QueryParams): Promise<Result<T[]>>;
  
  /** 认证模块抽象，屏蔽 Web Session 与 RN 原生 Auth 的差异 */
  auth: {
    getUser(): Promise<Result<User | null>>;
    login(credentials: Credentials): Promise<Result<User>>;
  };
}
```

## 5. 跨平台类型约束
*   **严禁 any**: 任何无法确定的类型必须声明为 `unknown` 并配合类型谓词（Type Predicates）使用。
*   **环境无关类型**: 避免使用 `HTMLElement`, `React.CSSProperties` 等 Web 特有类型。
*   **数值稳定性**: 时间戳统一使用数字 `number` (Timestamp)，避免 `Date` 对象在跨平台序列化时的时区偏差。

## 6. 设计令牌类型化 (Design Token Typing)
```typescript
type ColorToken = 'primary' | 'secondary' | 'background';
type SpacingToken = 'xs' | 'sm' | 'md' | 'lg';

// 样式系统通过映射这些字面量类型，实现 Web 与 RN 的样式统一
```

## 7. 类型检查清单
- [ ] 是否在 API 入口使用了 Zod 校验？
- [ ] 所有的异步 Function 是否返回了 `Promise<Result<T>>`？
- [ ] 实体定义是否放在了可以被 RN 引用的 `packages/types` 中？
- [ ] 是否存在未处理的 `unknown` 数据？
