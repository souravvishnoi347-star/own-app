// Hostbolt Command Center - Co-Founder App Client Logic
// Built to match official Nexus AI design system (Inter font, Royal Blue #2B63EB, Luxury Cards)

const DEFAULT_STATE = {
  goal: {
    targetUsd: 5000,
    targetInr: 420000,
    startDate: "2026-11-16",
    endDate: "2027-01-15",
    collectedInr: 112000
  },
  copilot: {
    name: "Nexus AI Copilot",
    status: "Online & Active",
    isAutonomous: true,
    currentMission: "Cross-referencing client deliverables, Trovenza fleet calculator & preparing automated sprint reports.",
    accuracy: "99.4%",
    runsExecutedToday: 18,
    tokenLatency: "240ms"
  },
  todayFocus: [
    { id: "tf-1", title: "Deploy Taxi Fare Engine & Fleet for Trovenza", tag: "Client Retainer", tagColor: "blue", due: "Today, 4:00 PM", completed: false },
    { id: "tf-2", title: "Review carousel hooks & render video reels", tag: "Instagram", tagColor: "purple", due: "Today, 6:30 PM", completed: false },
    { id: "tf-3", title: "Finalize Talib Bhai Rajaji Safari Ads Landing Page", tag: "Business", tagColor: "indigo", due: "Tomorrow, 11:00 AM", completed: false },
    { id: "tf-4", title: "Draft script for AI automation video", tag: "Faceless YT", tagColor: "amber", due: "Tomorrow, 2:00 PM", completed: false },
    { id: "tf-5", title: "Audit Hostbolt server telemetry & 24/7 uptime SLA", tag: "Business", tagColor: "emerald", due: "Nov 20", completed: true },
    { id: "tf-6", title: "Schedule batch upload for Shorts channel #2", tag: "Faceless YT", tagColor: "amber", due: "Nov 22", completed: false }
  ],
  contentPipeline: [
    { id: "cp-1", channel: "Faceless YT", brand: "AI Automations Lab", status: "Editing", title: "10 AI Tools Replacing Software Engineers in 2026", due: "Due Tomorrow, 5:00 PM", scriptPct: 100, voicePct: 100, editPct: 40, totalPct: 80, duration: "10:02", icon: "video" },
    { id: "cp-2", channel: "Instagram", brand: "@growthops.daily", status: "Scheduled", title: "3 Psychology Tricks to Double Agency Retainers", due: "Today, 8:00 PM (Auto-publish)", scriptPct: 100, voicePct: 100, editPct: 100, totalPct: 100, badge: "Asset sync ready - Reel & Audio synced", icon: "instagram" },
    { id: "cp-3", channel: "Personal Brand", brand: "Sourav's Brand", status: "Scripting", title: "My $50k/mo Solopreneur Tech Stack Breakdown", due: "Due Nov 22, 10:00 AM", scriptPct: 60, voicePct: 0, editPct: 0, totalPct: 35, badge: "Draft outline - Hook validation complete", icon: "mic" },
    { id: "cp-4", channel: "Faceless YT", brand: "AI Automations Lab", status: "Review", title: "Automating Lead Gen with Make.com & Claude 3.5", due: "Target: Nov 24, 2:00 PM", scriptPct: 100, voicePct: 100, editPct: 85, totalPct: 92, duration: "14:18", icon: "play-square" }
  ],
  projects: [
    { id: "proj-1", name: "Trovenza Travels Portal", client: "Trovenza Travels Pvt Ltd", type: "Client Retainer", statusBadge: "On Track", progress: 75, nextMilestone: "Finalize Taxi Fare Engine, Fleet Showcase & Staging Smoke Tests", dealValue: 28000, collected: 7000, pending: 21000, tasksRemaining: 4, team: ["SV", "AG"], status: "in-progress" },
    { id: "proj-2", name: "Rajaji National Park Safari", client: "Talib Bhai (Safari Team)", type: "Client Retainer", statusBadge: "Attention Req.", progress: 45, nextMilestone: "Client approval on Google Ads disclaimer & WhatsApp zone booking flow", dealValue: 30000, collected: 0, pending: 30000, tasksRemaining: 7, team: ["SV"], status: "planning" },
    { id: "proj-3", name: "Nexus AI Workflow Engine", client: "Hostbolt Internal Infra", type: "Internal Infra", statusBadge: "Almost Done", progress: 90, nextMilestone: "Connect 24/7 Remote Webhook & GSAP Animation Skills", dealValue: 0, collected: 0, pending: 0, tasksRemaining: 2, team: ["SV", "AG", "NX"], status: "active" },
    { id: "proj-4", name: "Rajnandini Boutique POS", client: "Indu Ji & Rajnandini Studio", type: "Delivered Client", statusBadge: "Delivered", progress: 100, nextMilestone: "Physical stock count reconciliation & non-working holiday patch", dealValue: 25000, collected: 25000, pending: 0, tasksRemaining: 1, team: ["SV", "AG"], status: "delivered" },
    { id: "proj-5", name: "Hotel Aadvik Inn Check-In App", client: "Amit Sir (Hotel Aadvik)", type: "Client Retainer", statusBadge: "On Track", progress: 60, nextMilestone: "Contactless QR check-in & automated WhatsApp review flow", dealValue: 25000, collected: 10000, pending: 15000, tasksRemaining: 5, team: ["SV"], status: "in-progress" },
    { id: "proj-6", name: "Urbanage Atelier Portfolio Portal", client: "Urbanage Atelier LLP", type: "SaaS Incubator", statusBadge: "Pipeline", progress: 20, nextMilestone: "Send customized WhatsApp audit pitch and architectural portfolio mockup", dealValue: 35000, collected: 0, pending: 35000, tasksRemaining: 8, team: ["SV"], status: "pipeline" }
  ],
  payments: [
    { id: "pay-1", project: "Rajnandini Boutique POS", amount: 25000, mode: "UPI", date: "2026-10-15", status: "Verified" },
    { id: "pay-2", project: "Trovenza Travels (Phase 1 Advance)", amount: 7000, mode: "Bank Transfer", date: "2026-10-18", status: "Verified" },
    { id: "pay-3", project: "Hotel Aadvik Inn (Advance)", amount: 10000, mode: "UPI", date: "2026-10-25", status: "Verified" },
    { id: "pay-4", project: "Hotel Satyam Swagat", amount: 25000, mode: "Cash & UPI", date: "2026-09-20", status: "Verified" }
  ]
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
let currentProjectFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  renderAll();
  await loadData();
  switchTab('pulse');
  if (window.lucide) lucide.createIcons();
});

