# 原生js 相关的 示例

## `generateWeekJob.js` 连续天数生成
生成连续的周次  
一般可用于商店运营时间如`周一至周五` || `周一至周二、周三、周六周日`  

```JavaScript
console.log(generateWeekJob([1,2,4,5,7]));

// .log 

{
  list: [
    { begin: '周一', end: '周二' },
    { begin: '周四', end: '周五' },
    { begin: '周日', end: '周日' }
  ],
  week: [ 1, 2, 4, 5, 7 ]
}

// 例子
const showweek = weeklist.list.map(item=>{
  const {begin,end} = item;
  if(begin===end){
    return end;
  }
  return [begin,end].join('至');
}).join('、');
console.log(showweek);
// 周一至周二、周四至周五、周日
```

