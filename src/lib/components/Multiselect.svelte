<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  export let value: string[] = [];
  export let placeholder = '';

  let inputValue = '';
  let activeOption: {value: string, name: string} | undefined;
  let showOptions = false;
  let input: HTMLInputElement;
  let first = true;
  let options: {value: string, name: string}[] = [];
  let selected: {[key: string]: {value: string, name: string}} = {};
  let slot: HTMLSelectElement;

  const iconClearPath = 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z';

  onMount(() => {
    for(const o of slot.children) {
      if(!(o instanceof HTMLOptionElement)) continue;
      o.selected && !value.includes(o.value) && (value = [...value, o.value]);
      options = [...options, {value: o.value, name: o.textContent || ''}];
    }
    value && (selected = options.reduce((obj, op) => value.includes(op.value) ? {...obj, [op.value]: op} : obj, {}));
    first = false;
  });

  $: if (!first) value = Object.values(selected).map(o => o.value);
  $: filtered = options.filter(o => inputValue ? o.name.toLowerCase().includes(inputValue.toLowerCase()) : o);
  $: if (activeOption && !filtered.includes(activeOption) || !activeOption && inputValue) activeOption = filtered[0];


  function add(token: {value: string, name: string}) {
    selected[token.value] = token;
  }

  function remove(value: string) {
    const {[value]: val, ...rest} = selected;
    selected = rest;
  }

  function optionsVisibility(show: boolean | undefined) {
    if (typeof show === 'boolean') {
      showOptions = show;
      show && input.focus();
    } else {
      showOptions = !showOptions;
    }
    if (!showOptions) {
      activeOption = undefined;
    }
  }

  function handleKeyup(e: KeyboardEvent) {
    if (e.keyCode === 13) {
      activeOption && Object.keys(selected).includes(activeOption.value) ? remove(activeOption.value) : add(activeOption as {value: string, name: string});
      inputValue = '';
    }
    if ([38,40].includes(e.keyCode)) { // up and down arrows
      const increment = e.keyCode === 38 ? -1 : 1;
      const calcIndex = filtered.indexOf(activeOption as {value: string, name: string}) + increment;
      activeOption = calcIndex < 0 ? filtered[filtered.length - 1]
        : calcIndex === filtered.length ? filtered[0]
        : filtered[calcIndex];
    }
  }

  function handleBlur(e: FocusEvent) {
    optionsVisibility(false);
  }

  function handleTokenClick(e: MouseEvent) {
    if (e.target && e.target instanceof Element && (e.target as Element).closest('.token-remove')) {
      e.stopPropagation();
      remove((e.target.closest('.token') as HTMLDivElement).dataset.id || '');
    } else if (e.target && (e.target as Element).closest('.remove-all')) {
      selected = {};
      inputValue = '';
    } else {
      optionsVisibility(true);
    }
  }

  function handleOptionMousedown(e: MouseEvent) {
    if(!e.target) return;
    const value = (e.target as HTMLButtonElement).dataset.value || '';
    if (selected[value]) {
      remove(value);
    } else {
      add(options.filter(o => o.value === value)[0]);
      input.focus();
    }
  }
</script>


<div class="multiselect">
  <button class="tokens" type="button" class:showOptions on:click|preventDefault={handleTokenClick}>
    {#each Object.values(selected) as s}
      <div class="token" data-id="{s.value}">
        <span>{s.name}</span>
        <div class="token-remove" title="Remove {s.name}">
          <svg class="icon-clear" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path d="{iconClearPath}"/>
          </svg>
        </div>
      </div>
    {/each}
    <div class="actions">
      <input autocomplete="off" bind:value={inputValue} bind:this={input} on:keyup={handleKeyup} on:blur={handleBlur} placeholder={placeholder} style="{Object.keys(selected).length > 0 ? "width: 0;" : ""}"/>
      <div class="remove-all" title="Remove All" class:hidden={!Object.keys(selected).length}>
        <svg class="icon-clear" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
          <path d="{iconClearPath}"/>
        </svg>
      </div>
      <svg class="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M5 8l4 4 4-4z"></path></svg>
    </div>
  </button>

  <select bind:this={slot} multiple class="hidden"><slot></slot></select>
  
  {#if showOptions}
    <button class="options" type="button" transition:fly="{{duration: 200, y: 5}}" on:mousedown|preventDefault={handleOptionMousedown}>
      {#each filtered as option}
        <li class:selected={selected[option.value]} class:active={activeOption === option} data-value="{option.value}">{option.name}</li>
      {/each}
    </button>
  {/if}
</div>

<style>
  .multiselect {
    background-color: var(--background-color);
    position: relative;
    width: calc(16em + 4px);
    font-size: 16px;
  }

  .tokens {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    width: 100%;
    background-color: var(--background-color);
    border: none;
    padding: 0;
  }
  .tokens::after {    
    background: none repeat scroll 0 0 transparent;
    bottom: -1px;
    content: "";
    display: block;
    height: 2px;
    left: 50%;
    position: absolute;
    background: var(--background-color);
    transition: width 0.3s ease 0s, left 0.3s ease 0s;
    width: 0;
  }
  .tokens.showOptions::after { 
    width: 100%; 
    left: 0; 
  }
  .token {
    align-items: center;
    background-color: var(--background-color3);
    border-radius: 1.25rem;
    display: flex;
    margin: .25em .5rem .25rem 0;
    max-height: 1.0rem;
    padding: .25rem .5rem .25rem .5rem;
    transition: background-color .3s;
    white-space: nowrap;
    color: var(--primary-color2);
  }
  .token:hover {
    background-color: var(--background-color2);
  }
  .token-remove, .remove-all {
    align-items: center;
    background-color: hsl(215, 8%, 28%);
    border-radius: 50%;
    color: var(--primary-color2);
    display: flex;
    justify-content: center;
    height: 1rem;
    margin-left: .25rem;
    min-width: 1rem;
  }
  .token-remove:hover, .remove-all:hover {
    background-color: hsl(213, 17%, 39%);
    cursor: pointer;
  }

  .actions {
    align-items: center;
    display: flex;
    margin-left: auto;
  }

  input {
    border: none;
    font-size: 1rem;
    line-height: 1.5rem;
    margin: 0;
    outline: none;
    padding: 0;
    width: 15em;
    background-color: transparent;
  }

  .dropdown-arrow path {
    fill: var(--primary-color2);
  }
  .multiselect:hover .dropdown-arrow path {
    fill: var(--primary-color2);
  }

  .icon-clear path {
    fill: var(--background-color);
  }

  .options {
    box-shadow: 0px 2px 4px rgba(0,0,0,.1), 0px -2px 4px rgba(0,0,0,.1);
    left: 0;
    list-style: none;
    margin-block-end: 0;
    margin-block-start: 0;
    max-height: 70vh;
    overflow: auto;
    padding-inline-start: 0;
    position: absolute;
    top: calc(100% + 1px);
    width: 100%;
    border: none;
    z-index: 100;
    border-radius: 10px;
    background-color: var(--background-color3);
    padding: 2px;
  }
  li {
    background-color: var(--background-color);
    cursor: pointer;
    padding: .5rem;
    color: var(--text-color1);
  }
  li:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  li:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  li:not(.selected):hover {
    background-color: hsl(0, 0%, 20%);
  }
  li.selected {
    background-color: var(--background-color3);
    color: var(--text-color1);
  }
  li.active {
    background-color: var(--background-color);
  }
  li.selected.active, li.selected:hover {
    background-color: var(--background-color2);
  }

  .hidden {
    display: none;
  }
</style>