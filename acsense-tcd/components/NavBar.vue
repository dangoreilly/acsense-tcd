<template>

<nav class="navbar navbar-info-page bg-primary-subtle">

  <div class="container-fluid">

    <a class="navbar-brand">Acsense</a>

    <form class="d-flex" role="search">

      <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success" type="submit">Search</button>

    </form>

  </div>

</nav>

</template>

<script lang="ts">
</script>

<style>

.container-fluid {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 2rem;
}

.navbar-main-info-page {
    position: fixed !important;
    top: 0;
    padding: 0.5rem 0;
    left: 0;
    right: 0;
    z-index: 100;
    /* box-shadow: 5px 10px rgba(0, 0, 0, 0.2); */
}

</style>