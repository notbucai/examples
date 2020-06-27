/*
 * @Author: bucai
 * @Date: 2020-06-27 10:00:33
 * @LastEditors: bucai
 * @LastEditTime: 2020-06-27 10:04:35
 * @Description: 失败重试
 */
// 1.首先来个封装获取数据的 Promise方法
function getData () {
  let p = new Promise((resolve, reject) => {
    setTimeout(() => {
      // 定义一个随机数
      let num = Math.ceil(Math.random() * 20)
      // 小于这个随机数 那么就是成功 反之就是失败
      if (num <= 20) return resolve(num)
      if (num > 20) return reject('失败了 憨憨')
    }, 1000)
  })
  // 返回出去 p
  return p;
}

// 2.有失败重试功能的函数 reGetData()
function failureToRetry (getData, times, delay) {
  // 返回一个 Promise对象
  return new Promise((resolve, reject) => {
    // 定义重试函数
    function again () {
      getData().then(resolve).catch(err => {
        console.log(`还有 ${times} 次尝试`)
        if (times == 0) {
          reject(err)
        } else {
          times--
          setTimeout(again(), delay)
        }
      })
    }
    // 调用方法
    again();
  });
}

// 3.// 执行函数，五次重试，每隔一秒执行一次
failureToRetry(getData, 5, 1000);