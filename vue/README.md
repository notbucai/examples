# Vuejs 相关的 示例

## 获取验证码倒计时

```
// 根据实际需求 修改`GetCode.vue` TODO 位置
// 导入并注册组件`GetCode.vue`

// 使用
<get-code @msg="onMsg" ></get-code>
// 可选 onMsg 函数接受get内部信息 [e]
{
  type, // info 和 error
  msg // 具体信息
}
```

## 自动加载全局组件库，不需要重复引用

> 查阅 [globalComponent.js](./globalComponent.js)