<script lang="ts">
  let { children } = $props();
  import "./app.css";
</script>

<svelte:head>
  <title>SvelteKit App</title>
  <link href="https://fonts.cdnfonts.com/css/terminus" rel="stylesheet">
  <link href="https://fonts.cdnfonts.com/css/noto-mono" rel="stylesheet">
  <link href="https://fonts.cdnfonts.com/css/sebastian-gothic-nbp" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@exuanbo/file-icons-js@latest/dist/css/file-icons.min.css" rel="stylesheet">
</svelte:head>

{@render children?.()}
