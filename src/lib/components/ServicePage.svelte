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
  import type { FormBodyI } from "$lib/server/types";
  import type { Snippet } from 'svelte'

  interface PropsI {
    children: Snippet;
    service_slug: string;
    back_button_redirect_url?: string;
    main_button_text?: string;
  }

  const {
    children,
    service_slug,
    main_button_text = "Записаться на консультацию",
    back_button_redirect_url = '/'
  }: PropsI = $props();

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
        .setText(main_button_text)
        .enable()
        .show();

      bb.show();

      bb.on("click", () => {
        goto(back_button_redirect_url);
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

        fetch(`/api/web-app/forms/${service_slug}`, {
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

{@render children()}
