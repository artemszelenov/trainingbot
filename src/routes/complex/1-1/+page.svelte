<script lang="ts">
  import Author from '$lib/components/Author.svelte';
  import TabsNav from '$lib/components/TabsNav.svelte';
  import ServicePage from '$lib/components/ServicePage.svelte';
</script>

<ServicePage
  service_slug="complex-individual"
  back_button_redirect_url="/complex"
>
  <header class="container">
    <Author />

    <TabsNav>
      <a href="/">Йога</a>
      <a href="/psychotherapy">Психотерапия</a>
      <a href="/complex" class="is-active">Комплекс</a>
    </TabsNav>
  </header>

  <main class="container prose">
    <h1>Индивидуальная комплексная работа</h1>

    <p>
      Тело - это проводник наших энергий, зеркало наших программ и мышления.
      Поэтому, работая с телом мы влияем на внутренние процессы психики, и
      наоборот. Работая комплексно, можно добиться невероятных результатов,
      меняющих вашу жизнь!
    </p>

    <p>
      Для тех, кому необходимы фундаментальные изменения личности и выход на
      качественно новый уровень жизни
    </p>

    <h3>Комплексный подход</h3>

    <ul>
      <li>Выявление вашего главного запроса на практику</li>
      <li>Заключение договора возмездного оказания консультационных услуг</li>
      <li>Составление персональных 10 практик йоги</li>
      <li>
        Составление и проведение 5 индивидуальных психотерапевтических сессий по
        вашему запросу
      </li>
      <li>Опросники До/после и обратная связь по результатам работы</li>
    </ul>

    <h3>Стоимость</h3>

    <p>
      <strong>5 000 ₽</strong> / Консультация (при приобретении пакета консультация
      бесплатна)
    </p>
    <p>
      <strong>40 000 ₽</strong> / Пакет 10 практик йоги и 5 психотерапевтических
      сессий
    </p>
  </main>
</ServicePage>
