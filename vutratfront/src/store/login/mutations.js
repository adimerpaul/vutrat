/*
export function someMutation (state) {
}
*/
export function auth_request(state){
  state.status = 'loading'
}
export function auth_success(state, data){
  state.status = 'success'
  state.token = data.token
  state.user = data.user
  // state.booluser=data.user.permisos.find(permiso=>permiso.id===1)!=undefined
  // state.boolregtramite=data.user.permisos.find(permiso=>permiso.id===2)!=undefined
  // state.direcciontrbutaria=data.user.permisos.find(permiso=>permiso.id==3)!=undefined
  // state.infraestructura=data.user.permisos.find(permiso=>permiso.id==4)!=undefined
  // state.seguridadciudadana=data.user.permisos.find(permiso=>permiso.id==5)!=undefined
  // state.medioambiente=data.user.permisos.find(permiso=>permiso.id==6)!=undefined
  // state.salubridad=data.user.permisos.find(permiso=>permiso.id==7)!=undefined
  // state.activiadeseconomicas=data.user.permisos.find(permiso=>permiso.id==8)!=undefined
  // state.consultartramite=data.user.permisos.find(permiso=>permiso.id==9)!=undefined
  // state.entregartramite=data.user.permisos.find(permiso=>permiso.id==10)!=undefined

}
export function   auth_error(state){
  state.status = 'error'
}
export function salir(state){
  state.status = ''
  state.token = ''
  state.user = ''
  // state.booluser=false
  // state.boolregtramite=false
  // state.direcciontrbutaria=false
  // state.infraestructura=false
  // state.seguridadciudadana=false
  // state.medioambiente=false
  // state.salubridad=false
  // state.activiadeseconomicas=false
  // state.consultartramite=false
  state.entregartramite=false
}
