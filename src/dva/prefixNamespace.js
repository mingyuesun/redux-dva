
function prefix(obj, namespace) {
	return Object.keys(obj).reduce((memo, key) => {
		const newKey = `${namespace}/${key}`
		memo[newKey] = obj[key]
		return memo
	}, {})
}
function prefixNamespace(model) {
	if (model.reducers) {
		model.reducers = prefix(model.reducers, model.namespace)
	}
	return model
}

export default prefixNamespace