<script>
  import './global.css';
  import { dev, browser } from '$app/environment';
  import { onMount } from 'svelte'
  import { setDebug, isTMA, retrieveLaunchParams, initMiniApp, initViewport } from '@telegram-apps/sdk';
  import Gift from "$lib/components/Gift.svelte";

  const { children, data } = $props();

  let is_admin = $state(false);
  let is_new_client = $state(false);

  if (dev && browser) {
    isTMA().then(() => {
      setDebug(true);
    })
  }

  onMount(() => {
    isTMA().then(async () => {
      const [app] = initMiniApp();
      const [viewport] = initViewport();

      if (app.isDark) {
        app.setHeaderColor('#212121');
      }

      const vp = await viewport
      
      if (!vp.isExpanded) {
        vp.expand();
      }

      const { initData, initDataRaw } = retrieveLaunchParams()

      fetch('/api/web-app/auth', {
        method: 'POST',
        headers: {
          authorization: `tma ${initDataRaw}`
        },
      })
        .then(res => res.json())
        .then((data) => {
          is_new_client = data.is_new_client
        });

      if (initData?.user?.id === Number(data.admin_chat_id)) {
        is_admin = true;
      }
    })
  });
</script>

{#if is_new_client}
  <Gift />
{/if}

{#if is_admin}
  <nav class="container top-nav">
    <a href="/admin">Личный кабинет</a>
  </nav>
{/if}

{@render children()}

<style>
  .top-nav {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-block-end: 20px;
  }
</style>