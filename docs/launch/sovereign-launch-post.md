# How We Built a Zero-Trust AI Lab That Talks to GitHub Pages (The OMEGA BLACK Architecture)

> **"What if your personal AI lab could be anywhere, but accessible from everywhere?"**

Today, we're releasing **OMEGA BLACK v2.0-sovereign**, an open-source reference implementation for a hybrid, self-hosted AI security platform. It solves a problem every security researcher faces: How do you safely expose your powerful internal tools (Firecracker microVMs, GPU rigs, Temporal workflows) to the public internet without getting pwned?

Most solutions involve VPNs, complicated firewalls, or just "hoping for the best." We chose a different path: **Protocol Sovereignty**.

## The Architecture: "The Sovereign Bridge"

OMEGA BLACK is split into two worlds:
1.  **The Public Surface (Spoke)**: A static, unhackable React/Vite UI hosted on GitHub Pages.
2.  **The Hardened Lab (Hub)**: Your private server rack running heavy exploit workflows.

The magic is the **Sovereign Bridge** that connects them.

### 1. The Gateway with No Inbound Ports
We use **Cloudflare Tunnels (Zero Trust)** codified in Terraform. The Lab reaches OUT to the edge; no one reaches IN. There is no port 80/443 open on your router.

```mermaid
graph LR
    User[You (Cafe Wi-Fi)] -->|HTTPS| PublicUI[GitHub Pages]
    PublicUI -->|JWT Auth| Edge[Cloudflare Edge]
    Edge -->|Encrypted Tunnel| Lab[Your Home Server]
    Lab -->|Local Execution| MicroVM[Firecracker Sandbox]
```

### 2. The "execFile" Security Contract
A bridge is only as safe as its weakest link. We enforce a strict **`execFile` Only** policy in our Node.js gateway. We banned `child_process.exec()` entirely to eliminate shell injection vulnerability classes.

### 3. Distributed Memory (pgvector)
Your AI agents in the lab need context. We use `pgvector` to synchronize embedding data. When you scan a target on the public UI, the metadata is pushed down the tunnel, enriched by your local LLM (running on Ollama), and the results are securely streamed back up.

## Why This Matters for 2026

The future of AI security isn't purely cloud-native; it's **Hybrid-Sovereign**.
- **Governance**: You own the data. Your recon logs never sit in someone else's S3 bucket.
- **Cost**: You run heavy inference on your own consumer GPUs (RTX 4090s), not expensive cloud H100s.
- **Stealth**: Your traffic originates from your resilient infrastructure, not flagged data center IPs.

## Get Started

OMEGA BLACK v2.0 is available now. 
Clone the repo, spin up the bridge with a single `docker-compose up`, and take back control of your research grid.

**[View the Repository](https://github.com/cybertecklabs-labs/Omega-Black-)** | **[Read the Docs](https://omega.black/docs)**