// Load Data
async function loadData() {
  try {
    const cached = localStorage.getItem('hostbolt_command_center_data');
    if (cached) {
      state = Object.assign({}, DEFAULT_STATE, JSON.parse(cached));
      renderAll();
    }

    const res = await fetch('/api/data');
    if (res.ok) {
      const serverData = await res.json();
      state = Object.assign({}, DEFAULT_STATE, serverData);
      localStorage.setItem('hostbolt_command_center_data', JSON.stringify(state));
      renderAll();
    }
  } catch (e) {
    // Default data already rendered
  }
}

// Refresh telemetry
async function refreshData() {
  await loadData();
  logToTerminal('System telemetry refreshed.');
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

  const statProjectsEl = document.getElementById('stat-active-projects');
  if (statProjectsEl) statProjectsEl.innerText = projects.length || 8;

  const statVideoEl = document.getElementById('stat-video-pipeline');
  if (statVideoEl) statVideoEl.innerText = (content.length * 3 + 2) || 14;
  
  const pendingFocus = focus.filter(f => !f.completed).length;
  const statTasksEl = document.getElementById('stat-pending-tasks');
  if (statTasksEl) statTasksEl.innerText = pendingFocus + 13;

  const badgeTasksEl = document.getElementById('focus-count-badge');
  if (badgeTasksEl) badgeTasksEl.innerText = `${pendingFocus} Remaining`;

  if (state.copilot) {
    const missionEl = document.getElementById('copilot-mission');
    if (missionEl) missionEl.innerText = state.copilot.currentMission;

    const runsEl = document.getElementById('copilot-runs');
    if (runsEl) runsEl.innerText = `${state.copilot.runsExecutedToday || 18} Runs`;
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
