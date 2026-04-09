# HPE Recipe Detection - 5-Phase Implementation Plan

## Project Overview

A full-stack web application for managing and deploying software recipes (component version combinations) to Kubernetes clusters. The project spans backend services, frontend UI, and DevOps infrastructure.

**Duration:** 5 phases
**Team:** 5 people (2 Backend, 2 DevOps, 1 Frontend)

---

## Team Roles

| Role | Name | Primary Responsibility | Tech Stack |
|------|------|----------------------|-----------|
| Backend 1 (B1) | *TBD* | REST API Controllers, Endpoints | Spring Boot, REST |
| Backend 2 (B2) | *TBD* | Core Services, Data Models, K8s Integration | Spring Boot Services, Kubernetes Client |
| DevOps 1 (D1) | *TBD* | Docker, Build Automation, CI scripts | Docker, Maven, Node.js build |
| DevOps 2 (D2) | *TBD* | Kubernetes, Helm Charts, Infrastructure | Kubernetes, Helm, YAML manifests |
| Frontend (F1) | *TBD* | React UI, Components, Real-time Updates | React, Vite, WebSocket |

---

## Phase Breakdown

```
Phase 1: Foundation & Project Setup (Week 1)
Phase 2: Core Backend & Frontend Basics (Week 2)
Phase 3: API Integration & Advanced Features (Week 3)
Phase 4: Containerization & Kubernetes (Week 4)
Phase 5: CI/CD Pipeline & Production Deploy (Week 5)
```

---

# PHASE 1: Foundation & Project Setup

**Goals:** Set up project structure, establish tooling, create foundational components
**Deliverables:** Running local dev environment, basic project scaffold

---

## Phase 1 Deliverables by Role

### Backend 1 (B1) - Project Structure & Health Check

**Deliverable:**
- ✅ Set up Spring Boot Maven project with proper pom.xml
- ✅ Configure Spring Boot with application.yml (port 8081, /api context path)
- ✅ Implement HealthController with `/api/health` endpoint
- ✅ Add Spring Actuator endpoints (health, info)
- ✅ Verify backend starts: `mvn spring-boot:run`

**Demo:**
```bash
curl http://localhost:8081/api/health
# Response: {"status":"UP","service":"recipe-detection-api"}
```

**Files to Deliver:**
- `backend/pom.xml` (with Spring Boot 3.2.5, Actuator)
- `backend/src/main/resources/application.yml`
- `backend/src/main/java/com/hpe/recipe/RecipeDetectionApplication.java`
- `backend/src/main/java/com/hpe/recipe/controller/HealthController.java`

---

### Backend 2 (B2) - Data Models & Service Foundation

**Deliverable:**
- ✅ Create Recipe model class
- ✅ Create Catalog model class
- ✅ Create HelmRelease model class
- ✅ Set up CatalogService with sample data (in-memory)
- ✅ Verify model serialization (JSON conversion)

**Demo:**
```bash
# Verify models can be serialized (run unit test or log output)
# Create a Recipe object and convert to JSON string
```

**Files to Deliver:**
- `backend/src/main/java/com/hpe/recipe/model/Recipe.java`
- `backend/src/main/java/com/hpe/recipe/model/Catalog.java`
- `backend/src/main/java/com/hpe/recipe/model/HelmRelease.java`
- `backend/src/main/java/com/hpe/recipe/service/CatalogService.java`

---

### DevOps 1 (D1) - Docker Foundation

**Deliverable:**
- ✅ Create Dockerfile with multi-stage build (Maven build stage + JRE runtime stage)
- ✅ Test Docker build: `docker build -t hpe-recipe-detection:0.0.1 .`
- ✅ Test Docker run: `docker run -p 8080:8080 hpe-recipe-detection:0.0.1`
- ✅ Document build steps in README section

**Demo:**
```bash
docker build -t hpe-recipe-detection:0.0.1 .
docker run -p 8080:8080 hpe-recipe-detection:0.0.1
curl http://localhost:8080/api/health
```

