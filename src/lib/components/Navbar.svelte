<script lang="ts">
  import NavbarEntry from "./NavbarEntry.svelte";
  import { currentUser, isValid, pb } from "$lib/auth";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Permissions, checkPermission } from "$lib/permissions";

  export let open = false;
  let closeBtnClass = "bx bx-menu";
  let closeBtn: HTMLElement;
  let onLoginPage = false;

  $: onLoginPage = $page.route !== null && $page.route.id === "/login";

  let navEntries: {
    name: string;
    icon: string;
    link: string;
  }[] = [];

  $: {
    navEntries = [];
    let permissions = $currentUser?.permissions;
    navEntries.push({ name: "Dashboard", icon: "bx bx-grid-alt", link: "/" })
    if(checkPermission(permissions, Permissions.Users)) {
      navEntries.push({ name: "Users", icon: "bx bx-user", link: "/users" });
    }
    if(checkPermission(permissions, Permissions.Metrics)) {
      navEntries.push({ name: "Statistics", icon: "bx bx-pie-chart", link: "/statistics" });
    }
    if(checkPermission(permissions, Permissions.Cloud)) {
      navEntries.push({ name: "Cloud", icon: "bx bx-folder", link: "/cloud" });
    }
    if(checkPermission(permissions, Permissions.Portainer)) {
      navEntries.push({ name: "Portainer", icon: "bx bxl-docker", link: "/portainer" });
    }
    if(checkPermission(permissions, Permissions.Database)) {
      navEntries.push({ name: "Pocketbase", icon: "bx bx-data", link: "/pocketbase" });
    }
    navEntries.push({ name: "Settings", icon: "bx bx-cog", link: "/settings" });
  };

  const toggleSidebar = () => {
    open = !open;
     if(open){
        closeBtnClass = "bx-menu-alt-right";
     }else {
        closeBtnClass = "bx-menu";
     }
  }

  const gotoLogin = () => {
    if(open) {
      pb.authStore.clear();
      goto("/login");
    } else {
      goto("/account");
    }
  }
</script>

<div class="sidebar" class:open={open}>
  <div class="logo-details">
    <i class="bx bx-code-alt icon gradient"></i>
    <div class="logo_name">ProfiDev</div>
    <button class="bx {closeBtnClass}" id="btn" on:click={toggleSidebar} bind:this={closeBtn}></button>
  </div>
  <ul class="nav-list">
    {#each navEntries as entry}
      <NavbarEntry name={entry.name} icon={entry.icon} link={entry.link} open={open} />
    {/each}
  </ul>
  <div class="profile">
    <a href="/account" class="info gradient">
      <span class="name">{$isValid ? $currentUser?.name : "Not Loged in"}</span>
      <span class="group">{$isValid ? $currentUser?.permissions === 0 ? "Admin" : "User" : ""}</span>
    </a>
    <button class="bx {$isValid ? open ? "bx-log-out" : "bx-user" : "bx-log-in"} gradient" on:click={gotoLogin} class:highlight={onLoginPage}></button>
    <span class="tooltip">{$isValid ? open ? "Logout" : "Account" : "Login"}</span>
  </div>
</div>

<style>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins" , sans-serif;
    font-weight: 900;
  }
  .sidebar{
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 78px;
    background: var(--background-color3);
    padding: 6px 14px;
    z-index: 99;
    transition: all 0.5s ease;
    user-select: none;
  }
  .sidebar.open{
    width: 250px;
  }
  .sidebar .logo-details{
    height: 60px;
    display: flex;
    align-items: center;
    position: relative;
  }
  .sidebar .logo-details .icon{
    opacity: 0;
    transition: all 0.5s ease;
  }
  .sidebar .logo-details .logo_name{
    color: var(--primary-color1);
    font-size: 20px;
    font-weight: bold;
    opacity: 0;
    transition: all 0.5s ease;
  }
  .sidebar.open .logo-details .icon,
  .sidebar.open .logo-details .logo_name{
    opacity: 1;
  }
  .sidebar .logo-details #btn{
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    font-size: 22px;
    transition: all 0.4s ease;
    font-size: 23px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s ease;
		border: none;
    font-size: 28px;
    color: var(--primary-color1);
    background-color: var(--background-color3);
  }
  .sidebar.open .logo-details #btn{
    text-align: right;
  }
  .sidebar i, .sidebar button{
    height: 60px;
    width: 50px;
    font-size: 28px;
    text-align: center;
    line-height: 60px;
  }
  .sidebar .nav-list{
    margin-top: 20px;
    height: calc(100% - 146px);
  }
  .sidebar li i{
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    border-radius: 12px;
  }
  .sidebar li .profile-details{
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
  .sidebar li.profile .name,
  .sidebar li.profile .job{
    font-size: 15px;
    font-weight: 400;
    white-space: nowrap;
  }
  .sidebar li.profile .job{
    font-size: 12px;
  }
  .sidebar li .logout{
    background-color: var(--background-color2);
  }
  .profile{
    position: relative;
    margin: 8px 0;
    list-style: none;
    display: flex;
    height: 50px;
    width: 100%;
    border-radius: 12px;
    align-items: center;
    text-decoration: none;
    transition: all 0.4s ease;
    background: var(--background-color2);
    justify-content: space-between;
  }
  .profile .info{
    display: flex;
    height: 100%;
    border-radius: 12px;
    align-items: center;
    text-decoration: none;
    transition: all 0.4s ease;
    flex-direction: column;
    justify-content: center;
    padding-left: 0;
    width: calc(100% - 50px);
  }
  .sidebar.open .profile .info{
    padding: 0 10px;
  }
  .sidebar.open .profile .info:hover{
    background-image: linear-gradient(180deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
    background-attachment: fixed;
    background-clip: border-box;
  }
  .profile .info .name,
  .profile .info .group{
    font-size: 15px;
    font-weight: 900;
    white-space: nowrap;
    pointer-events: none;
    border-radius: 12px;
    transition: all 0.4s ease;
    width: 100%;
  }
  .sidebar.open .profile .info .name,
  .sidebar.open .profile .info .group{
    pointer-events: auto;
  }
  .sidebar.open .profile .info:hover .name,
  .sidebar.open .profile .info:hover .group{
    color: var(--background-color2);
  }
  .profile button{
    height: 50px;
    width: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 22px;
    border-radius: 12px;
    transition: all 0.4s ease;
    border: none;
    cursor: pointer;
  }
  .profile button:hover,
  .profile button.highlight{
    background-image: linear-gradient(180deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
    background-attachment: fixed;
    color: var(--background-color2);
    background-clip: border-box;
  }
  .profile .tooltip{
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
  .profile button:hover + .tooltip{
    opacity: 1;
    pointer-events: auto;
    transition: all 0.4s ease;
    top: 50%;
    transform: translateY(-50%);
  }
  .gradient{
    background-image: linear-gradient(180deg, var(--primary-color1) 0%, var(--primary-color3) 100%);
    background-attachment: fixed;
    color: transparent;
    background-clip: text;
  }
</style>
