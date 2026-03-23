# AI Engineer Portfolio

一个用于展示 AI 工程项目的个人作品集网站，采用复古像素 + 终端风格视觉语言，面向招聘方、技术负责人和潜在合作方快速传达项目能力、工程思维和业务结果。

当前项目是一个基于 Vite 的 React 单页应用，包含首页项目矩阵、项目详情页和独立 Demo 页三类核心视图。

## 项目亮点

- 复古 pixel / terminal 风格界面，强调个人品牌辨识度
- 首页支持按不同视角筛选项目：算法、工程、产品、Founder / HR
- 项目详情页采用长文档叙事结构，适合展示系统设计、技术挑战和业务结果
- 提供独立 Demo 路由，便于后续接入真实演示环境
- 基于 TypeScript 和组件化结构，适合继续扩展项目内容和视觉表现

## 页面说明

### 1. Home

首页采用 Bento Grid 形式展示项目卡片，并提供多维筛选入口：

- `All Works`
- `Algorithm Lead`
- `Engineering Lead`
- `Product / Biz Lead`
- `Founder / HR`

适合在较短时间内让访客从不同角色视角理解你的能力覆盖范围。

### 2. Project Detail

详情页使用偏 Notion 风格的信息组织方式，重点呈现：

- TL;DR
- Why this matters
- System Design
- Technical Challenges
- Outcomes
- Reflection & Takeaways

这类结构非常适合 AI 项目叙事，既能写技术深度，也能写业务价值。

### 3. Demo

`/demo/:id` 当前为占位型演示容器，已经具备独立页面框架、悬浮操作菜单和后续接入真实交互 Demo 的 UI 外壳。

## 技术栈

- React 18
- TypeScript
- Vite
- React Router v7
- Tailwind CSS v4
- shadcn/ui + Radix UI
- Lucide React
- Motion

## 本地启动

### 环境要求

- Node.js 18+
- npm

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

默认会启动 Vite 本地开发服务器。

### 构建生产版本

```bash
npm run build
```

### 本地预览生产构建

```bash
npm run preview
```

## 生产部署（VPS）

服务以 systemd 托管，开机自启，崩溃自动重启。服务文件位于 `/etc/systemd/system/portfolio.service`。

```bash
# 查看状态
sudo systemctl status portfolio

# 实时日志
sudo journalctl -u portfolio -f

# 重启（修改配置后）
sudo systemctl restart portfolio

# 停止 / 启动
sudo systemctl stop portfolio
sudo systemctl start portfolio
```

> Vite dev server 监听 `0.0.0.0:443`，SSL 证书路径：`/etc/ssl/cloudflare/sunshifeng.{pem,key}`

## 路由设计

- `/`：首页
- `/project/:id`：项目详情页
- `/demo/:id`：独立 Demo 页面

其中 `/demo/:id` 不走主站 `Layout`，便于后续做更沉浸式的演示体验。

## 目录结构

```text
src/
  app/
    components/
      ui/                # shadcn/ui 组件
      Layout.tsx         # 全局布局
    data/
      projects.ts        # 项目数据定义
    pages/
      Home.tsx           # 首页
      ProjectDetail.tsx  # 项目详情页
      Demo.tsx           # Demo 页面
    App.tsx              # 应用入口
    routes.tsx           # 路由定义
  styles/
    index.css
    theme.css
    pixel.css            # 像素风视觉样式
  main.tsx
```

## 设计风格

项目整体采用以下设计语言：

- 像素网格背景
- CRT 扫描线覆盖层
- 粗边框 + 偏移阴影的像素按钮 / 卡片
- 高饱和品牌色块
- `font-mono` 与 `font-sans` 混合使用，兼顾终端气质和内容可读性

## 当前实现状态

这个仓库更接近一个“可展示、可继续演化”的前端作品集原型，目前已经具备清晰的展示骨架，但仍有一些待完善点：

- 项目数据存在多处定义，`Home`、`ProjectDetail`、`src/app/data/projects.ts` 尚未统一
- 某些项目 ID 命名不一致，例如首页里的 `rag-engine` 与数据文件中的 `rag-pipeline`
- Demo 页面目前是占位实现，还未接入真实业务交互
- 仓库中引入了较多 UI 组件依赖，但当前实际使用的只是其中一部分

如果下一步要继续打磨，优先建议：

1. 统一项目数据源
2. 为每个项目补充真实截图、架构图和外链
3. 将 Demo 页替换为真实可操作样例
4. 增加部署说明与线上访问地址

## 适合用途

这个项目适合用于：

- AI Engineer / Applied AI / AI Infra 岗位求职展示
- 面向创业团队或招聘经理的个人能力介绍页
- 作为个人品牌官网模板继续扩展
- 作为 AI 项目 Case Study 展示站点的前端基础模板

## License

当前仓库未声明许可证。如需开源分发，建议补充 `LICENSE` 文件并明确资产与文案使用范围。