**Files to Deliver:**
- `Dockerfile` (multi-stage: Maven builder + JRE runtime)
- `.dockerignore` (optional, to optimize build)
- Docker build documentation

---

### DevOps 2 (D2) - Kubernetes & Helm Scaffold

**Deliverable:**
- ✅ Create Helm chart directory structure
- ✅ Create Chart.yaml (chart metadata)
- ✅ Create basic values.yaml with image config and resource limits
- ✅ Verify Helm chart structure: `helm lint ./helm/recipe-detection-chart`

**Demo:**
```bash
helm lint ./helm/recipe-detection-chart
# Output: No errors
```

**Files to Deliver:**
- `helm/recipe-detection-chart/Chart.yaml`
- `helm/recipe-detection-chart/values.yaml` (basic, 1 replica, default image: 0.0.1)
- Helm structure documentation

---

### Frontend (F1) - React Project & Dev Environment

**Deliverable:**
- ✅ Initialize React + Vite project
- ✅ Create package.json with dependencies (React 18, Vite 5, Vite plugin for React)
- ✅ Set up vite.config.js with proxy to backend (`/api` → `http://localhost:8081`)
- ✅ Create App.jsx (basic "Hello HPE Recipe Detection" page)
- ✅ Verify frontend starts: `npm run dev` (port 3000)

**Demo:**
```bash
cd frontend
npm install
npm run dev
# Frontend starts on http://localhost:3000
# Try curl http://localhost:3000/api/health (proxy test)
```

**Files to Deliver:**
- `frontend/package.json` (React 18, Vite 5, React Router, ReactFlow)
- `frontend/vite.config.js` (with proxy)
- `frontend/index.html` (basic HTML)
- `frontend/src/main.jsx` (React entry point)
- `frontend/src/App.jsx` (basic component)

---

## Phase 1 Demo Checklist

- [ ] **B1:** Backend starts on port 8081, `/api/health` returns UP
- [ ] **B2:** Recipe/Catalog/HelmRelease models created and tested
- [ ] **D1:** Docker image builds and container runs, health endpoint accessible
- [ ] **D2:** Helm chart lints without errors
- [ ] **F1:** Frontend starts on port 3000, proxy test works

---

---

# PHASE 2: Core Backend & Frontend Basics

**Goals:** Implement core API endpoints, build catalog/recipe management UI
**Deliverables:** Working CRUD endpoints, basic recipe browsing UI

---

## Phase 2 Deliverables by Role

### Backend 1 (B1) - Catalog & Recipe Endpoints

**Deliverable:**
- ✅ Implement CatalogController with endpoints:
  - GET `/api/catalogs` → list all catalogs
  - GET `/api/catalogs/{version}/recipes` → recipes for a catalog
- ✅ Implement RecipeController with endpoints:
  - GET `/api/recipes/{version}/components` → get component versions
  - GET `/api/recipes/{version}/upgradePaths` → get upgrade paths
- ✅ Add @CrossOrigin to allow frontend requests
- ✅ Test endpoints with curl/Postman

**Demo:**
```bash
curl http://localhost:8081/api/catalogs
curl http://localhost:8081/api/recipes/1.3.0/components
```

**Files to Deliver:**
- `backend/src/main/java/com/hpe/recipe/controller/CatalogController.java`
- `backend/src/main/java/com/hpe/recipe/controller/RecipeController.java`
- Unit tests for endpoints (CatalogControllerTest.java, RecipeControllerTest.java)

---

### Backend 2 (B2) - Service Layer & In-Memory Data

**Deliverable:**
- ✅ Implement CatalogService with:
  - Sample catalog data (v1.0, v1.1, etc.)
  - Sample recipe data for each catalog (1.3.0, 1.3.1, 1.4.0, etc.)
  - Component versions (Spark, Kafka, Airflow, HBase)
  - Upgrade path logic
- ✅ Wire CatalogService into controllers
- ✅ Test service logic (unit tests)

