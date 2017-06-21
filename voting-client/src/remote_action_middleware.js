
export default socket => store => next => action => {
  if (action.meta && action.meta.remote) {
    action.clientId = store.getState().get('clientId');
    socket.emit('action', action);
  }
  return next(action);
}