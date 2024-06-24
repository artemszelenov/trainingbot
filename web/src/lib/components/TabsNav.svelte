<script>
  const { children } = $props();
</script>

<nav>
  {@render children()}
</nav>

<style>
  nav {
    display: flex;
    align-items: center;
    margin-block-start: 20px;
  }

  nav :global(a) {
    flex-grow: 1;
    padding: 8px;
    text-align: center;
    text-decoration: none;
    font-size: 13px;
    border-radius: 7px;
    background-color: transparent;
  }

  nav :global(a.is-active) {
    background-color: white;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 12%), 0 3px 1px 0 rgba(0, 0, 0, 4%);
  }
</style>