**Demo:**
```bash
# Verify service provides sample data
# Hit endpoints from Phase 2 B1 and see populated responses
```

**Files to Deliver:**
- `backend/src/main/java/com/hpe/recipe/service/CatalogService.java` (fully implemented)
- Unit tests: `backend/src/test/java/.../CatalogServiceTest.java`

---

### DevOps 1 (D1) - Build Scripts & CI Foundation

**Deliverable:**
- ✅ Create GitHub Actions workflow file (.github/workflows/build.yml)
- ✅ Define build steps:
  - Set up JDK 17
  - `mvn clean package -DskipTests`
  - Set up Node.js 18
  - `npm install && npm run build` (frontend)
  - Build Docker image with git SHA tag
- ✅ Test locally: `mvn clean package -DskipTests`

**Demo:**
```bash
# Run workflow locally or push to GitHub and see Actions execute
# Verify artifact upload works
```

**Files to Deliver:**
- `.github/workflows/build.yml`
- CI documentation

---

### DevOps 2 (D2) - Kubernetes Deployment Manifest

**Deliverable:**
- ✅ Create Deployment template (templates/deployment.yaml)
  - Configurable replicas, image, labels
  - Liveness/readiness probes on `/api/health`
  - Resource limits (CPU 250m-500m, memory 256Mi-512Mi)
- ✅ Create Service template (templates/service.yaml)
  - ClusterIP on port 8080
- ✅ Create ConfigMap template (templates/configmap.yaml)
  - Placeholder for recipe data
- ✅ Update values.yaml with deployment config
- ✅ Test: `helm template recipe-detection ./helm/recipe-detection-chart` generates valid YAML

**Demo:**
```bash
helm template recipe-detection ./helm/recipe-detection-chart
# Output: Valid Deployment, Service, ConfigMap YAML
```

**Files to Deliver:**
- `helm/recipe-detection-chart/templates/deployment.yaml`
- `helm/recipe-detection-chart/templates/service.yaml`
- `helm/recipe-detection-chart/templates/configmap.yaml`
- Updated `helm/recipe-detection-chart/values.yaml`

---

### Frontend (F1) - Catalog & Recipe Browsing UI

**Deliverable:**
- ✅ Create RecipePage component that:
  - Fetches `/api/catalogs` on mount
  - Displays list of catalogs
  - Allows clicking on catalog to see recipes
- ✅ Create RecipeDetails component that:
  - Shows recipe components (Spark, Kafka, etc.)
  - Shows upgrade paths
- ✅ Wire into App.jsx with React Router (routes: `/`, `/recipes/:version`)
- ✅ Add bootstrap/Tailwind styling for basic look
- ✅ Test: frontend loads and displays data from backend

**Demo:**
```bash
npm run dev
# Visit http://localhost:3000
# Click catalogs → see recipes list
# Click recipe → see components and upgrade paths
```

**Files to Deliver:**
- `frontend/src/components/RecipePage.jsx`
- `frontend/src/components/RecipeDetails.jsx`
- Updated `frontend/src/App.jsx` with routing
- `frontend/src/api.js` (helper to fetch from backend)
- `frontend/package.json` (add React Router, CSS framework if needed)

---

## Phase 2 Demo Checklist

- [ ] **B1:** All catalog and recipe endpoints working, tested with curl
- [ ] **B2:** Service layer populates with sample data, all endpoints return data
- [ ] **D1:** GitHub Actions workflow runs successfully on push to main
- [ ] **D2:** Helm templates render valid Kubernetes YAML
- [ ] **F1:** Frontend loads data from backend, UI displays catalogs and recipes

---

---

# PHASE 3: API Integration & Advanced Features

**Goals:** Implement Helm release CRUD, real-time updates, GitOps foundation
**Deliverables:** Full release management API, real-time WebSocket updates, Git integration ready

---

## Phase 3 Deliverables by Role

### Backend 1 (B1) - Helm Release API Endpoints

