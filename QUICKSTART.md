# Quick Start (5 Minutes)

## TL;DR

```bash
# 1. Clone and enter the repo
git clone https://github.com/yourusername/hpe-recipe-detection.git
cd hpe-recipe-detection

# 2. Start minikube
minikube start --driver=docker --cpus=4 --memory=8192

# 3. Build backend and Docker image
cd backend && mvn clean package -DskipTests && cd ..
docker build -t hpe-recipe-detection:0.0.1 .

# 4. Load into minikube and deploy
minikube image load hpe-recipe-detection:0.0.1
helm install recipe-detection ./helm/recipe-detection-chart --namespace default

# 5. Port forward and test
kubectl port-forward svc/recipe-detection 8080:8080 &
sleep 2
curl http://localhost:8080/api/health

# Expected: {"status":"UP","service":"recipe-detection-api"}
```

---

## What You Just Did

| Step | What Happened |
|------|---------------|
| **Clone** | Downloaded the code from GitHub |
| **minikube start** | Started a local Kubernetes cluster on Docker |
| **mvn package** | Compiled Java code, ran tests, created JAR |
| **docker build** | Packaged JAR into a Docker image |
| **minikube image load** | Loaded the image into minikube's Docker daemon |
| **helm install** | Deployed the app to Kubernetes using Helm |
| **kubectl port-forward** | Forwarded port 8080 from the pod to localhost |
| **curl** | Tested the API endpoint |

---

## File Structure (Quick Tour)

```
backend/              ← Spring Boot Java code
  src/main/java/...   ← Controllers, Services, Models
  src/test/java/...   ← Unit & integration tests
  pom.xml             ← Maven dependencies

frontend/             ← React code
  src/...             ← React components
  package.json        ← npm dependencies

helm/                 ← Kubernetes package
  recipe-detection-chart/
    templates/        ← K8s YAML templates (Deployment, Service, etc.)
    values.yaml       ← Configuration defaults
    Chart.yaml        ← Chart metadata

docs/                 ← Documentation
  ARCHITECTURE.md     ← Design decisions
  IMPLEMENTATION_PLAN.md ← Week-by-week roadmap
  GIT_WORKFLOW.md     ← How to use Git

Dockerfile            ← How to build the Docker image
README.md             ← Project overview
SETUP.md              ← Detailed deployment steps
```

---

## Common Commands

### Kubernetes / Helm

```bash
# See what's deployed
kubectl get all
kubectl get pods
kubectl get svc

# View logs
kubectl logs -f deployment/recipe-detection

# See resource details
kubectl describe pod recipe-detection-xyz
kubectl describe svc recipe-detection

# Port forward
kubectl port-forward svc/recipe-detection 8080:8080

# Delete deployment
helm uninstall recipe-detection
```

### Backend (Java)

```bash
cd backend

# Compile and test
mvn clean package

# Run locally (without Docker)
mvn spring-boot:run

# Run a specific test
mvn test -Dtest=ConfigMapServiceTest
```

### Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Run dev server (hot reload)
npm run dev

# Build for production
npm build
```

### Docker

```bash
# Build image
docker build -t hpe-recipe-detection:0.0.1 .

# View images
docker images

# Run container locally
docker run -p 8080:8080 hpe-recipe-detection:0.0.1

# Remove image
docker rmi hpe-recipe-detection:0.0.1
```

---

## Testing the API

### Health Check (always works first)
```bash
curl http://localhost:8080/api/health
```

### Once ConfigMaps are created:
```bash
# List all catalogs
curl http://localhost:8080/api/catalogs

# Get recipes in a specific catalog
curl http://localhost:8080/api/catalogs/v0.0.164/recipes

# Get a recipe's component versions
curl http://localhost:8080/api/recipes/1.4.1/components

# Get upgrade paths
curl http://localhost:8080/api/recipes/1.4.1/upgradePaths
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `mvn: command not found` | Install Maven 3.9+ or use a Docker image |
| Pod stuck in `ImagePullBackOff` | Run `minikube image load hpe-recipe-detection:0.0.1` |
| `curl: connection refused` | Run `kubectl port-forward svc/recipe-detection 8080:8080` |
| Docker daemon not running | Start Docker Desktop or minikube |
| Pod crashes immediately | Run `kubectl logs deployment/recipe-detection` to see why |
| ConfigMaps not found | Create them: `kubectl create configmap recipe-data ...` |

---

## Next Steps

1. **Read the docs** — `docs/ARCHITECTURE.md` explains design decisions
2. **Follow the implementation plan** — `docs/IMPLEMENTATION_PLAN.md` has week-by-week tasks
3. **Learn Git workflow** — `docs/GIT_WORKFLOW.md` for committing and PRs
4. **Deploy sample data** — `SETUP.md` Step 10 shows how to create ConfigMaps
5. **Start coding** — Begin with Week 1 tasks from the implementation plan

---

## Key Concepts (in 30 seconds)

- **ConfigMap**: A Kubernetes object that stores configuration data (like recipe JSON)
- **Helm Chart**: A template for deploying Kubernetes resources. One chart = many environments
- **Fabric8**: A Java library for talking to the Kubernetes API
- **Jackson**: A Java library for parsing JSON
- **React Flow**: A React library for drawing interactive graphs

---

## File Changes on Every Commit

When you commit, remember to update:
- `backend/pom.xml` — increment `<version>`
- `helm/recipe-detection-chart/Chart.yaml` — increment `version`
- `helm/recipe-detection-chart/Chart.yaml` — increment `appVersion`
- `frontend/package.json` — increment `"version"`

This keeps versions in sync.

---

## Still Stuck?

1. **Check logs**: `kubectl logs deployment/recipe-detection`
2. **Describe resources**: `kubectl describe pod <pod-name>`
3. **Test locally**: `cd backend && mvn spring-boot:run`
4. **Read docs**: Start with `README.md`, then `SETUP.md`
5. **Ask the team**: Slack, standup, or pair programming

---

## Deployment Checklist (Before Pushing to Git)

- [ ] Backend compiles: `mvn clean package`
- [ ] Tests pass: `mvn test`
- [ ] Docker builds: `docker build -t hpe-recipe-detection:0.0.1 .`
- [ ] Helm chart validates: `helm lint ./helm/recipe-detection-chart`
- [ ] Pod starts: `kubectl get pods`
- [ ] API responds: `curl http://localhost:8080/api/health`

If all ✅, you're ready to push and create a PR!
