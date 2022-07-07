import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider, connect } from 'react-redux'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import prefixNamespace from './prefixNamespace'
import createSagaMiddleware from 'redux-saga'
import * as sagaEffects from 'redux-saga/effects'
export { connect }

function dva() {
	const app = {
		model,
		_models: [],
		router,
		_router: null,
		start,
		getActionCreators
	}
	const initialReducers = {}

	function model(model) {
		const prefixModel = prefixNamespace(model)
		app._models.push(prefixModel) 
	}

	function router(router) {
		app._router = router
	}

	function getActionCreators() {
		let actionCreators = {}
		for (const model of app._models) {
			let { reducers, effects } = model
			// actionCreators.counter1 = {add: () => ({type: add})}
			let reducersActionCreators = Object.keys(reducers).reduce((memo, key) => {
				// key = counter1/add
				// memo.add = () => ({type: 'counter/add'})
				memo[key.split('/')[1]] = () => ({type: key})
				return memo
			}, {})
			let effectsActionCreators = Object.keys(effects).reduce((memo, key) => {
				memo[key.split('/')[1]] = () => ({type: key})
				return memo
			}, {})
			actionCreators[model.namespace] = {...reducersActionCreators, ...effectsActionCreators}
		}
		return actionCreators
	}
	
	function start(selector) {
		for (const model of app._models) {
			initialReducers[model.namespace] = getReducer(model)
		}
		
		const sagas = getSagas(app)
		const combineReducer = createReducer()
		const sagaMiddleware = createSagaMiddleware()
		// const store = createStore(combineReducer)
		const store = applyMiddleware(sagaMiddleware)(createStore)(combineReducer)
		sagas.forEach(saga => sagaMiddleware.run(saga))
		createRoot(document.querySelector(selector)).render(
			<Provider store={store}>
				{app._router()}
			</Provider>
		)

		function createReducer() {
			return combineReducers(initialReducers)
		}

		function getReducer(model) {
			let { reducers, state: initialState } = model
			let reducer = (state = initialState, action) => {
				// 用动作类型去匹配 reducer 函数，如果能匹配上，就用此 reducer 函数计算新的 state
				let reducer = reducers[action.type]
				if (reducer) {
					return reducer(state, action)
				}
				// 如果没有匹配上，就直接返回之前的 state
				return state
			}
			return reducer
		}
		
		function getSagas(app) {
			const sagas = []
			for(const model of app._models) {
				sagas.push(getSaga(model))
			}
			return sagas
		}
	}

	function getSaga(model) {
		const { effects } = model
		return function*() {
			for (const key in effects) {
				yield sagaEffects.takeEvery(key, function* (action) {
					yield effects[key](action, sagaEffects)
				})
			}
		}
	}
	
	return app
}

export default dva