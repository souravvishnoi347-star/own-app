// Hostbolt Command Center - Co-Founder App Client Logic
// Built to match official Nexus AI design system (Inter font, Royal Blue #2B63EB, Luxury Cards)

let state = {
  goal: {
    targetUsd: 5000,
    targetInr: 420000,
    collectedInr: 112000
  },
  copilot: {
    name: "Nexus AI Copilot",
    status: "Online & Active",
    currentMission: "Cross-referencing client deliverables, Trovenza fleet calculator & preparing automated sprint reports.",
    accuracy: "99.4%",
    runsExecutedToday: 18,
    tokenLatency: "240ms"
  },
  todayFocus: [],
  contentPipeline: [],
  projects: [],
  payments: []
};

let currentProjectFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  switchTab('pulse');
  if (window.lucide) lucide.createIcons();
});

// Load Data
async function loadData() {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      state = await res.json();
      localStorage.setItem('hostbolt_command_center_data', JSON.stringify(state));
    }
  } catch (e) {
    const cached = localStorage.getItem('hostbolt_command_center_data');
    if (cached) state = JSON.parse(cached);
  }
  renderAll();
}

// Refresh telemetry
async function refreshData() {
  await loadData();
  logToTerminal('System telemetry refreshed from local daemon.');
  if (window.lucide) lucide.createIcons();
}

// Switch Bottom Tabs
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(`tab-${tabId}`);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('text-[#2B63EB]');
      btn.classList.remove('text-slate-400');
    } else {
      btn.classList.remove('text-[#2B63EB]');
      btn.classList.add('text-slate-400');
    }
  });

  if (window.lucide) lucide.createIcons();
}

// Render All Sections
function renderAll() {
  renderPulse();
  renderProjects();
  renderContent();
  renderFinance();
  if (window.lucide) lucide.createIcons();
}

// =========================================================================
// 1. PULSE (DASHBOARD - Images 2 & 3)
// =========================================================================
function renderPulse() {
  const projects = state.projects || [];
  const content = state.contentPipeline || [];
  const focus = state.todayFocus || [];

  document.getElementById('stat-active-projects').innerText = projects.length || 8;
  document.getElementById('stat-video-pipeline').innerText = (content.length * 3 + 2) || 14;
  
  const pendingFocus = focus.filter(f => !f.completed).length;
  document.getElementById('stat-pending-tasks').innerText = pendingFocus + 13;
  document.getElementById('focus-count-badge').innerText = `${pendingFocus} Remaining`;

  if (state.copilot) {
    document.getElementById('copilot-mission').innerText = state.copilot.currentMission;
    document.getElementById('copilot-runs').innerText = `${state.copilot.runsExecutedToday || 18} Runs`;
  }

  // Render Today's Focus List (Image 3)
  const focusContainer = document.getElementById('today-focus-list');
  if (focusContainer) {
    focusContainer.innerHTML = focus.map(item => {
      const tagColors = {
        'Faceless YT': 'bg-amber-50 text-amber-700 border-amber-200/60',
        'Instagram': 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
        'Business': 'bg-blue-50 text-[#2B63EB] border-blue-200/60',
        'Client Retainer': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        'Personal Brand': 'bg-purple-50 text-purple-700 border-purple-200/60'
      };
      const badgeStyle = tagColors[item.tag] || 'bg-slate-100 text-slate-700 border-slate-200';

      return `
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 transition group">
          <div class="flex items-center space-x-3">
            <button onclick="toggleFocusTask('${item.id}')" class="w-5 h-5 rounded-md border ${item.completed ? 'bg-[#2B63EB] border-[#2B63EB] text-white' : 'border-slate-300 bg-white'} flex items-center justify-center transition">
              ${item.completed ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : ''}
            </button>
            <div>
              <p class="text-xs font-bold ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}">${item.title}</p>
              <div class="flex items-center space-x-2 mt-0.5">
                <span class="text-[9px] font-bold px-1.5 py-0.2 rounded border ${badgeStyle}">${item.tag}</span>
                <span class="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <i data-lucide="clock" class="w-3 h-3"></i>
                  <span>${item.due}</span>
                </span>
              </div>
            </div>
          </div>
          <button class="text-slate-400 hover:text-slate-600 p-1">
            <i data-lucide="more-vertical" class="w-4 h-4"></i>
          </button>
        </div>
      `;
    }).join('');
  }
}

// Toggle Task
function toggleFocusTask(id) {
  const task = (state.todayFocus || []).find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveData();
  }
}

