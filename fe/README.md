# Front-end for Portfolio Manger

## How to run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
    npm run dev
    ```

## Use Guide

### Prompt for AI

`该项目基于 Vue3 + JavaScript + Shadcn-vue，使用 Tailwind CSS 进行样式设计, lucide-vue-next 作为图标库, ECharts 作为图表库`

### API requests

请使用`/lib/request.js`文件中的`api`函数来发送API请求，格式为：

```
api.get("<url>", {<data or params>})
  .then((res) => {
    // 处理成功响应
    console.log(res);
  })
  .catch((e) => {
    // 处理错误响应
    console.error(e);
  });
```

使用示例如下：

```javascript
import { api } from '@/lib/request.js';

api
  .post("/cash/deposit", {
    account_id: 3,
    type: 1,
    amount: topupAmount.value,
    description: "Top-up via Virtual Payment",
  })
  .then((res) => {
    // 处理成功响应
    accountStore.setBalance(res.current_balance);
    apiResult.value = true;
    processMessage.value = "Your deposit was successful!";
  })
  .catch((e) => {
    // 处理错误响应
    apiResult.value = false;
    processMessage.value =
      e?.message || "Deposit failed due to a network error.";
  })
  .finally(() => {
    // 无论成功或失败，都会执行此代码
    isLoading.value = false;
  });
```

