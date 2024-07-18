<script>
  const { children } = $props()
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
    }

    main {
      padding-block: 30px;
    }
  }
</style>