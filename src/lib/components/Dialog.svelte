<script lang="ts">
  export let modalVisible = false;
  export let submit = () => {};

  const close = () => {
    modalVisible = false;
  }
</script>



<button class="container" on:click|self={close}>
  <div class="modal-background">
    <div class="modal">
      <form class="form" on:submit={submit}>
        <slot />
      </form>
    </div>
  </div>
</button>

<style>
  .container {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .8);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
  }

  .modal-background {
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    border-radius: 20px;
    background-image: linear-gradient(163deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
  }

  .modal {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: var(--background-color2);
    border-radius: 20px;
    transition: all 0.3s ease;
    transform: scale(1.01);
  }

  .modal:hover {
    transform: scale(0.98);
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-left: 2em;
    padding-right: 2em;
    padding-bottom: 0.4em;
    border-radius: 20px;
    align-items: center;
    box-sizing: border-box;
    background-image: linear-gradient(var(--primary-color1) 0%, var(--primary-color3) 100%);
    background-clip: text;
    background-attachment: fixed;
    color: transparent;
  }
</style>