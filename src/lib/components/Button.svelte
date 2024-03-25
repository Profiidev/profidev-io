<script lang="ts">
  export let text = "";
  export let onClick = () => {};
  export let isSubmit = false;
</script>

<button class="button" on:click={onClick} type={isSubmit ? "submit" : "button"}><p>{text}</p></button>

<style>
  .button {
    height: 2.5em;
    width: 9em;
    margin-bottom: 3em;
    margin-top: calc(1em + 2em * var(--add));
    padding: 0.5em;
    padding-left: 1.1em;
    padding-right: 1.1em;
    border-radius: 5px;
    border: none;
    outline: none;
    transition: .4s ease-in-out, margin 0s;
    background-image: linear-gradient(163deg, #6d1fbb 0%, #4b0be6 100%);
    color: rgb(0, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button:hover {
    background-image: linear-gradient(163deg, #1c0843 0%, #2a1036 100%);
    color: #9683ff;
  }

  .button p {
    margin: 0;
    padding: 0;
    font-size: 1.3em;
  }
</style>