<script>
  import Author from '$lib/components/Author.svelte'
  import TabsNav from '$lib/components/TabsNav.svelte'
  import ServiceTeaser from '$lib/components/ServiceTeaser.svelte'
</script>

<header class="container">
  <Author />

  <TabsNav>
    <a href="/">Йога</a>
    <a href="/psychotherapy.html">Психотерапия</a>
    <a href="/complex.html" class="is-active">Комплекс</a>
  </TabsNav>
</header>

<main class="container">
  <ServiceTeaser
    title="Индивидуальная сессия"
    subtitle="Описание"
    href="/complex/1-1.html"
    bgUrl="/yoga-30-min-bg.png"
  />
</main>

