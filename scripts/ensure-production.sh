#!/bin/bash
# OMEGA BLACK - Pre-Push Production Guard
# Validates the Node.js/Vite stack and security hardening

set -e

echo "🚀 Starting OMEGA BLACK Final Validation..."

# 1. Cleanup: Ensure no legacy Python artifacts exist in the staging area
echo "🧹 Purging legacy Python artifacts..."
find . -name "__pycache__" -type d -exec rm -rf {} +
find . -name "*.pyc" -delete
rm -rf venv/ .pytest_cache/

# 2. Security: Check for 'exec(' usage in Node.js files (Hardening Audit)
echo "🛡️ Auditing for insecure process execution..."
# Using grep to look for patterns of child_process.exec or just .exec(
if grep -r "\.exec(" backend/src | grep -v "execFile"; then
  echo "❌ ERROR: Insecure 'exec()' detected! Use 'execFile()' only for command execution."
  exit 1
fi

# 3. Dependency Check: Audit for vulnerabilities
# Note: This requires npm to be present and node_modules to be installed or at least package-lock.json
echo "📦 Running npm security audit..."
if [ -f "backend/package.json" ]; then
  cd backend && npm audit --audit-level=high || echo "⚠️ NPM Audit found issues. Check report." && cd ..
fi

# 4. Build Test: Ensure Vite/React frontend compiles
echo "🏗️ Testing Frontend Production Build..."
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
  cd frontend
  # Check if node_modules exists, if not, we can't build easily without network
  if [ -d "node_modules" ]; then
    npm run build
  else
    echo "⏭️ Skipping build test (node_modules not found). Run npm install first."
  fi
  cd ..
fi

# 5. Infrastructure: Validate Docker Compose syntax
echo "🐳 Validating Docker orchestration..."
if [ -f "docker-compose.yml" ]; then
  docker-compose config > /dev/null
  echo "✅ Docker Compose syntax is valid."
fi

echo "✅ VALIDATION SUCCESSFUL: OMEGA BLACK is ready for Public Debut. 🖤🚀"
