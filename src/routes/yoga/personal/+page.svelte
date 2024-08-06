<script lang="ts">
  import Author from '$lib/components/Author.svelte';
  import TabsNav from '$lib/components/TabsNav.svelte';
  import ServicePage from '$lib/components/ServicePage.svelte';
</script>

<ServicePage service_slug="yoga-personal">
  <header class="container">
    <Author />

    <TabsNav>
      <a href="/" class="is-active">Йога</a>
      <a href="/psychotherapy">Психотерапия</a>
      <a href="/complex">Комплекс</a>
    </TabsNav>
  </header>

  <main class="container prose">
    <h1>Персональная йога</h1>

    <h3>Как строится работа</h3>

    <ol>
      <li>
        Диагностическая консультация (выявляем запрос и составляем персональный
        протокол йоги)
      </li>
      <li>Договор на оказание спортивно-оздоровительных услуг</li>
      <li>
        Пакет из 10 занятий и обратная связь по результатам модуля (опросники,
        тесты, фото До/После для оценки результативности занятий)
      </li>
      <li>Выбираем удобный формат занятий (онлайн/оффлайн), время и место</li>
    </ol>

    <h3>Стоимость</h3>

    <p><strong>2 000 ₽</strong> / Консультация</p>

    <p><strong>3 500 ₽</strong> / 1 занятие</p>

    <p><strong>25 000 ₽</strong> / 10 занятий (доступна рассрочка)</p>
  </main>
</ServicePage>
