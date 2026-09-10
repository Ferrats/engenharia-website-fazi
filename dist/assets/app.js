import {normalize,projectRows} from './journey.mjs';
const $=(q,root=document)=>root.querySelector(q);
const $$=(q,root=document)=>[...root.querySelectorAll(q)];
const menu=$('.menu-toggle');menu?.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));$('#navigation').classList.toggle('open',!expanded);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.click();menu.focus();}});
const path=location.pathname.split('/').pop()||'index.html';$$('nav a').forEach(a=>{if(a.getAttribute('href')===path)a.setAttribute('aria-current','page');});
const pathForm=$('#construction-path');
if(pathForm){pathForm.addEventListener('change',event=>{const raw=Object.fromEntries(new FormData(pathForm));const s=normalize(raw,event.target.name);pathForm.elements.recursos.value=s.recursos;pathForm.elements.modalidade.value=s.modalidade;$('#path-rule').textContent=s.modalidade==='projeto'?'Gestão do projeto inclui o acompanhamento do financiamento pela Caixa, sem execução da obra. Por isso, o financiamento foi selecionado.':raw.modalidade==='projeto'&&s.modalidade!=='projeto'?'A forma de pagamento mudou. Escolha outra modalidade ou mantenha “preciso de orientação”.':'';});}
const form=$('#contact-form');
if(form){
 const params=Object.fromEntries(new URLSearchParams(location.search));const first=normalize(params);
 for(const [name,value]of Object.entries(first))form.elements[name].value=value;
 const construction=$('#construction-fields');const review=$('#review');const confirmation=$('#confirmation');
 const sync=(changed='')=>{
  // Disabled construction controls must still be read so service switches can be normalized.
  const raw=Object.fromEntries(['servico','tipo','modalidade','recursos','terreno'].map(k=>[k,form.elements[k].value]));
  if(changed==='servico'){raw.modalidade='orientacao';raw.recursos='orientacao';raw.terreno='orientacao';}
  const s=normalize(raw,changed);
  for(const [name,value]of Object.entries(s))form.elements[name].value=value;
  const isConstruction=s.servico==='construcao';construction.hidden=!isConstruction;
  $$('select',construction).forEach(el=>el.disabled=!isConstruction);
  $('#reform-rule').hidden=s.servico!=='reforma';
  const title=$('#contact-title');title.replaceChildren(document.createTextNode('Vamos conhecer'),document.createElement('br'));
  const em=document.createElement('em');em.textContent=s.servico==='construcao'?'sua construção.':s.servico==='reforma'?'sua reforma.':'seu projeto.';title.append(em);
  let rule=s.modalidade==='projeto'?'Gestão do projeto inclui projeto técnico e financiamento pela Caixa, sem execução. Por isso, selecionamos o financiamento.':'';
  if(s.modalidade==='projeto'&&s.tipo==='comercial')rule+=' [Atendimento comercial nesta modalidade a confirmar com Fazilari.]';
  if(raw.modalidade==='projeto'&&s.modalidade!=='projeto')rule='A forma de pagamento mudou. Escolha outra modalidade ou mantenha “preciso de orientação”.';
  $('#form-rule').textContent=rule;
 };
 sync();
 form.addEventListener('change',e=>{if(['servico','tipo','modalidade','recursos','terreno'].includes(e.target.name))sync(e.target.name);});
 const mark=(el,message)=>{el.setAttribute('aria-invalid',message?'true':'false');const error=$(`#${el.id}-error`);if(error)error.textContent=message;};
 form.addEventListener('input',e=>{if(e.target.matches('input,textarea,select'))mark(e.target,'');});
 const stage=(n)=>{$$('.stepper li').forEach((li,i)=>{li.classList.toggle('active',i+1===n);if(i+1===n)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});};stage(1);
 form.addEventListener('submit',e=>{
  e.preventDefault();let invalid=null;
  $$('[required]',form).forEach(el=>{let message='';if(!el.value.trim())message='Preencha este campo para continuar.';else if(el.type==='email'&&!el.validity.valid)message='Informe um e-mail válido, como nome@exemplo.com.';mark(el,message);if(message&&!invalid)invalid=el;});
  if(invalid){invalid.focus();return;}
  const data=Object.fromEntries(new FormData(form));const dl=$('#review-data');dl.replaceChildren();
  for(const [label,value]of projectRows(data)){const row=document.createElement('div');const dt=document.createElement('dt');const dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);dl.append(row);}
  form.hidden=true;review.hidden=false;confirmation.hidden=true;stage(2);review.focus();review.scrollIntoView({block:'start'});
 });
 $('#edit-request').addEventListener('click',()=>{review.hidden=true;form.hidden=false;stage(1);form.elements.servico.focus();});
 $('#simulate-send').addEventListener('click',()=>{review.hidden=true;confirmation.hidden=false;stage(3);confirmation.focus();confirmation.scrollIntoView({block:'start'});});
 $('#back-review').addEventListener('click',()=>{confirmation.hidden=true;review.hidden=false;stage(2);review.focus();});
}
const cards=$$('.project-card');
if(cards.length){let filter='todas';let limit=3;const render=()=>{const matching=cards.filter(c=>filter==='todas'||c.dataset.service===filter||c.dataset.type===filter);cards.forEach(c=>c.hidden=true);matching.slice(0,limit).forEach(c=>c.hidden=false);$('#load-more').hidden=matching.length<=limit;$('#filter-status').textContent=`${matching.length} espaços de projeto · Exibindo ${Math.min(limit,matching.length)}`;};$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;limit=3;$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}));$('#load-more').addEventListener('click',()=>{limit+=3;render();});render();}
const projectTitle=$('#project-title');if(projectTitle){const raw=new URLSearchParams(location.search).get('id');const id=/^[1-6]$/.test(raw||'')?raw:null;projectTitle.textContent=id?`[Nome da obra ${id}]`:'[Nome da obra]';}
