(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{101:function(e,t,n){},111:function(e,t,n){},112:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(10),i=n.n(c),o=(n(101),n(84)),l=n(40),s=n.n(l),u=n(61),m=n(13),d=n(82),p=n(172),f=n(167),h=n(17),E=n(169),b=n(154),g=n(151),v=n(153),k=n(155),y=n(156),w=n(38),j=n.n(w),O=n(149),I=n(3),C="https://shopping-list-cqrs.herokuapp.com",x=function(e){fetch("".concat(C,"/events"),{method:"POST",body:JSON.stringify(e),headers:{"Content-Type":"application/json"}})},S=Object(O.a)((function(e){return{listItemChecked:{background:e.palette.secondary.light,textDecoration:"line-through"},listItem:{"&:hover, &.Mui-focusVisible":{background:e.palette.primary.light}},list:{overflow:"auto",maxHeight:"calc(100vh - 117px)"}}}));function L(e){var t=e.listItems,n=e.listId,c=e.setListId,i=S(),o=i.listItem,l=i.listItemChecked,s=i.list;Object(a.useEffect)((function(){e.id&&e.id!==n&&c(e.id)}),[n,c,e.id]);return r.a.createElement(E.a,null,r.a.createElement(E.a,{p:2},r.a.createElement(g.a,{align:"center",display:"block",component:h.a,to:"edit"},"Bearbeiten")),r.a.createElement(v.a,{className:s},t.map((function(t){return r.a.createElement(b.a,{onClick:function(){return function(t){e.checkListItem(t.id);var n={list_id:e.listId,product_id:t.id,type:""};return t.checked?n.type="item_unchecked":n.type="item_checked",x(n)}(t)},key:t.id,className:Object(I.a)(o,t.checked?l:""),button:!0},r.a.createElement(k.a,null,r.a.createElement(j.a,null)),r.a.createElement(y.a,{primary:t.name}))}))))}var N=n(83),_=n(76),W=n.n(_),B=n(173),A=Object(O.a)((function(e){return{listItemChecked:{background:e.palette.secondary.light},listItem:{"&:hover, &.Mui-focusVisible":{background:e.palette.primary.light}},chipContainer:{overflowX:"auto"},list:{overflow:"auto",maxHeight:"calc(100vh - 135px)"}}}));function M(e){var t=e.listItems,n=e.products,c=A(),i=c.listItem,o=c.listItemChecked,l=c.chipContainer,s=c.list,u=Object(a.useState)([]),d=Object(m.a)(u,2),p=d[0],f=d[1],w=Array.from(new Set(n.map((function(e){return e.category}))));return r.a.createElement(E.a,null,r.a.createElement(E.a,{p:2},r.a.createElement(g.a,{align:"center",display:"block",component:h.a,to:"/list/".concat(e.listId)},"Fertig")),r.a.createElement(E.a,{p:1,display:"flex",justifyContent:"flex-start",className:l},w.map((function(e){return r.a.createElement(B.a,{key:e,icon:r.a.createElement(j.a,null),label:e,color:p.includes(e)?"primary":"default",onClick:function(){return function(e){console.log(e);var t=p.includes(e)?p.filter((function(t){return t!==e})):[].concat(Object(N.a)(p),[e]);return console.log(t),f(t)}(e)},clickable:!0})}))),r.a.createElement(v.a,{className:s},n.filter((function(e){return!(p.length>0)||p.includes(e.category)})).map((function(n){var a=t.some((function(e){return e.id===n.id}));return r.a.createElement(b.a,{onClick:function(){return function(t){var n={list_id:e.listId,product_id:t.id,type:""};return t.selected?n.type="item_removed":n.type="item_added",x(n)}(n)},className:Object(I.a)(i,a?o:""),key:n.id,button:!0},r.a.createElement(k.a,null,r.a.createElement(j.a,null)),r.a.createElement(y.a,{primary:n.name}),a&&r.a.createElement(W.a,null))}))))}var R=n(77),F=n.n(R),D=n(78),J=n.n(D),P=n(158),T=n(79),H=n.n(T),U=n(80),G=n.n(U),K=n(62),V=n.n(K),Z=n(157),q=n(163),z=n(168),X=n(171),$=n(162),Q=n(160),Y=n(161),ee=n(159),te=Object(O.a)((function(e){return{root:{width:"100%",maxWidth:360,backgroundColor:e.palette.background.paper},nested:{paddingLeft:e.spacing(4)},isDeleted:{backgroundColor:e.palette.secondary.dark}}}));function ne(e){var t=te(),n=r.a.useState(!0),a=Object(m.a)(n,2),c=a[0],i=a[1],o=r.a.useState(!1),l=Object(m.a)(o,2),s=l[0],u=l[1],d=r.a.useState(!1),p=Object(m.a)(d,2),f=p[0],g=p[1],w=r.a.useState(""),j=Object(m.a)(w,2),O=j[0],I=j[1],C=r.a.useState(""),S=Object(m.a)(C,2),L=S[0],N=S[1],_=function(){u(!1)},W=function(){g(!1)};return r.a.createElement(E.a,{className:t.root},r.a.createElement(v.a,{component:"nav","aria-label":"main mailbox folders"},r.a.createElement(b.a,{button:!0},r.a.createElement(k.a,null,r.a.createElement(F.a,null)),r.a.createElement(y.a,{onClick:function(){u(!0)},primary:"Neuer Einkaufszettel"})),r.a.createElement(b.a,{button:!0,onClick:function(){i(!c)}},r.a.createElement(k.a,null,r.a.createElement(J.a,null)),r.a.createElement(y.a,{primary:"Einkaufslisten"}),c?r.a.createElement(H.a,null):r.a.createElement(G.a,null)),r.a.createElement(Z.a,{in:c,timeout:"auto",unmountOnExit:!0},r.a.createElement(v.a,{component:"div",disablePadding:!0},e.shoppingLists.map((function(e){return r.a.createElement(b.a,{key:e.id,component:h.a,to:"/list/".concat(e.id),button:!0,className:t.nested},r.a.createElement(k.a,null,r.a.createElement(V.a,null)),r.a.createElement(y.a,{primary:e.name}))}))))),r.a.createElement(P.a,null),r.a.createElement(v.a,{component:"nav","aria-label":"secondary mailbox folders"},r.a.createElement(b.a,{button:!0},r.a.createElement(y.a,{onClick:function(){g(!0)},primary:"L\xf6schen"}))),r.a.createElement(X.a,{open:s,onClose:_,"aria-labelledby":"form-dialog-title"},r.a.createElement(ee.a,{id:"form-dialog-title"},"Neue Liste"),r.a.createElement(Q.a,null,r.a.createElement(Y.a,null,"Bitte gib den Namen deiner Einkaufsliste ein."),r.a.createElement(z.a,{autoFocus:!0,margin:"dense",id:"name",value:O,label:"Name",type:"name",fullWidth:!0,onChange:function(e){return I(e.target.value)}})),r.a.createElement($.a,null,r.a.createElement(q.a,{onClick:_,color:"primary"},"Zur\xfcck"),r.a.createElement(q.a,{onClick:function(){if(_(),O.trim())return I(""),x({type:"list_added",name:O})},color:"primary"},"OK"))),r.a.createElement(X.a,{open:f,onClose:W,"aria-labelledby":"form-dialog-title"},r.a.createElement(ee.a,{id:"form-dialog-title"},"Liste l\xf6schen"),r.a.createElement(Q.a,null,r.a.createElement(Y.a,null,"Welche Liste m\xf6chtest du l\xf6schen?"),r.a.createElement(v.a,null,e.shoppingLists.map((function(e){var n=L===e.id;return r.a.createElement(b.a,{key:e.id,onClick:function(){return N(e.id)},button:!0,className:n?t.isDeleted:""},r.a.createElement(k.a,null,r.a.createElement(V.a,null)),r.a.createElement(y.a,{primary:e.name}))})))),r.a.createElement($.a,null,r.a.createElement(q.a,{onClick:W,color:"primary"},"Zur\xfcck"),r.a.createElement(q.a,{onClick:function(){if(_(),L.trim())return N(""),x({type:"list_removed",list_id:L})},color:"primary"},"OK"))))}var ae=n(164),re=n(165),ce=n(30),ie=n(166),oe=n(81),le=n.n(oe),se=Object(O.a)((function(e){return{menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1}}}));function ue(){var e=se();return r.a.createElement(E.a,{flexGrow:1},r.a.createElement(ae.a,{position:"static"},r.a.createElement(re.a,null,r.a.createElement(ie.a,{onClick:function(){return Object(h.c)("/menu")},edge:"start",className:e.menuButton,color:"inherit","aria-label":"menu"},r.a.createElement(le.a,null)),r.a.createElement(ce.a,{variant:"h6",className:e.title},"Einkauf-App"))))}var me=Object(O.a)((function(){return{page:{margin:"0",padding:"0",maxHeight:"100vh",overflow:"hidden",position:"relative"}}}));function de(e){var t=me().page;return r.a.createElement(E.a,{className:t},r.a.createElement(ue,null),r.a.createElement(h.b,null,r.a.createElement(L,{listId:e.listId,listItems:e.listItems,checkListItem:e.checkListItem,setListId:e.setListId,path:"/list/:id"}),r.a.createElement(M,{products:e.products,listId:e.listId,listItems:e.listItems,path:"/list/:id/edit"}),r.a.createElement(ne,{shoppingLists:e.shoppingLists,path:"/menu"})))}n(111);var pe=Object(d.a)({palette:{primary:{main:"#57DBBE",light:"#80FFE3"},secondary:{main:"#915540",light:"#DF9379"}},typography:{fontFamily:"\n      Roboto Mono,\n      Roboto,\n      sans-serif\n      "}});pe=Object(p.a)(pe);var fe=function(){var e=Object(a.useState)(new Map),t=Object(m.a)(e,2),n=t[0],c=t[1],i=Object(a.useState)(!1),l=Object(m.a)(i,2),d=l[0],p=l[1],h=Object(a.useState)("1"),E=Object(m.a)(h,2),b=E[0],g=E[1],v=r.a.useState([]),k=Object(m.a)(v,2),y=k[0],w=k[1],j=Object(a.useState)([]),O=Object(m.a)(j,2),I=O[0],x=O[1];Object(a.useEffect)((function(){if(!d){var e=new EventSource("".concat(C,"/list-data"));e.onmessage=function(){var e=Object(u.a)(s.a.mark((function e(t){var n,a,r,i;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=JSON.parse(t.data),a=new Response(t.data,{headers:{"content-type":"application/json"}}),r=new Map(Object.entries(n)),c(r),!window.caches){e.next=10;break}return e.next=7,window.caches.open("shoppinglist");case 7:return i=e.sent,e.next=10,i.put("/events/".concat(b),a).catch((function(e){return console.log(e)}));case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),e.onerror=function(){var e=Object(u.a)(s.a.mark((function e(t){var n,a,r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!window.caches){e.next=9;break}return e.next=3,window.caches.match("/events/".concat(b));case 3:return n=e.sent,e.next=6,null===n||void 0===n?void 0:n.json();case 6:a=e.sent,r=new Map(Object.entries(a)),c(r);case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),p(!0)}}),[d,n,b]);var S=n.get(b)||[];return Object(a.useEffect)((function(){fetch("".concat(C,"/lists")).then((function(e){return e.json()})).then((function(e){return w(e.data)}))}),[]),Object(a.useEffect)((function(){fetch("".concat(C,"/products")).then((function(e){return e.json()})).then((function(e){var t=e.data.map((function(e){return{id:String(e.id),name:e.product_name,category:e.category,selected:S.some((function(t){return t.id==="".concat(e.id)}))}}));x(t)}))}),[]),r.a.createElement(f.a,{theme:pe},r.a.createElement(de,{products:I,shoppingLists:y,listId:b,setListId:g,listItems:S,checkListItem:function(e){var t=S.map((function(t){return t.id===e?Object(o.a)({},t,{checked:!t.checked}):t})),a=n.set(b,t);c(a)}}))},he=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function Ee(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(fe,null)),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("","/service-worker.js");he?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):Ee(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):Ee(t,e)}))}}()},96:function(e,t,n){e.exports=n(112)}},[[96,1,2]]]);
//# sourceMappingURL=main.11beba5e.chunk.js.map