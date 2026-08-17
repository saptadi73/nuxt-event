import{A as e,C as t,E as n,J as r,K as i,N as a,Wt as o,j as s,mt as c,rt as l,xt as u}from"./B-z84zkO.js";import{f as d}from"./Qa8bcr-W.js";import{r as f}from"./BVRKn77F.js";import{t as p}from"./DS22AJSA.js";import{t as m}from"./CaHC_FMm.js";import{t as h}from"./CNs_Ozdc.js";import{n as g,t as _}from"./CVpEDwKO.js";import{t as v}from"./XKvIZXPM2.js";import{t as y}from"./BeBqB4Vk2.js";var b={class:`mx-auto max-w-4xl px-3 py-10 sm:px-6`},x={key:0,class:`glass-card mt-8 rounded-[2rem] p-7 text-slate-300`},S={key:1,class:`mt-8 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100`},C={key:2,class:`glass-card mt-8 rounded-[2rem] p-7`},w={class:`flex flex-wrap justify-between gap-5 border-b border-white/10 pb-6`},T={class:`text-sm text-slate-400`},E={class:`mt-1 font-semibold`},D={class:`mt-6 grid gap-5 sm:grid-cols-2`},O={class:`mt-2 text-lg font-semibold`},k={class:`mt-2 text-lg font-semibold`},A={class:`text-sm text-slate-400`},j={class:`mt-2 text-lg font-semibold`},M={class:`text-sm text-slate-400`},N={class:`mt-7 flex items-center justify-between border-t border-white/10 pt-6`},P={class:`text-2xl text-cyan-200`},F=[`disabled`],I=`last-paid-registration-id`,L=a({__name:`invoice`,setup(a){h({middleware:`auth`}),f({title:`Invoice | IWBIF 2026`});let{getMyInvoices:L,getInvoiceByRegistration:R}=g(),{getRegistration:z}=v(),{getMyTickets:B}=y(),V=d(),H=c(null),U=c(null),W=p(`current-invoice`,()=>null),G=c(!0),K=c(!1),q=c(``),J=()=>{let e=V.query.registration_id??V.query.registrationId??``;return Array.isArray(e)?e[0]||``:typeof e==`string`?e:``},Y=e=>{let t=e.trim();t&&sessionStorage.setItem(I,t)},X=async e=>{let t=e.trim();if(!t)return null;try{let e=await R(t);return Y(t),e.data}catch{try{let e=(await z(t)).data.registration_number?.trim();if(!e)return null;let n=await R(e);return Y(e),n.data}catch{return null}}};i(async()=>{let e=J();if(H.value=W.value,!H.value)try{let e=sessionStorage.getItem(`current-invoice`);e&&(H.value=JSON.parse(e))}catch{sessionStorage.removeItem(`current-invoice`)}try{try{let e=await L(),t=_(e.data),n=t.find(e=>e.order.status?.toLowerCase()===`paid`)||t[0]||null;n&&(H.value=n)}catch{}if(H.value||e&&(H.value=await X(e)),!H.value){let e=sessionStorage.getItem(I);e&&(H.value=await X(e))}if(!H.value)try{let e=await B(),t=(Array.isArray(e.data)?e.data:[])[0];t&&(H.value=await X(t.registration_id))}catch{}H.value&&(W.value=H.value,sessionStorage.setItem(`current-invoice`,JSON.stringify(H.value)),H.value.registration?.id&&Y(H.value.registration.id))}catch{H.value||(q.value=`Your invoice is not available yet. Please contact the event organizer if your payment has already been confirmed.`)}finally{G.value=!1}});let Z=(e,t)=>new Intl.NumberFormat(`id-ID`,{style:`currency`,currency:t}).format(e),Q=e=>e?new Intl.DateTimeFormat(`id-ID`,{dateStyle:`long`,timeStyle:`short`}).format(new Date(e)):`-`,$=async()=>{if(!(!U.value||!H.value)){K.value=!0;try{let e=window.open(``,`_blank`,`width=960,height=1200`);if(!e)throw Error(`Unable to open print window.`);let t=U.value.outerHTML,n=`${H.value.registration.registration_number||H.value.order.order_number} Invoice`;e.document.write(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${n}</title>
          <style>
            :root {
              color-scheme: light;
            }
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 32px;
              background: #eef4fb;
              color: #08111f;
              font-family: Arial, Helvetica, sans-serif;
            }
            .glass-card {
              max-width: 840px;
              margin: 0 auto;
              border: 1px solid #d7e2f0;
              border-radius: 28px;
              padding: 32px;
              background: #ffffff;
              box-shadow: 0 18px 48px rgba(8, 17, 31, 0.08);
            }
            .text-slate-400,
            .text-slate-500 {
              color: #5b6b80 !important;
            }
            .text-cyan-200,
            .text-cyan-200\\/70,
            .text-emerald-200,
            .text-emerald-300 {
              color: #0f766e !important;
            }
            .text-2xl,
            .text-lg,
            .font-semibold,
            .font-black {
              color: #08111f;
            }
            .bg-emerald-300\\/10 {
              background: #e6fffa !important;
            }
            .border-white\\/10 {
              border-color: #d7e2f0 !important;
            }
            .print\\:hidden,
            button,
            a {
              display: none !important;
            }
            dl {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 20px;
            }
            dt {
              font-size: 12px;
              letter-spacing: 0.18em;
              text-transform: uppercase;
            }
            dd {
              margin: 8px 0 0;
            }
            @media print {
              body {
                padding: 0;
                background: #ffffff;
              }
              .glass-card {
                max-width: none;
                border: none;
                border-radius: 0;
                box-shadow: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${t}
          <script>
            window.onload = () => {
              window.print();
            };
          <\/script>
        </body>
      </html>
    `),e.document.close()}catch{q.value=`The PDF export could not be prepared. Please try again.`}finally{K.value=!1}}};return(i,a)=>{let c=m;return r(),n(`section`,b,[a[10]||=t(`p`,{class:`text-sm uppercase tracking-[.35em] text-cyan-200`},`Payment and Invoice`,-1),a[11]||=t(`h1`,{class:`mt-3 text-3xl font-black sm:text-4xl`},`Registration invoice`,-1),u(G)?(r(),n(`div`,x,`Loading invoice...`)):u(q)?(r(),n(`div`,S,o(u(q)),1)):u(H)?(r(),n(`article`,{key:3,id:`invoice`,ref_key:`invoiceElement`,ref:U,class:`glass-card mt-8 rounded-[2rem] p-5 sm:p-7`},[t(`div`,w,[t(`div`,null,[t(`p`,T,o(u(H).registration.event_name),1),t(`p`,E,`Invoice `+o(u(H).order.order_number),1)]),a[3]||=t(`span`,{class:`h-fit rounded-full bg-emerald-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-emerald-200`},`Paid`,-1)]),t(`dl`,D,[t(`div`,null,[a[4]||=t(`dt`,{class:`text-xs uppercase tracking-[.2em] text-slate-500`},`Registration number`,-1),t(`dd`,O,o(u(H).registration.registration_number),1)]),t(`div`,null,[a[5]||=t(`dt`,{class:`text-xs uppercase tracking-[.2em] text-slate-500`},`Participant`,-1),t(`dd`,k,o(u(H).participant.full_name),1),t(`p`,A,o(u(H).participant.email),1)]),t(`div`,null,[a[6]||=t(`dt`,{class:`text-xs uppercase tracking-[.2em] text-slate-500`},`Delegate package`,-1),t(`dd`,j,o(u(H).registration.delegate_package_name||u(H).registration.ticket_type_name||`-`),1)]),t(`div`,null,[a[7]||=t(`dt`,{class:`text-xs uppercase tracking-[.2em] text-slate-500`},`Payment status`,-1),a[8]||=t(`dd`,{class:`mt-2 text-lg font-semibold text-emerald-300`},`Paid`,-1),t(`p`,M,o(Q(u(H).payment.paid_at)),1)])]),t(`div`,N,[a[9]||=t(`span`,{class:`text-slate-400`},`Total paid`,-1),t(`strong`,P,o(Z(u(H).order.total_amount,u(H).order.currency)),1)]),t(`button`,{class:`mt-7 w-full rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 print:hidden sm:w-auto`,disabled:u(K),onClick:$},o(u(K)?`Preparing PDF...`:`Download invoice PDF`),9,F)],512)):(r(),n(`div`,C,[a[1]||=t(`p`,{class:`text-lg font-semibold`},`No invoice is available yet.`,-1),a[2]||=t(`p`,{class:`mt-2 text-slate-400`},`Your invoice will appear after your payment has been confirmed.`,-1),s(c,{to:`/dashboard/payment`,class:`mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950`},{default:l(()=>[...a[0]||=[e(`Go to payment`,-1)]]),_:1})]))])}}});export{L as default};