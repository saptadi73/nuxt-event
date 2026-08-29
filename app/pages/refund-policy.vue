<template><LegalPage :title="document.title" :intro="document.intro" :sections="document.sections" /></template>
<script setup lang="ts">const document=useLegalContent('refund'); useSeoMeta({title:()=>`${document.value.label} | IWBIF 2026`,description:()=>document.value.intro});</script>
