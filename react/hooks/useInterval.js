import {useEffect,useRef} from 'react';
/**
 * 定时器
 * @param {function} callback 回调函数
 * @param {number} time 时间
 */
export default function useInterval(callback, time = 300) {
    // 用于保存回调函数
    const intervalFn = useRef();
    useEffect(() => {
        // 初始化 回调
        intervalFn.current = callback;
    });
    useEffect(() => {
        const timer = setInterval(() => {
            intervalFn.current()
        }, time)
        return () => { clearInterval(timer) }
    }, [time]);
}