<script>
  import Author from '$lib/components/Author.svelte';
  import TabsNav from '$lib/components/TabsNav.svelte';
  import ServiceTeaser from '$lib/components/ServiceTeaser.svelte';
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
  <ServiceTeaser
    title="Индивидуальная сессия"
    subtitle="Высокоэффективные психологические сессии ИНП (интегральное нейропрограммирование)"
    href="/psychotherapy/1-1"
    bgUrl="/yoga-30-min-bg.png"
  />
</main>
