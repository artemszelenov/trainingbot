<script lang="ts">
  import Author from '$lib/components/Author.svelte';
  import TabsNav from '$lib/components/TabsNav.svelte';
  import ServicePage from '$lib/components/ServicePage.svelte';
</script>

<ServicePage
  service_slug="psychotherapy-individual"
  back_button_redirect_url="/psychotherapy"
>
  <header class="container">
    <Author />

    <TabsNav>
      <a href="/">Йога</a>
      <a href="/psychotherapy" class="is-active">Психотерапия</a>
      <a href="/complex">Комплекс</a>
    </TabsNav>
  </header>

  <main class="container prose">
    <h1>Индивидуальная сессия</h1>

    <h3>С каким запросом стоит обратиться</h3>

    <ul>
      <li>
        «Не знаю как сформулировать, просто плохо, не могу найти себе место»
      </li>
      <li>
        Беспричинные перепады настроения, неспособность контролировать эмоции
      </li>
      <li>Проблемы в семье, детско-родительские отношения</li>
      <li>Психосоматика</li>
      <li>Вопросы предназначения, смыслов и целей в жизни</li>
      <li>Проработка чувства вины, долга, страхов</li>
      <li>Избавление от продуктов родительского программирования</li>
    </ul>

    <p>
      На первой сессии определяем истинную проблему, формируем вашу желаемую
      точку/цель, а также основные моменты, которые стоит проработать
    </p>

    <h3>Стоимость</h3>

    <p><strong>5 000 ₽</strong> / Сессия</p>
    <p><strong>23 500 ₽</strong> / Пакет из 5 сессий</p>
    <p><strong>47 500 ₽</strong> / Пакет из 10 сессий</p>

    <p>После оплаты определим удобное время, место и формат для нашей сессии</p>
  </main>
</ServicePage>
