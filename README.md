# ✦ Mystic AI — Fortune Reading

把国内AI看相的模式搬到全球市场。上传照片 → AI解读手相/面相/气场 → $2.99/次。

## 你需要做的（总共3步，5分钟）

### 1. 注册 Gumroad
- 打开 https://gumroad.com/ 注册（只需要邮箱）
- 创建产品：价格设 $2.99，类型选 "Digital Product"
- 在产品设置中，把 "Redirect URL" 设为你的网站地址加上 `?paid=true`（部署后才有）
- 拿到产品链接（如 https://gumroad.com/l/xxxxx）

### 2. 注册 Vercel（免费部署）
- 打开 https://vercel.com/ 用GitHub登录
- 导入本项目 → 部署

### 3. 配置环境变量
在Vercel项目设置 → Environment Variables 添加：
- `GLM_API_KEY` ← 你的智谱AI API Key（https://open.bigmodel.cn/ 免费获取）

### 4. 设置Gumroad跳转（重要！）
回到Gumroad产品编辑页 → 找到 **"Redirect URL"** → 填入：
```
https://mystic-ai-fortune.vercel.app/?paid=true
```
（等部署完Vercel后再把域名改对，暂时先用这个占位）

Gumroad链接已填好：`https://leonpique.gumroad.com/l/MysticAI`

### 完成后
- ✅ 网站自动上线
- ✅ 全球用户自助使用
- ✅ 支付走Gumroad，钱到你的账户
- ✅ 零维护

## 产品逻辑
用户上传照片 → 选择手相/面相/气场 → 填名字 → 付$2.99 → AI解读命运 → 自动出报告

## 收益模型
- $2.99/次（≈ 21 RMB）
- 目标10,000 RMB ≈ 476单/月 ≈ 16单/天
- 通过社交媒体（TikTok/Reddit/Twitter）推广

## 技术栈
- 前端：纯HTML/CSS/JS（零依赖）
- 后端：Vercel Serverless Functions
- AI：智谱 GLM-4V-Flash（视觉分析+文本生成）
- 支付：Gumroad
