/* ================================================================
   FACULDADE — Sistema Acadêmico
   Persistência via localStorage
   ================================================================ */

'use strict';

// ── STORAGE ──────────────────────────────────────────────────────
const KEY  = 'faculdade_';
const load = k => JSON.parse(localStorage.getItem(KEY + k) || '[]');
const save = (k, v) => localStorage.setItem(KEY + k, JSON.stringify(v));
const uid  = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// ── STATE ─────────────────────────────────────────────────────────
let alunos       = load('alunos');
let professores  = load('professores');
let funcionarios = load('funcionarios');
let disciplinas  = load('disciplinas');
let matriculas   = load('matriculas');
let provas       = load('provas');
let agenda       = load('agenda');

// ── SEED DEMO ─────────────────────────────────────────────────────
if (!alunos.length) {
  alunos = [
    { id: uid(), nome: 'Ana Paula Ferreira', cpf: '123.456.789-00', email: 'ana@email.com',   tel: '(71)99999-1111', curso: 'Ciência da Computação', periodo: '3º Período', status: 'Ativo', nasc: '2002-05-15' },
    { id: uid(), nome: 'Bruno Costa Silva',  cpf: '987.654.321-00', email: 'bruno@email.com', tel: '(71)98888-2222', curso: 'Engenharia Civil',       periodo: '5º Período', status: 'Ativo', nasc: '2000-09-22' },
    { id: uid(), nome: 'Carla Mendes',       cpf: '111.222.333-44', email: 'carla@email.com', tel: '(71)97777-3333', curso: 'Direito',                periodo: '2º Período', status: 'Ativo', nasc: '2003-01-30' },
  ];
  save('alunos', alunos);
}
if (!professores.length) {
  professores = [
    { id: uid(), nome: 'Prof. Ricardo Alves',   cpf: '555.666.777-88', email: 'ricardo@faculdade.edu',  tel: '(71)96666-4444', esp: 'Algoritmos e Estrutura de Dados', tit: 'Doutorado' },
    { id: uid(), nome: 'Profa. Fernanda Lima',  cpf: '444.555.666-77', email: 'fernanda@faculdade.edu', tel: '(71)95555-5555', esp: 'Cálculo e Álgebra Linear',         tit: 'Mestrado'  },
  ];
  save('professores', professores);
}
if (!disciplinas.length) {
  disciplinas = [
    { id: uid(), nome: 'Algoritmos e Programação', codigo: 'CC101',  carga: 80, profId: professores[0]?.id || '', periodo: '1º Período', area: 'Tecnologia', creditos: 5, ementa: 'Fundamentos de lógica e programação estruturada.' },
    { id: uid(), nome: 'Cálculo I',                codigo: 'MAT201', carga: 60, profId: professores[1]?.id || '', periodo: '1º Período', area: 'Exatas',     creditos: 4, ementa: 'Limites, derivadas e integrais.' },
  ];
  save('disciplinas', disciplinas);
}
if (!agenda.length) {
  agenda = [
    { id: uid(), titulo: 'Prova de Cálculo I', tipo: 'Prova',  data: new Date(Date.now() + 5  * 86400000).toISOString().slice(0, 10), hora: '08:00', local: 'Sala 201',          desc: 'P1 de Cálculo I' },
    { id: uid(), titulo: 'Semana Acadêmica',   tipo: 'Evento', data: new Date(Date.now() + 12 * 86400000).toISOString().slice(0, 10), hora: '09:00', local: 'Auditório Central', desc: 'Palestras e workshops' },
  ];
  save('agenda', agenda);
}

