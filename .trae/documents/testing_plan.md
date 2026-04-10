# 项目测试计划

## 1. 测试目标

- 确保核心功能正常工作
- 验证代码生成功能的正确性
- 测试图层选择和切图功能
- 确保资产路径配置功能正常
- 提高代码质量和可靠性

## 2. 测试范围

### 2.1 后端服务测试

- **codeGeneratorService**：测试代码生成功能，包括 styled-components 和 tailwindcss 生成
- **psdService**：测试 PSD 文件解析功能
- **slicingService**：测试切图生成功能
- **API 路由**：测试各个 API 端点的响应

### 2.2 前端组件测试

- **LayerSelector**：测试图层树渲染和选择功能
- **CodeGenerator**：测试代码生成和资产路径配置
- **SlicingTool**：测试切图功能
- **FileUpload**：测试文件上传功能

### 2.3 集成测试

- 测试完整的 PSD 到代码的工作流程
- 测试资产路径配置的端到端功能

## 3. 测试工具和框架

- **Vitest**：用于前端组件和工具函数测试
- **Jest**：用于后端服务测试
- **Supertest**：用于 API 路由测试

## 4. 测试计划

### 4.1 后端服务测试

1. **创建测试文件结构**：
   - `api/services/__tests__/codeGeneratorService.test.ts`
   - `api/services/__tests__/psdService.test.ts`
   - `api/services/__tests__/slicingService.test.ts`
   - `api/routes/__tests__/generate.test.ts`
   - `api/routes/__tests__/slice.test.ts`

2. **codeGeneratorService 测试**：
   - 测试 generateStyledComponents 方法
   - 测试 generateTailwindCSS 方法
   - 测试 assetPath 参数的正确使用
   - 测试错误处理

3. **psdService 测试**：
   - 测试 PSD 文件解析功能
   - 测试图层提取功能
   - 测试错误处理

4. **slicingService 测试**：
   - 测试切图生成功能
   - 测试不同格式的切图生成
   - 测试错误处理

5. **API 路由测试**：
   - 测试 generate/code 端点
   - 测试 generate/layers 端点
   - 测试 slice/generate 端点

### 4.2 前端组件测试

1. **创建测试文件结构**：
   - `src/components/__tests__/LayerSelector.test.ts`
   - `src/components/__tests__/CodeGenerator.test.ts`
   - `src/components/__tests__/SlicingTool.test.ts`
   - `src/components/__tests__/FileUpload.test.ts`
   - `src/utils/__tests__/api.test.ts`

2. **LayerSelector 测试**：
   - 测试图层树渲染
   - 测试图层选择功能
   - 测试递归渲染

3. **CodeGenerator 测试**：
   - 测试代码生成功能
   - 测试资产路径配置
   - 测试框架选择

4. **SlicingTool 测试**：
   - 测试切图生成功能
   - 测试切图下载功能

5. **FileUpload 测试**：
   - 测试文件上传功能
   - 测试错误处理

6. **API 工具测试**：
   - 测试各个 API 函数的调用
   - 测试错误处理

### 4.3 集成测试

1. **创建测试文件**：
   - `tests/integration.test.ts`

2. **测试完整工作流程**：
   - 上传 PSD 文件
   - 选择图层
   - 配置资产路径
   - 生成代码
   - 验证生成的代码中包含正确的资产路径

## 5. 测试执行计划

1. **设置测试环境**：
   - 安装测试依赖
   - 配置测试环境

2. **编写单元测试**：
   - 后端服务测试
   - 前端组件测试

3. **运行测试**：
   - 运行所有测试
   - 分析测试结果
   - 修复测试失败的问题

4. **集成测试**：
   - 运行集成测试
   - 验证完整工作流程

5. **性能测试**：
   - 测试大型 PSD 文件的处理性能
   - 测试代码生成的性能

## 6. 预期结果

- 所有单元测试通过
- 所有集成测试通过
- 代码覆盖率达到 80% 以上
- 识别并修复潜在的问题

## 7. 风险和应对措施

### 7.1 风险

- **PSD 文件解析失败**：某些 PSD 文件可能无法正确解析
- **测试环境配置问题**：测试环境可能与生产环境不一致
- **性能测试资源限制**：大型 PSD 文件测试可能需要较多资源

### 7.2 应对措施

- 使用标准化的测试 PSD 文件
- 确保测试环境与生产环境配置一致
- 合理设置测试超时和资源限制

## 8. 测试完成标准

- 所有测试用例通过
- 代码覆盖率达到预期目标
- 识别的问题已修复
- 测试报告已生成

## 9. 后续维护

- 为新功能添加测试用例
- 定期运行测试以确保代码质量
- 更新测试用例以适应代码变更
