<template><LegalPage title="Cancellation and Refund Policy" intro="Ticket changes and refunds are handled fairly while protecting event commitments and payment costs." :sections="sections" /></template>
<script setup lang="ts">
useSeoMeta({title:'Refund Policy | IWBIF 2026'});
const sections=[
  {title:'Refund requests',text:'Refund eligibility follows the deadline and conditions communicated with the selected ticket. Administrative and payment processing fees may not be refundable.'},
  {title:'Ticket transfers',text:'Tickets cannot be transferred without organizer approval and all approved changes must be completed before the announced transfer deadline.'},
  {title:'Program changes',text:'Speaker, schedule, room, and track adjustments do not automatically qualify for a refund when the core forum continues as planned.'},
  {title:'Event cancellation',text:'If the organizer cancels the event, participants receive official instructions through the registered email about available remedies.'}
];
</script>
