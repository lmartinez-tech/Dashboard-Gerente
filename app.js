const STORAGE_KEY = "gc-control-dashboard-v1";

const statusOrder = ["pendiente", "progreso", "revision", "bloqueada", "completada"];
const statusLabels = {
  pendiente: "Pendiente",
  progreso: "En proceso",
  revision: "En revisión",
  bloqueada: "Bloqueada",
  completada: "Completada"
};

const roleLabels = {
  gerente: "Gerente contador",
  contador: "Contador",
  auxiliar: "Auxiliar"
};

const healthLabels = {
  green: "Estable",
  yellow: "Atención",
  red: "Crítico"
};

const priorityLabels = {
  alta: "Alta",
  media: "Media",
  baja: "Baja"
};

const iconPaths = {
  layout: '<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect>',
  building: '<path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path><path d="M9 9h1"></path><path d="M9 13h1"></path><path d="M9 17h1"></path>',
  "building-plus": '<path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path><path d="M16 14h5"></path><path d="M18.5 11.5v5"></path>',
  checklist: '<path d="M9 11l2 2 4-4"></path><path d="M9 17l2 2 4-4"></path><path d="M4 6h16"></path><path d="M4 12h2"></path><path d="M4 18h2"></path>',
  calendar: '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M3 10h18"></path>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"></path>',
  plus: '<path d="M12 5v14"></path><path d="M5 12h14"></path>',
  alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
  clock: '<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>',
  check: '<path d="M20 6 9 17l-5-5"></path>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
  close: '<path d="M18 6 6 18"></path><path d="M6 6l12 12"></path>',
  edit: '<path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="M7 10l5 5 5-5"></path><path d="M12 15V3"></path>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="M17 8l-5-5-5 5"></path><path d="M12 3v12"></path>'
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

let state = loadState();

document.addEventListener("DOMContentLoaded", () => {
  injectIcons();
  bindShellEvents();
  render();
});

function seedState() {
  const due = offset => relativeDate(offset);
  return {
    ui: {
      module: "dashboard",
      currentPersonId: "gerente-liz",
      search: "",
      managerFilter: "all",
      personFilter: "all",
      statusFilter: "all",
      meetingPersonId: "cont-daniel"
    },
    people: [
      {
        id: "gerente-liz",
        name: "Liz Martinez",
        role: "gerente",
        title: "Gerente contador principal",
        email: "liz@gc-control.local",
        managerId: "country",
        canSeeAll: true,
        weeklyCapacity: 42
      },
      {
        id: "gerente-ana",
        name: "Ana Maria Gomez",
        role: "gerente",
        title: "Gerente contador",
        email: "ana@gc-control.local",
        managerId: "country",
        canSeeAll: false,
        weeklyCapacity: 38
      },
      {
        id: "cont-daniel",
        name: "Daniel Rojas",
        role: "contador",
        title: "Contador senior",
        email: "daniel@gc-control.local",
        managerId: "gerente-liz",
        weeklyCapacity: 36
      },
      {
        id: "cont-camila",
        name: "Camila Perez",
        role: "contador",
        title: "Contadora",
        email: "camila@gc-control.local",
        managerId: "gerente-liz",
        weeklyCapacity: 34
      },
      {
        id: "cont-jorge",
        name: "Jorge Silva",
        role: "contador",
        title: "Contador",
        email: "jorge@gc-control.local",
        managerId: "gerente-ana",
        weeklyCapacity: 34
      },
      {
        id: "aux-laura",
        name: "Laura Meza",
        role: "auxiliar",
        title: "Auxiliar contable",
        email: "laura@gc-control.local",
        managerId: "gerente-liz",
        weeklyCapacity: 32
      },
      {
        id: "aux-natalia",
        name: "Natalia Ruiz",
        role: "auxiliar",
        title: "Auxiliar administrativa",
        email: "natalia@gc-control.local",
        managerId: "gerente-liz",
        weeklyCapacity: 30
      },
      {
        id: "aux-santiago",
        name: "Santiago Leon",
        role: "auxiliar",
        title: "Auxiliar contable",
        email: "santiago@gc-control.local",
        managerId: "gerente-ana",
        weeklyCapacity: 30
      }
    ],
    clients: [
      {
        id: "cli-orion",
        name: "Orion Foods S.A.S.",
        nit: "901.245.880-1",
        sector: "Alimentos",
        plan: "Full contable",
        status: "active",
        health: "yellow",
        managerId: "gerente-liz",
        accountantId: "cont-daniel",
        assistantId: "aux-laura",
        cadence: "Semanal",
        lastReview: due(-6),
        notes: "Pendiente respuesta de facturación para cierre."
      },
      {
        id: "cli-andes",
        name: "Andes Digital S.A.S.",
        nit: "901.884.103-7",
        sector: "Tecnología",
        plan: "Contabilidad + nómina",
        status: "active",
        health: "green",
        managerId: "gerente-liz",
        accountantId: "cont-camila",
        assistantId: "aux-natalia",
        cadence: "Quincenal",
        lastReview: due(-2),
        notes: "Cliente estable, buen cumplimiento documental."
      },
      {
        id: "cli-cafe",
        name: "Cafe Aurora S.A.S.",
        nit: "900.731.540-2",
        sector: "Retail",
        plan: "Contabilidad",
        status: "active",
        health: "red",
        managerId: "gerente-liz",
        accountantId: "cont-daniel",
        assistantId: "aux-natalia",
        cadence: "Semanal",
        lastReview: due(-13),
        notes: "Riesgo por soportes incompletos y bancos sin conciliar."
      },
      {
        id: "cli-bio",
        name: "BioSantander S.A.S.",
        nit: "901.441.225-9",
        sector: "Salud",
        plan: "Full contable",
        status: "active",
        health: "yellow",
        managerId: "gerente-ana",
        accountantId: "cont-jorge",
        assistantId: "aux-santiago",
        cadence: "Quincenal",
        lastReview: due(-5),
        notes: "Revisar pagos a proveedores y documentos equivalentes."
      },
      {
        id: "cli-nova",
        name: "Nova Legaltech S.A.S.",
        nit: "901.334.762-4",
        sector: "Servicios",
        plan: "Contabilidad + impuestos",
        status: "suspended",
        health: "red",
        managerId: "gerente-liz",
        accountantId: "cont-camila",
        assistantId: "aux-laura",
        cadence: "Semanal",
        lastReview: due(-18),
        notes: "Cliente suspendido, falta decisión sobre reactivación."
      },
      {
        id: "cli-quilla",
        name: "Quilla Commerce S.A.S.",
        nit: "901.662.008-5",
        sector: "Ecommerce",
        plan: "Contabilidad",
        status: "active",
        health: "green",
        managerId: "gerente-ana",
        accountantId: "cont-jorge",
        assistantId: "aux-santiago",
        cadence: "Mensual",
        lastReview: due(-1),
        notes: "Cierre mensual al día."
      }
    ],
    activities: [
      {
        id: "act-001",
        title: "Conciliar bancos de abril y mayo",
        clientId: "cli-cafe",
        type: "Cierre mensual",
        assigneeId: "aux-natalia",
        reviewerId: "cont-daniel",
        status: "bloqueada",
        priority: "alta",
        dueDate: due(-3),
        updatedAt: due(-1),
        detail: "Faltan extractos de dos cuentas y soporte de pagos PSE.",
        comments: ["Cliente no ha enviado extractos completos."]
      },
      {
        id: "act-002",
        title: "Revisar IVA bimestral",
        clientId: "cli-orion",
        type: "Impuestos",
        assigneeId: "cont-daniel",
        reviewerId: "gerente-liz",
        status: "revision",
        priority: "alta",
        dueDate: due(2),
        updatedAt: due(0),
        detail: "Validar compras gravadas y retenciones antes de presentar.",
        comments: ["Listo para revisión de gerente."]
      },
      {
        id: "act-003",
        title: "Solicitar certificados de retención",
        clientId: "cli-andes",
        type: "Soportes",
        assigneeId: "aux-natalia",
        reviewerId: "cont-camila",
        status: "progreso",
        priority: "media",
        dueDate: due(4),
        updatedAt: due(-1),
        detail: "Enviar recordatorio y cargar soportes recibidos.",
        comments: []
      },
      {
        id: "act-004",
        title: "Estados financieros de gerencia",
        clientId: "cli-orion",
        type: "Estados financieros",
        assigneeId: "cont-daniel",
        reviewerId: "gerente-liz",
        status: "pendiente",
        priority: "media",
        dueDate: due(7),
        updatedAt: due(-2),
        detail: "Preparar borrador con variaciones significativas.",
        comments: []
      },
      {
        id: "act-005",
        title: "Actualizar matriz de obligaciones",
        clientId: "cli-bio",
        type: "Obligaciones",
        assigneeId: "cont-jorge",
        reviewerId: "gerente-ana",
        status: "progreso",
        priority: "media",
        dueDate: due(3),
        updatedAt: due(0),
        detail: "Cruzar responsabilidades tributarias contra RUT vigente.",
        comments: ["RUT actualizado cargado."]
      },
      {
        id: "act-006",
        title: "Definir plan de reactivación",
        clientId: "cli-nova",
        type: "Servicio al cliente",
        assigneeId: "cont-camila",
        reviewerId: "gerente-liz",
        status: "pendiente",
        priority: "alta",
        dueDate: due(1),
        updatedAt: due(-4),
        detail: "Preparar opciones: reactivar, pausar o cierre ordenado.",
        comments: []
      },
      {
        id: "act-007",
        title: "Cerrar nómina y seguridad social",
        clientId: "cli-andes",
        type: "Nómina",
        assigneeId: "cont-camila",
        reviewerId: "gerente-liz",
        status: "completada",
        priority: "media",
        dueDate: due(-2),
        updatedAt: due(-1),
        detail: "Nómina cerrada y soportes cargados.",
        comments: ["Cliente confirmó pago."]
      },
      {
        id: "act-008",
        title: "Validar gastos de representación",
        clientId: "cli-quilla",
        type: "Cierre mensual",
        assigneeId: "aux-santiago",
        reviewerId: "cont-jorge",
        status: "revision",
        priority: "baja",
        dueDate: due(5),
        updatedAt: due(0),
        detail: "Separar gastos deducibles y no deducibles.",
        comments: []
      }
    ],
    meetingNotes: [
      {
        id: "note-001",
        personId: "cont-daniel",
        date: relativeDate(-1),
        note: "Priorizar Cafe Aurora y dejar plan claro para bancos antes del viernes."
      }
    ]
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    return migrateState(parsed);
  } catch (error) {
    console.warn("No se pudo cargar el estado guardado", error);
    return seedState();
  }
}

function migrateState(data) {
  const seeded = seedState();
  return {
    ...seeded,
    ...data,
    ui: { ...seeded.ui, ...(data.ui || {}) },
    people: Array.isArray(data.people) ? data.people : seeded.people,
    clients: Array.isArray(data.clients) ? data.clients : seeded.clients,
    activities: Array.isArray(data.activities) ? data.activities : seeded.activities,
    meetingNotes: Array.isArray(data.meetingNotes) ? data.meetingNotes : seeded.meetingNotes
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindShellEvents() {
  $("#mainNav").addEventListener("click", event => {
    const button = event.target.closest("[data-module]");
    if (!button) return;
    state.ui.module = button.dataset.module;
    saveState();
    render();
  });

  $("#globalSearch").addEventListener("input", event => {
    state.ui.search = event.target.value;
    saveState();
    renderView();
  });

  $("#currentPerson").addEventListener("change", event => {
    state.ui.currentPersonId = event.target.value;
    state.ui.managerFilter = "all";
    state.ui.personFilter = "all";
    saveState();
    render();
  });

  $("#managerFilter").addEventListener("change", event => {
    state.ui.managerFilter = event.target.value;
    saveState();
    renderView();
  });

  $("#personFilter").addEventListener("change", event => {
    state.ui.personFilter = event.target.value;
    saveState();
    renderView();
  });

  $("#statusFilter").addEventListener("change", event => {
    state.ui.statusFilter = event.target.value;
    saveState();
    renderView();
  });

  $("#newActivityBtn").addEventListener("click", () => openActivityForm());
  $("#newClientBtn").addEventListener("click", () => openClientForm());

  document.addEventListener("click", handleActionClick);
  document.addEventListener("change", handleInlineChange);
  document.addEventListener("submit", handleFormSubmit);
}

function render() {
  injectIcons();
  $$("#mainNav .nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.module === state.ui.module);
  });
  $("#pageTitle").textContent = moduleTitle(state.ui.module);
  hydrateControls();
  renderView();
}

function renderView() {
  const view = $("#appView");
  const module = state.ui.module;
  if (module === "dashboard") renderDashboard(view);
  if (module === "clientes") renderClients(view);
  if (module === "actividades") renderActivities(view);
  if (module === "reuniones") renderMeetings(view);
  if (module === "equipo") renderTeam(view);
  if (module === "datos") renderData(view);
  injectIcons(view);
}

function hydrateControls() {
  $("#globalSearch").value = state.ui.search || "";
  setOptions(
    $("#currentPerson"),
    state.people.map(person => ({
      value: person.id,
      label: `${person.name} · ${roleLabels[person.role]}`
    })),
    state.ui.currentPersonId
  );
  setOptions(
    $("#managerFilter"),
    [{ value: "all", label: "Todos" }].concat(
      state.people
        .filter(person => person.role === "gerente")
        .map(person => ({ value: person.id, label: person.name }))
    ),
    state.ui.managerFilter
  );
  setOptions(
    $("#personFilter"),
    [{ value: "all", label: "Todos" }].concat(
      state.people
        .filter(person => person.role !== "gerente")
        .map(person => ({ value: person.id, label: `${person.name} · ${roleLabels[person.role]}` }))
    ),
    state.ui.personFilter
  );
  setOptions(
    $("#statusFilter"),
    [{ value: "all", label: "Todos" }].concat(
      statusOrder.map(status => ({ value: status, label: statusLabels[status] }))
    ),
    state.ui.statusFilter
  );
}

function setOptions(select, options, selectedValue) {
  select.innerHTML = options
    .map(option => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`)
    .join("");
  select.value = selectedValue || options[0]?.value || "";
  if (select.value !== selectedValue && options.length) {
    select.value = options[0].value;
  }
}

function renderDashboard(view) {
  const metrics = getMetrics();
  const visible = visibleActivities();
  const overdue = visible.filter(activity => isOverdue(activity));
  const blocked = visible.filter(activity => activity.status === "bloqueada");
  const dueSoon = visible.filter(activity => !isDone(activity) && !isOverdue(activity) && daysUntil(activity.dueDate) <= 7);
  const clients = visibleClients();

  view.innerHTML = `
    <div class="view-header">
      <div>
        <h3>Tablero gerente contador</h3>
        <p>Controla clientes, responsables, vencimientos y compromisos de reunión desde una sola vista de seguimiento.</p>
      </div>
      <button class="secondary-button" type="button" data-action="open-meeting">
        <span data-icon="calendar"></span>
        Abrir reunión
      </button>
    </div>

    <div class="metric-grid">
      ${metricCard("Clientes activos", metrics.activeClients, `${metrics.riskClients} en atención`, "building", metrics.riskClients > 0 ? "warn" : "good")}
      ${metricCard("Pendientes", metrics.openActivities, `${metrics.dueSoon} vencen en 7 días`, "checklist", "info")}
      ${metricCard("Vencidas", metrics.overdue, "Requieren decisión hoy", "alert", metrics.overdue ? "bad" : "good")}
      ${metricCard("Bloqueadas", metrics.blocked, "Esperando insumo o criterio", "clock", metrics.blocked ? "warn" : "good")}
      ${metricCard("Cumplimiento", `${metrics.completionRate}%`, "Actividades completadas", "check", metrics.completionRate >= 75 ? "good" : "warn")}
    </div>

    <div class="workspace-grid">
      <section class="work-surface">
        <div class="section-title">
          <div>
            <h4>Actividades por estado</h4>
            <p>Arrastra una tarjeta para actualizar el estado o ábrela para dejar comentario.</p>
          </div>
          <span>${visible.length} actividades visibles</span>
        </div>
        <div class="kanban" id="kanbanBoard">
          ${statusOrder.map(status => kanbanColumn(status, visible.filter(activity => activity.status === status))).join("")}
        </div>
      </section>

      <aside class="side-panel">
        <section>
          <div class="section-title">
            <h4>Agenda crítica</h4>
            <span>Hoy</span>
          </div>
          <div class="list-stack">
            ${agendaInsightList(overdue, blocked, dueSoon)}
          </div>
        </section>

        <section>
          <div class="section-title">
            <h4>Clientes en foco</h4>
            <span>${clients.length} clientes</span>
          </div>
          <div class="list-stack">
            ${clients
              .filter(client => client.health !== "green" || clientOpenActivities(client.id).some(activity => activity.status === "bloqueada" || isOverdue(activity)))
              .slice(0, 5)
              .map(clientFocusItem)
              .join("") || emptySmall("Sin clientes críticos con los filtros actuales.")}
          </div>
        </section>
      </aside>
    </div>

    <div class="split-grid">
      <section class="work-surface">
        <div class="section-title">
          <h4>Carga por responsable</h4>
          <span>Abiertas / capacidad semanal</span>
        </div>
        <div class="list-stack">
          ${teamWorkloadRows()}
        </div>
      </section>

      <section class="work-surface">
        <div class="section-title">
          <h4>Próximos vencimientos</h4>
          <span>Ordenados por fecha</span>
        </div>
        <div class="list-stack">
          ${visible
            .filter(activity => !isDone(activity))
            .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
            .slice(0, 6)
            .map(activity => insightItem(activity, isOverdue(activity) ? "bad" : "warn"))
            .join("") || emptySmall("No hay actividades abiertas.")}
        </div>
      </section>
    </div>
  `;
  bindKanban();
}

function renderClients(view) {
  const clients = visibleClients();
  view.innerHTML = `
    <div class="view-header">
      <div>
        <h3>Cartera de clientes</h3>
        <p>Revisa responsables, salud del cliente, última revisión y pendientes abiertos para ordenar el seguimiento.</p>
      </div>
      <button class="primary-button" type="button" data-action="new-client">
        <span data-icon="plus"></span>
        Cliente
      </button>
    </div>

    <div class="client-grid">
      ${clients.map(clientCard).join("") || emptyState("No hay clientes con los filtros actuales.")}
    </div>

    <section class="table-panel">
      <div class="table-toolbar">
        <div class="section-title">
          <h4>Vista detallada</h4>
          <span>${clients.length} registros</span>
        </div>
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Gerente</th>
              <th>Contador</th>
              <th>Auxiliar</th>
              <th>Estado</th>
              <th>Pendientes</th>
              <th>Última revisión</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${clients.map(clientRow).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderActivities(view) {
  const activities = visibleActivities().sort((a, b) => {
    if (isDone(a) !== isDone(b)) return isDone(a) ? 1 : -1;
    return a.dueDate.localeCompare(b.dueDate);
  });
  view.innerHTML = `
    <div class="view-header">
      <div>
        <h3>Control de actividades</h3>
        <p>Asigna, prioriza y cambia estados. Esta vista también sirve para que contadores y auxiliares actualicen avances.</p>
      </div>
      <button class="primary-button" type="button" data-action="new-activity">
        <span data-icon="plus"></span>
        Actividad
      </button>
    </div>

    <section class="table-panel">
      <div class="table-toolbar">
        <div class="section-title">
          <h4>Actividades visibles</h4>
          <span>${activities.length} actividades</span>
        </div>
        <button class="secondary-button" type="button" data-action="export-csv">
          <span data-icon="download"></span>
          CSV
        </button>
      </div>
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Actividad</th>
              <th>Cliente</th>
              <th>Responsable</th>
              <th>Revisa</th>
              <th>Vence</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${activities.map(activityRow).join("") || `<tr><td colspan="8">${emptySmall("No hay actividades con los filtros actuales.")}</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderMeetings(view) {
  const team = peopleInScope().filter(person => person.role !== "gerente");
  if (!team.some(person => person.id === state.ui.meetingPersonId)) {
    state.ui.meetingPersonId = team[0]?.id || currentPerson().id;
    saveState();
  }
  const person = personById(state.ui.meetingPersonId) || currentPerson();
  const activities = activitiesForPerson(person.id).filter(activity => !isDone(activity));
  const overdue = activities.filter(isOverdue);
  const blocked = activities.filter(activity => activity.status === "bloqueada");
  const dueSoon = activities.filter(activity => !isOverdue(activity) && daysUntil(activity.dueDate) <= 7);
  const notes = state.meetingNotes
    .filter(note => note.personId === person.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  view.innerHTML = `
    <div class="view-header">
      <div>
        <h3>Reunión de seguimiento</h3>
        <p>Una guía práctica para tener reuniones más ordenadas: revisar riesgos, definir decisiones y dejar compromisos accionables.</p>
      </div>
      <label class="field compact-field">
        <span>Responsable</span>
        <select id="meetingPersonSelect">
          ${team.map(member => `<option value="${member.id}" ${member.id === person.id ? "selected" : ""}>${escapeHtml(member.name)} · ${roleLabels[member.role]}</option>`).join("")}
        </select>
      </label>
    </div>

    <div class="meeting-layout">
      <aside class="side-panel">
        <section>
          <div class="section-title">
            <h4>${escapeHtml(person.name)}</h4>
            <span>${roleLabels[person.role]}</span>
          </div>
          <div class="three-grid">
            ${compactMetric("Abiertas", activities.length, "info")}
            ${compactMetric("Vencidas", overdue.length, overdue.length ? "bad" : "good")}
            ${compactMetric("Bloqueos", blocked.length, blocked.length ? "warn" : "good")}
          </div>
        </section>
        <section>
          <div class="section-title">
            <h4>Notas anteriores</h4>
            <span>${notes.length}</span>
          </div>
          <div class="list-stack">
            ${notes.map(note => `
              <div class="insight-item">
                <strong>${formatDate(note.date)}</strong>
                <span>${escapeHtml(note.note)}</span>
              </div>
            `).join("") || emptySmall("Todavía no hay notas para esta persona.")}
          </div>
        </section>
      </aside>

      <section class="work-surface agenda-block">
        <div class="section-title">
          <div>
            <h4>Agenda recomendada</h4>
            <p>Marca los puntos revisados durante la reunión.</p>
          </div>
          <button class="secondary-button" type="button" data-action="copy-meeting-summary" data-person-id="${person.id}">
            <span data-icon="check"></span>
            Copiar acta
          </button>
        </div>

        ${meetingChecklist("Vencidas", overdue, "bad")}
        ${meetingChecklist("Bloqueos", blocked, "warn")}
        ${meetingChecklist("Próximos 7 días", dueSoon, "info")}

        <form class="form-grid" id="meetingNoteForm">
          <input type="hidden" name="personId" value="${person.id}">
          <label class="field full">
            <span>Nota de reunión</span>
            <textarea name="note" placeholder="Decisiones, compromisos o temas a escalar"></textarea>
          </label>
          <label class="field">
            <span>Nueva acción</span>
            <input name="actionTitle" type="text" placeholder="Ej. Enviar soportes al cliente">
          </label>
          <label class="field">
            <span>Cliente</span>
            <select name="clientId">
              ${visibleClients().map(client => `<option value="${client.id}">${escapeHtml(client.name)}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Vence</span>
            <input name="dueDate" type="date" value="${relativeDate(3)}">
          </label>
          <label class="field">
            <span>Prioridad</span>
            <select name="priority">
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="baja">Baja</option>
            </select>
          </label>
          <div class="full">
            <button class="primary-button" type="submit">
              <span data-icon="plus"></span>
              Guardar seguimiento
            </button>
          </div>
        </form>
      </section>
    </div>
  `;

  $("#meetingPersonSelect").addEventListener("change", event => {
    state.ui.meetingPersonId = event.target.value;
    saveState();
    renderView();
  });
}

function renderTeam(view) {
  const members = peopleInScope().filter(person => person.role !== "gerente");
  view.innerHTML = `
    <div class="view-header">
      <div>
        <h3>Equipo contable</h3>
        <p>Visualiza carga, clientes asignados y señales de riesgo por contador o auxiliar.</p>
      </div>
    </div>

    <div class="team-grid">
      ${members.map(teamCard).join("") || emptyState("No hay miembros del equipo con los filtros actuales.")}
    </div>
  `;
}

function renderData(view) {
  view.innerHTML = `
    <div class="view-header">
      <div>
        <h3>Datos y respaldo</h3>
        <p>Esta versión guarda la información en el navegador. Puedes exportar JSON, importar una copia o reiniciar datos de ejemplo.</p>
      </div>
    </div>

    <section class="data-panel">
      <div class="section-title">
        <h4>Portabilidad</h4>
        <span>LocalStorage</span>
      </div>
      <div class="quick-actions">
        <button type="button" data-action="export-json"><span data-icon="download"></span> Exportar JSON</button>
        <button type="button" data-action="trigger-import"><span data-icon="upload"></span> Importar JSON</button>
        <button type="button" data-action="copy-json"><span data-icon="database"></span> Copiar JSON</button>
        <button type="button" data-action="reset-data"><span data-icon="close"></span> Reiniciar ejemplo</button>
      </div>
      <input id="importFile" type="file" accept="application/json,.json" hidden>
    </section>

    <section class="data-panel">
      <div class="section-title">
        <h4>Siguiente paso técnico</h4>
        <span>Cuando conectemos usuarios reales</span>
      </div>
      <div class="list-stack">
        <div class="insight-item good">
          <strong>Base de datos</strong>
          <span>Clientes, equipo, actividades, comentarios, auditoría de cambios y permisos por rol.</span>
        </div>
        <div class="insight-item warn">
          <strong>Portal de contador y auxiliar</strong>
          <span>Ingreso con correo, vista limitada a sus clientes y opción de actualizar avances sin tocar información sensible.</span>
        </div>
        <div class="insight-item">
          <strong>Reportes para dirección</strong>
          <span>Resumen semanal por gerente, cumplimiento por responsable, bloqueos y actividades vencidas.</span>
        </div>
      </div>
    </section>
  `;

  $("#importFile").addEventListener("change", importJson);
}

function metricCard(label, value, note, iconName, tone = "") {
  return `
    <article class="metric-card ${tone}">
      <div class="metric-top">
        <span class="metric-label">${escapeHtml(label)}</span>
        <span data-icon="${iconName}"></span>
      </div>
      <div class="metric-value">${escapeHtml(String(value))}</div>
      <div class="metric-note">${escapeHtml(note)}</div>
    </article>
  `;
}

function compactMetric(label, value, tone) {
  return `
    <article class="metric-card ${tone}" style="min-height:auto;padding:12px;">
      <span class="metric-label">${escapeHtml(label)}</span>
      <div class="metric-value" style="font-size:24px;">${escapeHtml(String(value))}</div>
    </article>
  `;
}

function kanbanColumn(status, activities) {
  return `
    <div class="kanban-column" data-drop-status="${status}">
      <div class="kanban-head">
        <strong>${statusLabels[status]}</strong>
        <span class="count-pill">${activities.length}</span>
      </div>
      <div class="kanban-list">
        ${activities.map(activityCard).join("") || `<div class="empty-state" style="min-height:120px;">Sin actividades</div>`}
      </div>
    </div>
  `;
}

function activityCard(activity) {
  const client = clientById(activity.clientId);
  const assignee = personById(activity.assigneeId);
  const overdue = isOverdue(activity);
  return `
    <article class="activity-card" draggable="true" data-activity-card="${activity.id}">
      <div class="activity-title">
        <strong>${escapeHtml(activity.title)}</strong>
        <span class="priority-pill priority-${activity.priority}">${priorityLabels[activity.priority]}</span>
      </div>
      <div class="activity-meta">
        <div class="mini-row"><span data-icon="building"></span><span>${escapeHtml(client?.name || "Sin cliente")}</span></div>
        <div class="mini-row"><span data-icon="user"></span><span>${escapeHtml(assignee?.name || "Sin responsable")}</span></div>
        <div class="mini-row ${overdue ? "tone-bad" : ""}"><span data-icon="calendar"></span><span>${formatDate(activity.dueDate)} · ${dueText(activity)}</span></div>
      </div>
      <div class="quick-actions">
        <button type="button" data-action="open-activity" data-id="${activity.id}">Abrir</button>
        ${activity.status !== "completada" ? `<button type="button" data-action="quick-complete" data-id="${activity.id}">Completar</button>` : ""}
      </div>
    </article>
  `;
}

function clientCard(client) {
  const pending = clientOpenActivities(client.id);
  const manager = personById(client.managerId);
  const accountant = personById(client.accountantId);
  const assistant = personById(client.assistantId);
  return `
    <article class="client-card">
      <div class="client-head">
        <div>
          <h4>${escapeHtml(client.name)}</h4>
          <p>${escapeHtml(client.nit)} · ${escapeHtml(client.sector)}</p>
        </div>
        <span class="health-pill health-${client.health}">${healthLabels[client.health]}</span>
      </div>
      <div class="list-stack">
        <div class="mini-row"><span data-icon="user"></span><span>${escapeHtml(manager?.name || "Sin gerente")}</span></div>
        <div class="mini-row"><span data-icon="checklist"></span><span>${escapeHtml(accountant?.name || "Sin contador")} / ${escapeHtml(assistant?.name || "Sin auxiliar")}</span></div>
        <div class="mini-row"><span data-icon="clock"></span><span>${pending.length} pendientes abiertos</span></div>
      </div>
      <div class="quick-actions">
        <button type="button" data-action="open-client" data-id="${client.id}">Ver</button>
        <button type="button" data-action="new-activity-for-client" data-id="${client.id}">Asignar</button>
      </div>
    </article>
  `;
}

function clientRow(client) {
  const pending = clientOpenActivities(client.id);
  return `
    <tr>
      <td><strong>${escapeHtml(client.name)}</strong><br><span class="muted">${escapeHtml(client.nit)}</span></td>
      <td>${escapeHtml(personById(client.managerId)?.name || "")}</td>
      <td>${escapeHtml(personById(client.accountantId)?.name || "")}</td>
      <td>${escapeHtml(personById(client.assistantId)?.name || "")}</td>
      <td><span class="status-pill status-${client.status}">${client.status === "active" ? "Activo" : client.status === "suspended" ? "Suspendido" : "Inactivo"}</span></td>
      <td>${pending.length}</td>
      <td>${formatDate(client.lastReview)}</td>
      <td><button class="secondary-button" type="button" data-action="open-client" data-id="${client.id}">Abrir</button></td>
    </tr>
  `;
}

function activityRow(activity) {
  const client = clientById(activity.clientId);
  const assignee = personById(activity.assigneeId);
  const reviewer = personById(activity.reviewerId);
  return `
    <tr>
      <td><strong>${escapeHtml(activity.title)}</strong><br><span class="muted">${escapeHtml(activity.type)}</span></td>
      <td>${escapeHtml(client?.name || "Sin cliente")}</td>
      <td>${escapeHtml(assignee?.name || "Sin responsable")}</td>
      <td>${escapeHtml(reviewer?.name || "Sin revisor")}</td>
      <td class="${isOverdue(activity) ? "tone-bad" : ""}">${formatDate(activity.dueDate)}<br><span class="muted">${dueText(activity)}</span></td>
      <td><span class="priority-pill priority-${activity.priority}">${priorityLabels[activity.priority]}</span></td>
      <td>
        <select class="inline-select" data-inline-status="${activity.id}">
          ${statusOrder.map(status => `<option value="${status}" ${activity.status === status ? "selected" : ""}>${statusLabels[status]}</option>`).join("")}
        </select>
      </td>
      <td><button class="secondary-button" type="button" data-action="open-activity" data-id="${activity.id}">Abrir</button></td>
    </tr>
  `;
}

function teamCard(person) {
  const activities = activitiesForPerson(person.id);
  const open = activities.filter(activity => !isDone(activity));
  const overdue = open.filter(isOverdue);
  const blocked = open.filter(activity => activity.status === "bloqueada");
  const assignedClients = clientsForPerson(person.id);
  const capacity = person.weeklyCapacity || 32;
  const load = Math.min(100, Math.round((open.length * 4 / capacity) * 100));
  return `
    <article class="team-card">
      <div class="team-head">
        <div class="mini-row">
          <div class="team-avatar">${initials(person.name)}</div>
          <div>
            <h4>${escapeHtml(person.name)}</h4>
            <p>${roleLabels[person.role]} · ${assignedClients.length} clientes</p>
          </div>
        </div>
        <span class="role-pill status-${person.role === "contador" ? "progreso" : "revision"}">${roleLabels[person.role]}</span>
      </div>
      <div class="list-stack">
        <div class="mini-row"><span data-icon="checklist"></span><span>${open.length} abiertas, ${overdue.length} vencidas</span></div>
        <div class="mini-row"><span data-icon="alert"></span><span>${blocked.length} bloqueadas</span></div>
      </div>
      <div>
        <div class="mini-row" style="justify-content:space-between;margin-bottom:6px;">
          <span class="muted">Carga estimada</span>
          <strong>${load}%</strong>
        </div>
        <div class="progress-bar"><span style="width:${load}%"></span></div>
      </div>
      <div class="quick-actions">
        <button type="button" data-action="set-meeting-person" data-id="${person.id}">Reunión</button>
        <button type="button" data-action="new-activity-for-person" data-id="${person.id}">Asignar</button>
      </div>
    </article>
  `;
}

function agendaInsightList(overdue, blocked, dueSoon) {
  const items = []
    .concat(overdue.slice(0, 3).map(activity => insightItem(activity, "bad")))
    .concat(blocked.filter(activity => !overdue.includes(activity)).slice(0, 2).map(activity => insightItem(activity, "warn")))
    .concat(dueSoon.slice(0, 3).map(activity => insightItem(activity, "warn")));
  return items.join("") || emptySmall("Sin vencidas ni bloqueadas en esta vista.");
}

function insightItem(activity, tone = "") {
  const client = clientById(activity.clientId);
  const assignee = personById(activity.assigneeId);
  return `
    <button class="insight-item ${tone}" type="button" data-action="open-activity" data-id="${activity.id}" style="border-top:0;border-right:0;border-bottom:0;background:transparent;text-align:left;width:100%;">
      <strong>${escapeHtml(activity.title)}</strong>
      <span>${escapeHtml(client?.name || "Sin cliente")} · ${escapeHtml(assignee?.name || "Sin responsable")} · ${dueText(activity)}</span>
    </button>
  `;
}

function clientFocusItem(client) {
  const open = clientOpenActivities(client.id);
  const critical = open.filter(activity => activity.status === "bloqueada" || isOverdue(activity)).length;
  return `
    <button class="insight-item ${client.health === "red" ? "bad" : "warn"}" type="button" data-action="open-client" data-id="${client.id}" style="border-top:0;border-right:0;border-bottom:0;background:transparent;text-align:left;width:100%;">
      <strong>${escapeHtml(client.name)}</strong>
      <span>${healthLabels[client.health]} · ${critical} críticos · ${open.length} abiertos</span>
    </button>
  `;
}

function teamWorkloadRows() {
  const members = peopleInScope().filter(person => person.role !== "gerente");
  return members
    .map(person => {
      const open = activitiesForPerson(person.id).filter(activity => !isDone(activity));
      const capacity = person.weeklyCapacity || 32;
      const load = Math.min(100, Math.round((open.length * 4 / capacity) * 100));
      return `
        <div class="insight-item">
          <strong>${escapeHtml(person.name)} · ${open.length} abiertas</strong>
          <span>${roleLabels[person.role]} · capacidad ${capacity} h/semana</span>
          <div class="progress-bar"><span style="width:${load}%"></span></div>
        </div>
      `;
    })
    .join("") || emptySmall("No hay equipo visible.");
}

function meetingChecklist(title, activities, tone) {
  return `
    <section>
      <div class="section-title">
        <h4>${escapeHtml(title)}</h4>
        <span>${activities.length}</span>
      </div>
      <div>
        ${activities.slice(0, 6).map(activity => `
          <label class="check-row">
            <input type="checkbox">
            <span>
              <strong>${escapeHtml(activity.title)}</strong>
              <span class="${tone ? `tone-${tone}` : ""}">${escapeHtml(clientById(activity.clientId)?.name || "Sin cliente")} · ${formatDate(activity.dueDate)} · ${dueText(activity)}</span>
            </span>
          </label>
        `).join("") || emptySmall(`Sin elementos en ${title.toLowerCase()}.`)}
      </div>
    </section>
  `;
}

function openActivityForm(activityId, defaults = {}) {
  const activity = activityId ? state.activities.find(item => item.id === activityId) : null;
  const model = activity || {
    id: "",
    title: "",
    clientId: defaults.clientId || visibleClients()[0]?.id || state.clients[0]?.id,
    type: "Cierre mensual",
    assigneeId: defaults.assigneeId || state.people.find(person => person.role !== "gerente")?.id,
    reviewerId: currentPerson().id,
    status: "pendiente",
    priority: "media",
    dueDate: relativeDate(5),
    detail: "",
    comments: []
  };
  openModal(`
    <form id="activityForm">
      <div class="modal-header">
        <h3>${activity ? "Editar actividad" : "Nueva actividad"}</h3>
        <button class="icon-button" type="button" data-action="close-modal" aria-label="Cerrar"><span data-icon="close"></span></button>
      </div>
      <div class="modal-body">
        <input type="hidden" name="id" value="${escapeHtml(model.id)}">
        <div class="form-grid">
          <label class="field full">
            <span>Actividad</span>
            <input name="title" type="text" required value="${escapeAttribute(model.title)}" placeholder="Ej. Revisar cierre mensual">
          </label>
          <label class="field">
            <span>Cliente</span>
            <select name="clientId" required>
              ${state.clients.map(client => `<option value="${client.id}" ${model.clientId === client.id ? "selected" : ""}>${escapeHtml(client.name)}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Tipo</span>
            <input name="type" type="text" required value="${escapeAttribute(model.type)}">
          </label>
          <label class="field">
            <span>Responsable</span>
            <select name="assigneeId" required>
              ${state.people.filter(person => person.role !== "gerente").map(person => `<option value="${person.id}" ${model.assigneeId === person.id ? "selected" : ""}>${escapeHtml(person.name)} · ${roleLabels[person.role]}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Revisa</span>
            <select name="reviewerId" required>
              ${state.people.map(person => `<option value="${person.id}" ${model.reviewerId === person.id ? "selected" : ""}>${escapeHtml(person.name)}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Estado</span>
            <select name="status" required>
              ${statusOrder.map(status => `<option value="${status}" ${model.status === status ? "selected" : ""}>${statusLabels[status]}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Prioridad</span>
            <select name="priority" required>
              ${Object.keys(priorityLabels).map(priority => `<option value="${priority}" ${model.priority === priority ? "selected" : ""}>${priorityLabels[priority]}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Vence</span>
            <input name="dueDate" type="date" required value="${escapeAttribute(model.dueDate)}">
          </label>
          <label class="field full">
            <span>Detalle</span>
            <textarea name="detail" placeholder="Contexto, bloqueo, criterio o entregable esperado">${escapeHtml(model.detail || "")}</textarea>
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="secondary-button" type="button" data-action="close-modal">Cancelar</button>
        <button class="primary-button" type="submit">Guardar</button>
      </div>
    </form>
  `);
}

function openClientForm(clientId) {
  const client = clientId ? state.clients.find(item => item.id === clientId) : null;
  const model = client || {
    id: "",
    name: "",
    nit: "",
    sector: "",
    plan: "Contabilidad",
    status: "active",
    health: "green",
    managerId: currentPerson().role === "gerente" ? currentPerson().id : "gerente-liz",
    accountantId: state.people.find(person => person.role === "contador")?.id,
    assistantId: state.people.find(person => person.role === "auxiliar")?.id,
    cadence: "Quincenal",
    lastReview: relativeDate(0),
    notes: ""
  };
  openModal(`
    <form id="clientForm">
      <div class="modal-header">
        <h3>${client ? "Editar cliente" : "Nuevo cliente"}</h3>
        <button class="icon-button" type="button" data-action="close-modal" aria-label="Cerrar"><span data-icon="close"></span></button>
      </div>
      <div class="modal-body">
        <input type="hidden" name="id" value="${escapeHtml(model.id)}">
        <div class="form-grid">
          <label class="field">
            <span>Cliente</span>
            <input name="name" required type="text" value="${escapeAttribute(model.name)}">
          </label>
          <label class="field">
            <span>NIT</span>
            <input name="nit" type="text" value="${escapeAttribute(model.nit)}">
          </label>
          <label class="field">
            <span>Sector</span>
            <input name="sector" type="text" value="${escapeAttribute(model.sector)}">
          </label>
          <label class="field">
            <span>Plan</span>
            <input name="plan" type="text" value="${escapeAttribute(model.plan)}">
          </label>
          <label class="field">
            <span>Gerente</span>
            <select name="managerId">
              ${state.people.filter(person => person.role === "gerente").map(person => `<option value="${person.id}" ${model.managerId === person.id ? "selected" : ""}>${escapeHtml(person.name)}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Contador</span>
            <select name="accountantId">
              ${state.people.filter(person => person.role === "contador").map(person => `<option value="${person.id}" ${model.accountantId === person.id ? "selected" : ""}>${escapeHtml(person.name)}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Auxiliar</span>
            <select name="assistantId">
              ${state.people.filter(person => person.role === "auxiliar").map(person => `<option value="${person.id}" ${model.assistantId === person.id ? "selected" : ""}>${escapeHtml(person.name)}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Salud</span>
            <select name="health">
              ${Object.keys(healthLabels).map(health => `<option value="${health}" ${model.health === health ? "selected" : ""}>${healthLabels[health]}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Estado</span>
            <select name="status">
              <option value="active" ${model.status === "active" ? "selected" : ""}>Activo</option>
              <option value="suspended" ${model.status === "suspended" ? "selected" : ""}>Suspendido</option>
              <option value="inactive" ${model.status === "inactive" ? "selected" : ""}>Inactivo</option>
            </select>
          </label>
          <label class="field">
            <span>Ritmo</span>
            <input name="cadence" type="text" value="${escapeAttribute(model.cadence)}">
          </label>
          <label class="field full">
            <span>Notas</span>
            <textarea name="notes">${escapeHtml(model.notes || "")}</textarea>
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="secondary-button" type="button" data-action="close-modal">Cancelar</button>
        <button class="primary-button" type="submit">Guardar</button>
      </div>
    </form>
  `);
}

function openActivityDetail(activityId) {
  const activity = state.activities.find(item => item.id === activityId);
  if (!activity) return;
  const client = clientById(activity.clientId);
  const comments = activity.comments || [];
  openModal(`
    <div class="modal-header">
      <div>
        <h3>${escapeHtml(activity.title)}</h3>
        <p class="muted" style="margin:5px 0 0;">${escapeHtml(client?.name || "Sin cliente")} · ${escapeHtml(activity.type)}</p>
      </div>
      <button class="icon-button" type="button" data-action="close-modal" aria-label="Cerrar"><span data-icon="close"></span></button>
    </div>
    <div class="modal-body">
      <div class="three-grid">
        ${compactMetric("Estado", statusLabels[activity.status], activity.status === "bloqueada" ? "warn" : "info")}
        ${compactMetric("Prioridad", priorityLabels[activity.priority], activity.priority === "alta" ? "bad" : "info")}
        ${compactMetric("Vence", formatDate(activity.dueDate), isOverdue(activity) ? "bad" : "good")}
      </div>
      <div class="split-grid">
        <div class="list-stack">
          <div class="insight-item"><strong>Responsable</strong><span>${escapeHtml(personById(activity.assigneeId)?.name || "")}</span></div>
          <div class="insight-item"><strong>Revisa</strong><span>${escapeHtml(personById(activity.reviewerId)?.name || "")}</span></div>
          <div class="insight-item"><strong>Detalle</strong><span>${escapeHtml(activity.detail || "Sin detalle")}</span></div>
        </div>
        <div>
          <div class="section-title">
            <h4>Comentarios</h4>
            <span>${comments.length}</span>
          </div>
          <div class="list-stack">
            ${comments.map(comment => `<div class="insight-item"><span>${escapeHtml(comment)}</span></div>`).join("") || emptySmall("Sin comentarios.")}
          </div>
        </div>
      </div>
      <form id="activityCommentForm" class="form-grid">
        <input type="hidden" name="activityId" value="${activity.id}">
        <label class="field">
          <span>Actualizar estado</span>
          <select name="status">
            ${statusOrder.map(status => `<option value="${status}" ${activity.status === status ? "selected" : ""}>${statusLabels[status]}</option>`).join("")}
          </select>
        </label>
        <label class="field full">
          <span>Comentario</span>
          <textarea name="comment" placeholder="Qué se hizo, qué falta o qué debe decidir el gerente"></textarea>
        </label>
        <div class="full">
          <button class="primary-button" type="submit">Guardar actualización</button>
          <button class="secondary-button" type="button" data-action="edit-activity" data-id="${activity.id}"><span data-icon="edit"></span> Editar</button>
        </div>
      </form>
    </div>
  `);
}

function openClientDetail(clientId) {
  const client = state.clients.find(item => item.id === clientId);
  if (!client) return;
  const activities = state.activities.filter(activity => activity.clientId === client.id);
  openModal(`
    <div class="modal-header">
      <div>
        <h3>${escapeHtml(client.name)}</h3>
        <p class="muted" style="margin:5px 0 0;">${escapeHtml(client.nit)} · ${escapeHtml(client.plan)}</p>
      </div>
      <button class="icon-button" type="button" data-action="close-modal" aria-label="Cerrar"><span data-icon="close"></span></button>
    </div>
    <div class="modal-body">
      <div class="three-grid">
        ${compactMetric("Salud", healthLabels[client.health], client.health === "red" ? "bad" : client.health === "yellow" ? "warn" : "good")}
        ${compactMetric("Abiertas", activities.filter(activity => !isDone(activity)).length, "info")}
        ${compactMetric("Vencidas", activities.filter(isOverdue).length, activities.filter(isOverdue).length ? "bad" : "good")}
      </div>
      <div class="split-grid">
        <div class="list-stack">
          <div class="insight-item"><strong>Gerente</strong><span>${escapeHtml(personById(client.managerId)?.name || "")}</span></div>
          <div class="insight-item"><strong>Contador</strong><span>${escapeHtml(personById(client.accountantId)?.name || "")}</span></div>
          <div class="insight-item"><strong>Auxiliar</strong><span>${escapeHtml(personById(client.assistantId)?.name || "")}</span></div>
          <div class="insight-item"><strong>Notas</strong><span>${escapeHtml(client.notes || "Sin notas")}</span></div>
        </div>
        <div class="list-stack">
          ${activities.slice(0, 8).map(activity => insightItem(activity, isOverdue(activity) ? "bad" : "")).join("") || emptySmall("Sin actividades para este cliente.")}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="secondary-button" type="button" data-action="edit-client" data-id="${client.id}"><span data-icon="edit"></span> Editar</button>
      <button class="primary-button" type="button" data-action="new-activity-for-client" data-id="${client.id}"><span data-icon="plus"></span> Asignar actividad</button>
    </div>
  `);
}

function openModal(markup) {
  $("#modalRoot").innerHTML = `<div class="modal-backdrop"><div class="modal">${markup}</div></div>`;
  injectIcons($("#modalRoot"));
}

function closeModal() {
  $("#modalRoot").innerHTML = "";
}

function handleActionClick(event) {
  const action = event.target.closest("[data-action]");
  if (!action) return;
  const id = action.dataset.id;
  const type = action.dataset.action;
  if (type === "close-modal") closeModal();
  if (type === "new-activity") openActivityForm();
  if (type === "new-client") openClientForm();
  if (type === "open-activity") openActivityDetail(id);
  if (type === "open-client") openClientDetail(id);
  if (type === "edit-activity") openActivityForm(id);
  if (type === "edit-client") openClientForm(id);
  if (type === "quick-complete") updateActivityStatus(id, "completada");
  if (type === "new-activity-for-client") {
    closeModal();
    openActivityForm(null, { clientId: id });
  }
  if (type === "new-activity-for-person") openActivityForm(null, { assigneeId: id });
  if (type === "set-meeting-person") {
    state.ui.meetingPersonId = id;
    state.ui.module = "reuniones";
    saveState();
    render();
  }
  if (type === "open-meeting") {
    state.ui.module = "reuniones";
    saveState();
    render();
  }
  if (type === "copy-meeting-summary") copyMeetingSummary(action.dataset.personId);
  if (type === "export-json") exportJson();
  if (type === "copy-json") copyText(JSON.stringify(state, null, 2), "JSON copiado.");
  if (type === "trigger-import") $("#importFile")?.click();
  if (type === "reset-data") resetData();
  if (type === "export-csv") exportActivitiesCsv();
}

function handleInlineChange(event) {
  const statusId = event.target.dataset.inlineStatus;
  if (statusId) updateActivityStatus(statusId, event.target.value);
}

function handleFormSubmit(event) {
  if (event.target.id === "activityForm") {
    event.preventDefault();
    saveActivityForm(event.target);
  }
  if (event.target.id === "clientForm") {
    event.preventDefault();
    saveClientForm(event.target);
  }
  if (event.target.id === "activityCommentForm") {
    event.preventDefault();
    saveActivityComment(event.target);
  }
  if (event.target.id === "meetingNoteForm") {
    event.preventDefault();
    saveMeetingNote(event.target);
  }
}

function saveActivityForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const existing = state.activities.find(activity => activity.id === data.id);
  const model = {
    id: data.id || `act-${Date.now()}`,
    title: data.title.trim(),
    clientId: data.clientId,
    type: data.type.trim(),
    assigneeId: data.assigneeId,
    reviewerId: data.reviewerId,
    status: data.status,
    priority: data.priority,
    dueDate: data.dueDate,
    updatedAt: relativeDate(0),
    detail: data.detail.trim(),
    comments: existing?.comments || []
  };
  if (existing) {
    Object.assign(existing, model);
  } else {
    state.activities.unshift(model);
  }
  saveState();
  closeModal();
  renderView();
  showToast("Actividad guardada.");
}

function saveClientForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const model = {
    id: data.id || `cli-${Date.now()}`,
    name: data.name.trim(),
    nit: data.nit.trim(),
    sector: data.sector.trim(),
    plan: data.plan.trim(),
    status: data.status,
    health: data.health,
    managerId: data.managerId,
    accountantId: data.accountantId,
    assistantId: data.assistantId,
    cadence: data.cadence.trim(),
    lastReview: relativeDate(0),
    notes: data.notes.trim()
  };
  const existing = state.clients.find(client => client.id === data.id);
  if (existing) {
    Object.assign(existing, model);
  } else {
    state.clients.unshift(model);
  }
  saveState();
  closeModal();
  renderView();
  showToast("Cliente guardado.");
}

function saveActivityComment(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const activity = state.activities.find(item => item.id === data.activityId);
  if (!activity) return;
  activity.status = data.status;
  activity.updatedAt = relativeDate(0);
  if (data.comment.trim()) {
    activity.comments = activity.comments || [];
    activity.comments.push(`${formatDate(relativeDate(0))}: ${data.comment.trim()}`);
  }
  saveState();
  closeModal();
  renderView();
  showToast("Actualización guardada.");
}

function saveMeetingNote(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  if (data.note.trim()) {
    state.meetingNotes.unshift({
      id: `note-${Date.now()}`,
      personId: data.personId,
      date: relativeDate(0),
      note: data.note.trim()
    });
  }
  if (data.actionTitle.trim()) {
    state.activities.unshift({
      id: `act-${Date.now()}`,
      title: data.actionTitle.trim(),
      clientId: data.clientId,
      type: "Compromiso de reunión",
      assigneeId: data.personId,
      reviewerId: currentPerson().id,
      status: "pendiente",
      priority: data.priority,
      dueDate: data.dueDate,
      updatedAt: relativeDate(0),
      detail: "Acción creada desde reunión de seguimiento.",
      comments: []
    });
  }
  saveState();
  renderView();
  showToast("Seguimiento guardado.");
}

function updateActivityStatus(activityId, status) {
  const activity = state.activities.find(item => item.id === activityId);
  if (!activity) return;
  activity.status = status;
  activity.updatedAt = relativeDate(0);
  saveState();
  renderView();
  showToast(`Estado actualizado a ${statusLabels[status]}.`);
}

function bindKanban() {
  $$(".activity-card").forEach(card => {
    card.addEventListener("dragstart", event => {
      card.classList.add("dragging");
      event.dataTransfer.setData("text/plain", card.dataset.activityCard);
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
  });

  $$("[data-drop-status]").forEach(column => {
    column.addEventListener("dragover", event => {
      event.preventDefault();
      column.classList.add("over");
    });
    column.addEventListener("dragleave", () => column.classList.remove("over"));
    column.addEventListener("drop", event => {
      event.preventDefault();
      column.classList.remove("over");
      const activityId = event.dataTransfer.getData("text/plain");
      updateActivityStatus(activityId, column.dataset.dropStatus);
    });
  });
}

function getMetrics() {
  const clients = visibleClients();
  const activities = visibleActivities();
  const open = activities.filter(activity => !isDone(activity));
  const completed = activities.filter(isDone);
  const activeClients = clients.filter(client => client.status === "active");
  const riskClients = clients.filter(client => client.health !== "green").length;
  return {
    activeClients: activeClients.length,
    riskClients,
    openActivities: open.length,
    overdue: open.filter(isOverdue).length,
    blocked: open.filter(activity => activity.status === "bloqueada").length,
    dueSoon: open.filter(activity => !isOverdue(activity) && daysUntil(activity.dueDate) <= 7).length,
    completionRate: activities.length ? Math.round((completed.length / activities.length) * 100) : 0
  };
}

function visibleClients() {
  const current = currentPerson();
  const search = normalize(state.ui.search || "");
  return state.clients.filter(client => {
    if (!clientInCurrentScope(client, current)) return false;
    if (state.ui.managerFilter !== "all" && client.managerId !== state.ui.managerFilter) return false;
    if (state.ui.personFilter !== "all" && client.accountantId !== state.ui.personFilter && client.assistantId !== state.ui.personFilter) return false;
    if (search) {
      const haystack = normalize([client.name, client.nit, client.sector, personById(client.accountantId)?.name, personById(client.assistantId)?.name].join(" "));
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

function visibleActivities() {
  const current = currentPerson();
  const clientIds = new Set(visibleClients().map(client => client.id));
  const search = normalize(state.ui.search || "");
  return state.activities.filter(activity => {
    const client = clientById(activity.clientId);
    if (!client || !clientIds.has(client.id)) return false;
    if (!activityInCurrentScope(activity, current)) return false;
    if (state.ui.statusFilter !== "all" && activity.status !== state.ui.statusFilter) return false;
    if (state.ui.personFilter !== "all" && activity.assigneeId !== state.ui.personFilter && activity.reviewerId !== state.ui.personFilter) return false;
    if (search) {
      const haystack = normalize([
        activity.title,
        activity.type,
        activity.detail,
        client.name,
        personById(activity.assigneeId)?.name,
        personById(activity.reviewerId)?.name
      ].join(" "));
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

function clientInCurrentScope(client, current) {
  if (current.canSeeAll) return true;
  if (current.role === "gerente") return client.managerId === current.id;
  return client.accountantId === current.id || client.assistantId === current.id;
}

function activityInCurrentScope(activity, current) {
  if (current.canSeeAll) return true;
  if (current.role === "gerente") {
    const client = clientById(activity.clientId);
    return client?.managerId === current.id || activity.reviewerId === current.id;
  }
  return activity.assigneeId === current.id || activity.reviewerId === current.id;
}

function peopleInScope() {
  const current = currentPerson();
  if (current.canSeeAll) return state.people;
  if (current.role === "gerente") return state.people.filter(person => person.id === current.id || person.managerId === current.id);
  return state.people.filter(person => person.id === current.id);
}

function clientOpenActivities(clientId) {
  return state.activities.filter(activity => activity.clientId === clientId && !isDone(activity));
}

function activitiesForPerson(personId) {
  return state.activities.filter(activity => activity.assigneeId === personId || activity.reviewerId === personId);
}

function clientsForPerson(personId) {
  return state.clients.filter(client => client.accountantId === personId || client.assistantId === personId || client.managerId === personId);
}

function currentPerson() {
  return personById(state.ui.currentPersonId) || state.people[0];
}

function personById(id) {
  return state.people.find(person => person.id === id);
}

function clientById(id) {
  return state.clients.find(client => client.id === id);
}

function isDone(activity) {
  return activity.status === "completada";
}

function isOverdue(activity) {
  return !isDone(activity) && daysUntil(activity.dueDate) < 0;
}

function daysUntil(dateText) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateText}T00:00:00`);
  return Math.round((target - today) / 86400000);
}

function dueText(activity) {
  if (isDone(activity)) return "Completada";
  const days = daysUntil(activity.dueDate);
  if (days < 0) return `${Math.abs(days)} días vencida`;
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence mañana";
  return `Vence en ${days} días`;
}

function relativeDate(offset) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function formatDate(dateText) {
  if (!dateText) return "";
  const date = new Date(`${dateText}T00:00:00`);
  return date.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function emptySmall(text) {
  return `<div class="empty-state" style="min-height:90px;">${escapeHtml(text)}</div>`;
}

function emptyState(text) {
  return `<div class="empty-state">${escapeHtml(text)}</div>`;
}

function moduleTitle(module) {
  return {
    dashboard: "Inicio",
    clientes: "Clientes",
    actividades: "Actividades",
    reuniones: "Reuniones",
    equipo: "Equipo",
    datos: "Datos"
  }[module] || "Inicio";
}

function injectIcons(root = document) {
  $$("[data-icon]", root).forEach(slot => {
    const name = slot.dataset.icon;
    if (!name || !iconPaths[name] || slot.dataset.rendered === "true") return;
    slot.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]}</svg>`;
    slot.dataset.rendered = "true";
  });
}

function copyMeetingSummary(personId) {
  const person = personById(personId);
  const activities = activitiesForPerson(personId).filter(activity => !isDone(activity));
  const lines = [
    `Acta de seguimiento - ${person?.name || ""}`,
    `Fecha: ${formatDate(relativeDate(0))}`,
    "",
    "Vencidas:",
    ...activities.filter(isOverdue).map(activitySummaryLine),
    "",
    "Bloqueadas:",
    ...activities.filter(activity => activity.status === "bloqueada").map(activitySummaryLine),
    "",
    "Próximos 7 días:",
    ...activities.filter(activity => !isOverdue(activity) && daysUntil(activity.dueDate) <= 7).map(activitySummaryLine),
    "",
    "Compromisos:",
    "- "
  ];
  copyText(lines.join("\n"), "Acta copiada.");
}

function activitySummaryLine(activity) {
  return `- ${activity.title} | ${clientById(activity.clientId)?.name || "Sin cliente"} | ${formatDate(activity.dueDate)} | ${statusLabels[activity.status]}`;
}

function copyText(text, message) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast(message)).catch(() => fallbackCopy(text, message));
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  showToast(message);
}

function exportJson() {
  downloadFile("gc-control-datos.json", JSON.stringify(state, null, 2), "application/json");
}

function exportActivitiesCsv() {
  const rows = [
    ["Actividad", "Cliente", "Responsable", "Revisor", "Estado", "Prioridad", "Vence"],
    ...visibleActivities().map(activity => [
      activity.title,
      clientById(activity.clientId)?.name || "",
      personById(activity.assigneeId)?.name || "",
      personById(activity.reviewerId)?.name || "",
      statusLabels[activity.status],
      priorityLabels[activity.priority],
      activity.dueDate
    ])
  ];
  const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
  downloadFile("gc-control-actividades.csv", csv, "text/csv;charset=utf-8");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = migrateState(JSON.parse(reader.result));
      saveState();
      render();
      showToast("Datos importados.");
    } catch (error) {
      showToast("No se pudo importar el JSON.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function resetData() {
  if (!confirm("¿Reiniciar los datos de ejemplo? Se perderán los cambios guardados en este navegador.")) return;
  state = seedState();
  saveState();
  render();
  showToast("Datos reiniciados.");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
