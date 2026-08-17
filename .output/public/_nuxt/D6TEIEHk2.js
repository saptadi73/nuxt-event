import{Ct as e,F as t,J as n,Kt as r,M as i,N as a,O as o,T as s,X as c,at as l,gt as u}from"./WGmG78np.js";import{f as d}from"./yg7viFrl.js";import{r as f}from"./CFPEspFw.js";import{t as p}from"./BZiK9vZr.js";import{t as m}from"./P8dZb0AH.js";import{t as h}from"./CNs_Ozdc.js";import{n as g,t as _}from"./BbxyG11t.js";import{t as v}from"./Of7LaUDB2.js";import{t as y}from"./BQej8YWQ2.js";var b={class:`mx-auto max-w-4xl px-3 py-10 sm:px-6`},x={key:0,class:`glass-card mt-8 rounded-[2rem] p-7 text-slate-300`},S={key:1,class:`mt-8 rounded-3xl border border-red-400/30 bg-red-950/30 p-6 text-red-100`},C={key:2,class:`glass-card mt-8 rounded-[2rem] p-7`},w={class:`flex flex-wrap justify-between gap-5 border-b border-white/10 pb-6`},T={class:`text-sm text-slate-400`},E={class:`mt-1 font-semibold`},D={class:`mt-6 grid gap-5 sm:grid-cols-2`},O={class:`mt-2 text-lg font-semibold`},k={class:`mt-2 text-lg font-semibold`},A={class:`text-sm text-slate-400`},j={class:`mt-2 text-lg font-semibold`},M={class:`text-sm text-slate-400`},N={class:`mt-7 flex items-center justify-between border-t border-white/10 pt-6`},P={class:`text-2xl text-cyan-200`},F=[`disabled`],I=`last-paid-registration-id`,L=t({__name:`invoice`,setup(t){h({middleware:`auth`}),f({title:`Invoice | IWBIF 2026`});let{getMyInvoices:L,getInvoiceByRegistration:R}=g(),{getRegistration:z}=v(),{getMyTickets:B}=y(),V=d(),H=u(null),U=u(null),W=p(`current-invoice`,()=>null),G=u(!0),K=u(!1),q=u(``),J=()=>{let e=V.query.registration_id??V.query.registrationId??``;return Array.isArray(e)?e[0]||``:typeof e==`string`?e:``},Y=e=>{let t=e.trim();t&&sessionStorage.setItem(I,t)},X=async e=>{let t=e.trim();if(!t)return null;try{let e=await R(t);return Y(t),e.data}catch{try{let e=(await z(t)).data.registration_number?.trim();if(!e)return null;let n=await R(e);return Y(e),n.data}catch{return null}}};n(async()=>{let e=J();if(H.value=W.value,!H.value)try{let e=sessionStorage.getItem(`current-invoice`);e&&(H.value=JSON.parse(e))}catch{sessionStorage.removeItem(`current-invoice`)}try{try{let e=await L(),t=_(e.data),n=t.find(e=>e.order.status?.toLowerCase()===`paid`)||t[0]||null;n&&(H.value=n)}catch{}if(H.value||e&&(H.value=await X(e)),!H.value){let e=sessionStorage.getItem(I);e&&(H.value=await X(e))}if(!H.value)try{let e=await B(),t=(Array.isArray(e.data)?e.data:[])[0];t&&(H.value=await X(t.registration_id))}catch{}H.value&&(W.value=H.value,sessionStorage.setItem(`current-invoice`,JSON.stringify(H.value)),H.value.registration?.id&&Y(H.value.registration.id))}catch{H.value||(q.value=`Your invoice is not available yet. Please contact the event organizer if your payment has already been confirmed.`)}finally{G.value=!1}});let Z=(e,t)=>new Intl.NumberFormat(`id-ID`,{style:`currency`,currency:t}).format(e),Q=e=>e?new Intl.DateTimeFormat(`id-ID`,{dateStyle:`long`,timeStyle:`short`}).format(new Date(e)):`-`,$=async()=>{if(!(!U.value||!H.value)){K.value=!0;try{let e=window.open(``,`_blank`,`width=960,height=1200`);if(!e)throw Error(`Unable to open print window.`);let t=U.value.outerHTML,n=`${H.value.registration.registration_number||H.value.order.order_number} Invoice`;e.document.write(`
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
    `),e.document.close()}catch{q.value=`The PDF export could not be prepared. Please try again.`}finally{K.value=!1}}};return(t,n)=>{let u=m;return c(),o(`section`,b,[n[10]||=s(`p`,{class:`text-sm uppercase tracking-[.35em] text-cyan-200`},`Payment and Invoice`,-1),n[11]||=s(`h1`,{class:`mt-3 text-3xl font-black sm:text-4xl`},`Registration invoice`,-1),e(G)?(c(),o(`div`,x,`Loading invoice...`)):e(q)?(c(),o(`div`,S,r(e(q)),1)):e(H)?(c(),o(`article`,{key:3,id:`invoice`,ref_key:`invoiceElement`,ref:U,class:`glass-card mt-8 rounded-[2rem] p-5 sm:p-7`},[s(`div`,w,[s(`div`,null,[s(`p`,T,r(e(H).registration.event_name),1),s(`p`,E,`Invoice `+r(e(H).order.order_number),1)]),n[3]||=s(`span`,{class:`h-fit rounded-full bg-emerald-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-emerald-200`},`Paid`,-1)]),s(`dl`,D,[s(`div`,null,[n[4]||=s(`dt`,{class:`text-xs uppercase tracking-[.2em] text-slate-500`},`Registration number`,-1),s(`dd`,O,r(e(H).registration.registration_number),1)]),s(`div`,null,[n[5]||=s(`dt`,{class:`text-xs uppercase tracking-[.2em] text-slate-500`},`Participant`,-1),s(`dd`,k,r(e(H).participant.full_name),1),s(`p`,A,r(e(H).participant.email),1)]),s(`div`,null,[n[6]||=s(`dt`,{class:`text-xs uppercase tracking-[.2em] text-slate-500`},`Delegate package`,-1),s(`dd`,j,r(e(H).registration.delegate_package_name||e(H).registration.ticket_type_name||`-`),1)]),s(`div`,null,[n[7]||=s(`dt`,{class:`text-xs uppercase tracking-[.2em] text-slate-500`},`Payment status`,-1),n[8]||=s(`dd`,{class:`mt-2 text-lg font-semibold text-emerald-300`},`Paid`,-1),s(`p`,M,r(Q(e(H).payment.paid_at)),1)])]),s(`div`,N,[n[9]||=s(`span`,{class:`text-slate-400`},`Total paid`,-1),s(`strong`,P,r(Z(e(H).order.total_amount,e(H).order.currency)),1)]),s(`button`,{class:`mt-7 w-full rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 print:hidden sm:w-auto`,disabled:e(K),onClick:$},r(e(K)?`Preparing PDF...`:`Download invoice PDF`),9,F)],512)):(c(),o(`div`,C,[n[1]||=s(`p`,{class:`text-lg font-semibold`},`No invoice is available yet.`,-1),n[2]||=s(`p`,{class:`mt-2 text-slate-400`},`Your invoice will appear after your payment has been confirmed.`,-1),a(u,{to:`/dashboard/payment`,class:`mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950`},{default:l(()=>[...n[0]||=[i(`Go to payment`,-1)]]),_:1})]))])}}});export{L as default};