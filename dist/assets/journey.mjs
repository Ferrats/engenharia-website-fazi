export const options={servico:['construcao','reforma'],tipo:['orientacao','residencial','comercial'],modalidade:['orientacao','global','administracao','projeto'],recursos:['orientacao','proprios','caixa'],terreno:['orientacao','sim','nao','buscando']};
export const labels={servico:{construcao:'Construção',reforma:'Reforma'},tipo:{orientacao:'Ainda não sei',residencial:'Residencial',comercial:'Comercial'},modalidade:{orientacao:'Ainda preciso de orientação',global:'Empreitada global — obra completa',administracao:'Administração da obra',projeto:'Gestão do projeto — projeto e financiamento, sem execução'},recursos:{orientacao:'Preciso de orientação',proprios:'Recursos próprios',caixa:'Financiamento pela Caixa'},terreno:{orientacao:'Preciso de orientação',sim:'Sim, já tenho terreno',nao:'Não tenho terreno',buscando:'Estou buscando um terreno'}};
export function normalize(input,changed=''){
 const state=Object.fromEntries(Object.entries(options).map(([key,values])=>[key,values.includes(input[key])?input[key]:(key==='servico'?'':'orientacao')]));
 if(state.servico==='reforma'){state.recursos='proprios';state.modalidade='orientacao';state.terreno='orientacao';}
 else if(state.servico==='construcao'&&state.modalidade==='projeto'){
  if(changed==='recursos'&&state.recursos!=='caixa') state.modalidade='orientacao';
  else state.recursos='caixa';
 }
 return state;
}
export function projectRows(data){
 const s=normalize(data);const rows=[['Serviço',labels.servico[s.servico]||'Não informado'],['Tipo de imóvel',labels.tipo[s.tipo]],['Cidade e bairro',data.cidade||'']];
 if(s.servico==='construcao') rows.push(['Participação da FCK3',labels.modalidade[s.modalidade]],['Recursos',labels.recursos[s.recursos]],['Terreno',labels.terreno[s.terreno]]);
 else rows.push(['Recursos','Recursos próprios']);
 rows.push(['Sobre o projeto',data.descricao||''],['Nome',data.nome||''],['E-mail',data.email||''],['Telefone',data.telefone||'Não informado']);return rows;
}