// ── NAVEGAÇÃO ─────────────────────────────────────────────────────
const titles = {
  dashboard: 'Dashboard', alunos: 'Alunos', professores: 'Professores',
  funcionarios: 'Funcionários', disciplinas: 'Disciplinas',
  matriculas: 'Matrículas', provas: 'Provas & Notas', agenda: 'Agenda',
};
const badges = {
  dashboard: 'VISÃO GERAL', alunos: 'DISCENTES', professores: 'DOCENTES',
  funcionarios: 'ADMINISTRATIVO', disciplinas: 'GRADE CURRICULAR',
  matriculas: 'VÍNCULOS', provas: 'AVALIAÇÕES', agenda: 'CALENDÁRIO',
};

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`.nav-item[onclick="navigate('${page}')"]`).classList.add('active');
  document.getElementById('page-title').textContent = titles[page];
  document.getElementById('page-badge').textContent = badges[page];
  document.getElementById('sidebar').classList.remove('open');
  renderPage(page);
}

function renderPage(p) {
  const map = {
    dashboard:    renderDashboard,
    alunos:       renderAlunos,
    professores:  renderProfessores,
    funcionarios: renderFuncionarios,
    disciplinas:  renderDisciplinas,
    matriculas:   renderMatriculas,
    provas:       renderProvas,
    agenda:       renderAgenda,
  };
  map[p]?.();
}

