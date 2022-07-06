import React from 'react'
import dva, { connect } from 'dva'

const app = dva()
// 添加模型
app.model({
  namespace: 'counter1',
  state: {number: 0},
  reducers: {
    add(state) {
      return {number: state.number + 1}
    }
  }
})
app.model({
  namespace: 'counter2',
  state: {number: 0},
  reducers: {
    add(state) {
      return {number: state.number + 1}
    }
  }
})
function Counter1(props) {
  return (
    <div>
      <p>{props.number}</p>
      <button onClick={() => props.dispatch({type: 'counter1/add'})}>+</button>
    </div>
  )
}
const ConnectedCounter1 = connect(state => state.counter1)(Counter1)
function Counter2(props) {
  return (
    <div>
      <p>{props.number}</p>
      <button onClick={() => props.dispatch({type: 'counter2/add'})}>+</button>
    </div>
  )
}
const ConnectedCounter2 = connect(state => state.counter2)(Counter2)
app.router(() => <><ConnectedCounter1/><hr/><ConnectedCounter2/></>)
app.start("#root")