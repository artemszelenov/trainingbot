<script>
  import { dev, browser } from '$app/environment';
  import { onMount } from 'svelte'
  import { setDebug, isTMA, retrieveLaunchParams, initMiniApp } from '@telegram-apps/sdk';
  const { children } = $props();

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

      const { initDataRaw } = retrieveLaunchParams()

      fetch('/api/web-app/auth', {
        method: 'POST',
        headers: {
          authorization: `tma ${initDataRaw}`
        },
      });
    })
  });
</script>

{@render children()}

<style>
  @import "@fontsource/inter";
  @import "@fontsource/inter/500.css";
  @import "@fontsource/inter/600.css";
  @import "@fontsource/inter/700.css";

  :root {
    --text-basic: #424242;
    --text-skin: #FFDAB9;

    --surface-0: #fff;
    --surface-1: #fff;

    --bg-basic: #424242;
    --bg-basic-60: #42424260;

    accent-color: var(--text-skin);
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --text-basic: #fff;
      --surface-0: #212121;
      --surface-1: #424242;
    }
  }

  :global {
    * {
      color: var(--text-basic);
      margin: 0;
      font-family: Inter, sans-serif;
    }

    .container {
      max-width: 500px;
      margin-inline: auto;
      padding-inline: 16px;
    }

    body {
      padding-block: 30px;
      font-size: 16px;
      background-color: var(--surface-0);
    }

    main {
      padding-block: 30px;
    }

    /* h1+*, h2+*, h3+*, h4+*, h5+*, h6+* {
      margin-top: .8em;
    } */

    h1 {
      font-size: 34px;
      font-weight: 800;
      margin-block: 0 24px;
    }

    .heading-1 {
      font-size: 34px;
      font-weight: 800;
    }

    h2 {
      font-size: 28px;
      font-weight: 600;
      margin-block: 0 24px;
    }

    .heading-2 {
      font-size: 28px;
      font-weight: 600;
    }

    h3 {
      font-size: 24px;
      font-weight: 600;
      margin-block: 30px 18px;
    }

    .heading-3 {
      font-size: 24px;
      font-weight: 600;
    }

    h4 {
      font-size: 20px;
      font-weight: 600;
      margin-block: 0 24px;
    }

    .heading-4 {
      font-size: 20px;
      font-weight: 600;
    }

    .prose p, ul {
      margin-block: 16px;
    }

    .prose li + li {
      margin-block-start: 10px;
    }

    strong {
      font-weight: 800;
    }

    .main-button {
      display: grid;
      place-items: center;
      height: 50px;
      margin-block-start: auto;
      border-radius: 10px;
      background-color: var(--bg-basic);
      color: var(--text-skin);
      text-decoration: none;
      border: none;
      width: 100%;
      font-size: 18px;
    }
  }
</style>