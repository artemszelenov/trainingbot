<script lang="ts">
  type Props = {
    title: string;
    subtitle: string;
    href: string;
    bgUrl: string;
  };

  const { title, subtitle, href, bgUrl }: Props = $props();
</script>

<article style="--bg: url('{bgUrl}')">
  <section>
    <h1>{title}</h1>
    <p>{subtitle}</p>

    <a {href}>Подробнее</a>
  </section>
</article>

<style>
  article {
    position: relative;
    border-radius: 18px;
    background-image: var(--bg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    overflow: hidden;

    &::before {
      position: absolute;
      inset: 0;
      background-color: var(--bg-basic-60);
      backdrop-filter: blur(2px);
      content: '';
    }
  }

  section {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 30px 22px 22px;
    min-height: 47vw;
  }

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: white;
  }

  p {
    margin-block: 16px 28px;
    font-size: 16px;
    font-weight: 500;
    color: white;
  }

  a {
    display: grid;
    place-items: center;
    height: 50px;
    margin-block-start: auto;
    border-radius: 10px;
    background-color: var(--bg-basic);
    color: var(--text-skin);
    text-decoration: none;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
    }
  }
</style>