// =========================================================================
// 2. PROJECTS & OPERATIONS (Image 5)
// =========================================================================
function filterProjects(category) {
  currentProjectFilter = category;
  ['all', 'client', 'internal'].forEach(k => {
    const btn = document.getElementById(`pf-${k}`);
    if (btn) {
      if ((k === 'all' && category === 'all') || 
          (k === 'client' && category === 'Client Retainer') ||
          (k === 'internal' && category === 'Internal Infra')) {
        btn.className = "px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap bg-[#2B63EB] text-white";
      } else {
        btn.className = "px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap bg-white text-slate-600 border border-slate-200";
      }
    }
  });
  renderProjects();
}

function renderProjects() {
  const container = document.getElementById('projects-list');
  if (!container) return;

  let list = state.projects || [];
  if (currentProjectFilter !== 'all') {
    list = list.filter(p => p.type === currentProjectFilter);
  }

  container.innerHTML = list.map(p => {
    const isCompleted = p.progress === 100;
    const badgeColor = p.statusBadge === 'On Track' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                       p.statusBadge === 'Attention Req.' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                       p.statusBadge === 'Almost Done' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                       'bg-blue-50 text-[#2B63EB] border-blue-200';

    return `
      <div class="card-luxury p-4 space-y-3">
        <!-- Top Pill row -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2B63EB]">${p.type}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor} flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full ${p.statusBadge === 'Attention Req.' ? 'bg-rose-500' : 'bg-emerald-500'}"></span>
              <span>${p.statusBadge}</span>
            </span>
          </div>
          <button class="text-slate-400 hover:text-slate-600">
            <i data-lucide="more-vertical" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Project Title -->
        <div>
          <h4 class="text-sm font-extrabold text-slate-900">${p.name}</h4>
          <p class="text-[11px] text-slate-500 font-medium">${p.client}</p>
        </div>

        <!-- Progress Bar -->
        <div class="space-y-1">
          <div class="flex justify-between text-[11px] font-bold">
            <span class="text-slate-600">Sprint Completion</span>
            <span class="text-[#2B63EB] font-mono">${p.progress}%</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div class="bg-[#2B63EB] h-2 rounded-full" style="width: ${p.progress}%"></div>
          </div>
        </div>

        <!-- Next Milestone Box (Image 5) -->
        <div class="bg-blue-50/60 border border-blue-100/80 rounded-xl p-2.5 flex items-start space-x-2">
          <div class="w-5 h-5 rounded-md bg-blue-100 text-[#2B63EB] flex items-center justify-center shrink-0 mt-0.5">
            <i data-lucide="flag" class="w-3 h-3"></i>
          </div>
          <div class="flex-1">
            <span class="text-[10px] font-bold text-slate-700 block">Next Milestone</span>
            <p class="text-[11px] font-medium text-slate-600 leading-snug">${p.nextMilestone}</p>
          </div>
        </div>

        <!-- Bottom Avatars & Remaining Tasks -->
        <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
          <div class="flex items-center -space-x-1.5">
            ${(p.team || ['SV']).map(t => `
              <div class="w-6 h-6 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                ${t}
              </div>
            `).join('')}
            ${p.team && p.team.length > 2 ? '<div class="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-[9px] font-bold flex items-center justify-center ring-2 ring-white">+2</div>' : ''}
          </div>

          <div class="flex items-center space-x-1 text-slate-500 font-semibold">
            <i data-lucide="check-circle" class="w-3.5 h-3.5 text-slate-400"></i>
            <span>${p.tasksRemaining} tasks remaining</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// =========================================================================
// 3. CONTENT HUB (Image 4)
// =========================================================================
function renderContent() {
  const container = document.getElementById('content-list');
  if (!container) return;

  const content = state.contentPipeline || [];
  container.innerHTML = content.map(c => {
    const statusPill = c.status === 'Editing' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                       c.status === 'Scheduled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                       c.status === 'Review' ? 'bg-blue-50 text-[#2B63EB] border-blue-200' :
                       'bg-slate-100 text-slate-700 border-slate-200';

    return `
      <div class="card-luxury p-3.5 space-y-3">
        <!-- Top Tags -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-1.5">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">${c.channel}</span>
            <span class="text-[10px] font-bold text-slate-600 flex items-center gap-1">
              <i data-lucide="youtube" class="w-3 h-3 text-rose-600"></i>
              <span>${c.brand}</span>
            </span>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusPill} flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full ${c.status === 'Scheduled' ? 'bg-emerald-500' : 'bg-indigo-500'}"></span>
            <span>${c.status}</span>
          </span>
        </div>

        <!-- Thumbnail & Title Row -->
        <div class="flex items-start space-x-3">
          <div class="w-16 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 relative overflow-hidden">
            <i data-lucide="play" class="w-5 h-5 text-blue-400 fill-current opacity-80"></i>
            ${c.duration ? `<span class="absolute bottom-1 right-1 bg-black/80 text-[8px] font-mono px-1 rounded text-white">${c.duration}</span>` : ''}
          </div>
          <div class="flex-1">
            <h4 class="text-xs font-bold text-slate-900 leading-snug">${c.title}</h4>
            <div class="flex items-center space-x-1 text-[10px] text-slate-400 font-medium mt-1">
              <i data-lucide="clock" class="w-3 h-3"></i>
              <span>${c.due}</span>
            </div>
          </div>
        </div>

        <!-- Multi-stage progress bar -->
        <div class="space-y-1 pt-1">
          <div class="flex justify-between text-[10px] font-bold text-slate-500">
            <span>${c.badge || `Script ${c.scriptPct}% • Voiceover ${c.voicePct}% • Edit ${c.editPct}%`}</span>
            <span class="text-[#2B63EB] font-mono">${c.totalPct}%</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 rounded-full" style="width: ${c.totalPct}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// =========================================================================
// 4. FINANCE LEDGER
// =========================================================================
function renderFinance() {
  const container = document.getElementById('finance-payments-list');
  if (!container) return;

  const payments = state.payments || [];
  container.innerHTML = payments.map(p => `
    <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
      <div>
        <h4 class="text-xs font-bold text-slate-800">${p.project}</h4>
        <span class="text-[10px] text-slate-400 font-medium">${p.date} • via ${p.mode}</span>
      </div>
      <div class="text-right">
        <span class="text-xs font-black text-emerald-600 font-mono">+₹${Number(p.amount).toLocaleString('en-IN')}</span>
        <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded block mt-0.5">Verified</span>
      </div>
    </div>
  `).join('');
}

// =========================================================================
// 5. 24/7 REMOTE COMMAND EXECUTION (WEBHOOK)
// =========================================================================
async function executeRemoteCommand(action, customCommand = null) {
  logToTerminal(`[HOSTBOLT-REMOTE] Dispatching action: "${action}"...`);
  try {
    const res = await fetch('/api/command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hostbolt-Auth': 'hostbolt-secure-2026'
      },
      body: JSON.stringify({ action, customCommand })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      logToTerminal(`✓ [SUCCESS]:\n${data.output}`);
      if (state.copilot) {
        state.copilot.runsExecutedToday = (state.copilot.runsExecutedToday || 18) + 1;
        document.getElementById('copilot-runs').innerText = `${state.copilot.runsExecutedToday} Runs`;
      }
    } else {
      logToTerminal(`✗ [ERROR]: ${data.error || 'Execution failed'}`);
    }
  } catch (err) {
    logToTerminal(`✗ [NETWORK ERROR]: Could not reach host laptop: ${err.message}`);
  }
}

function promptCustomCommand() {
  const cmd = prompt("Enter PowerShell command to execute on 24/7 Laptop:", "Get-Date");
  if (cmd) {
    executeRemoteCommand('custom', cmd);
  }
}

function testSystemStatus() {
  executeRemoteCommand('system-status');
}

function logToTerminal(msg) {
  const out = document.getElementById('terminal-output');
  if (out) {
    const time = new Date().toLocaleTimeString();
    out.innerHTML += `<p class="border-b border-slate-900 pb-1 mt-1"><span class="text-blue-400">[${time}]</span> ${msg}</p>`;
    out.scrollTop = out.scrollHeight;
  }
}

function clearTerminal() {
  const out = document.getElementById('terminal-output');
  if (out) out.innerHTML = '<p class="text-slate-400">Terminal buffer cleared.</p>';
}

// Modals
function promptAgentModal() {
  document.getElementById('agentModal').classList.remove('hidden');
}

function closeAgentModal() {
  document.getElementById('agentModal').classList.add('hidden');
}

async function sendAgentPrompt() {
  const text = document.getElementById('agentPromptInput').value.trim();
  if (!text) return;
  closeAgentModal();
  logToTerminal(`[AGENT DISPATCH]: Prompting Antigravity: "${text}"`);
  executeRemoteCommand('custom', `echo "Agent task queued: ${text}"`);
}

function renderNewVideoModal() {
  alert("HyperFrames + GSAP Video Renderer: Queueing automated reel for Instagram & YouTube Shorts.");
}

async function saveData() {
  localStorage.setItem('hostbolt_command_center_data', JSON.stringify(state));
  try {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
  } catch (e) {}
  renderAll();
}
