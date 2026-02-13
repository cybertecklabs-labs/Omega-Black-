variable "cloudflare_api_token" {
  description = "Sensitive token for zero-trust tunnel provisioning"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID for the tunnel"
  type        = string
}

variable "public_hostname" {
  description = "The public CNAME that routes to your bridge (e.g., bridge.omega.black)"
  type        = string
}

variable "env" {
  description = "Environment (prod/staging/lab)"
  type        = string
  default     = "prod"
}

variable "jwt_secret" {
  description = "Shared secret for Gateway <-> UI validation"
  type        = string
  sensitive   = true
}

variable "temporal_namespace" {
  description = "Temporal namespace for Bridge workflows"
  type        = string
  default     = "omega-bridge"
}

variable "lab_temporal_host" {
  description = "Private IP/Hostname of the internal Lab Temporal cluster"
  type        = string
}
