<script lang="ts">
  let { children } = $props();
  import "./app.css";
</script>

<svelte:head>
  <title>Charlie Holland's Blog</title>
  <!-- Importing fonts -->
  <link href="https://fonts.cdnfonts.com/css/sebastian-gothic-nbp" rel="stylesheet">
  <!-- Importing icons -->
  <link href="https://cdn.jsdelivr.net/npm/@exuanbo/file-icons-js@latest/dist/css/file-icons.min.css" rel="stylesheet">
  <!-- Importing jquery -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</svelte:head>

{@render children?.()}
