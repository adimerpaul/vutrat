import Index from 'pages/Index'
import Login from "pages/Login";
import Tramite from "pages/Tramite";
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component:Index },
      { path: 'login', component:Login },
      { path: 'tramite', component:Tramite ,},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
