# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
















<script lang="ts">
  import { gzip, ungzip } from 'pako';

  let files: FileList;
  const down = () => {
    fetch('http://localhost:8080/cloud/download/test', {
      method: 'GET',
      headers: {
        "Authorization" : ""
      }
    }).then(response => response.blob()).then(async blob => {
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const url = window.URL.createObjectURL(new Blob([ungzip(arrayBuffer)]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'test';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const up = () => {
    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const arrayBuffer = event.target?.result;
      fetch('http://localhost:8080/cloud/upload/test', {
        method: 'PUT',
        headers: {
          "Authorization": ""
        },
        body: gzip(arrayBuffer as ArrayBuffer, { level: 4 })
      });
    };
    fileReader.readAsArrayBuffer(files[0]);
  }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={down}>Click me</button>
<input type="file" bind:files={files} />
