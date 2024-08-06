<script>
  import './global.css';
  import { dev, browser } from '$app/environment';
  import { onMount } from 'svelte'
  import { setDebug, isTMA, retrieveLaunchParams, initMiniApp } from '@telegram-apps/sdk';
  const { children, data } = $props();

  let is_admin = $state(false);

  if (dev && browser) {
    isTMA().then(() => {
      setDebug(true);
    })
  }

  onMount(() => {
    isTMA().then(() => {
      const [app] = initMiniApp();

      if (app.isDark) {
        app.setHeaderColor('#212121');
      }

      const { initData, initDataRaw } = retrieveLaunchParams()

      fetch('/api/web-app/auth', {
        method: 'POST',
        headers: {
          authorization: `tma ${initDataRaw}`
        },
      });

      if (initData?.user?.id === Number(data.admin_chat_id)) {
        is_admin = true;
      }
    })
  });
</script>

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