<template>
  <q-layout view="hHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          <router-link to="/" class="text-white" style="text-decoration:none;">Ballito Bookclub</router-link>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-layout-drawer v-model="leftDrawerOpen" :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null">
      <q-list no-border link inset-delimiter>
        <q-item to="/authors">
          <q-item-side icon="person_outline" />
          <q-item-main label="Authors" sublabel="view all authors" />
        </q-item>
        <q-item to="/books">
          <q-item-side icon="book" />
          <q-item-main label="Books" sublabel="view all books" />
        </q-item>
        <q-item to="/wishlist">
          <q-item-side icon="favorite" />
          <q-item-main label="Wishlist" sublabel="view wishlist" />
        </q-item>
        <q-item to="/genres">
          <q-item-side icon="label" />
          <q-item-main label="Genres" sublabel="view all genres" />
        </q-item>
        <q-item to="/users">
          <q-item-side icon="group" />
          <q-item-main label="Members" sublabel="view bookclub members" />
        </q-item>
        <q-item to="/addbook">
          <q-item-side icon="add" />
          <q-item-main label="New book" sublabel="enter new book details" />
        </q-item>
        <q-item :to="{ name: 'logout' }">
          <q-item-side icon="close"/>
          <q-item-main label="Logout" sublabel="log out of the app" />
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-layout-footer>
      <q-toolbar>
        <q-item>
          <router-link :to="{ name: 'home' }"><q-item-side style="text-decoration:none;" icon="home" color="white"/></router-link>
        </q-item>
        <q-item to="/authors">
          <q-item-side icon="person_outline" color="white"/>
        </q-item>
        <q-item to="/books">
          <q-item-side icon="book" color="white"/>
        </q-item>
        <q-item to="/genres">
          <q-item-side icon="label" color="white"/>
        </q-item>
        <q-item to="/users">
          <q-item-side icon="people" color="white"/>
        </q-item>
      </q-toolbar>
    </q-layout-footer>
  </q-layout>
</template>

<script>
export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  }
}
</script>

<style>
a, a:hover {
  text-decoration: none;
}
</style>
