<script>
  import Author from '$lib/components/Author.svelte';
  import TabsNav from '$lib/components/TabsNav.svelte';
  import ServiceTeaser from '$lib/components/ServiceTeaser.svelte';
</script>

<header class="container">
  <Author />

  <TabsNav>
    <a href="/" class="is-active">Йога</a>
    <a href="/psychotherapy">Психотерапия</a>
    <a href="/complex">Комплекс</a>
  </TabsNav>
</header>

<main class="container">
  <ServiceTeaser
    title="Консультация"
    subtitle="За 40 минут выявляем вашу проблему и пути решения"
    href="/yoga/consultation"
    bgUrl="/yoga-consultation.jpg"
  />

  <ServiceTeaser
    title={`Клуб "Йога за 30 минут" в Телеграм`}
    subtitle="30-минутные тематические уроки для поддержания тела и нервной системы в тонусе"
    href="/yoga/30-min"
    bgUrl="/yoga-30-min.jpg"
  />

  <ServiceTeaser
    title="Персональная йога"
    subtitle="Для тех, кто любит себя и ценит своё время на здоровую и полноценную жизнь"
    href="/yoga/personal"
    bgUrl="/yoga-personal.jpg"
  />
</main>

<style>
  main {
    display: grid;
    gap: 20px;
  }
</style>
