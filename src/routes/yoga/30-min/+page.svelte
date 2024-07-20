<script>
  import { browser } from '$app/environment';
  import { goto, onNavigate } from '$app/navigation';
  import { initBackButton, initMainButton, isTMA } from '@telegram-apps/sdk';
  import Author from '$lib/components/Author.svelte';
  import TabsNav from '$lib/components/TabsNav.svelte';

  if (browser) {
    isTMA().then((tma) => {
      if (!tma) return;

      const [bb] = initBackButton();
      const [mb] = initMainButton();

      mb.setBgColor('#424242')
        .setTextColor('#FFDAB9')
        .setText('Вступить')
        .enable()
        .show();

      bb.show();

      bb.on('click', () => {
        goto('/');
        bb.hide();
      });

      onNavigate(() => {
        bb.hide();
        mb.hide();
      });
    });
  }
</script>

<header class="container">
  <Author />

  <TabsNav>
    <a href="/" class="is-active">Йога</a>
    <a href="/psychotherapy">Психотерапия</a>
    <a href="/complex">Комплекс</a>
  </TabsNav>
</header>

<main class="container prose">
  <h1>Йога за 30 минут</h1>

  <h3>В онлайн клубе уже есть</h3>

  <ul>
    <li>Вводная практика для новичков</li>
    <li>
      Более 15 уроков ев различную тематику (от болей в спине и долгосидоза до
      комплексов при ПМС и болях в критические дни)
    </li>
    <li>Видео-разборы основных асан в йоге</li>
    <li>
      Тематические медитации (от усталости до постановки целей и намерения в
      жизни)
    </li>
    <li>Недельные йога-челленджи</li>
    <li>Практика 108 Сурья Намаскар</li>
  </ul>

  <h3>Кому подойдет</h3>

  <ul>
    <li>Некогда ходить на полноценные тренировки</li>
    <li>Много сидячей, монотонной работы, все затекает</li>
    <li>Спина и тело требует разминки</li>
    <li>Бессонница, стресс, апатия</li>
    <li>Нет энергии</li>
    <li>«Отваливается» поясница</li>
    <li>Болит голова</li>
  </ul>

  <h3>Стоимость подписки</h3>

  <p><strong>2 000 ₽</strong> / месяц</p>
  <p>Первая неделя для новичков <strong>БЕСПЛАТНО</strong></p>
</main>
