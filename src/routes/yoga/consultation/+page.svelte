<script lang="ts">
  import Author from '$lib/components/Author.svelte';
  import TabsNav from '$lib/components/TabsNav.svelte';
  import ServicePage from '$lib/components/ServicePage.svelte';
</script>

<ServicePage service_slug="yoga-consultation">
  <header class="container">
    <Author />

    <TabsNav>
      <a href="/" class="is-active">Йога</a>
      <a href="/psychotherapy">Психотерапия</a>
      <a href="/complex">Комплекс</a>
    </TabsNav>
  </header>

  <main class="container prose">
    <h1>Консультация</h1>

    <h3>С чем стоит обратиться</h3>

    <ul>
      <li>Лишние кг; желание подтянуть тело</li>
      <li>Эмоциональные качели, стресс</li>
      <li>Избавиться от бессонницы, панических атак</li>
      <li>Нарушение осанки, боли в спине</li>
      <li>Протрузии/грыжи</li>
      <li>
        Проблемы по-женски (боли в критические дни; ПМС; эндометриоз,
        поликистоз, миома)
      </li>
      <li>Беременность</li>
      <li>Послеродовое восстановление (диастаз, симфизит, депрессия)</li>
    </ul>

    <h3>Как проходит консультация</h3>

    <ol>
      <li>Видео-созвон в Телеграмм на 40 минут</li>
      <li>
        Подробный разбор вашего запроса и предложения вариантов его решения
      </li>
      <li>Подбор формата занятий, времени и места</li>
      <li>Выбор тарифы</li>
      <li>Ответы на вопросы</li>
    </ol>

    <h3>Стоимость</h3>

    <p><strong>2 000 ₽</strong></p>
  </main>
</ServicePage>
