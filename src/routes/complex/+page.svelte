<script>
  import Author from '$lib/components/Author.svelte';
  import TabsNav from '$lib/components/TabsNav.svelte';
  import ServiceTeaser from '$lib/components/ServiceTeaser.svelte';
</script>

<header class="container">
  <Author />

  <TabsNav>
    <a href="/">Йога</a>
    <a href="/psychotherapy">Психотерапия</a>
    <a href="/complex" class="is-active">Комплекс</a>
  </TabsNav>
</header>

<main class="container">
  <ServiceTeaser
    title="Индивидуальная комплексная работа"
    subtitle="Применение техник йоги совместно с интегральным нейропрограммированием"
    href="/complex/1-1"
    bgUrl="/complex-individual.jpg"
  />
</main>
