# React 相关的 示例

### [`封装常用的Hooks`](./hooks)

## React Hooks 实现 `简单Redux`
useReducer + useConext

```jsx
// ----  actions.js ----
const CHNAGE_ACTION = Symbol('CHNAGE_ACTION');

// ---- reducer.js ---- 
// initialState
const initialState = {
  token: '',
};
// 需要暴露出去 or 单独写
export const StoreContext = createContext({});
// reducer
const reducer = (state, action) => {
  const { type, payload } = action;
  const newState = Object.assign({}, state);
  switch (type) {
    case CHNAGE_ACTION:
      newState.token = payload;
      break;

    default:
      break;
  }
  return newState;
};
// 初始化函数 
const init = (state) => {
  state.token = 123;
  return state;
};

// Provider 组件
function RealizeRedux(props) {

  const [state, dispatch] = useReducer(reducer, initialState, init);
  return (
    <div>
      {/* 传递 */}
      <StoreContext.Provider value={{ state, dispatch }}>
        {props.children}
      </StoreContext.Provider>
    </div>
  );

}

// 使用 
// 子组件
function TestStore() {
  const { state, dispatch } = useContext(StoreContext);

  return (
    <div>
      <p>{state.token}</p>
      <button onClick={() => dispatch({ type: CHNAGE_ACTION, payload: 'changeTest' })}>change</button>
    </div>
  );
}

// 父组件
function App() {
  return (
    <div className="App">
      <RealizeRedux >
        {/* 组件使用状态 */} 
        <TestStore />
      </RealizeRedux>
    </div>
  );
}

```