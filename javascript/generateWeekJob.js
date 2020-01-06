/**
 * 周次生成
 * @param {Array} weekList 周
 * @description generateWeekJob([1,2,3,4,5,6,7]) return 周一至周日
 */
function generateWeekJob(weekList = []) {
    const date = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    const selectListMap = {};

    weekList.forEach(item=>{
        selectListMap[item-1] = true;
    });

    // 得到列表 再排序
    const selectListTrue = Object.keys(selectListMap).filter(key => selectListMap[key]).map(item => parseInt(item, 10)).sort((a, b) => a - b);

    // 尾部增加一个
    selectListTrue.length && selectListTrue.push(selectListTrue[selectListTrue.length - 1]);
    // console.log(selectListTrue)
    // 结果储存
    const continuouslist = [];
    //  在计算得到 连续天数
    // 单个连续储存
    let itemcontinuous = '';

    selectListTrue.forEach((key, index) => {
        // 如果为空则表示刚开始
        if (!itemcontinuous) {
            itemcontinuous = date[key];
        } else {
            // 判断是否连续
            // 连续就直接进入下一个 
            // 不连续直接赋值
            // console.log(key, selectListTrue[index - 1], index)
            const endlen = index + 1 === selectListTrue.length;

            if (Math.abs(key - selectListTrue[index - 1]) !== 1 || endlen) {
                // 判断是否是最后一个
                const end = endlen ? date[key] : date[selectListTrue[index - 1]];
                continuouslist.push({
                    begin: itemcontinuous,
                    end,
                });
                itemcontinuous = date[key];
            }
        }
    });
    return {
        list: continuouslist,
        week: [...new Set(selectListTrue.map(item => item + 1))],
    }
}

const weeklist = generateWeekJob([1,2,4,5,7]);
/*
return 
{
  list: [
    { begin: '周一', end: '周二' },
    { begin: '周四', end: '周五' },
    { begin: '周日', end: '周日' }
  ],
  week: [ 1, 2, 4, 5, 7 ]
}
 */

const showweek = weeklist.list.map(item=>{
    const {begin,end} = item;
    if(begin===end){
        return end;
    }else {
        return [begin,end].join('至');
    }
}).join('、');


console.log(showweek)