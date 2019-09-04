const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  usersInfo: state => state.user.usersInfo,
  funcInfos: state => state.func.funcInfos,
  identityInfos: state => state.identity.identityInfos,
  routes: state => state.settings.routes,
}
export default getters
