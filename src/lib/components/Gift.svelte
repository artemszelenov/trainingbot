<script lang="ts">
  import { Gift } from 'lucide-svelte';
  import { createDialog, melt } from '@melt-ui/svelte';
  import { initMiniApp, retrieveLaunchParams } from '@telegram-apps/sdk';

  const {
    elements: { portalled, overlay, content, title, description, close },
    states: { open },
  } = createDialog({
    closeOnOutsideClick: false,
  });

  open.set(true);

  function handleClick() {
    const { initData } = retrieveLaunchParams();
    const [app] = initMiniApp();

    const body = {
      chat_id: initData?.user?.id,
    };

    fetch('/api/web-app/get-free-yoga-guide', {
      method: 'POST',
      body: JSON.stringify(body),
    }).then(() => {
      app.close();
    });
  }
</script>

{#if $open}
  <div use:melt={$portalled}>
    <div class="overlay" use:melt={$overlay}>
      <div class="content" use:melt={$content}>
        <h3 class="title" use:melt={$title}>
          <Gift size={30} aria-hidden="true" />
          Вам подарок!
        </h3>

        <p class="text" use:melt={$description}>
          Гайд "Топ-5 асан от ноющей поясницы" в формате pdf
        </p>

        <div class="actions">
          <button class="btn is-primary" type="button" onclick={handleClick}
            >Получить</button
          >
          <button class="btn" use:melt={$close}>Закрыть</button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    background-color: oklch(0% 0 0 / 50%);
  }

  .content {
    max-width: 500px;
    width: calc(100vw - 32px);
    background-color: var(--surface-0);
    border-radius: 16px;
    animation-duration: 500ms;
    animation-name: fade;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  .title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    padding-inline: 20px;
    padding-block-start: 30px;
  }

  .text {
    padding-inline: 20px;
    padding-block: 25px;
    font-size: 18px;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #00000010;
    padding-inline: 20px;
    padding-block: 20px;
  }

  .btn {
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: 8px;
    font-size: 16px;
    padding: 10px 18px;
  }

  .btn.is-primary {
    border: 1px solid var(--bg-basic);
  }

  @keyframes fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
</style>
