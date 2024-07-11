<script>
  import Author from '$lib/components/Author.svelte'
  import TabsNav from '$lib/components/TabsNav.svelte'
  import ServiceTeaser from '$lib/components/ServiceTeaser.svelte'
</script>

<header class="container">
  <Author />

  <TabsNav>
    <a href="/" class="is-active">Йога</a>
    <a href="/psychotherapy.html">Психотерапия</a>
    <a href="/complex.html">Комплекс</a>
  </TabsNav>
</header>

<main class="container">
  <ServiceTeaser
    title="Консультация"
    subtitle="За 40 минут выявляем ваш запрос/проблему и пути решения"
    href="/yoga/consultation.html"
    bgUrl="/yoga-30-min-bg.png"
  />

  <ServiceTeaser
    title={`Клуб "Йога за 30 минут" в Телеграм`}
    subtitle="30-минутные тематические уроки для поддержания тела и нервной системы в тонусе"
    href="/yoga/30-min.html"
    bgUrl="/yoga-30-min-bg.png"
  />

  <ServiceTeaser
    title="Персональная йога"
    subtitle="Для тех, кто любит себя и ценит своё время на здоровую и полноценную жизнь"
    href="/yoga/personal.html"
    bgUrl="/yoga-30-min-bg.png"
  />
</main>

<style>
  main {
    display: grid;
    gap: 20px;
  }
</style>
