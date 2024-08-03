<script lang="ts">
  import { browser } from "$app/environment";
  import { goto, onNavigate } from "$app/navigation";
  import {
    initBackButton,
    initMainButton,
    isTMA,
    initMiniApp,
    retrieveLaunchParams,
    type BackButton,
    type MainButton,
  } from "@telegram-apps/sdk";
  import Author from "$lib/components/Author.svelte";
  import TabsNav from "$lib/components/TabsNav.svelte";
  import type { FormBodyI } from "$lib/server/types";

  let bb: BackButton;
  let mb: MainButton;

  if (browser) {
    isTMA().then((tma) => {
      if (!tma) return;

      const [app] = initMiniApp();
      [bb] = initBackButton();
      [mb] = initMainButton();

      mb.setBgColor("#424242")
        .setTextColor("#FFDAB9")
        .setText("Записаться на консультацию")
        .enable()
        .show();

      bb.show();

      bb.on("click", () => {
        goto("/");
        bb.hide();
      });

      mb.on("click", () => {
        const { initData } = retrieveLaunchParams();

        if (!initData?.user?.id) {
          console.error("[trainingbot web app] > ", "user id is not found");
          return;
        }

        const body: FormBodyI = {
          chat_id: initData.user.id,
        };

        fetch("/api/web-app/forms/yoga-consultation", {
          method: "POST",
          body: JSON.stringify(body),
        }).then(() => {
          app.close();
        });
      });
    });
  }

  onNavigate(() => {
    bb?.hide();
    mb?.hide();
  });
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
  <h1>Консультация</h1>

  <h3>С чем стоит обратиться</h3>

  <ul>
    <li>Лишние кг; желание подтянуть тело</li>
    <li>Эмоциональные качели, стресс</li>
    <li>Избавиться от бессонницы, панических атак</li>
    <li>Нарушение осанки, боли в спине</li>
    <li>Протрузии/грыжи</li>
    <li>
      Проблемы по-женски (боли в критические дни; ПМС; эндометриоз, поликистоз,
      миома)
    </li>
    <li>Беременность</li>
    <li>Послеродовое восстановление (диастаз, симфизит, депрессия)</li>
  </ul>

  <h3>Как проходит консультация</h3>

  <ol>
    <li>Видео-созвон в Телеграмм на 40 минут</li>
    <li>Подробный разбор вашего запроса и предложения вариантов его решения</li>
    <li>Подбор формата занятий, времени и места</li>
    <li>Выбор тарифы</li>
    <li>Ответы на вопросы</li>
  </ol>

  <h3>Стоимость</h3>

  <p><strong>2 000 ₽</strong> / Консультация</p>
</main>