**Deliverable:**
- ✅ Implement HelmReleaseController with full CRUD:
  - GET `/api/helm-releases` → list all releases
  - GET `/api/helm-releases/{version}` → get specific release
  - POST `/api/helm-releases` → create new release
  - PUT `/api/helm-releases/{version}` → update release
  - PUT `/api/helm-releases/{version}/status` → update status
  - DELETE `/api/helm-releases/{version}` → delete release
- ✅ Recipe management endpoints within release:
  - POST `/api/helm-releases/{version}/recipes` → add recipe to release
  - PUT `/api/helm-releases/{version}/recipes/{recipeVersion}` → update recipe
  - DELETE `/api/helm-releases/{version}/recipes/{recipeVersion}` → remove recipe
- ✅ Deploy endpoint:
  - POST `/api/helm-releases/{version}/deploy` → trigger deployment
- ✅ Test all endpoints with curl/Postman

**Demo:**
```bash
# Create a release
curl -X POST http://localhost:8081/api/helm-releases \
  -H "Content-Type: application/json" \
  -d '{"version":"2.0.0","releaseName":"prod-release"}'

# List releases
curl http://localhost:8081/api/helm-releases

# Add recipe to release
curl -X POST http://localhost:8081/api/helm-releases/2.0.0/recipes \
  -H "Content-Type: application/json" \
  -d '{"version":"1.3.0"}'
```

**Files to Deliver:**
- `backend/src/main/java/com/hpe/recipe/controller/HelmReleaseController.java`
- Unit/integration tests for all CRUD endpoints

---

### Backend 2 (B2) - Services & Kubernetes Integration

**Deliverable:**
- ✅ Implement HelmReleaseService:
  - CRUD logic for releases (in-memory storage)
  - Recipe management within releases
  - Status tracking
- ✅ Implement GitOpsService (basic foundation):
  - Method to generate Helm values YAML from release
  - Placeholder for Git push (not fully functional yet)
- ✅ Create KubernetesConfig (Spring bean):
  - Initialize Kubernetes client
  - ConfigMap management helpers
- ✅ Create ConfigMap writer to store recipe data in K8s (optional for phase 3)

**Demo:**
```bash
# Create release, verify it's stored
# Add recipes to release
# Check service returns updated data
```

**Files to Deliver:**
- `backend/src/main/java/com/hpe/recipe/service/HelmReleaseService.java`
- `backend/src/main/java/com/hpe/recipe/service/GitOpsService.java`
- `backend/src/main/java/com/hpe/recipe/config/KubernetesConfig.java`
- Unit tests for services
- Updated `backend/src/main/resources/application.yml` with GitOps config

---

### DevOps 1 (D1) - Build & Docker Optimization

**Deliverable:**
- ✅ Optimize Dockerfile:
  - Ensure dependency caching works (copy pom.xml before src)
  - Multi-stage to keep final image light
  - Test build performance
- ✅ Create build script (.scripts/build.sh or similar)
- ✅ Add image tagging strategy (version-based tags)
- ✅ Update CI workflow to push image with multiple tags (latest, version)
- ✅ Document Docker build and push process

**Demo:**
```bash
# Build and tag image
docker build -t hpe-recipe-detection:0.0.2 .
docker run -p 8080:8080 hpe-recipe-detection:0.0.2
```

**Files to Deliver:**
- Optimized `Dockerfile`
- `.scripts/build.sh` or similar build script
- Updated `.github/workflows/build.yml` with image push (if registry configured)
- Docker best practices documentation

---

### DevOps 2 (D2) - Helm Values & GitOps Config

**Deliverable:**
- ✅ Create versioned values files:
  - `values-v0.0.2.yaml` with updated recipe data
  - `values-v0.0.3.yaml` with new recipes
  - `values-v0.0.4.yaml` with latest recipes
- ✅ Update ConfigMap template to include recipe data from values
- ✅ Add environment variable config to Deployment for GitOps settings
- ✅ Create Helm upgrade/rollback documentation
- ✅ Test: `helm install/upgrade` with different values files

