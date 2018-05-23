
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { name: 'home', path: '/', component: () => import('components/Home'), meta: {auth: true} },
      { name: 'addbook', path: '/addbook/:isbn?', component: () => import('components/AddBook'), meta: {auth: true} },
      { name: 'author', path: '/authors/:id', component: () => import('components/Author'), meta: {auth: true} },
      { name: 'authors', path: '/authors', component: () => import('components/Authors'), meta: {auth: true} },
      { name: 'book', path: '/books/:id', component: () => import('components/Book'), meta: {auth: true} },
      { name: 'books', path: '/books', component: () => import('components/Books'), meta: {auth: true} },
      { name: 'comments', path: '/comments', component: () => import('components/Comments'), meta: {auth: true} },
      { name: 'editauthor', path: '/editauthor/:id', component: () => import('components/EditAuthor'), meta: {auth: true} },
      { name: 'editbook', path: '/editbook/:id', component: () => import('components/EditBook'), meta: {auth: true} },
      { name: 'genre', path: '/genre/:tag', component: () => import('components/Genre'), meta: {auth: true} },
      { name: 'genres', path: '/genres', component: () => import('components/Genres'), meta: {auth: true} },
      { name: 'login', path: '/login', component: () => import('components/Login'), meta: {auth: false} },
      { name: 'logout', path: '/logout', component: () => import('components/Logout'), meta: {auth: true} },
      { name: 'scanner', path: '/scanner', component: () => import('components/Scanner'), meta: {auth: true} },
      { name: 'user', path: '/users/:id', component: () => import('components/User'), meta: {auth: true} },
      { name: 'users', path: '/users', component: () => import('components/Users'), meta: {auth: true} },
      { name: 'wishlist', path: '/wishlist', component: () => import('components/Wishlist'), meta: {auth: true} }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
