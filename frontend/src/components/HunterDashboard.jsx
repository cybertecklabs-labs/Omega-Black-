import React, { useState, useEffect, useRef } from 'react';
import { Activity, Shield, Users, Zap, Terminal, Database, Crosshair, AlertTriangle, Lock, GitBranch, Cpu, DollarSign, Search } from 'lucide-react';

// --- THEME CONFIG ---
const THEME = {
    cyan: '#00f3ff',
    magenta: '#ff00ff',
    green: '#00ff41',
    yellow: '#fcee0a',
    red: '#ff0055',
    bg: '#050510',
};

// Agents exactly as requested (ECHO appears twice per specs)
const AGENTS = [
    { name: 'CLAUDE', role: 'Architect', status: 'active', color: THEME.cyan },
    { name: 'GHOST', role: 'Offensive', status: 'active', color: THEME.green },
    { name: 'SYNAPSE', role: 'Analyst', status: 'idle', color: THEME.yellow },
    { name: 'NOVA', role: 'Reporter', status: 'idle', color: THEME.red },
    { name: 'ECHO', role: 'Observer', status: 'idle', color: '#a855f7' },
    { name: 'ECHO', role: 'Support', status: 'idle', color: '#a855f7' }
];

// --- SUB-COMPONENTS ---

const Panel = ({ children, className = "", title, icon: Icon, color = "text-cyan-400" }) => (
    <div className={`relative bg-black/80 border border-cyan-500/30 backdrop-blur-sm p-4 flex flex-col ${className}`}
        style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
        {title && (
            <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
                <div className={`flex items-center gap-2 font-orbitron text-xs tracking-wider ${color} drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]`}>
                    {Icon && <Icon size={14} />}
                    {title.toUpperCase()}
                </div>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    <div className={`w-1 h-1 ${color.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
                </div>
            </div>
        )}
        <div className="relative flex-1 min-h-0 text-cyan-50">
            {children}
        </div>
        {/* Tech accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20"></div>
    </div>
);

const ProgressBar = ({ label, value, color, max = 100 }) => (
    <div className="mb-2 w-full">
        <div className="flex justify-between text-[10px] font-mono mb-1 text-gray-400">
            <span>{label}</span>
            <span style={{ color }}>{value}%</span>
        </div>
        <div className="h-1.5 bg-gray-900 border border-gray-800 relative w-full overflow-hidden">
            <div
                className="h-full transition-all duration-1000 ease-out relative"
                style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
            >
                <div className="absolute top-0 right-0 h-full w-px bg-white/50 shadow-[0_0_8px_white]"></div>
            </div>
        </div>
    </div>
);

const AgentAvatar = ({ agent }) => (
    <div className="flex flex-col items-center gap-1 group cursor-pointer transition-transform hover:-translate-y-1">
        <div className={`w-10 h-10 rounded-full border border-gray-700 bg-gray-900 flex items-center justify-center relative overflow-hidden group-hover:border-[${agent.color}] group-hover:shadow-[0_0_10px_${agent.color}]`}>
            <Users size={18} style={{ color: agent.color }} />
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-black ${agent.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
        </div>
        <span className="text-[9px] font-orbitron tracking-wider text-gray-500 group-hover:text-white">{agent.name}</span>
    </div>
);

// --- MAIN DASHBOARD COMPONENT ---

export default function HunterDashboard() {
    const canvasRef = useRef(null);
    const [logs, setLogs] = useState([]);

    // Radar Animation Effect
    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext('2d');
        let frame = 0;

        // Simulate radar nodes
        const nodes = Array.from({ length: 30 }, () => ({
            x: Math.random() * cvs.width,
            y: Math.random() * cvs.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            color: Math.random() > 0.8 ? THEME.red : THEME.cyan
        }));

        const draw = () => {
            ctx.clearRect(0, 0, cvs.width, cvs.height);

            // Radar sweep
            const cx = cvs.width / 2, cy = cvs.height / 2;
            const angle = (frame * 0.01) % (Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 243, 255, 0.02)';
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, 300, angle, angle + 0.5);
            ctx.fill();

            // Nodes
            nodes.forEach(n => {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > cvs.width) n.vx *= -1;
                if (n.y < 0 || n.y > cvs.height) n.vy *= -1;

                ctx.fillStyle = n.color;
                ctx.shadowBlur = 5;
                ctx.shadowColor = n.color;
                ctx.beginPath();
                ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Connections
                nodes.forEach(n2 => {
                    const d = Math.hypot(n.x - n2.x, n.y - n2.y);
                    if (d < 60) {
                        ctx.strokeStyle = `rgba(0, 243, 255, ${1 - d / 60})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.stroke();
                    }
                });
            });

            frame++;
            requestAnimationFrame(draw);
        };
        draw();
    }, []);

    // Log Simulator
    useEffect(() => {
        const interval = setInterval(() => {
            const newLog = `[${new Date().toLocaleTimeString()}] RECON: Analyzed packet #${Math.floor(Math.random() * 9000)}`;
            setLogs(prev => [newLog, ...prev].slice(0, 8));
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-screen bg-[#050510] text-[#00f3ff] p-4 flex flex-col font-sans overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between items-end border-b border-cyan-500/30 pb-4 mb-4">
                <div>
                    <h1 className="text-4xl font-black font-orbitron tracking-widest text-white drop-shadow-[0_0_10px_#00f3ff]">
                        OMEGA <span className="text-cyan-400">BLACK</span>
                    </h1>
                    <div className="text-xs font-mono tracking-[0.4em] text-gray-400 mt-1 pl-1 uppercase">Autonomous Hacker Operating System</div>
                </div>
                <div className="flex gap-6">
                    {AGENTS.map((agent, i) => <AgentAvatar key={i} agent={agent} />)}
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-4 min-h-0">

                {/* 1. ATTACK SURFACE RADAR (Top Left Large) */}
                <Panel className="col-span-8 row-span-4 relative group" title="ATTACK SURFACE RADAR" icon={Activity}>
                    <div className="absolute top-10 left-4 text-xs font-mono text-gray-400 z-10">Find unlinked endpoints.</div>
                    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full opacity-80" />

                    {/* Overlay Search */}
                    <div className="absolute top-4 right-4 z-10 w-64 bg-black/60 border border-gray-700 p-1 flex items-center backdrop-blur-md">
                        <Search size={14} className="text-gray-500 m-2" />
                        <input type="text" placeholder="Search target assets..." className="bg-transparent border-none outline-none text-xs text-white w-full font-mono" />
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute bottom-4 right-4 flex gap-3 z-10">
                        <button className="px-4 py-2 bg-cyan-900/40 border border-cyan-500/50 text-cyan-300 text-xs font-orbitron hover:bg-cyan-500/20 transition-colors uppercase tracking-wider backdrop-blur-sm">
                            OSINT SCAN
                        </button>
                        <button className="px-4 py-2 bg-red-900/40 border border-red-500/50 text-red-300 text-xs font-orbitron hover:bg-red-500/20 transition-colors uppercase tracking-wider backdrop-blur-sm">
                            EXPLOIT PLAN
                        </button>
                    </div>
                </Panel>

                {/* 2. RISK INDEX & EARNINGS (Top Right) */}
                <Panel className="col-span-4 row-span-3 flex flex-col gap-4" title="HUNTING OVERVIEW" icon={Crosshair}>

                    {/* Risk KPI */}
                    <div className="relative bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 p-4 overflow-hidden">
                        <div className="absolute top-2 right-2 animate-pulse"><AlertTriangle size={16} className="text-red-500" /></div>
                        <div className="text-[10px] text-red-400 font-mono mb-1 uppercase tracking-wider">RISK INDEX</div>
                        <div className="text-5xl font-black font-orbitron text-red-500 drop-shadow-[0_0_15px_rgba(255,0,85,0.5)]">82</div>
                        <div className="text-sm font-bold text-red-400 mt-1 uppercase">HIGH</div>
                        <div className="w-full h-1 bg-gray-800 mt-3 relative overflow-hidden">
                            <div className="h-full w-[82%] bg-gradient-to-r from-red-600 to-orange-500"></div>
                        </div>
                    </div>

                    {/* Financials */}
                    <div className="space-y-3 mt-1">
                        <div className="flex justify-between items-center bg-black/40 p-2 border-l-2 border-green-500">
                            <span className="text-xs text-gray-400 font-mono flex items-center gap-2"><DollarSign size={12} /> Est. Earnings</span>
                            <span className="text-white font-bold font-mono">$380 - $770</span>
                        </div>

                        <ProgressBar label="ACCEPTANCE ODDS" value={68} color="#00ff41" />

                        <div className="flex justify-between items-center text-xs border-t border-gray-800 pt-2">
                            <span className="text-gray-500 font-mono">COMPETITION LEVEL</span>
                            <span className="text-red-400 font-bold bg-red-900/20 px-2 py-0.5 border border-red-500/30 text-[10px]">HIGHLY ACTIVE</span>
                        </div>
                    </div>
                </Panel>

                {/* 3. BOUNTY INTELLIGENCE (Right Middle) */}
                <Panel className="col-span-4 row-span-3 flex flex-col gap-3" title="BOUNTY INTELLIGENCE" icon={Database}>
                    <ProgressBar label="VELOCITY INDEX (4.5)" value={45} color={THEME.cyan} />

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-black/40 p-2 border border-gray-800 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cyan-500/50 transition-colors">
                            <span className="text-[10px] text-gray-500 mb-1">PAYOUT ANALYZER</span>
                            <span className="text-yellow-400 font-bold text-xs">VIEW DATA</span>
                        </div>
                        <div className="bg-green-900/10 p-2 border border-green-500/30 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] text-green-400 mb-1">DUPLICATE RISK</span>
                            <span className="text-white font-bold text-sm">22% LOW</span>
                        </div>
                    </div>

                    <div className="mt-auto bg-yellow-900/10 border border-yellow-500/20 p-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping"></div>
                        <span className="text-[10px] text-yellow-200 uppercase tracking-wide">Hidden Gem Match Found</span>
                    </div>
                </Panel>

                {/* 4. AI CONTEXT PANEL (Bottom Left) */}
                <Panel className="col-span-4 row-span-2 relative overflow-hidden" title="AI CONTEXT PANEL" icon={GitBranch} color="text-red-400">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50"></div>
                    <div className="space-y-2 font-mono text-xs pl-2">
                        <div className="flex gap-2"><span className="text-gray-500 w-12">PATH:</span> <span className="text-white">SSRF → RCE Chain</span></div>
                        <div className="flex gap-2"><span className="text-gray-500 w-12">RISK:</span> <span className="text-red-500 font-bold animate-pulse">CRITICAL</span></div>
                        <div className="bg-gray-800/50 p-2 text-gray-300 mt-2 border border-gray-700">
                            Next Step: Exploit config.php to gain shell access.
                        </div>
                    </div>
                </Panel>

                {/* 5. CO-PILOT TERMINAL (Bottom Center) */}
                <Panel className="col-span-5 row-span-2" title="CO-PILOT TERMINAL" icon={Terminal}>
                    <div className="font-mono text-[10px] h-full overflow-hidden flex flex-col justify-end gap-1 text-gray-400">
                        {logs.map((log, i) => (
                            <div key={i} className="opacity-80 hover:opacity-100 hover:text-white transition-opacity truncate">
                                {log}
                            </div>
                        ))}
                        <div className="flex items-center gap-2 text-cyan-400 mt-1">
                            <span>➜</span>
                            <span className="animate-pulse">_</span>
                        </div>
                    </div>
                </Panel>

                {/* 6. EVIDENCE LOCKER (Bottom Right) */}
                <Panel className="col-span-3 row-span-2" title="EVIDENCE LOCKER" icon={Lock} color="text-yellow-400">
                    <div className="flex flex-col gap-1 text-[10px] font-mono text-gray-300">
                        {['admin_panel.png', 'sqli_exploit.txt', 'h1_report.md', 'dump_users.json'].map((file, i) => (
                            <div key={i} className="flex justify-between items-center p-1.5 hover:bg-white/5 border-b border-gray-800 cursor-pointer group">
                                <span className="group-hover:text-cyan-400 transition-colors">{file}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100"></div>
                            </div>
                        ))}
                    </div>
                </Panel>

            </div>
        </div>
    );
}