**Demo:**
```bash
# Install with default values
helm install recipe-detection ./helm/recipe-detection-chart

# Upgrade to v0.0.3 values
helm upgrade recipe-detection ./helm/recipe-detection-chart \
  -f ./helm/recipe-detection-chart/values-v0.0.3.yaml

# Verify ConfigMap contains recipe data
kubectl get configmap recipe-detection-config -o yaml
```

**Files to Deliver:**
- `helm/recipe-detection-chart/values-v0.0.2.yaml`
- `helm/recipe-detection-chart/values-v0.0.3.yaml`
- `helm/recipe-detection-chart/values-v0.0.4.yaml`
- Updated ConfigMap template with recipe data
- Helm deployment documentation

---

### Frontend (F1) - Release Management UI & WebSocket Setup

**Deliverable:**
- ✅ Create ManagePage component:
  - List all releases
  - Create new release (form)
  - Edit release details
  - Delete release
- ✅ Create ReleaseDetail component:
  - Show recipes in release
  - Add/remove recipes
  - Deploy button
- ✅ Set up WebSocket connection (ReleaseWebSocketHandler placeholder on backend):
  - Connect to `/ws/releases`
  - Listen for real-time updates
  - Update UI when release status changes
- ✅ Create useRealtimeReleases hook to manage WebSocket
- ✅ Add loading/error states

**Demo:**
```bash
npm run dev
# Navigate to /manage
# Create a new release (shown in real-time on all browser tabs)
# Add recipes to release
# See status updates as they happen
```

**Files to Deliver:**
- `frontend/src/components/ManagePage.jsx`
- `frontend/src/components/ReleaseDetail.jsx`
- `frontend/src/hooks/useRealtimeReleases.js` (WebSocket hook)
- `frontend/src/api.js` (fetch helpers for CRUD)
- Updated routing in App.jsx
- Install WebSocket libraries if needed (ws, react-use-websocket)

---

## Phase 3 Demo Checklist

- [ ] **B1:** All CRUD endpoints for releases and recipes working
- [ ] **B2:** Services handle in-memory storage and business logic correctly
- [ ] **D1:** Docker build optimized and tagged correctly in CI
- [ ] **D2:** Versioned Helm values files tested, ConfigMap contains recipe data
- [ ] **F1:** Full release management UI working, WebSocket broadcasts updates

---

---

# PHASE 4: Containerization & Kubernetes Deployment

**Goals:** Full Docker image with frontend, deploy to Minikube, test end-to-end
**Deliverables:** Running application in Kubernetes, all services integrated

---

## Phase 4 Deliverables by Role

### Backend 1 (B1) - Deploy Endpoint Implementation

**Deliverable:**
- ✅ Complete POST `/api/helm-releases/{version}/deploy` endpoint:
  - Trigger GitOpsService.generateAndPush()
  - Broadcast WebSocket message on deploy start/success/failure
  - Return deploy status/message
- ✅ Add error handling for deployment failures
- ✅ Test end-to-end: create release, add recipes, deploy
- ✅ Verify error scenarios (missing recipes, git push failure)

**Demo:**
```bash
# Create, populate, and deploy a release
curl -X POST http://localhost:8081/api/helm-releases/2.0.0/deploy
# Response: {"message":"Pushed to Git. Jenkins will deploy shortly.","version":"2.0.0"}
```

**Files to Deliver:**
- Fully implemented deploy endpoint in HelmReleaseController
- Error handling and logging
- Integration tests

---

### Backend 2 (B2) - GitOps YAML Generation & K8s Client

**Deliverable:**
- ✅ Complete GitOpsService:
  - generateAndPush(release) → generates values-vX.X.X.yaml
  - Commits and pushes to GitHub (with GitOps credentials)
  - Handles git authentication via token
- ✅ K8s client integration:
  - ConfigMap creation/update logic
  - Verify ConfigMap is created in cluster on deploy
- ✅ WebSocket integration:
  - Broadcast status updates during deployment
- ✅ Test: create release → deploy → check Git repo for new values file

