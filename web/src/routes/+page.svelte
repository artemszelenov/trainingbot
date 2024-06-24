<script>
  import Author from '$lib/components/Author.svelte'
  import TabsNav from '$lib/components/TabsNav.svelte'
  import ServiceTeaser from '$lib/components/ServiceTeaser.svelte'
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
    title="Йога за 30 минут"
    subtitle="Это телеграмм - чат с 30-минутными видео-уроками на различную тематику"
    href="/yoga/30-min"
    bgUrl="/yoga-30-min-bg.png"
  />

  <ServiceTeaser
    title="Йога за 30 минут"
    subtitle="Это телеграмм - чат с 30-минутными видео-уроками на различную тематику"
    href="/yoga/30-min"
    bgUrl="/yoga-30-min-bg.png"
  />

  <ServiceTeaser
    title="Йога за 30 минут"
    subtitle="Это телеграмм - чат с 30-минутными видео-уроками на различную тематику"
    href="/yoga/30-min"
    bgUrl="/yoga-30-min-bg.png"
  />
</main>

<style>
  main {
    display: grid;
    gap: 20px;
  }
</style>
