# HPE Recipe Detection - Backend Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Spring Boot Configuration](#spring-boot-configuration)
6. [Data Models](#data-models)
7. [Controllers & API Endpoints](#controllers--api-endpoints)
8. [Services Layer](#services-layer)
9. [Kubernetes Integration](#kubernetes-integration)
10. [GitOps Integration](#gitops-integration)
11. [WebSocket Real-Time Updates](#websocket-real-time-updates)
12. [Build & Run](#build--run)
13. [Testing Strategy](#testing-strategy)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)

---

## Overview

The HPE Recipe Detection Backend is a **Spring Boot REST API** that manages software recipes (component version combinations) and their deployments to Kubernetes clusters via Helm charts. It acts as the central orchestrator between the Frontend UI, Kubernetes cluster, and GitOps repository.

**Core Responsibilities:**
- Expose REST APIs for recipe and release management
- Manage Helm releases (CRUD operations)
- Generate GitOps YAML configurations
- Push configuration changes to GitHub
- Interact with Kubernetes ConfigMaps
- Broadcast real-time status updates via WebSocket
- Provide health and actuator endpoints for monitoring

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│                    Port 3000 (dev) / 8080 (prod)             │
└────────────────────────────┬────────────────────────────────┘
                             │
                    HTTP REST / WebSocket
                             │
┌────────────────────────────▼────────────────────────────────┐
│              Spring Boot Backend (Port 8081)                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Controllers (@RestController)            │   │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────────┐ │   │
│  │  │ Health     │ │ Catalog    │ │ HelmRelease     │ │   │
│  │  │ Controller │ │ Controller │ │ Controller      │ │   │
│  │  └────────────┘ └────────────┘ └──────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                             │                                │
│  ┌──────────────────────────▼──────────────────────────┐   │
│  │         Services (@Service / Business Logic)         │   │
│  │  ┌────────────┐ ┌──────────────┐ ┌──────────────┐  │   │
│  │  │ Catalog    │ │ HelmRelease  │ │ GitOps      │  │   │
│  │  │ Service    │ │ Service      │ │ Service     │  │   │
│  │  └────────────┘ └──────────────┘ └──────────────┘  │   │
│  └──────────────────────────┬──────────────────────────┘   │
│                             │                                │
│  ┌──────────────────────────▼──────────────────────────┐   │
│  │       Models (@Entity / Plain Java Objects)          │   │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────────┐ │   │
│  │  │ Recipe     │ │ Catalog    │ │ HelmRelease     │ │   │
│  │  └────────────┘ └────────────┘ └──────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Configuration & Infrastructure               │   │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────────┐ │   │
│  │  │ Kubernetes │ │ WebSocket  │ │ Spring Boot     │ │   │
│  │  │ Config     │ │ Config     │ │ Config          │ │   │
│  │  └────────────┘ └────────────┘ └──────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
                    │              │              │
                    ▼              ▼              ▼
        ┌──────────────────┐  ┌──────────┐  ┌──────────────┐
        │  GitHub GitOps   │  │Kubernetes│  │ Environment  │
        │  Repository      │  │ Cluster  │  │ Variables    │
        └──────────────────┘  └──────────┘  └──────────────┘
```

---

## Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **JDK** | Eclipse Temurin | 17 | Java runtime |
| **Framework** | Spring Boot | 3.2.5 | REST API framework |
| **Build Tool** | Maven | 3.9+ | Dependency management & build |
| **Web** | Spring Boot Starter Web | 3.2.5 | HTTP REST endpoints |
| **Actuator** | Spring Boot Starter Actuator | 3.2.5 | Health/metrics endpoints |
| **WebSocket** | Spring Boot Starter WebSocket | 3.2.5 | Real-time updates |
| **Kubernetes** | Fabric8 Kubernetes Client | 6.10.0 | K8s API interaction |
| **Git** | JGit | 6.8.0 | Git operations |
| **JSON** | Jackson Databind | (managed) | JSON serialization |
| **Testing** | Spring Boot Test | 3.2.5 | Unit/Integration tests |

---

## Project Structure

```
backend/
├── pom.xml                                      # Maven configuration
├── src/
│   ├── main/
│   │   ├── java/com/hpe/recipe/
│   │   │   ├── RecipeDetectionApplication.java  # Spring Boot entry point
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── KubernetesConfig.java        # K8s client bean setup
│   │   │   │   ├── WebSocketConfig.java         # WebSocket endpoint config
│   │   │   │   └── ReleaseWebSocketHandler.java # WebSocket message broadcast handler
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── HealthController.java        # Health check endpoint
│   │   │   │   ├── CatalogController.java       # Catalog CRUD endpoints
│   │   │   │   ├── RecipeController.java        # Recipe query endpoints
│   │   │   │   └── HelmReleaseController.java   # Full Helm release CRUD + deploy
│   │   │   │
│   │   │   ├── model/
│   │   │   │   ├── Catalog.java                 # Data model for catalogs
│   │   │   │   ├── Recipe.java                  # Data model for recipes
│   │   │   │   └── HelmRelease.java             # Data model for Helm releases
│   │   │   │
│   │   │   └── service/
│   │   │       ├── CatalogService.java          # Catalog business logic + sample data
│   │   │       ├── HelmReleaseService.java      # Helm release CRUD + K8s ConfigMap
│   │   │       └── GitOpsService.java           # YAML generation + Git push
│   │   │
│   │   └── resources/
│   │       └── application.yml                  # Spring Boot configuration
│   │
│   └── test/
│       └── java/com/hpe/recipe/                 # Unit & integration tests
│           ├── controller/
│           ├── service/
│           └── integration/
│
└── target/                                       # Maven build output
    └── recipe-detection-*.jar                   # Compiled JAR executable
```

---

## Spring Boot Configuration

### application.yml

Location: `backend/src/main/resources/application.yml`

```yaml
server:
  port: 8081                        # Backend API runs on this port
  servlet:
    context-path: /api              # All endpoints prefixed with /api
    encoding:
      charset: UTF-8                # UTF-8 encoding for all requests/responses

spring:
  application:
    name: recipe-detection-api      # Application name in logs

management:                          # Spring Actuator configuration
  endpoints:
    web:
      exposure:
        include: health,info         # Expose health and info endpoints
      base-path: /actuator           # Prefix for actuator endpoints
  endpoint:
    health:
      show-details: always           # Show detailed health info

gitops:                              # Custom configuration for GitOps
  repo-url: https://github.com/NaomiiAP/hpe-recipe.git
  local-path: ${java.io.tmpdir}/hpe-recipe-gitops  # Temporary directory for cloning
  branch: main                       # Git branch to push to
  username: ${GIT_USERNAME:NaomiiAP} # GitHub username (env var or default)
  token: ${GIT_TOKEN:}               # GitHub PAT token (env var, required for push)
  values-dir: helm/recipe-detection-chart  # Path to Helm values files in repo
```

### Environment Variables

| Variable | Default | Purpose | Required |
|----------|---------|---------|----------|
| `GIT_USERNAME` | `NaomiiAP` | GitHub username | No |
| `GIT_TOKEN` | _(empty)_ | GitHub Personal Access Token | **Yes** (for deploy) |
| `SERVER_PORT` | `8081` | Backend port | No |
| `SERVER_SERVLET_CONTEXT_PATH` | `/api` | API context path | No |

**Set environment variables:**

```bash
# Linux/Mac
export GIT_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
export GIT_USERNAME=myusername

# Windows (PowerShell)
$env:GIT_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxx"
$env:GIT_USERNAME = "myusername"

# Or in .env file (if using spring-dotenv)
GIT_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GIT_USERNAME=myusername
```

---

## Data Models

### 1. Recipe Model

**File:** `backend/src/main/java/com/hpe/recipe/model/Recipe.java`

Represents a software recipe (specific component versions combination).

```java
public class Recipe {
    private String version;                        // e.g., "1.3.0"
    private String description;                    // e.g., "Base recipe with core analytics"
    private Map<String, String> components;        // e.g., {"spark": "3.1.2", "kafka": "3.1.0"}
    private List<String> upgradePaths;             // e.g., ["1.3.1", "1.4.0"]

    // Getters and Setters
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Map<String, String> getComponents() { return components; }
    public void setComponents(Map<String, String> components) { this.components = components; }

    public List<String> getUpgradePaths() { return upgradePaths; }
    public void setUpgradePaths(List<String> upgradePaths) { this.upgradePaths = upgradePaths; }
}
```

**Example Recipe JSON:**
```json
{
  "version": "1.3.0",
  "description": "Base recipe with core analytics components",
  "components": {
    "spark": "3.1.2",
    "kafka": "3.1.0",
    "airflow": "2.3.0",
    "hbase": "2.4.6"
  },
  "upgradePaths": ["1.3.1", "1.4.0"]
}
```

---

### 2. Catalog Model

**File:** `backend/src/main/java/com/hpe/recipe/model/Catalog.java`

Represents a collection of recipes for a specific catalog version.

```java
public class Catalog {
    private String version;           // e.g., "0.0.1", "0.0.2"
    private String description;       // e.g., "Initial release"
    private List<Recipe> recipes;     // List of recipes in this catalog

    // Getters and Setters
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Recipe> getRecipes() { return recipes; }
    public void setRecipes(List<Recipe> recipes) { this.recipes = recipes; }
}
```

**Example Catalog JSON:**
```json
{
  "version": "0.0.1",
  "description": "Initial catalog release",
  "recipes": [
    { "version": "1.3.0", "description": "...", "components": {...}, "upgradePaths": [...] },
    { "version": "1.3.1", "description": "...", "components": {...}, "upgradePaths": [...] }
  ]
}
```

---

### 3. HelmRelease Model

**File:** `backend/src/main/java/com/hpe/recipe/model/HelmRelease.java`

Represents a Helm release with selected recipes and deployment status.

```java
public class HelmRelease {
    private String version;                // e.g., "2.0.0" (release version)
    private String releaseName;            // e.g., "prod-release" (Helm release name)
    private String status;                 // e.g., "draft", "deploying", "deployed", "push_failed"
    private List<Recipe> recipes;          // Recipes included in this release
    private String description;            // Release description
    private LocalDateTime createdAt;       // Timestamp created
    private LocalDateTime updatedAt;       // Timestamp last updated

    // Getters and Setters
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getReleaseName() { return releaseName; }
    public void setReleaseName(String releaseName) { this.releaseName = releaseName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<Recipe> getRecipes() { return recipes; }
    public void setRecipes(List<Recipe> recipes) { this.recipes = recipes; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

**Status Lifecycle:**
- `draft` - Release created, not deployed yet
- `deploying` - Currently pushing to Git/Kubernetes
- `deployed` - Successfully deployed
- `push_failed` - Git push failed
- `rollback` - Rolled back to previous version

**Example HelmRelease JSON:**
```json
{
  "version": "2.0.0",
  "releaseName": "prod-release",
  "status": "deployed",
  "description": "Production release with upgraded components",
  "recipes": [
    { "version": "1.4.0", "description": "...", "components": {...}, "upgradePaths": [...] },
    { "version": "1.5.0", "description": "...", "components": {...}, "upgradePaths": [...] }
  ],
  "createdAt": "2024-04-09T10:30:00",
  "updatedAt": "2024-04-09T11:45:00"
}
```

---

## Controllers & API Endpoints

### 1. HealthController

**File:** `backend/src/main/java/com/hpe/recipe/controller/HealthController.java`

Provides health check endpoint for monitoring and readiness probes.

```java
@RestController
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
            "status", "UP",
            "service", "recipe-detection-api",
            "timestamp", Instant.now().toString()
        );
    }
}
```

**Endpoint:**

| Method | URL | Purpose | Response |
|--------|-----|---------|----------|
| GET | `/api/health` | Health check | `{"status":"UP","service":"recipe-detection-api","timestamp":"2024-04-09T10:30:00Z"}` |

**Usage:**

```bash
curl http://localhost:8081/api/health
```

**Used By:**
- Kubernetes liveness probe
- Kubernetes readiness probe
- Monitoring systems

---

### 2. CatalogController

**File:** `backend/src/main/java/com/hpe/recipe/controller/CatalogController.java`

Provides endpoints to query catalogs and recipes.

```java
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/catalogs")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public List<Catalog> getAllCatalogs() {
        return catalogService.getAllCatalogs();
    }

    @GetMapping("/{catalogVersion}/recipes")
    public List<Recipe> getRecipes(@PathVariable String catalogVersion) {
        return catalogService.getRecipesByCatalog(catalogVersion);
    }
}
```

**Endpoints:**

| Method | URL | Purpose | Response |
|--------|-----|---------|----------|
| GET | `/api/catalogs` | List all catalogs | `[{"version":"0.0.1",...}, {"version":"0.0.2",...}]` |
| GET | `/api/catalogs/{version}/recipes` | Get recipes for a catalog | `[{"version":"1.3.0",...}, {"version":"1.3.1",...}]` |

**Usage:**

```bash
# List all catalogs
curl http://localhost:8081/api/catalogs

# Get recipes for catalog 0.0.1
curl http://localhost:8081/api/catalogs/0.0.1/recipes
```

---

### 3. RecipeController

**File:** `backend/src/main/java/com/hpe/recipe/controller/RecipeController.java`

Provides endpoints to query individual recipes.

```java
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/recipes")
public class RecipeController {

    private final CatalogService catalogService;

    public RecipeController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/{recipeVersion}/components")
    public Map<String, String> getComponents(@PathVariable String recipeVersion) {
        return catalogService.getComponentsByRecipe(recipeVersion);
    }

    @GetMapping("/{recipeVersion}/upgradePaths")
    public List<String> getUpgradePaths(@PathVariable String recipeVersion) {
        return catalogService.getUpgradePaths(recipeVersion);
    }
}
```

**Endpoints:**

| Method | URL | Purpose | Response |
|--------|-----|---------|----------|
| GET | `/api/recipes/{version}/components` | Get component versions for a recipe | `{"spark":"3.1.2","kafka":"3.1.0","airflow":"2.3.0","hbase":"2.4.6"}` |
| GET | `/api/recipes/{version}/upgradePaths` | Get possible upgrade paths | `["1.3.1","1.4.0"]` |

**Usage:**

```bash
# Get components for recipe 1.3.0
curl http://localhost:8081/api/recipes/1.3.0/components

# Get upgrade paths for recipe 1.3.0
curl http://localhost:8081/api/recipes/1.3.0/upgradePaths
```

---

### 4. HelmReleaseController

**File:** `backend/src/main/java/com/hpe/recipe/controller/HelmReleaseController.java`

Provides full CRUD operations for Helm releases and deployment management.

```java
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/helm-releases")
public class HelmReleaseController {

    private final HelmReleaseService helmReleaseService;
    private final ReleaseWebSocketHandler wsHandler;
    private final GitOpsService gitOpsService;

    public HelmReleaseController(HelmReleaseService helmReleaseService,
                                ReleaseWebSocketHandler wsHandler,
                                GitOpsService gitOpsService) {
        this.helmReleaseService = helmReleaseService;
        this.wsHandler = wsHandler;
        this.gitOpsService = gitOpsService;
    }

    // CRUD operations...
}
```

**Endpoints - Release CRUD:**

| Method | URL | Purpose | Request Body | Response |
|--------|-----|---------|--------------|----------|
| GET | `/api/helm-releases` | List all releases | - | `[{...}, {...}]` |
| GET | `/api/helm-releases/{version}` | Get specific release | - | `{...}` |
| POST | `/api/helm-releases` | Create new release | `{"version":"2.0.0","releaseName":"prod"}` | `{...}` |
| PUT | `/api/helm-releases/{version}` | Update release | `{"version":"2.0.0","description":"..."}` | `{...}` |
| DELETE | `/api/helm-releases/{version}` | Delete release | - | 204 No Content |

**Usage:**

```bash
# List all releases
curl http://localhost:8081/api/helm-releases

# Create a new release
curl -X POST http://localhost:8081/api/helm-releases \
  -H "Content-Type: application/json" \
  -d '{"version":"2.0.0","releaseName":"prod-release","status":"draft"}'

# Update a release
curl -X PUT http://localhost:8081/api/helm-releases/2.0.0 \
  -H "Content-Type: application/json" \
  -d '{"description":"Updated production release"}'

# Delete a release
curl -X DELETE http://localhost:8081/api/helm-releases/2.0.0
```

**Endpoints - Recipe Management within Release:**

| Method | URL | Purpose | Request Body | Response |
|--------|-----|---------|--------------|----------|
| GET | `/api/helm-releases/{version}/recipes` | List recipes in release | - | `[{...}, {...}]` |
| POST | `/api/helm-releases/{version}/recipes` | Add recipe to release | `{"version":"1.3.0"}` | `{...}` |
| PUT | `/api/helm-releases/{version}/recipes/{recipeVersion}` | Update recipe in release | `{...}` | `{...}` |
| DELETE | `/api/helm-releases/{version}/recipes/{recipeVersion}` | Remove recipe from release | - | 204 No Content |
| GET | `/api/helm-releases/{version}/recipes/{recipeVersion}/components` | Get components | - | `{...}` |
| GET | `/api/helm-releases/{version}/recipes/{recipeVersion}/upgradePaths` | Get upgrade paths | - | `[...]` |

**Usage:**

```bash
# Add recipe to release
curl -X POST http://localhost:8081/api/helm-releases/2.0.0/recipes \
  -H "Content-Type: application/json" \
  -d '{"version":"1.3.0"}'

# Remove recipe from release
curl -X DELETE http://localhost:8081/api/helm-releases/2.0.0/recipes/1.3.0
```

**Endpoints - Status & Deploy:**

| Method | URL | Purpose | Request Body | Response |
|--------|-----|---------|--------------|----------|
| PUT | `/api/helm-releases/{version}/status` | Update status | `{"status":"deployed"}` | `{...}` |
| POST | `/api/helm-releases/{version}/deploy` | Deploy release (GitOps) | - | `{"message":"Pushed to Git...","version":"2.0.0"}` |
| GET | `/api/helm-releases/compare?from=X&to=Y` | Compare versions | - | `{...}` |

**Usage:**

```bash
# Update status
curl -X PUT http://localhost:8081/api/helm-releases/2.0.0/status \
  -H "Content-Type: application/json" \
  -d '{"status":"deployed"}'

# Deploy release (pushes to Git, triggers CI/CD)
curl -X POST http://localhost:8081/api/helm-releases/2.0.0/deploy

# Compare two releases
curl "http://localhost:8081/api/helm-releases/compare?from=1.0.0&to=2.0.0"
```

---

## Services Layer

### 1. CatalogService

**File:** `backend/src/main/java/com/hpe/recipe/service/CatalogService.java`

Manages catalog and recipe data (currently in-memory, can be migrated to database).

**Responsibilities:**
- Provide sample catalog data
- Provide sample recipe data
- Query recipes by catalog
- Query components by recipe
- Calculate upgrade paths

```java
@Service
public class CatalogService {

    public List<Catalog> getAllCatalogs() {
        // Returns list of all catalogs (v0.0.1, v0.0.2, etc.)
    }

    public List<Recipe> getRecipesByCatalog(String catalogVersion) {
        // Returns recipes for given catalog version
    }

    public Map<String, String> getComponentsByRecipe(String recipeVersion) {
        // Returns {"spark": "3.1.2", "kafka": "3.1.0", ...}
    }

    public List<String> getUpgradePaths(String recipeVersion) {
        // Returns list of versions this recipe can upgrade to
    }

    private void initializeCatalogs() {
        // Sample data initialization
    }
}
```

**Sample Data Structure:**

```
Catalog v0.0.1
├── Recipe 1.3.0
│   ├── Components: {spark: 3.1.2, kafka: 3.1.0, airflow: 2.3.0, hbase: 2.4.6}
│   └── UpgradePaths: [1.3.1, 1.4.0]
└── Recipe 1.3.1
    ├── Components: {spark: 3.2.0, kafka: 3.2.1, airflow: 2.4.1, hbase: 2.4.8}
    └── UpgradePaths: [1.3.0, 1.4.0]

Catalog v0.0.2
├── Recipe 1.3.2
│   ├── Components: {spark: 3.2.1, kafka: 3.2.3, airflow: 2.4.3, hbase: 2.4.9}
│   └── UpgradePaths: [1.3.1, 1.3.0]
└── Recipe 1.4.0
    ├── Components: {spark: 3.3.0, kafka: 3.3.2, airflow: 2.5.3, hbase: 2.5.4}
    └── UpgradePaths: [1.3.2, 1.3.1]
```

---

### 2. HelmReleaseService

**File:** `backend/src/main/java/com/hpe/recipe/service/HelmReleaseService.java`

Manages Helm releases (CRUD operations) and Kubernetes integration.

**Responsibilities:**
- CRUD operations for releases
- Recipe management within releases
- Status tracking
- Kubernetes ConfigMap management
- Duplicate detection

```java
@Service
public class HelmReleaseService {

    private final KubernetesClient kubernetesClient;
    private final Map<String, HelmRelease> releaseCache = new ConcurrentHashMap<>();

    public HelmRelease createHelmRelease(HelmRelease release) {
        // Create new release (check for duplicates)
        // Store in cache and K8s ConfigMap
    }

    public HelmRelease getHelmRelease(String version) {
        // Retrieve release by version
    }

    public List<HelmRelease> getAllHelmReleases() {
        // Retrieve all releases
    }

    public HelmRelease updateHelmRelease(String version, HelmRelease release) {
        // Update existing release
        // Update in cache and K8s ConfigMap
    }

    public boolean deleteHelmRelease(String version) {
        // Delete release from cache and K8s ConfigMap
    }

    // Recipe management
    public Recipe addRecipeToRelease(String version, Recipe recipe) {
        // Add recipe to release's recipe list
    }

    public Recipe updateRecipeInRelease(String version, String recipeVersion, Recipe recipe) {
        // Update recipe in release
    }

    public List<Recipe> getRecipesByHelmVersion(String version) {
        // Get all recipes in a release
    }

    public boolean deleteRecipeFromRelease(String version, String recipeVersion) {
        // Remove recipe from release
    }

    // Queries
    public Map<String, String> getComponentsByRecipe(String version, String recipeVersion) {
        // Get components of recipe in release
    }

    public List<String> getUpgradePaths(String version, String recipeVersion) {
        // Get upgrade paths for recipe
    }

    public Map<String, Object> getUpgradePathsBetweenHelmVersions(String from, String to) {
        // Compare two releases
    }

    private void syncToKubernetes(HelmRelease release) {
        // Update Kubernetes ConfigMap with release data
    }
}
```

**In-Memory Storage:**
```
releaseCache: {
  "2.0.0": HelmRelease(version: 2.0.0, releaseName: prod-release, status: draft, recipes: [...]),
  "2.0.1": HelmRelease(version: 2.0.1, releaseName: staging-release, status: deployed, recipes: [...]),
  ...
}
```

---

### 3. GitOpsService

**File:** `backend/src/main/java/com/hpe/recipe/service/GitOpsService.java`

Handles YAML generation and Git push for GitOps workflow.

**Responsibilities:**
- Generate Helm values YAML from release
- Clone Git repository
- Commit changes
- Push to GitHub
- Handle authentication

```java
@Service
public class GitOpsService {

    private final Git gitClient;
    private final ObjectMapper objectMapper;

    public void generateAndPush(HelmRelease release) throws Exception {
        // 1. Clone or pull repo: gitops.repo-url
        // 2. Generate values-vX.X.X.yaml from release
        // 3. Commit: "Release vX.X.X with recipes"
        // 4. Push to gitops.branch with authentication (GIT_TOKEN)
        // 5. Close connection
    }

    private String generateValuesYaml(HelmRelease release) {
        // Convert release to Helm values YAML format:
        // recipeData:
        //   chartVersion: "2.0.0"
        //   recipes:
        //     - version: "1.3.0"
        //       components: {...}
        //       ...
    }

    private void authenticateWithGit(String username, String token) {
        // Set up Git authentication using PAT token
    }
}
```

**Generated YAML Format:**

```yaml
recipeData:
  chartVersion: "2.0.0"
  recipes:
    - version: "1.3.0"
      description: "Base recipe"
      components:
        spark: "3.1.2"
        kafka: "3.1.0"
        airflow: "2.3.0"
        hbase: "2.4.6"
      upgradePaths:
        - "1.3.1"
        - "1.4.0"
    - version: "1.4.0"
      description: "Feature release"
      components:
        spark: "3.3.0"
        kafka: "3.3.2"
        airflow: "2.5.3"
        hbase: "2.5.4"
      upgradePaths:
        - "1.3.1"
```

**Git Workflow:**

1. Clone: `git clone https://github.com/user/hpe-recipe.git`
2. Create/update: `values-v2.0.0.yaml`
3. Stage: `git add helm/recipe-detection-chart/values-v2.0.0.yaml`
4. Commit: `git commit -m "Release v2.0.0 with recipes 1.3.0, 1.4.0"`
5. Push: `git push origin main` (using PAT token for auth)

---

## Kubernetes Integration

### KubernetesConfig

**File:** `backend/src/main/java/com/hpe/recipe/config/KubernetesConfig.java`

Sets up Kubernetes client bean for API interactions.

```java
@Configuration
public class KubernetesConfig {

    @Bean
    public KubernetesClient kubernetesClient() {
        return new DefaultKubernetesClient();
    }
}
```

### ConfigMap Management

The backend automatically creates/updates Kubernetes ConfigMaps to store recipe data:

**ConfigMap Name:** `recipe-detection-config` (generated by Helm chart)

**ConfigMap Contents:**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: recipe-detection-config
  namespace: default
data:
  chart-version: "2.0.0"
  recipe-data.json: |
    {
      "chartVersion": "2.0.0",
      "recipes": [
        {
          "version": "1.3.0",
          "description": "Base recipe",
          "components": {"spark": "3.1.2", ...},
          "upgradePaths": ["1.3.1", "1.4.0"]
        },
        ...
      ]
    }
```

**Update Flow:**

1. User creates/updates HelmRelease via API
2. HelmReleaseService.syncToKubernetes() called
3. Backend updates K8s ConfigMap with new recipe data
4. Pod reads ConfigMap and starts using new data
5. Deployment automatically restarts if ConfigMap changed (via checksum annotation)

---

## GitOps Integration

### Flow Diagram

```
User Action (via UI)
    │
    ▼
1. Create/Update Release (API POST/PUT)
    │
    ▼
2. HelmReleaseController receives request
    │
    ▼
3. HelmReleaseService updates in-memory cache & K8s ConfigMap
    │
    ▼
4. User clicks "Deploy" button
    │
    ▼
5. POST /api/helm-releases/{version}/deploy
    │
    ▼
6. HelmReleaseController calls GitOpsService.generateAndPush()
    │
    ▼
7. GitOpsService:
   ├─ Clones GitHub repo
   ├─ Generates values-vX.X.X.yaml
   ├─ Commits changes
   ├─ Pushes to 'main' branch (using GIT_TOKEN)
    │
    ▼
8. GitHub Actions / Jenkins triggered (via webhook)
    │
    ▼
9. CI/CD pipeline:
   ├─ Builds Docker image
   ├─ Pushes to registry
   ├─ Deploys to K8s: helm upgrade --install recipe-detection
   ├─ K8s pulls updated values-vX.X.X.yaml
   ├─ Updates ConfigMap with new recipes
   ├─ Restarts pod with new image/config
    │
    ▼
10. WebSocket notifies frontend of deployment status
    │
    ▼
11. UI updates in real-time
```

### Prerequisites for GitOps

1. **GitHub Repository:** `https://github.com/NaomiiAP/hpe-recipe.git`
2. **Personal Access Token (PAT):** Created in GitHub (Settings → Developer settings → Personal access tokens)
   - Scope: `repo` (full repository access)
   - Token supplied via `GIT_TOKEN` environment variable
3. **Git Configuration in application.yml:**
   ```yaml
   gitops:
     repo-url: https://github.com/NaomiiAP/hpe-recipe.git
     branch: main
     username: ${GIT_USERNAME:NaomiiAP}
     token: ${GIT_TOKEN:}
     values-dir: helm/recipe-detection-chart
   ```

---

## WebSocket Real-Time Updates

### WebSocketConfig

**File:** `backend/src/main/java/com/hpe/recipe/config/WebSocketConfig.java`

Configures WebSocket endpoint for real-time communication.

```java
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final ReleaseWebSocketHandler releaseWebSocketHandler;

    public WebSocketConfig(ReleaseWebSocketHandler releaseWebSocketHandler) {
        this.releaseWebSocketHandler = releaseWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(releaseWebSocketHandler, "/ws/releases")
                .setAllowedOrigins("*");
    }
}
```

### ReleaseWebSocketHandler

**File:** `backend/src/main/java/com/hpe/recipe/config/ReleaseWebSocketHandler.java`

Handles WebSocket connections and broadcasts messages.

```java
@Component
public class ReleaseWebSocketHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        System.out.println("WebSocket connected: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        System.out.println("WebSocket closed: " + session.getId());
    }

    public void broadcast(String eventType, Object data) {
        // Broadcast message to all connected clients
        // Message format: {"event": "status_changed", "data": {...}}
    }
}
```

### WebSocket Message Format

Messages broadcast to frontend:

```json
{
  "event": "status_changed",
  "data": {
    "version": "2.0.0",
    "status": "deploying"
  },
  "timestamp": "2024-04-09T10:30:00Z"
}
```

**Event Types:**

| Event | Trigger | Data |
|-------|---------|------|
| `release_created` | New release created | Full HelmRelease object |
| `release_updated` | Release updated | Full HelmRelease object |
| `release_deleted` | Release deleted | `{version: "2.0.0"}` |
| `recipe_added` | Recipe added to release | `{helmVersion: "2.0.0", recipe: {...}}` |
| `recipe_updated` | Recipe updated | `{helmVersion: "2.0.0", recipe: {...}}` |
| `recipe_deleted` | Recipe removed | `{helmVersion: "2.0.0", recipeVersion: "1.3.0"}` |
| `status_changed` | Release status changed | `{version: "2.0.0", status: "deployed"}` |

### Frontend Connection

```javascript
// Frontend code (React)
useEffect(() => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${protocol}//${window.location.host}/ws/releases`);

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log("WebSocket message:", message);

    if (message.event === 'status_changed') {
      // Update UI with new status
    }
  };

  return () => ws.close();
}, []);
```

---

## Build & Run

### Prerequisites

```bash
# Check Java version (must be 17+)
java -version

# Check Maven version (must be 3.9+)
mvn -version

# Check Git
git --version
```

### Build from Source

```bash
# Navigate to backend
cd backend

# Clean and compile
mvn clean compile

# Run tests
mvn test

# Build JAR
mvn clean package -DskipTests

# Output: target/recipe-detection-0.0.1.jar
```

### Run Locally (Development)

**Option 1: Using Maven Spring Boot Plugin**

```bash
cd backend

# Set environment variables
export GIT_TOKEN=ghp_xxxx
export GIT_USERNAME=myusername

# Run directly
mvn spring-boot:run
```

Backend starts on `http://localhost:8081/api`

**Option 2: Run JAR directly**

```bash
cd backend

mvn clean package -DskipTests

java -jar target/recipe-detection-0.0.1.jar \
  --GIT_TOKEN=ghp_xxxx \
  --GIT_USERNAME=myusername
```

**Option 3: Docker**

```bash
# Build image
docker build -t hpe-recipe-detection:0.0.1 .

# Run container
docker run -d \
  --name recipe-backend \
  -p 8080:8080 \
  -e GIT_TOKEN=ghp_xxxx \
  -e GIT_USERNAME=myusername \
  hpe-recipe-detection:0.0.1
```

### Verify Backend is Running

```bash
# Health check
curl http://localhost:8081/api/health

# List catalogs
curl http://localhost:8081/api/catalogs

# List releases
curl http://localhost:8081/api/helm-releases
```

---

## Testing Strategy

### Unit Tests

Test individual services and controllers in isolation.

```java
@SpringBootTest
class HelmReleaseServiceTest {

    @Mock
    private KubernetesClient kubernetesClient;

    @InjectMocks
    private HelmReleaseService helmReleaseService;

    @Test
    void testCreateRelease() {
        HelmRelease release = new HelmRelease();
        release.setVersion("2.0.0");
        release.setReleaseName("test");

        HelmRelease created = helmReleaseService.createHelmRelease(release);

        assertNotNull(created);
        assertEquals("2.0.0", created.getVersion());
    }

    @Test
    void testAddRecipeToRelease() {
        // Test adding recipe to release
    }
}
```

### Integration Tests

Test controllers with real Spring context.

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class HelmReleaseControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testCreateRelease() {
        HelmRelease release = new HelmRelease();
        release.setVersion("2.0.0");

        ResponseEntity<HelmRelease> response = restTemplate.postForEntity(
            "/api/helm-releases",
            release,
            HelmRelease.class
        );

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }
}
```

### Run Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=HelmReleaseServiceTest

# Run with coverage
mvn test jacoco:report
# Report: backend/target/site/jacoco/index.html
```

---

## Deployment

### Kubernetes Deployment

**1. Build and push Docker image:**

```bash
cd hpe-recipe-detection
docker build -t hpe-recipe-detection:0.0.1 .
docker tag hpe-recipe-detection:0.0.1 myregistry/hpe-recipe-detection:0.0.1
docker push myregistry/hpe-recipe-detection:0.0.1
```

**2. Deploy with Helm:**

```bash
# Install release
helm install recipe-detection ./helm/recipe-detection-chart \
  -f ./helm/recipe-detection-chart/values.yaml

# Or upgrade
helm upgrade --install recipe-detection ./helm/recipe-detection-chart \
  -f ./helm/recipe-detection-chart/values.yaml
```

**3. Verify deployment:**

```bash
# Check pod status
kubectl get pods -l app.kubernetes.io/name=recipe-detection

# Check service
kubectl get svc recipe-detection

# View logs
kubectl logs -l app.kubernetes.io/name=recipe-detection

# Port-forward and test
kubectl port-forward svc/recipe-detection 8080:8080
curl http://localhost:8080/api/health
```

---

## Troubleshooting

### Backend won't start

```bash
# Error: Port 8081 already in use
# Solution: Kill process on port 8081
lsof -i :8081
kill -9 <PID>

# Or change port in application.yml
server:
  port: 8082
```

### GitOps push fails

```bash
# Error: Authentication failed
# Solution: Verify GIT_TOKEN is set correctly
export GIT_TOKEN=ghp_xxxxxxxxxxxx

# Check token has 'repo' scope in GitHub
# Settings → Developer settings → Personal access tokens
```

### WebSocket connection fails

```bash
# Error: WebSocket connection refused
# Solution: Verify WebSocket port is same as HTTP port (8081)
# Check firewall allows WebSocket connections

# In browser console:
ws://localhost:8081/ws/releases  # Should connect
```

### Kubernetes ConfigMap not updating

```bash
# Check ConfigMap exists
kubectl get configmap recipe-detection-config -o yaml

# Check pod has mounted ConfigMap
kubectl describe pod <pod-name>

# Restart pod to reload ConfigMap
kubectl delete pod <pod-name>
# K8s will automatically restart it with updated ConfigMap
```

### High memory usage

```bash
# Check memory usage
kubectl top pods recipe-detection-xxx

# Increase memory limit in values.yaml
resources:
  limits:
    memory: 1Gi     # Increase from 512Mi
  requests:
    memory: 512Mi   # Increase from 256Mi
```

---

## Developer Quick Reference

### Useful Maven Commands

```bash
mvn clean                    # Clean build artifacts
mvn compile                  # Compile only
mvn test                     # Run tests
mvn package                  # Build JAR
mvn spring-boot:run          # Run application
mvn dependency:tree          # Show dependency tree
mvn javadoc:javadoc          # Generate API docs
```

### Useful URLs (Local Development)

```
Health:           http://localhost:8081/api/health
Actuator:         http://localhost:8081/api/actuator
Metrics:          http://localhost:8081/api/actuator/metrics
All Catalogs:     http://localhost:8081/api/catalogs
All Releases:     http://localhost:8081/api/helm-releases
WebSocket:        ws://localhost:8081/ws/releases
```

### Key Dependencies

```xml
<!-- Spring Boot -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Kubernetes Client -->
<dependency>
    <groupId>io.fabric8</groupId>
    <artifactId>kubernetes-client</artifactId>
    <version>6.10.0</version>
</dependency>

<!-- Git Operations -->
<dependency>
    <groupId>org.eclipse.jgit</groupId>
    <artifactId>org.eclipse.jgit</artifactId>
    <version>6.8.0.202311291450-r</version>
</dependency>

<!-- JSON Serialization -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

---

## Summary

The **Backend** is a Spring Boot REST API that:

1. **Exposes APIs** for catalog, recipe, and Helm release management
2. **Manages state** in-memory (can be migrated to database)
3. **Integrates with Kubernetes** via Fabric8 client
4. **Implements GitOps** by generating and pushing YAML files
5. **Broadcasts updates** via WebSocket to connected frontends
6. **Follows REST conventions** with proper HTTP status codes
7. **Provides monitoring** via /actuator endpoints

All components are modular, testable, and deployment-ready for Kubernetes environments.