// ── DASHBOARD ─────────────────────────────────────────────────────
function renderDashboard() {
  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card blue">  <div class="stat-num">${alunos.length}</div>       <div class="stat-label">Alunos</div></div>
    <div class="stat-card purple"><div class="stat-num">${professores.length}</div>  <div class="stat-label">Professores</div></div>
    <div class="stat-card gold">  <div class="stat-num">${disciplinas.length}</div>  <div class="stat-label">Disciplinas</div></div>
    <div class="stat-card green"> <div class="stat-num">${matriculas.length}</div>   <div class="stat-label">Matrículas</div></div>
    <div class="stat-card red">   <div class="stat-num">${provas.length}</div>       <div class="stat-label">Avaliações</div></div>
  `;

  const recentMat = [...matriculas].slice(-5).reverse();
  document.getElementById('dash-matriculas').innerHTML = recentMat.length
    ? `<table><thead><tr><th>Aluno</th><th>Disciplina</th><th>Status</th></tr></thead><tbody>
        ${recentMat.map(m => {
          const a = alunos.find(x => x.id === m.alunoId);
          const d = disciplinas.find(x => x.id === m.discId);
          return `<tr><td>${a?.nome || '—'}</td><td>${d?.nome || '—'}</td><td>${pillStatus(m.status)}</td></tr>`;
        }).join('')}
       </tbody></table>`
    : empty('Nenhuma matrícula ainda');

  const hoje = new Date().toISOString().slice(0, 10);
  const upcoming = agenda.filter(e => e.data >= hoje).slice(0, 5);
  document.getElementById('dash-provas').innerHTML = upcoming.length
    ? `<table><thead><tr><th>Evento</th><th>Tipo</th><th>Data</th></tr></thead><tbody>
        ${upcoming.map(e => `
          <tr>
            <td>${e.titulo}</td>
            <td>${pillTipo(e.tipo)}</td>
            <td class="mono">${fmtDate(e.data)}</td>
          </tr>`).join('')}
       </tbody></table>`
    : empty('Sem eventos próximos');
}

// ── ALUNOS ────────────────────────────────────────────────────────
function renderAlunos(q = '') {
  const list = q
    ? alunos.filter(a => a.nome.toLowerCase().includes(q.toLowerCase()) || a.cpf.includes(q))
    : alunos;
  const tb = document.getElementById('tbody-alunos');
  if (!list.length) {
    tb.innerHTML = `<tr><td colspan="7">${empty('Nenhum aluno cadastrado')}</td></tr>`;
    return;
  }
  tb.innerHTML = list.map((a, i) => `
    <tr>
      <td class="mono">${String(i + 1).padStart(2, '0')}</td>
      <td style="font-weight:500">${a.nome}</td>
      <td class="mono">${a.cpf}</td>
      <td>${a.curso}</td>
      <td>${a.periodo}</td>
      <td>${pillStatus(a.status)}</td>
      <td><div class="actions">
        <button class="btn btn-ghost btn-sm" onclick="editAluno('${a.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="confirmDelete('aluno','${a.id}')">✕</button>
      </div></td>
    </tr>`).join('');
}

function editAluno(id) {
  const a = alunos.find(x => x.id === id);
  document.getElementById('aluno-id').value      = id;
  document.getElementById('aluno-nome').value    = a.nome;
  document.getElementById('aluno-cpf').value     = a.cpf;
  document.getElementById('aluno-email').value   = a.email || '';
  document.getElementById('aluno-tel').value     = a.tel || '';
  document.getElementById('aluno-curso').value   = a.curso;
  document.getElementById('aluno-periodo').value = a.periodo;
  document.getElementById('aluno-status').value  = a.status;
  document.getElementById('aluno-nasc').value    = a.nasc || '';
  document.getElementById('modal-aluno-title').textContent = 'Editar Aluno';
  openModal('modal-aluno');
}

function salvarAluno() {
  const id  = document.getElementById('aluno-id').value;
  const obj = {
    id:      id || uid(),
    nome:    document.getElementById('aluno-nome').value.trim(),
    cpf:     document.getElementById('aluno-cpf').value.trim(),
    email:   document.getElementById('aluno-email').value.trim(),
    tel:     document.getElementById('aluno-tel').value.trim(),
    curso:   document.getElementById('aluno-curso').value,
    periodo: document.getElementById('aluno-periodo').value,
    status:  document.getElementById('aluno-status').value,
    nasc:    document.getElementById('aluno-nasc').value,
  };
  if (!obj.nome || !obj.cpf) { toast('Preencha nome e CPF', 'error'); return; }
  if (id) alunos = alunos.map(a => a.id === id ? obj : a);
  else alunos.push(obj);
  save('alunos', alunos);
  closeModal('modal-aluno');
  renderAlunos();
  renderDashboard();
  toast(id ? 'Aluno atualizado' : 'Aluno cadastrado', 'success');
  document.getElementById('modal-aluno-title').textContent = 'Novo Aluno';
}

// ── PROFESSORES ───────────────────────────────────────────────────
function renderProfessores(q = '') {
  const list = q ? professores.filter(p => p.nome.toLowerCase().includes(q.toLowerCase())) : professores;
  const tb = document.getElementById('tbody-professores');
  if (!list.length) {
    tb.innerHTML = `<tr><td colspan="7">${empty('Nenhum professor cadastrado')}</td></tr>`;
    return;
  }
  tb.innerHTML = list.map((p, i) => `
    <tr>
      <td class="mono">${String(i + 1).padStart(2, '0')}</td>
      <td style="font-weight:500">${p.nome}</td>
      <td class="mono">${p.cpf}</td>
      <td>${p.esp}</td>
      <td class="mono">${p.email || '—'}</td>
      <td><span class="pill pill-purple">${p.tit}</span></td>
      <td><div class="actions">
        <button class="btn btn-ghost btn-sm" onclick="editProf('${p.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="confirmDelete('professor','${p.id}')">✕</button>
      </div></td>
    </tr>`).join('');
}

function editProf(id) {
  const p = professores.find(x => x.id === id);
  document.getElementById('prof-id').value    = id;
  document.getElementById('prof-nome').value  = p.nome;
  document.getElementById('prof-cpf').value   = p.cpf;
  document.getElementById('prof-email').value = p.email || '';
  document.getElementById('prof-tel').value   = p.tel || '';
  document.getElementById('prof-esp').value   = p.esp || '';
  document.getElementById('prof-tit').value   = p.tit || 'Graduação';
  document.getElementById('modal-prof-title').textContent = 'Editar Professor';
  openModal('modal-professor');
}

function salvarProfessor() {
  const id  = document.getElementById('prof-id').value;
  const obj = {
    id:    id || uid(),
    nome:  document.getElementById('prof-nome').value.trim(),
    cpf:   document.getElementById('prof-cpf').value.trim(),
    email: document.getElementById('prof-email').value.trim(),
    tel:   document.getElementById('prof-tel').value.trim(),
    esp:   document.getElementById('prof-esp').value.trim(),
    tit:   document.getElementById('prof-tit').value,
  };
  if (!obj.nome) { toast('Informe o nome', 'error'); return; }
  if (id) professores = professores.map(p => p.id === id ? obj : p);
  else professores.push(obj);
  save('professores', professores);
  closeModal('modal-professor');
  renderProfessores();
  renderDashboard();
  toast(id ? 'Professor atualizado' : 'Professor cadastrado', 'success');
}

// ── FUNCIONÁRIOS ──────────────────────────────────────────────────
function renderFuncionarios() {
  const tb = document.getElementById('tbody-funcionarios');
  if (!funcionarios.length) {
    tb.innerHTML = `<tr><td colspan="7">${empty('Nenhum funcionário cadastrado')}</td></tr>`;
    return;
  }
  tb.innerHTML = funcionarios.map((f, i) => `
    <tr>
      <td class="mono">${String(i + 1).padStart(2, '0')}</td>
      <td style="font-weight:500">${f.nome}</td>
      <td class="mono">${f.cpf}</td>
      <td>${f.cargo}</td>
      <td><span class="pill pill-blue">${f.setor}</span></td>
      <td class="mono">${f.email || '—'}</td>
      <td><div class="actions">
        <button class="btn btn-ghost btn-sm" onclick="editFunc('${f.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="confirmDelete('funcionario','${f.id}')">✕</button>
      </div></td>
    </tr>`).join('');
}

function editFunc(id) {
  const f = funcionarios.find(x => x.id === id);
  document.getElementById('func-id').value      = id;
  document.getElementById('func-nome').value    = f.nome || '';
  document.getElementById('func-cpf').value     = f.cpf || '';
  document.getElementById('func-email').value   = f.email || '';
  document.getElementById('func-cargo').value   = f.cargo || '';
  document.getElementById('func-setor').value   = f.setor || '';
  document.getElementById('func-salario').value = f.salario || '';
  openModal('modal-funcionario');
}

function salvarFuncionario() {
  const id  = document.getElementById('func-id').value;
  const obj = {
    id:      id || uid(),
    nome:    document.getElementById('func-nome').value.trim(),
    cpf:     document.getElementById('func-cpf').value.trim(),
    email:   document.getElementById('func-email').value.trim(),
    cargo:   document.getElementById('func-cargo').value.trim(),
    setor:   document.getElementById('func-setor').value,
    salario: document.getElementById('func-salario').value,
  };
  if (!obj.nome) { toast('Informe o nome', 'error'); return; }
  if (id) funcionarios = funcionarios.map(f => f.id === id ? obj : f);
  else funcionarios.push(obj);
  save('funcionarios', funcionarios);
  closeModal('modal-funcionario');
  renderFuncionarios();
  toast('Funcionário salvo', 'success');
}

// ── DISCIPLINAS ───────────────────────────────────────────────────
function renderDisciplinas() {
  const c = document.getElementById('cards-disciplinas');
  if (!disciplinas.length) {
    c.innerHTML = `<div class="empty"><div class="empty-icon">📚</div><p>Nenhuma disciplina cadastrada</p></div>`;
    return;
  }
  const areaColors = { Exatas: 'blue', Humanas: 'gold', Biológicas: 'green', Tecnologia: 'purple', Linguagens: 'red' };
  c.innerHTML = disciplinas.map(d => {
    const prof  = professores.find(p => p.id === d.profId);
    const color = areaColors[d.area] || 'blue';
    return `<div class="item-card">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
        <span class="pill pill-${color}">${d.area}</span>
        <span class="mono" style="font-size:.7rem;color:var(--muted)">${d.codigo}</span>
      </div>
      <div class="item-card-title">${d.nome}</div>
      <div class="item-card-sub">${d.periodo} · ${d.carga}h · ${d.creditos} créditos</div>
      <div style="font-size:.78rem;color:var(--muted)">👤 ${prof?.nome || 'Sem professor'}</div>
      ${d.ementa ? `<div style="font-size:.76rem;color:var(--muted);margin-top:8px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${d.ementa}</div>` : ''}
      <div class="item-card-actions">
        <button class="btn btn-ghost btn-sm" onclick="editDisc('${d.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="confirmDelete('disciplina','${d.id}')">Excluir</button>
      </div>
    </div>`;
  }).join('');
}

function editDisc(id) {
  const d = disciplinas.find(x => x.id === id);
  document.getElementById('disc-id').value       = id;
  document.getElementById('disc-nome').value     = d.nome;
  document.getElementById('disc-codigo').value   = d.codigo;
  document.getElementById('disc-carga').value    = d.carga;
  document.getElementById('disc-periodo').value  = d.periodo;
  document.getElementById('disc-area').value     = d.area;
  document.getElementById('disc-creditos').value = d.creditos;
  document.getElementById('disc-ementa').value   = d.ementa || '';
  populateProfSelect('disc-prof', d.profId);
  document.getElementById('modal-disc-title').textContent = 'Editar Disciplina';
  openModal('modal-disciplina');
}

function salvarDisciplina() {
  const id  = document.getElementById('disc-id').value;
  const obj = {
    id:       id || uid(),
    nome:     document.getElementById('disc-nome').value.trim(),
    codigo:   document.getElementById('disc-codigo').value.trim(),
    carga:    document.getElementById('disc-carga').value,
    profId:   document.getElementById('disc-prof').value,
    periodo:  document.getElementById('disc-periodo').value,
    area:     document.getElementById('disc-area').value,
    creditos: document.getElementById('disc-creditos').value,
    ementa:   document.getElementById('disc-ementa').value.trim(),
  };
  if (!obj.nome) { toast('Informe o nome da disciplina', 'error'); return; }
  if (id) disciplinas = disciplinas.map(d => d.id === id ? obj : d);
  else disciplinas.push(obj);
  save('disciplinas', disciplinas);
  closeModal('modal-disciplina');
  renderDisciplinas();
  renderDashboard();
  toast('Disciplina salva', 'success');
}

// ── MATRÍCULAS ────────────────────────────────────────────────────
function renderMatriculas() {
  const tb = document.getElementById('tbody-matriculas');
  if (!matriculas.length) {
    tb.innerHTML = `<tr><td colspan="6">${empty('Nenhuma matrícula registrada')}</td></tr>`;
    return;
  }
  tb.innerHTML = matriculas.map((m, i) => {
    const a = alunos.find(x => x.id === m.alunoId);
    const d = disciplinas.find(x => x.id === m.discId);
    return `<tr>
      <td class="mono">${String(i + 1).padStart(2, '0')}</td>
      <td>${a?.nome || 'Aluno removido'}</td>
      <td>${d?.nome || 'Disciplina removida'}</td>
      <td class="mono">${m.periodo}</td>
      <td>${pillStatus(m.status)}</td>
      <td><button class="btn btn-danger btn-sm" onclick="confirmDelete('matricula','${m.id}')">✕</button></td>
    </tr>`;
  }).join('');
}

function salvarMatricula() {
  const alunoId = document.getElementById('mat-aluno').value;
  const discId  = document.getElementById('mat-disc').value;
  if (!alunoId || !discId) { toast('Selecione aluno e disciplina', 'error'); return; }
  const obj = {
    id: uid(), alunoId, discId,
    periodo:   document.getElementById('mat-periodo').value.trim() || '2024.1',
    status:    document.getElementById('mat-status').value,
    createdAt: new Date().toISOString(),
  };
  matriculas.push(obj);
  save('matriculas', matriculas);
  closeModal('modal-matricula');
  renderMatriculas();
  renderDashboard();
  toast('Matrícula registrada', 'success');
}

// ── PROVAS ────────────────────────────────────────────────────────
function renderProvas() {
  const tb = document.getElementById('tbody-provas');
  if (!provas.length) {
    tb.innerHTML = `<tr><td colspan="8">${empty('Nenhuma avaliação registrada')}</td></tr>`;
    return;
  }
  tb.innerHTML = provas.map((p, i) => {
    const a    = alunos.find(x => x.id === p.alunoId);
    const d    = disciplinas.find(x => x.id === p.discId);
    const nota = parseFloat(p.nota);
    const sit  = nota >= 7 ? 'Aprovado' : nota >= 5 ? 'Recuperação' : 'Reprovado';
    const cor  = nota >= 7 ? 'green'    : nota >= 5 ? 'gold'        : 'red';
    return `<tr>
      <td class="mono">${String(i + 1).padStart(2, '0')}</td>
      <td>${a?.nome || '—'}</td>
      <td>${d?.nome || '—'}</td>
      <td><span class="pill pill-blue">${p.tipo}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="mono" style="color:var(--${cor})">${nota.toFixed(1)}</span>
          <div class="grade-bar" style="width:60px">
            <div class="grade-fill" style="width:${nota * 10}%;background:var(--${cor})"></div>
          </div>
        </div>
      </td>
      <td class="mono">${fmtDate(p.data)}</td>
      <td><span class="pill pill-${cor}">${sit}</span></td>
      <td><button class="btn btn-danger btn-sm" onclick="confirmDelete('prova','${p.id}')">✕</button></td>
    </tr>`;
  }).join('');
}

function salvarProva() {
  const alunoId = document.getElementById('prov-aluno').value;
  const discId  = document.getElementById('prov-disc').value;
  const nota    = parseFloat(document.getElementById('prov-nota').value);
  if (!alunoId || !discId)          { toast('Selecione aluno e disciplina', 'error'); return; }
  if (isNaN(nota) || nota < 0 || nota > 10) { toast('Nota deve ser entre 0 e 10', 'error'); return; }
  const obj = {
    id: uid(), alunoId, discId,
    tipo:  document.getElementById('prov-tipo').value,
    nota:  nota.toString(),
    data:  document.getElementById('prov-data').value || new Date().toISOString().slice(0, 10),
    peso:  document.getElementById('prov-peso').value || '1',
    obs:   document.getElementById('prov-obs').value.trim(),
  };
  provas.push(obj);
  save('provas', provas);
  closeModal('modal-prova');
  renderProvas();
  renderDashboard();
  toast('Avaliação registrada', 'success');
}

// ── AGENDA ────────────────────────────────────────────────────────
function renderAgenda() {
  const list = [...agenda].sort((a, b) => a.data.localeCompare(b.data));
  const tb   = document.getElementById('tbody-agenda');
  if (!list.length) {
    tb.innerHTML = `<tr><td colspan="7">${empty('Nenhum evento agendado')}</td></tr>`;
    return;
  }
  const hoje = new Date().toISOString().slice(0, 10);
  tb.innerHTML = list.map((e, i) => `
    <tr style="${e.data < hoje ? 'opacity:.5' : ''}">
      <td class="mono">${String(i + 1).padStart(2, '0')}</td>
      <td style="font-weight:500">${e.titulo}</td>
      <td>${pillTipo(e.tipo)}</td>
      <td class="mono">${fmtDate(e.data)}</td>
      <td class="mono">${e.hora || '—'}</td>
      <td>${e.local || '—'}</td>
      <td><button class="btn btn-danger btn-sm" onclick="confirmDelete('evento','${e.id}')">✕</button></td>
    </tr>`).join('');
}

function salvarEvento() {
  const titulo = document.getElementById('ag-titulo').value.trim();
  if (!titulo) { toast('Informe o título', 'error'); return; }
  const obj = {
    id: uid(), titulo,
    tipo:  document.getElementById('ag-tipo').value,
    data:  document.getElementById('ag-data').value  || new Date().toISOString().slice(0, 10),
    hora:  document.getElementById('ag-hora').value,
    local: document.getElementById('ag-local').value.trim(),
    desc:  document.getElementById('ag-desc').value.trim(),
  };
  agenda.push(obj);
  save('agenda', agenda);
  closeModal('modal-agenda');
  renderAgenda();
  renderDashboard();
  toast('Evento agendado', 'success');
}

// ── EXCLUSÃO ──────────────────────────────────────────────────────
let _deleteTarget = null;

function confirmDelete(type, id) {
  _deleteTarget = { type, id };
  openModal('modal-confirm');
  document.getElementById('confirm-btn').onclick = () => {
    if      (type === 'aluno')       { alunos       = alunos.filter(x => x.id !== id);       save('alunos',       alunos);       renderAlunos();       }
    else if (type === 'professor')   { professores  = professores.filter(x => x.id !== id);  save('professores',  professores);  renderProfessores();  }
    else if (type === 'funcionario') { funcionarios = funcionarios.filter(x => x.id !== id); save('funcionarios', funcionarios); renderFuncionarios(); }
    else if (type === 'disciplina')  { disciplinas  = disciplinas.filter(x => x.id !== id);  save('disciplinas',  disciplinas);  renderDisciplinas();  }
    else if (type === 'matricula')   { matriculas   = matriculas.filter(x => x.id !== id);   save('matriculas',   matriculas);   renderMatriculas();   }
    else if (type === 'prova')       { provas       = provas.filter(x => x.id !== id);       save('provas',       provas);       renderProvas();       }
    else if (type === 'evento')      { agenda       = agenda.filter(x => x.id !== id);       save('agenda',       agenda);       renderAgenda();       }
    renderDashboard();
    closeModal('modal-confirm');
    toast('Registro excluído', 'success');
  };
}

// ── MODAIS ────────────────────────────────────────────────────────
function openModal(id) {
  if (id === 'modal-matricula')  { populateAlunoSelect('mat-aluno');  populateDiscSelect('mat-disc'); }
  if (id === 'modal-prova')      { populateAlunoSelect('prov-aluno'); populateDiscSelect('prov-disc'); }
  if (id === 'modal-disciplina') { populateProfSelect('disc-prof'); }
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  ['aluno-id', 'prof-id', 'func-id', 'disc-id'].forEach(k => {
    const el = document.getElementById(k);
    if (el) el.value = '';
  });
}

// Fechar ao clicar no overlay
document.querySelectorAll('.overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});

// ── HELPERS ───────────────────────────────────────────────────────
function populateAlunoSelect(selId) {
  const s = document.getElementById(selId);
  s.innerHTML = '<option value="">— Selecionar —</option>' +
    alunos.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
}

function populateDiscSelect(selId) {
  const s = document.getElementById(selId);
  s.innerHTML = '<option value="">— Selecionar —</option>' +
    disciplinas.map(d => `<option value="${d.id}">${d.nome}</option>`).join('');
}

function populateProfSelect(selId, selected = '') {
  const s = document.getElementById(selId);
  s.innerHTML = '<option value="">— Sem professor —</option>' +
    professores.map(p => `<option value="${p.id}"${p.id === selected ? ' selected' : ''}>${p.nome}</option>`).join('');
}

function pillStatus(s) {
  const map = {
    Ativo: 'green', Ativa: 'green', Concluída: 'blue', Formado: 'blue',
    Trancado: 'gold', Trancada: 'gold', Cancelado: 'red', Reprovada: 'red',
  };
  return `<span class="pill pill-${map[s] || 'blue'}">${s}</span>`;
}

function pillTipo(t) {
  const map = { Prova: 'red', Aula: 'blue', Reunião: 'gold', Palestra: 'purple', Evento: 'green', Feriado: 'gold' };
  return `<span class="pill pill-${map[t] || 'blue'}">${t}</span>`;
}

function fmtDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function empty(msg) {
  return `<div class="empty"><div class="empty-icon">📭</div><p>${msg}</p></div>`;
}

function toast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className   = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toastOut .2s ease forwards';
    setTimeout(() => t.remove(), 200);
  }, 2800);
}

// ── INIT ──────────────────────────────────────────────────────────
renderDashboard();




// ===== AUTH =====
const AUTH_USERS_KEY = 'sistemaFaculdade_users_v1';
const AUTH_SESSION_KEY = 'sistemaFaculdade_session_v1';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY)) || []; } catch(e) { return []; }
}
function saveUsers(u) { localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(u)); }
function getSession() {
  try { return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY)); } catch(e) { return null; }
}
function saveSession(u) { localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(u)); }
function clearSession() { localStorage.removeItem(AUTH_SESSION_KEY); }

function alternarAuthTab(tab) {
  document.getElementById('formLogin').classList.toggle('auth-hidden', tab !== 'login');
  document.getElementById('formCadastro').classList.toggle('auth-hidden', tab !== 'cadastro');
  document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabCadastro').classList.toggle('active', tab === 'cadastro');
  document.getElementById('erroLogin').textContent = '';
  document.getElementById('erroCadastro').textContent = '';
}

function toggleAuthSenha(id, btn) {
  const inp = document.getElementById(id);
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.querySelector('svg').style.opacity = show ? '1' : '0.45';
}

function fazerLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const senha = document.getElementById('loginSenha').value;
  const users = getUsers();
  const user = users.find(u => u.email === email && u.senha === senha);
  if (!user) {
    document.getElementById('erroLogin').textContent = 'E-mail ou senha incorretos.';
    return;
  }
  saveSession(user);
  mostrarApp(user);
}

function fazerCadastro(e) {
  e.preventDefault();
  const nome = document.getElementById('cadNome').value.trim();
  const email = document.getElementById('cadEmail').value.trim().toLowerCase();
  const senha = document.getElementById('cadSenha').value;
  const confirm = document.getElementById('cadSenhaConfirm').value;
  const erroEl = document.getElementById('erroCadastro');
  if (senha !== confirm) { erroEl.textContent = 'As senhas nao coincidem.'; return; }
  const users = getUsers();
  if (users.find(u => u.email === email)) { erroEl.textContent = 'E-mail ja cadastrado.'; return; }
  const user = { nome, email, senha };
  users.push(user);
  saveUsers(users);
  saveSession(user);
  mostrarApp(user);
}

function mostrarApp(user) {
  document.getElementById('telaAuth').style.display = 'none';
  document.getElementById('telaApp').style.display = 'flex';
  document.getElementById('mainFooter').style.display = 'block';

  const sf = document.querySelector('.sidebar-footer');
  if (sf) {
    sf.innerHTML = `
      <div style="margin-bottom:10px;">
        <p style="font-size:.78rem;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${user.nome}</p>
        <p style="font-size:.7rem;color:var(--muted);margin-top:2px;">${user.perfil || 'Usuario'}</p>
      </div>
      <button onclick="fazerLogout()" style="width:100%;padding:7px 12px;background:transparent;border:1px solid var(--border2);border-radius:var(--radius-sm);color:var(--muted);font-family:var(--font-sans);font-size:.78rem;cursor:pointer;transition:var(--transition);" onmouseover="this.style.borderColor='var(--red)';this.style.color='var(--red)'" onmouseout="this.style.borderColor='var(--border2)';this.style.color='var(--muted)'">
        Sair do sistema
      </button>
    `;
  }
}

function fazerLogout() {
  clearSession();
  document.getElementById('telaApp').style.display = 'none';
  document.getElementById('mainFooter').style.display = 'none';
  document.getElementById('telaAuth').style.display = 'flex';
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginSenha').value = '';
  alternarAuthTab('login');
}

(function() {
  const session = getSession();
  if (session) { mostrarApp(session); }
})();
