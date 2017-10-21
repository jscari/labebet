<template>
<div>
  <div id="overlay">
    <a id="overlaytext">Se connecter pour participer</a>
  </div>
  <nuxt/>
</div>
</template>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

#overlay {
    position: fixed; /* Sit on top of the page content */
    display: block; /* Hidden by default */
    width: 100%; /* Full width (cover the whole page) */
    height: 100%; /* Full height (cover the whole page) */
    top: 0; 
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5); /* Black background with opacity */
    z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
    cursor: pointer; /* Add a pointer on hover */
}
#overlaytext{
    position: absolute;
    top: 50%;
    left: 50%;
    color: white;
    transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);


    display: inline-block;
    position: relative;
    padding: .615384615em 1em;
    vertical-align: middle;
    min-height: 2.461538462em;
    min-width: 10em;
    box-sizing: border-box;
    font-weight: 400;
    font-family: inherit;
    line-height: 1;
    text-align: center;
    text-decoration: none;
    border-radius: 2px;
    border: 2px solid transparent;
    cursor: pointer;
    outline: 0;
    touch-action: manipulation;
    transition: all .1s ease-in;


    color: rgba(114,114,114,1);
    background-color: rgba(234,234,234,1);
    border-color: rgb(211, 211, 211);
    box-shadow: 0 0 1px 1px rgba(255,255,255,0.8), 0 1px 0 0 rgba(0,0,0,0.298039);
}

</style>