**Demo:**
```bash
# Deploy a release and verify:
# 1. New values-v2.0.0.yaml appears in Git repo
# 2. ConfigMap updated in Kubernetes
# 3. WebSocket broadcasts status updates
```

**Files to Deliver:**
- Fully implemented `GitOpsService.java`
- Fully implemented `KubernetesConfig.java` with client setup
- Updated application.yml with GitHub credentials config
- Tests for Git operations

---

### DevOps 1 (D1) - Full Docker Image with Frontend

**Deliverable:**
- ✅ Update Dockerfile to include frontend build:
  - Stage 1: Node.js build frontend (npm install, npm run build)
  - Stage 2: Maven build backend
  - Stage 3: JRE runtime with both frontend (static files) + backend (JAR)
  - Serve frontend static files from backend (e.g., Spring static resource)
- ✅ Or create separate orchestration (docker-compose for dev testing)
- ✅ Test: `docker build -t hpe-recipe-detection:0.0.4 .`
- ✅ Run: `docker run -p 8080:8080` and access frontend + backend on same container

**Demo:**
```bash
docker build -t hpe-recipe-detection:0.0.4 .
docker run -d -p 8080:8080 hpe-recipe-detection:0.0.4
# Check: http://localhost:8080/ (see frontend)
# Check: http://localhost:8080/api/health (see backend)
```

**Files to Deliver:**
- Updated `Dockerfile` (full stack: Node + Maven + JRE)
- Optional `docker-compose.yml` for local testing
- Documentation for running full stack in Docker

---

### DevOps 2 (D2) - Minikube Deployment & Testing

**Deliverable:**
- ✅ Write step-by-step deployment guide:
  - Start Minikube
  - Point Docker to Minikube
  - Build image in Minikube
  - Install Helm chart
- ✅ Verify all resources created:
  - Deployment running with 1 replica
  - Service (ClusterIP) created
  - ConfigMap with recipe data
  - Pod logs show backend healthy
- ✅ Test end-to-end:
  - Port-forward to service
  - Access frontend + API
  - Create and deploy a release
  - Verify ConfigMap updated
- ✅ Document troubleshooting (ImagePullBackOff, CrashLoopBackOff, etc.)

**Demo:**
```bash
# Deploy to Minikube
minikube start --driver=docker
eval $(minikube docker-env)
docker build -t hpe-recipe-detection:0.0.4 .
helm install recipe-detection ./helm/recipe-detection-chart \
  -f ./helm/recipe-detection-chart/values-v0.0.4.yaml
kubectl port-forward svc/recipe-detection 8080:8080
# Access: http://localhost:8080/
```

**Files to Deliver:**
- Complete deployment guide/script
- Troubleshooting documentation
- Reference: values files tested in cluster
- Helm chart examples (install, upgrade, delete)

---

### Frontend (F1) - Static Build & Frontend Deployment

**Deliverable:**
- ✅ Create production build:
  - `npm run build` → generates `dist/` folder
  - Verify built files are optimized
- ✅ Configure backend to serve frontend static files:
  - Add static file serving (Spring Boot auto-serves from `public/` or `static/`)
  - Copy frontend build output to backend resources
  - Or configure in Docker to copy build output
- ✅ Test: access frontend at `http://localhost:8080/`
- ✅ Verify API calls still work (proxy still points to backend)

**Demo:**
```bash
# Build frontend
npm run build

# Test locally (if running full stack Docker)
docker run -p 8080:8080 hpe-recipe-detection:0.0.4
# Visit http://localhost:8080/ and verify full app works
```

**Files to Deliver:**
- `frontend/dist/` (build output, committed or CI-generated)
- Updated build script to copy frontend build to backend
- Backend static file config documentation
- Package.json build script: `"build": "vite build"`

---

## Phase 4 Demo Checklist

