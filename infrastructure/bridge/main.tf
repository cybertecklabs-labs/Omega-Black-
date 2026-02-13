terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0.0"
    }
    random = {
      source = "hashicorp/random"
      version = "3.5.1"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# ---
# 🛡️ SOVEREIGN BRIDGE: INFRASTRUCTURE AS CODE
# Defines the Cortex Gateway + Temporal Bridge + Cloudflare Tunnel
# ---

# 1. NETWORK: Internal Bridge Network (Zero Trust)
resource "docker_network" "sovereign_bridge" {
  name = "omega-sovereign-bridge"
  driver = "bridge"
}

# 2. TUNNEL SECRET: Randomly generated secret for the tunnel
resource "random_id" "tunnel_secret" {
  byte_length = 35
}

# 3. CLOUDFLARE TUNNEL: The secure uplink (no inbound ports)
resource "cloudflare_tunnel" "omega_bridge" {
  account_id = var.cloudflare_account_id
  name       = "omega-sovereign-bridge-${var.env}"
  secret     = random_id.tunnel_secret.b64_std
}

# 4. TUNNEL CONFIG: Route traffic to internal gateway
resource "cloudflare_tunnel_config" "omega_config" {
  account_id = var.cloudflare_account_id
  tunnel_id  = cloudflare_tunnel.omega_bridge.id

  config {
    ingress_rule {
      hostname = var.public_hostname
      service  = "http://cortex-gateway:8080"
    }
    ingress_rule {
      service = "http_status:404"
    }
  }
}

# 5. CONTAINER: Cortex Gateway (Hardened Node.js API)
resource "docker_container" "cortex_gateway" {
  name  = "omega-cortex-gateway"
  image = "ghcr.io/cybertecklabs/omega-black-cortex-gateway:bridge"
  restart = "unless-stopped"
  
  env = [
    "NODE_ENV=production",
    "PORT=8080",
    "JWT_SECRET=${var.jwt_secret}",
    "TEMPORAL_ADDRESS=temporal-bridge-worker:7233",
    "TUNNEL_PUBLIC_HOST=${var.public_hostname}"
  ]
  
  ports {
    internal = 8080
    external = 8080
  }
  
  networks_advanced {
    name = docker_network.sovereign_bridge.name
  }
}

# 6. CONTAINER: Temporal Bridge Worker (Orchestrator Proxy)
resource "docker_container" "temporal_worker" {
  name  = "omega-temporal-bridge-worker"
  image = "ghcr.io/cybertecklabs/omega-temporal-bridge-worker:bridge"
  restart = "unless-stopped"

  env = [
    "TEMPORAL_NAMESPACE=${var.temporal_namespace}",
    "LAB_TEMPORAL_HOST=${var.lab_temporal_host}"
  ]

  networks_advanced {
    name = docker_network.sovereign_bridge.name
  }
}

# 7. CONTAINER: Cloudflared (Tunnel Daemon)
resource "docker_container" "tunnel_daemon" {
  name  = "omega-bridge-tunnel"
  image = "cloudflare/cloudflared:latest"
  restart = "unless-stopped"
  command = ["tunnel", "run", "--token", cloudflare_tunnel.omega_bridge.tunnel_token]

  networks_advanced {
    name = docker_network.sovereign_bridge.name
  }
}
