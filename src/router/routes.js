
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { name: 'home', path: '/', component: () => import('components/Home') },
      { name: 'addbook', path: '/addbook', component: () => import('components/AddBook') },
      { name: 'author', path: '/authors/:id', component: () => import('components/Author') },
      { name: 'authors', path: '/authors', component: () => import('components/Authors') },
      { name: 'book', path: '/books/:id', component: () => import('components/Book') },
      { name: 'books', path: '/books', component: () => import('components/Books') },
      { name: 'editbook', path: '/editbook/:id', component: () => import('components/EditBook') },
      { name: 'genre', path: '/genre/:tag', component: () => import('components/Genre') },
      { name: 'genres', path: '/genres', component: () => import('components/Genres') },
      { name: 'login', path: '/login', component: () => import('components/Login') },
      { name: 'logincallback', path: '/login/callback', component: () => import('components/Login') },
      { name: 'user', path: '/users/:id', component: () => import('components/User') },
      { name: 'users', path: '/users', component: () => import('components/Users') }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