- [ ] **B1:** Deploy endpoint fully functional, triggers GitOps
- [ ] **B2:** GitOps service generates and pushes YAML to GitHub, K8s ConfigMap updated
- [ ] **D1:** Docker image builds with both frontend and backend, single container runs both
- [ ] **D2:** Helm chart deploys to Minikube successfully, all resources created
- [ ] **F1:** Frontend served from Docker container, full app functional at single URL

---

---

# PHASE 5: CI/CD Pipeline & Production Ready

**Goals:** Fully automated CI/CD, production deployment, monitoring, documentation
**Deliverables:** Automated builds, deployments, and monitoring; production-ready system

---

## Phase 5 Deliverables by Role

### Backend 1 (B1) - API Polish & Testing

**Deliverable:**
- ✅ Write comprehensive API documentation:
  - All endpoints with examples
  - Request/response schemas
  - Error codes and handling
- ✅ Add input validation:
  - Release version format check
  - Recipe version format check
  - Required fields validation
- ✅ Add comprehensive logging
- ✅ Write integration tests for all endpoints
- ✅ Performance testing: ensure endpoints respond < 200ms

**Demo:**
```bash
# Run test suite
mvn test

# Generate API docs (OpenAPI/Swagger if added)
mvn javadoc:javadoc
```

**Files to Deliver:**
- Comprehensive Spring Boot tests
- API documentation (Markdown or Swagger YAML)
- Logging configuration (logback.xml)
- Input validation annotations (@Valid, custom validators)

---

### Backend 2 (B2) - Service Reliability & Monitoring

**Deliverable:**
- ✅ Add retry logic for Git operations
- ✅ Add fallback for K8s client (graceful degradation)
- ✅ Implement health checks (detailed Actuator endpoints)
- ✅ Add metrics collection (Spring Boot Micrometer)
- ✅ Database/persistent storage prep (if needed):
  - Document schema for future DB migration
  - Current in-memory config for demo
- ✅ Write service tests with mocked K8s/Git

**Demo:**
```bash
# Check detailed health
curl http://localhost:8081/api/actuator/health/readiness

# Check metrics
curl http://localhost:8081/api/actuator/metrics
```

**Files to Deliver:**
- Enhanced HelmReleaseService with retry/fallback
- Actuator configuration
- Micrometer metrics setup
- Service tests with mocks

---

### DevOps 1 (D1) - CI/CD Pipeline Completion

**Deliverable:**
- ✅ Complete GitHub Actions workflow:
  - Trigger on push to main
  - Build backend (Maven)
  - Build frontend (Node.js)
  - Run tests
  - Build Docker image
  - Push to registry (Docker Hub, ECR, or local)
  - Upload artifacts
- ✅ Add branch protection rules (require tests pass)
- ✅ Set up artifact retention policies
- ✅ Document CI/CD pipeline

**Demo:**
```bash
# Push to main
git push origin main

# Watch GitHub Actions workflow run:
# 1. Build backend
# 2. Build frontend
# 3. Run tests
# 4. Build Docker image
# 5. Push image

# Verify in Actions tab: all checks pass
```

**Files to Deliver:**
- Complete `.github/workflows/build.yml`
- Optional: `.github/workflows/deploy.yml` (automated deploy)
- CI/CD documentation and troubleshooting guide

---

### DevOps 2 (D2) - Production Deployment & Helm Releases

**Deliverable:**
- ✅ Create production Helm values file (production-ready):
  - 3 replicas for HA
  - Resource requests/limits optimized
  - Pod disruption budgets
  - Horizontal Pod Autoscaler (HPA) config
- ✅ Implement Helm release automation:
  - Script to handle `helm upgrade --install`
  - Rollback procedure documentation
- ✅ Set up monitoring/logging stack (optional):
  - Prometheus ServiceMonitor
  - Grafana dashboard (basic)
- ✅ Write deployment runbook

**Demo:**
```bash
# Deploy with production values
helm upgrade --install recipe-detection ./helm/recipe-detection-chart \
  -f ./helm/recipe-detection-chart/values-prod.yaml

# Check status
helm status recipe-detection
kubectl get pods,svc,configmap

# Check metrics
kubectl top pods
```

