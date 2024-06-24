<script>
  import Author from '$lib/components/Author.svelte'
  import TabsNav from '$lib/components/TabsNav.svelte'
</script>

<header class="container">
  <Author />

  <TabsNav>
    <a href="/">Йога</a>
    <a href="/psychotherapy" class="is-active">Психотерапия</a>
    <a href="/complex">Комплекс</a>
  </TabsNav>
</header>

<main class="container">
  <h1>Индивидуальная сессия</h1>
</main>

