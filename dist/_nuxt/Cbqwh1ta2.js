import{A as e,C as t,E as n,J as r,K as i,N as a,Wt as o,j as s,mt as c,rt as l,xt as u}from"./B-z84zkO.js";import{f as d}from"./Qa8bcr-W.js";import{r as f}from"./BVRKn77F.js";import{t as p}from"./DS22AJSA.js";import{t as m}from"./CaHC_FMm.js";import{t as h}from"./CNs_Ozdc.js";import{n as g,t as _}from"./BQCYlNoo2.js";import{t as v}from"./XKvIZXPM2.js";import{t as ee}from"./BeBqB4Vk2.js";var y={class:`mx-auto max-w-4xl px-3 py-10 sm:px-6`},b={key:0,class:`glass-card mt-8 rounded-[2rem] p-7 text-slate-300`},x={key:1,class:`mt-8 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100`},S={key:2,class:`glass-card mt-8 rounded-[2rem] p-7`},C={class:`flex flex-wrap justify-between gap-5 border-b border-white/10 pb-6`},w={class:`text-sm text-slate-400`},T={class:`mt-1 font-semibold`},E={class:`mt-6 grid gap-5 sm:grid-cols-2`},D={class:`mt-2 text-lg font-semibold`},O={class:`mt-2 text-lg font-semibold`},k={class:`text-sm text-slate-400`},A={class:`mt-2 text-lg font-semibold`},j={class:`text-sm text-slate-400`},M={class:`mt-7 flex items-center justify-between border-t border-white/10 pt-6`},N={class:`text-2xl text-cyan-200`},P=[`disabled`],F=`last-paid-registration-id`,I=a({__name:`invoice`,setup(a){h({middleware:`auth`}),f({title:`Invoice | IWBIF 2026`});let{getMyInvoices:I,getInvoiceByRegistration:L}=g(),{getRegistration:R}=v(),{getMyTickets:z}=ee(),B=d(),V=c(null),H=c(null),U=p(`current-invoice`,()=>null),W=c(!0),G=c(!1),K=c(``),q=()=>{let e=B.query.order_id??B.query.orderId??``;return Array.isArray(e)?e[0]||``:typeof e==`string`?e:``},J=()=>{let e=B.query.registration_id??B.query.registrationId??``;return Array.isArray(e)?e[0]||``:typeof e==`string`?e:``},Y=e=>{let t=e.trim();t&&sessionStorage.setItem(F,t)},X=async e=>{let t=e.trim();if(!t)return null;try{let e=await L(t);return Y(t),e.data}catch{try{let e=(await R(t)).data.registration_number?.trim();if(!e)return null;let n=await L(e);return Y(e),n.data}catch{return null}}};i(async()=>{let e=J(),t=q()||sessionStorage.getItem(`iwbif-store-order-id`)||``;if(V.value=U.value,!V.value)try{let e=sessionStorage.getItem(`current-invoice`);e&&(V.value=JSON.parse(e))}catch{sessionStorage.removeItem(`current-invoice`)}try{try{let e=await I(),n=_(e.data),r=(t?n.find(e=>e.order.id===t):null)||n.find(e=>e.order.status?.toLowerCase()===`paid`)||n[0]||null;r&&(V.value=r)}catch{}if(V.value||e&&(V.value=await X(e)),!V.value){let e=sessionStorage.getItem(F);e&&(V.value=await X(e))}if(!V.value)try{let e=await z(),t=(Array.isArray(e.data)?e.data:[])[0];t&&(V.value=await X(t.registration_id))}catch{}V.value&&(U.value=V.value,sessionStorage.setItem(`current-invoice`,JSON.stringify(V.value)),V.value.registration?.id&&Y(V.value.registration.id))}catch{V.value||(K.value=`Your invoice is not available yet. Please contact the event organizer if your payment has already been confirmed.`)}finally{W.value=!1}});let Z=(e,t)=>new Intl.NumberFormat(`id-ID`,{style:`currency`,currency:t}).format(e),Q=e=>e?new Intl.DateTimeFormat(`id-ID`,{dateStyle:`long`,timeStyle:`short`}).format(new Date(e)):`-`,$=async()=>{if(!(!H.value||!V.value)){G.value=!0;try{let e=window.open(``,`_blank`,`width=960,height=1200`);if(!e)throw Error(`Unable to open print window.`);let t=H.value.outerHTML,n=`${V.value.registration.registration_number||V.value.order.order_number} Invoice`;e.document.write(`
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
    `),e.document.close()}catch{K.value=`The PDF export could not be prepared. Please try again.`}finally{G.value=!1}}};return(i,a)=>{let c=m;return r(),n(`section`,y,[a[10]||=t(`p`,{class:`text-sm uppercase tracking-[.35em] text-cyan-200`},`Payment and Invoice`,-1),a[11]||=t(`h1`,{class:`mt-3 text-3xl font-black sm:text-4xl`},`Registration invoice`,-1),u(W)?(r(),n(`div`,b,`Loading invoice...`)):u(K)?(r(),n(`div`,x,o(u(K)),1)):u(V)?(r(),n(`article`,{key:3,id:`invoice`,ref_key:`invoiceElement`,ref:H,class:`glass-card mt-8 rounded-[2rem] p-5 sm:p-7`},[t(`div`,C,[t(`div`,null,[t(`p`,w,o(u(V).registration.event_name),1),t(`p`,T,`Invoice `+o(u(V).order.order_number),1)]),a[3]||=t(`span`,{class:`h-fit rounded-full bg-emerald-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-emerald-200`},`Paid`,-1)]),t(`dl`,E,[t(`div`,null,[a[4]||=t(`dt`,{class:`text-xs uppercase tracking-[.2em] text-slate-500`},`Registration number`,-1),t(`dd`,D,o(u(V).registration.registration_number),1)]),t(`div`,null,[a[5]||=t(`dt`,{class:`text-xs uppercase tracking-[.2em] text-slate-500`},`Participant`,-1),t(`dd`,O,o(u(V).participant.full_name),1),t(`p`,k,o(u(V).participant.email),1)]),t(`div`,null,[a[6]||=t(`dt`,{class:`text-xs uppercase tracking-[.2em] text-slate-500`},`Delegate package`,-1),t(`dd`,A,o(u(V).registration.delegate_package_name||u(V).registration.ticket_type_name||`-`),1)]),t(`div`,null,[a[7]||=t(`dt`,{class:`text-xs uppercase tracking-[.2em] text-slate-500`},`Payment status`,-1),a[8]||=t(`dd`,{class:`mt-2 text-lg font-semibold text-emerald-300`},`Paid`,-1),t(`p`,j,o(Q(u(V).payment.paid_at)),1)])]),t(`div`,M,[a[9]||=t(`span`,{class:`text-slate-400`},`Total paid`,-1),t(`strong`,N,o(Z(u(V).order.total_amount,u(V).order.currency)),1)]),t(`button`,{class:`mt-7 w-full rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 print:hidden sm:w-auto`,disabled:u(G),onClick:$},o(u(G)?`Preparing PDF...`:`Download invoice PDF`),9,P)],512)):(r(),n(`div`,S,[a[1]||=t(`p`,{class:`text-lg font-semibold`},`No invoice is available yet.`,-1),a[2]||=t(`p`,{class:`mt-2 text-slate-400`},`Your invoice will appear after your payment has been confirmed.`,-1),s(c,{to:`/dashboard/payment`,class:`mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950`},{default:l(()=>[...a[0]||=[e(`Go to payment`,-1)]]),_:1})]))])}}});export{I as default};