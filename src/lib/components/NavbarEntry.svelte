<script lang="ts">
  import { page } from '$app/stores';

  export let name = "";
  export let icon = "";
  export let link = "/";
  export let open = false;

  let highlighted = false;
  $: highlighted = $page.route !== null && (($page.route.id?.startsWith(link) ?? false) && link !== "/") || ($page.route.id === "/" && link === "/");
</script>

<li class:open={open}>
  <a href="{link}" class:highlight={highlighted}>
    <i class="{icon}"></i>
    <span class="links_name">{name}</span>
  </a>
  <span class="tooltip">{name}</span>
</li>

<style>
  li{
    position: relative;
    margin: 8px 0;
    list-style: none;
  }
  i{
    height: 60px;
    min-width: 50px;
    font-size: 28px;
    text-align: center;
    line-height: 60px;
  }
  li .tooltip{
    position: absolute;
    top: -20px;
    left: calc(100% + 15px);
    z-index: 3;
    background: var(--background-color2);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 15px;
    font-weight: 400;
    opacity: 0;
    white-space: nowrap;
    pointer-events: none;
    transition: 0s;
    color: #fff;
  }
  li:hover .tooltip{
    opacity: 1;
    pointer-events: auto;
    transition: all 0.4s ease;
    top: 50%;
    transform: translateY(-50%);
  }
  li.open .tooltip{
    display: none;
  }
  li a{
    display: flex;
    height: 100%;
    width: 100%;
    border-radius: 12px;
    align-items: center;
    text-decoration: none;
    transition: all 0.4s ease;
    background: var(--background-color2);
  }
  li a:hover,
  li a.highlight{
    background-image: linear-gradient(180deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
    background-attachment: fixed;
    color: var(--background-color2);
  }
  li a .links_name{
    background-image: linear-gradient(180deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
    background-attachment: fixed;
    color: transparent;
    background-clip: text;
    font-size: 15px;
    font-weight: 900;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: 0.4s;
  }
  li.open  a .links_name{
    opacity: 1;
    pointer-events: auto;
  }
  li a:hover .links_name,
  li a:hover i,
  li a.highlight .links_name,
  li a.highlight i{
    transition: all 0.5s ease;
    background-image: linear-gradient(180deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
    background-attachment: fixed;
    color: var(--background-color2);
  }
  li i{
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    font-weight: 900;
    border-radius: 12px;
    background-image: linear-gradient(180deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
    background-attachment: fixed;
    color: transparent;
    background-clip: text;
  }
  @media (max-width: 420px) {
    .sidebar li .tooltip{
      display: none;
    }
  }
</style>