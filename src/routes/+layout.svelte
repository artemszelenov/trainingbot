<script>
  import { dev, browser } from '$app/environment';
  import { setDebug, isTMA } from '@telegram-apps/sdk';
  const { children } = $props();

  if (dev && browser) {
    isTMA().then(() => {
      setDebug(true);
    })
  }
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

    --bg-basic: #424242;
    --bg-basic-40: #42424240;

    accent-color: var(--text-skin);
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }

  :global {
    * {
      color: var(--text-basic);
      margin: 0;
      font-family: Inter;
    }

    .container {
      max-width: 500px;
      margin-inline: auto;
      padding-inline: 16px;
    }

    body {
      padding-block: 30px;
      font-size: 16px;
    }

    main {
      padding-block: 30px;
    }

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