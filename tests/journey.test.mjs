import test from 'node:test';
import assert from 'node:assert/strict';
import {normalize,projectRows} from '../dist/assets/journey.mjs';
test('CTAs preservam todas as modalidades e cenários válidos',()=>{
 for(const modalidade of ['global','administracao','projeto','orientacao'])for(const terreno of ['sim','nao','buscando']){
  const state=normalize({servico:'construcao',modalidade,recursos:'caixa',terreno});
  assert.equal(state.modalidade,modalidade);assert.equal(state.terreno,terreno);assert.equal(state.recursos,'caixa');
 }
});
test('gestão do projeto define financiamento; mudar recursos pede nova modalidade',()=>{
 const state=normalize({servico:'construcao',modalidade:'projeto',recursos:'proprios'},'modalidade');
 assert.equal(state.recursos,'caixa');
 assert.equal(normalize({...state,recursos:'proprios'},'recursos').modalidade,'orientacao');
 assert.equal(normalize({...state,recursos:'orientacao'},'recursos').modalidade,'orientacao');
});
test('reforma remove dados de construção e mantém o tipo escolhido',()=>{
 const state=normalize({servico:'reforma',tipo:'comercial',modalidade:'projeto',recursos:'caixa',terreno:'sim'});
 assert.deepEqual(state,{servico:'reforma',tipo:'comercial',modalidade:'orientacao',recursos:'proprios',terreno:'orientacao'});
 const rows=projectRows({...state,nome:'Teste',descricao:'Reforma do espaço'});
 assert.ok(!rows.some(([label])=>['Terreno','Participação da FCK3'].includes(label)));
 assert.ok(rows.some(([label,value])=>label==='Recursos'&&value==='Recursos próprios'));
});
test('parâmetros desconhecidos não viram opções válidas',()=>{
 assert.deepEqual(normalize({servico:'<script>',modalidade:'n/a',tipo:'x'}),{servico:'',tipo:'orientacao',modalidade:'orientacao',recursos:'orientacao',terreno:'orientacao'});
});
test('revisão preserva texto e dados de contato; telefone é opcional',()=>{
 const rows=projectRows({servico:'construcao',nome:'João',email:'joao@example.com',cidade:'Mogi',descricao:'Casa\nDois quartos'});
 assert.ok(rows.some(([label,value])=>label==='Sobre o projeto'&&value==='Casa\nDois quartos'));
 assert.ok(rows.some(([label,value])=>label==='Telefone'&&value==='Não informado'));
});
