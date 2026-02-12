# OMEGA BLACK – Production Deployment Guide

## Hardware Requirements
- 3× control plane nodes (x86_64, 16GB+ RAM)
- 1+ GPU worker (NVIDIA, 6GB+ VRAM)
- 1× storage node (NFS, 5TB+)

## Software Stack
- Ubuntu 24.04 LTS
- RKE2 / k3s (HA with embedded etcd)
- Cilium (eBPF, Hubble)
- Longhorn (replicated storage)
- Harbor (private registry)
- ArgoCD (GitOps)
- Ollama (local LLM)
- Prometheus + Grafana + Loki

## Step‑by‑Step
1. Provision nodes with static IPs
2. Run bootstrap script (see `scripts/bootstrap-cluster.sh`)
3. Deploy OMEGA via ArgoCD
4. Configure network policies
5. Enable GPU taints and tolerations
