<script>
  import { initMiniApp } from '@telegram-apps/sdk';

  const [app] = initMiniApp();

  function createAnnounce() {
    fetch('/api/web-app/announce', {
      method: 'POST',
    }).then(() => {
      app.close();
    });
  }
</script>

<main class="container">
  <section class="row">
    <h2>Личный кабинет</h2>

    <a href="/">{`< На сайт`}</a>
  </section>

  <button type="button" class="main-button" onclick={createAnnounce}>
    Создать рассылку
  </button>
</main>

<style>
  h2 {
    margin: 0;
  }

  button {
    margin-top: 50px;
  }

  main {
    padding-block: 0;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
