import React from 'react'
import dva, { connect } from './dva'

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
const { counter1, counter2 } = app.getActionCreators()
function Counter1({number, add}) {
  return (
    <div>
      <p>{number}</p>
      <button onClick={add}>+</button>
    </div>
  )
}
const ConnectedCounter1 = connect(state => state.counter1, counter1)(Counter1)
function Counter2({number, add}) {
  return (
    <div>
      <p>{number}</p>
      <button onClick={add}>+</button>
    </div>
  )
}
const ConnectedCounter2 = connect(state => state.counter2, counter2)(Counter2)
app.router(() => <><ConnectedCounter1/><hr/><ConnectedCounter2/></>)
app.start("#root")