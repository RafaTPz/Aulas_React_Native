const assert = require('node:assert/strict');
const { test } = require('node:test');
const { DatabaseSync } = require('node:sqlite');
const { mkdtempSync, readFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Executa o repositório real; o adaptador substitui somente a ponte nativa do Expo.
function loadRepository(filename = ':memory:', failMigration = false) {
  const connections = [];
  const cache = new Map();
  const sqlite = {
    async openDatabaseAsync() {
      const db = new DatabaseSync(filename);
      connections.push(db);
      return {
        async execAsync(sql) {
          if (failMigration) { failMigration = false; throw new Error('Falha simulada'); }
          db.exec(sql);
        },
        async getAllAsync(sql, ...params) { return db.prepare(sql).all(...params); },
        async getFirstAsync(sql, ...params) { return db.prepare(sql).get(...params) ?? null; },
        async runAsync(sql, ...params) {
          const result = db.prepare(sql).run(...params);
          return { changes: result.changes, lastInsertRowId: result.lastInsertRowid };
        },
        async closeAsync() { db.close(); connections.splice(connections.indexOf(db), 1); },
      };
    },
  };
  function load(file) {
    if (cache.has(file)) return cache.get(file);
    const module = { exports: {} };
    const source = ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const run = vm.runInThisContext(`(function(require, module, exports) { ${source}\n})`, { filename: file });
    run((name) => name === 'expo-sqlite' ? sqlite : load(path.resolve(path.dirname(file), `${name}.ts`)), module, module.exports);
    cache.set(file, module.exports);
    return module.exports;
  }
  return {
    repository: load(path.resolve(__dirname, '../src/database/taskRepository.ts')),
    connections,
    close() { for (const db of connections) db.close(); },
  };
}

test('CRUD: cria, ordena, edita, conclui, reabre e exclui com parâmetros seguros', async () => {
  const fixture = loadRepository();
  const repo = fixture.repository;
  try {
    assert.deepEqual(await repo.getTasks(), []);
    const first = await repo.createTask({ title: "Estudar 'SQL'; DROP TABLE tasks; --", description: null });
    const second = await repo.createTask({ title: 'Segunda tarefa', description: 'Descrição' });
    assert.equal((await repo.getTaskById(first.id)).title, first.title);
    assert.equal((await repo.getTasks())[0].id, second.id);
    await repo.updateTask({ id: first.id, title: 'Título editado', description: 'Detalhes' });
    assert.equal((await repo.getTaskById(first.id)).description, 'Detalhes');
    await repo.toggleTaskComplete(first.id, 1);
    assert.equal((await repo.getTaskById(first.id)).completed, 1);
    await repo.toggleTaskComplete(first.id, 0);
    assert.equal((await repo.getTaskById(first.id)).completed, 0);
    await assert.rejects(repo.toggleTaskComplete(first.id, 2), /Status inválido/);
    await repo.deleteTask(first.id);
    assert.equal(await repo.getTaskById(first.id), null);
    assert.equal((await repo.getTasks()).length, 1);
    await assert.rejects(repo.updateTask({ id: first.id, title: 'Ausente', description: null }), /não encontrada/);
  } finally { fixture.close(); }
});

test('consultas simultâneas compartilham a conexão e aguardam a criação da tabela', async () => {
  const fixture = loadRepository();
  try {
    const results = await Promise.all(Array.from({ length: 8 }, () => fixture.repository.getTasks()));
    assert.equal(fixture.connections.length, 1);
    assert.ok(results.every((tasks) => tasks.length === 0));
  } finally { fixture.close(); }
});

test('uma falha de migração permite tentar abrir o banco novamente', async () => {
  const fixture = loadRepository(':memory:', true);
  try {
    await assert.rejects(fixture.repository.getTasks(), /Falha simulada/);
    assert.deepEqual(await fixture.repository.getTasks(), []);
    assert.equal(fixture.connections.length, 1);
  } finally { fixture.close(); }
});

test('tarefas persistem após fechar e reabrir o arquivo SQLite', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'aulas-felipe-'));
  const filename = path.join(directory, 'tasks.db');
  let fixture = loadRepository(filename);
  try {
    const task = await fixture.repository.createTask({ title: 'Persistência', description: null });
    fixture.close();
    fixture = loadRepository(filename);
    assert.equal((await fixture.repository.getTaskById(task.id)).title, 'Persistência');
  } finally {
    fixture.close();
    rmSync(directory, { recursive: true, force: true });
  }
});