**Files to Deliver:**
- `helm/recipe-detection-chart/values-prod.yaml`
- `helm/recipe-detection-chart/templates/hpa.yaml` (optional)
- `helm/recipe-detection-chart/templates/pdb.yaml` (optional)
- Deployment runbook and procedures
- Monitoring setup documentation (Prometheus/Grafana config examples)

---

### Frontend (F1) - Performance & Production Build

**Deliverable:**
- ✅ Optimize production build:
  - Enable code splitting
  - Minimize bundle size (use tree-shaking, dynamic imports)
  - Optimize images
- ✅ Add error boundaries and error handling
- ✅ Add loading skeletons/spinners for all API calls
- ✅ Implement analytics/telemetry (optional)
- ✅ Write performance tests (Lighthouse, bundle size check)
- ✅ Document frontend deployment

**Demo:**
```bash
# Build and check bundle size
npm run build
# Output: dist/ with optimized files

# Check performance
npm run analyze  # (if script exists)

# Lighthouse check
# Run in browser: Ctrl+Shift+I → Lighthouse → Generate report
```

**Files to Deliver:**
- Optimized production build configuration (vite.config.js)
- Error boundary components
- Loading states UI
- Performance tests/checks
- Frontend deployment documentation

---

## Phase 5 Demo Checklist

- [ ] **B1:** API fully documented, comprehensive tests, validation in place
- [ ] **B2:** Services reliable with retry logic, metrics exposed, health checks detailed
- [ ] **D1:** Full CI/CD pipeline automated, tests run before build, artifacts tracked
- [ ] **D2:** Production-ready Helm values, HA setup, deployment runbook written
- [ ] **F1:** Production build optimized, error handling comprehensive, performance verified

---

---

# Final Integration & Demo

## Phase 5 Integration Demo

**All 5 team members present the following end-to-end flow:**

1. **DevOps 1 & 2 (D1, D2):** Start Minikube, deploy latest Helm chart
   ```bash
   minikube start
   helm upgrade --install recipe-detection ./helm/recipe-detection-chart
   ```

2. **Frontend (F1):** Navigate to http://localhost:8080/
   - Show UI loading, data displayed from backend

3. **Backend 1 (B1):** Create a new release via frontend
   - Show API endpoint hit with valid input
   - Show response with created release

4. **Backend 2 (B2):** Add recipes to release
   - Show service processing
   - Show K8s ConfigMap updated with new data
   - Show logs showing Git push to repository

5. **DevOps 1 (D1):** Deploy the release
   - Trigger `/deploy` endpoint
   - Show GitHub repository updated with new `values-vX.X.X.yaml`
   - Show CI pipeline triggered (GitHub Actions)

6. **Frontend (F1):** Show real-time updates
   - Release status changes broadcasted via WebSocket
   - All browser tabs update in real-time

7. **DevOps 2 (D2):** Show monitoring/rollback
   - kubectl get all
   - helm history / helm rollback (if needed)

---

# Milestone Deliverables Summary

| Phase | Milestone | Status |
|-------|-----------|--------|
| 1     | Project scaffold, local dev env running | ✅ |
| 2     | Core APIs working, basic UI, Docker builds | ✅ |
| 3     | Full CRUD, real-time updates, GitOps foundation | ✅ |
| 4     | Full stack Docker, deployed to Minikube | ✅ |
| 5     | CI/CD automated, production-ready, documented | ✅ |

---

# Presentation Structure by Phase

Each phase (end of week) includes:
- **Duration:** 30-45 minutes per phase
- **Format:** Live demo + Q&A
- **Attendees:** Full team + stakeholders
- **Order:** B1 → B2 → D1 → D2 → F1 (each shows their component working)

---

# Success Criteria

- All 5 team members present at each phase
- Each member shows working code/deployment
- End-to-end flow works: UI → Backend → Kubernetes
- Helm chart successfully deploys app to Minikube
- GitHub Actions CI/CD pipeline automates builds
- Real-time WebSocket updates work across browsers
