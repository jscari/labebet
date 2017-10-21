<template>
  <div>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.5.2/css/bulma.min.css">
      <div id="tournament-header">
        <a id="tournament-title" href="/admin/events/"> {{this.$store.state.tournamentName}} | Administration du tournoi</a>
         <a id="topright-link" href="/">...</a>
    </div>
    <section class="section">
      <div class="container">
        <nuxt/>
      </div>
    </section>
  </div>
</template>
<script>
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
#tournament-header {
  padding-left: 50px;
    background: #690b29;
    line-height: 80px;
    font-size: 18px;
    font-weight: bolder;
    color: white;
    position: relative;
}
#topright-link {
  color: white;
  text-decoration: none;
    position: absolute;
    right: 0;
    vertical-align: middle;
    font-weight: 700;
    padding-right: 10px;
    font-size: 38px;
    line-height: 60px;
}
.back {
  cursor: pointer;
  display: inline-block;
  font-size: 30px;
  width: 80px;
  text-align: center;
}
a#tournament-title, a#tournament-title:hover {
  display: inline-block;
  padding-left: 0px;
  color:white;
}
</style>
