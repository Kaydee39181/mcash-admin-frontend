export const asyncActionName = basename => ({
    loading: `${basename}_LOADING`,
    failure: `${basename}_FAILING`,
    success: `${basename}_SUCCESS`
  });
  
  export const asyncActions = actionName => ({
    loading: bool => ({
      type: asyncActionName(actionName).loading,
      payload: bool
    }),
    success: payload => ({
      type: asyncActionName(actionName).success,
      payload
    }),
    failure: (bool, error) => ({
      type: asyncActionName(actionName).failure,
      payload: { error, status: bool }
    })
  });