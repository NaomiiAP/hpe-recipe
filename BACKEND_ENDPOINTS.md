# HPE Recipe Detection - API Endpoints Reference

**Base URL:** `http://localhost:8081/api` (development) or `http://<cluster-ip>/api` (production)

---

## Table of Contents

1. [Health & Monitoring](#health--monitoring)
2. [Catalogs](#catalogs)
3. [Recipes](#recipes)
4. [Helm Releases (CRUD)](#helm-releases-crud)
5. [Recipes in Release (Sub-resource CRUD)](#recipes-in-release-sub-resource-crud)
6. [Release Status & Deploy](#release-status--deploy)
7. [Comparisons](#comparisons)
8. [WebSocket](#websocket)
9. [Request/Response Formats](#requestresponse-formats)
10. [Error Responses](#error-responses)

---

## Health & Monitoring

### 1. GET /api/health

**Purpose:** Health check endpoint for Kubernetes probes and monitoring

**Method:** `GET`

**URL:** `http://localhost:8081/api/health`

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `200 OK`

```json
{
  "status": "UP",
  "service": "recipe-detection-api",
  "timestamp": "2024-04-09T10:30:00Z"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8081/api/health
```

**Used By:**
- Kubernetes liveness probe
- Kubernetes readiness probe
- External monitoring systems

---

### 2. GET /api/actuator

**Purpose:** List all actuator endpoints

**Method:** `GET`

**URL:** `http://localhost:8081/api/actuator`

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `200 OK`

```json
{
  "_links": {
    "self": { "href": "http://localhost:8081/api/actuator", "templated": false },
    "health": { "href": "http://localhost:8081/api/actuator/health", "templated": false },
    "health-path": { "href": "http://localhost:8081/api/actuator/health/{*path}", "templated": true },
    "info": { "href": "http://localhost:8081/api/actuator/info", "templated": false },
    "metrics": { "href": "http://localhost:8081/api/actuator/metrics", "templated": false },
    "metrics-requiredMetricName": { "href": "http://localhost:8081/api/actuator/metrics/{requiredMetricName}", "templated": true }
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8081/api/actuator
```

---

### 3. GET /api/actuator/health

**Purpose:** Detailed health information

**Method:** `GET`

**URL:** `http://localhost:8081/api/actuator/health`

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `200 OK`

```json
{
  "status": "UP",
  "components": {
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 1000000000,
        "free": 500000000,
        "threshold": 10485760,
        "exists": true
      }
    },
    "livenessState": {
      "status": "UP"
    },
    "readinessState": {
      "status": "UP"
    }
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8081/api/actuator/health
```

---

### 4. GET /api/actuator/metrics

**Purpose:** List available metrics

**Method:** `GET`

**URL:** `http://localhost:8081/api/actuator/metrics`

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `200 OK`

```json
{
  "names": [
    "jvm.memory.used",
    "jvm.memory.max",
    "jvm.threads.live",
    "http.server.requests",
    "process.uptime",
    ...
  ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8081/api/actuator/metrics
```

---

## Catalogs

### 5. GET /api/catalogs

**Purpose:** List all available catalogs

**Method:** `GET`

**URL:** `http://localhost:8081/api/catalogs`

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Query Parameters:** None

**Response:** `200 OK`

```json
[
  {
    "version": "0.0.1",
    "description": "Initial catalog release",
    "recipes": [
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
      },
      {
        "version": "1.3.1",
        "description": "Patch release with minor component upgrades",
        "components": {
          "spark": "3.2.0",
          "kafka": "3.2.1",
          "airflow": "2.4.1",
          "hbase": "2.4.8"
        },
        "upgradePaths": ["1.3.0", "1.4.0"]
      }
    ]
  },
  {
    "version": "0.0.2",
    "description": "Feature release with upgraded analytics stack",
    "recipes": [...]
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8081/api/catalogs
```

**Response Codes:**
- `200 OK` - Catalogs retrieved successfully

---

### 6. GET /api/catalogs/{catalogVersion}/recipes

**Purpose:** Get all recipes for a specific catalog version

**Method:** `GET`

**URL:** `http://localhost:8081/api/catalogs/{catalogVersion}/recipes`

**URL Parameters:**
- `catalogVersion` (string, required) - Catalog version (e.g., "0.0.1", "0.0.2")

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `200 OK`

```json
[
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
  },
  {
    "version": "1.3.1",
    "description": "Patch release with minor component upgrades",
    "components": {
      "spark": "3.2.0",
      "kafka": "3.2.1",
      "airflow": "2.4.1",
      "hbase": "2.4.8"
    },
    "upgradePaths": ["1.3.0", "1.4.0"]
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8081/api/catalogs/0.0.1/recipes
```

**Response Codes:**
- `200 OK` - Recipes retrieved successfully
- `404 Not Found` - Catalog version not found

---

## Recipes

### 7. GET /api/recipes/{recipeVersion}/components

**Purpose:** Get component versions for a specific recipe

**Method:** `GET`

**URL:** `http://localhost:8081/api/recipes/{recipeVersion}/components`

**URL Parameters:**
- `recipeVersion` (string, required) - Recipe version (e.g., "1.3.0", "1.4.0")

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `200 OK`

```json
{
  "spark": "3.1.2",
  "kafka": "3.1.0",
  "airflow": "2.3.0",
  "hbase": "2.4.6"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8081/api/recipes/1.3.0/components
```

**Response Codes:**
- `200 OK` - Components retrieved successfully
- `404 Not Found` - Recipe version not found

---

### 8. GET /api/recipes/{recipeVersion}/upgradePaths

**Purpose:** Get possible upgrade paths for a recipe

**Method:** `GET`

**URL:** `http://localhost:8081/api/recipes/{recipeVersion}/upgradePaths`

**URL Parameters:**
- `recipeVersion` (string, required) - Recipe version (e.g., "1.3.0")

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `200 OK`

```json
[
  "1.3.1",
  "1.4.0"
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8081/api/recipes/1.3.0/upgradePaths
```

**Response Codes:**
- `200 OK` - Upgrade paths retrieved successfully
- `404 Not Found` - Recipe version not found

---

## Helm Releases (CRUD)

### 9. GET /api/helm-releases

**Purpose:** List all Helm releases with lightweight summary

**Method:** `GET`

**URL:** `http://localhost:8081/api/helm-releases`

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Query Parameters:** None

**Response:** `200 OK`

```json
[
  {
    "version": "2.0.0",
    "releaseName": "prod-release",
    "status": "deployed"
  },
  {
    "version": "2.0.1",
    "releaseName": "staging-release",
    "status": "draft"
  },
  {
    "version": "2.1.0",
    "releaseName": "dev-release",
    "status": "deploying"
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8081/api/helm-releases
```

**Response Codes:**
- `200 OK` - Releases retrieved successfully

---

### 10. GET /api/helm-releases/{version}

**Purpose:** Get detailed information about a specific Helm release

**Method:** `GET`

**URL:** `http://localhost:8081/api/helm-releases/{version}`

**URL Parameters:**
- `version` (string, required) - Release version (e.g., "2.0.0")

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `200 OK`

```json
{
  "version": "2.0.0",
  "releaseName": "prod-release",
  "status": "deployed",
  "description": "Production release with upgraded components",
  "recipes": [
    {
      "version": "1.3.0",
      "description": "Base recipe",
      "components": {
        "spark": "3.1.2",
        "kafka": "3.1.0",
        "airflow": "2.3.0",
        "hbase": "2.4.6"
      },
      "upgradePaths": ["1.3.1", "1.4.0"]
    },
    {
      "version": "1.4.0",
      "description": "Feature release",
      "components": {
        "spark": "3.3.0",
        "kafka": "3.3.2",
        "airflow": "2.5.3",
        "hbase": "2.5.4"
      },
      "upgradePaths": ["1.3.1"]
    }
  ],
  "createdAt": "2024-04-09T10:30:00Z",
  "updatedAt": "2024-04-09T11:45:00Z"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8081/api/helm-releases/2.0.0
```

**Response Codes:**
- `200 OK` - Release retrieved successfully
- `404 Not Found` - Release version not found

---

### 11. POST /api/helm-releases

**Purpose:** Create a new Helm release

**Method:** `POST`

**URL:** `http://localhost:8081/api/helm-releases`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**

```json
{
  "version": "2.0.0",
  "releaseName": "prod-release",
  "status": "draft",
  "description": "Production release with upgraded components",
  "recipes": []
}
```

**Response:** `201 Created`

```json
{
  "version": "2.0.0",
  "releaseName": "prod-release",
  "status": "draft",
  "description": "Production release with upgraded components",
  "recipes": [],
  "createdAt": "2024-04-09T10:30:00Z",
  "updatedAt": "2024-04-09T10:30:00Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8081/api/helm-releases \
  -H "Content-Type: application/json" \
  -d '{
    "version": "2.0.0",
    "releaseName": "prod-release",
    "status": "draft",
    "description": "Production release"
  }'
```

**Response Codes:**
- `201 Created` - Release created successfully
- `409 Conflict` - Release version already exists

---

### 12. PUT /api/helm-releases/{version}

**Purpose:** Update an existing Helm release

**Method:** `PUT`

**URL:** `http://localhost:8081/api/helm-releases/{version}`

**URL Parameters:**
- `version` (string, required) - Release version (e.g., "2.0.0")

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**

```json
{
  "releaseName": "prod-release-updated",
  "description": "Updated production release"
}
```

**Response:** `200 OK`

```json
{
  "version": "2.0.0",
  "releaseName": "prod-release-updated",
  "status": "draft",
  "description": "Updated production release",
  "recipes": [],
  "createdAt": "2024-04-09T10:30:00Z",
  "updatedAt": "2024-04-09T11:00:00Z"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8081/api/helm-releases/2.0.0 \
  -H "Content-Type: application/json" \
  -d '{
    "releaseName": "prod-release-updated",
    "description": "Updated production release"
  }'
```

**Response Codes:**
- `200 OK` - Release updated successfully
- `404 Not Found` - Release version not found

---

### 13. DELETE /api/helm-releases/{version}

**Purpose:** Delete a Helm release

**Method:** `DELETE`

**URL:** `http://localhost:8081/api/helm-releases/{version}`

**URL Parameters:**
- `version` (string, required) - Release version (e.g., "2.0.0")

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `204 No Content`

**cURL Example:**
```bash
curl -X DELETE http://localhost:8081/api/helm-releases/2.0.0
```

**Response Codes:**
- `204 No Content` - Release deleted successfully
- `404 Not Found` - Release version not found

---

## Recipes in Release (Sub-resource CRUD)

### 14. GET /api/helm-releases/{version}/recipes

**Purpose:** List all recipes in a specific Helm release

**Method:** `GET`

**URL:** `http://localhost:8081/api/helm-releases/{version}/recipes`

**URL Parameters:**
- `version` (string, required) - Release version

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `200 OK`

```json
[
  {
    "version": "1.3.0",
    "description": "Base recipe",
    "components": {
      "spark": "3.1.2",
      "kafka": "3.1.0",
      "airflow": "2.3.0",
      "hbase": "2.4.6"
    },
    "upgradePaths": ["1.3.1", "1.4.0"]
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8081/api/helm-releases/2.0.0/recipes
```

**Response Codes:**
- `200 OK` - Recipes retrieved successfully

---

### 15. POST /api/helm-releases/{version}/recipes

**Purpose:** Add a recipe to a Helm release

**Method:** `POST`

**URL:** `http://localhost:8081/api/helm-releases/{version}/recipes`

**URL Parameters:**
- `version` (string, required) - Release version

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**

```json
{
  "version": "1.3.0"
}
```

**Response:** `201 Created`

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

**cURL Example:**
```bash
curl -X POST http://localhost:8081/api/helm-releases/2.0.0/recipes \
  -H "Content-Type: application/json" \
  -d '{"version": "1.3.0"}'
```

**Response Codes:**
- `201 Created` - Recipe added successfully
- `409 Conflict` - Recipe already exists in release

---

### 16. PUT /api/helm-releases/{version}/recipes/{recipeVersion}

**Purpose:** Update a recipe in a Helm release

**Method:** `PUT`

**URL:** `http://localhost:8081/api/helm-releases/{version}/recipes/{recipeVersion}`

**URL Parameters:**
- `version` (string, required) - Release version
- `recipeVersion` (string, required) - Recipe version

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**

```json
{
  "version": "1.3.0",
  "description": "Updated recipe description"
}
```

**Response:** `200 OK`

```json
{
  "version": "1.3.0",
  "description": "Updated recipe description",
  "components": {
    "spark": "3.1.2",
    "kafka": "3.1.0",
    "airflow": "2.3.0",
    "hbase": "2.4.6"
  },
  "upgradePaths": ["1.3.1", "1.4.0"]
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8081/api/helm-releases/2.0.0/recipes/1.3.0 \
  -H "Content-Type: application/json" \
  -d '{"description": "Updated recipe description"}'
```

**Response Codes:**
- `200 OK` - Recipe updated successfully
- `404 Not Found` - Release or recipe not found

---

### 17. DELETE /api/helm-releases/{version}/recipes/{recipeVersion}

**Purpose:** Remove a recipe from a Helm release

**Method:** `DELETE`

**URL:** `http://localhost:8081/api/helm-releases/{version}/recipes/{recipeVersion}`

**URL Parameters:**
- `version` (string, required) - Release version
- `recipeVersion` (string, required) - Recipe version

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `204 No Content`

**cURL Example:**
```bash
curl -X DELETE http://localhost:8081/api/helm-releases/2.0.0/recipes/1.3.0
```

**Response Codes:**
- `204 No Content` - Recipe removed successfully
- `404 Not Found` - Release or recipe not found

---

### 18. GET /api/helm-releases/{version}/recipes/{recipeVersion}/components

**Purpose:** Get components of a specific recipe in a release

**Method:** `GET`

**URL:** `http://localhost:8081/api/helm-releases/{version}/recipes/{recipeVersion}/components`

**URL Parameters:**
- `version` (string, required) - Release version
- `recipeVersion` (string, required) - Recipe version

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `200 OK`

```json
{
  "spark": "3.1.2",
  "kafka": "3.1.0",
  "airflow": "2.3.0",
  "hbase": "2.4.6"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8081/api/helm-releases/2.0.0/recipes/1.3.0/components
```

**Response Codes:**
- `200 OK` - Components retrieved successfully

---

### 19. GET /api/helm-releases/{version}/recipes/{recipeVersion}/upgradePaths

**Purpose:** Get upgrade paths for a specific recipe in a release

**Method:** `GET`

**URL:** `http://localhost:8081/api/helm-releases/{version}/recipes/{recipeVersion}/upgradePaths`

**URL Parameters:**
- `version` (string, required) - Release version
- `recipeVersion` (string, required) - Recipe version

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `200 OK`

```json
[
  "1.3.1",
  "1.4.0"
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8081/api/helm-releases/2.0.0/recipes/1.3.0/upgradePaths
```

**Response Codes:**
- `200 OK` - Upgrade paths retrieved successfully

---

## Release Status & Deploy

### 20. PUT /api/helm-releases/{version}/status

**Purpose:** Update the status of a Helm release

**Method:** `PUT`

**URL:** `http://localhost:8081/api/helm-releases/{version}/status`

**URL Parameters:**
- `version` (string, required) - Release version

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Request Body:**

```json
{
  "status": "deployed"
}
```

**Valid Status Values:**
- `draft` - Release created, not deployed
- `deploying` - Currently deploying
- `deployed` - Successfully deployed
- `push_failed` - Git push failed
- `rollback` - Rolled back to previous version

**Response:** `200 OK`

```json
{
  "version": "2.0.0",
  "releaseName": "prod-release",
  "status": "deployed",
  "description": "Production release",
  "recipes": [...],
  "createdAt": "2024-04-09T10:30:00Z",
  "updatedAt": "2024-04-09T11:45:00Z"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8081/api/helm-releases/2.0.0/status \
  -H "Content-Type: application/json" \
  -d '{"status": "deployed"}'
```

**Response Codes:**
- `200 OK` - Status updated successfully
- `400 Bad Request` - Invalid or missing status
- `404 Not Found` - Release not found

---

### 21. POST /api/helm-releases/{version}/deploy

**Purpose:** Deploy a Helm release (GitOps workflow)

**Method:** `POST`

**URL:** `http://localhost:8081/api/helm-releases/{version}/deploy`

**URL Parameters:**
- `version` (string, required) - Release version to deploy

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `200 OK`

```json
{
  "message": "Pushed to Git. Jenkins will deploy shortly.",
  "version": "2.0.0"
}
```

**Process:**
1. Release status → `deploying`
2. Generate `values-v2.0.0.yaml` from release
3. Clone GitHub repository
4. Commit and push changes to configured branch
5. Status updated to `deployed` or `push_failed`
6. WebSocket notifies all connected clients

**cURL Example:**
```bash
curl -X POST http://localhost:8081/api/helm-releases/2.0.0/deploy
```

**Response Codes:**
- `200 OK` - Deploy initiated successfully
- `400 Bad Request` - Release has no recipes
- `404 Not Found` - Release not found
- `500 Internal Server Error` - Git operation failed

**Error Response:**
```json
{
  "error": "Git push failed: Authentication failed. Check GIT_TOKEN env var."
}
```

---

## Comparisons

### 22. GET /api/helm-releases/compare?from={fromVersion}&to={toVersion}

**Purpose:** Compare two Helm release versions to see differences

**Method:** `GET`

**URL:** `http://localhost:8081/api/helm-releases/compare?from={fromVersion}&to={toVersion}`

**Query Parameters:**
- `from` (string, required) - Starting version (e.g., "1.0.0")
- `to` (string, required) - Target version (e.g., "2.0.0")

**Headers:**
```
Accept: application/json
```

**Request Body:** None

**Response:** `200 OK`

```json
{
  "fromVersion": "1.0.0",
  "toVersion": "2.0.0",
  "commonRecipes": [
    {
      "version": "1.3.0",
      "fromStatus": "included",
      "toStatus": "included"
    }
  ],
  "addedRecipes": [
    {
      "version": "1.4.0",
      "description": "New feature release"
    }
  ],
  "removedRecipes": [
    {
      "version": "1.2.0",
      "description": "Deprecated version"
    }
  ],
  "updatedRecipes": [
    {
      "version": "1.3.0",
      "changes": {
        "spark": {"from": "3.1.2", "to": "3.2.0"},
        "kafka": {"from": "3.1.0", "to": "3.2.1"}
      }
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8081/api/helm-releases/compare?from=1.0.0&to=2.0.0"
```

**Response Codes:**
- `200 OK` - Comparison successful
- `404 Not Found` - One or both release versions not found

---

## WebSocket

### 23. WS /ws/releases

**Purpose:** Real-time updates for Helm releases and recipes

**Protocol:** WebSocket

**URL:** `ws://localhost:8081/ws/releases` (development) or `wss://<cluster-ip>/ws/releases` (production)

**Connection:**

```javascript
const ws = new WebSocket('ws://localhost:8081/ws/releases');

ws.onopen = () => {
  console.log("Connected to WebSocket");
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log("Message received:", message);
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

ws.onclose = () => {
  console.log("Disconnected from WebSocket");
};
```

**Message Format:**

```json
{
  "event": "status_changed",
  "data": {
    "version": "2.0.0",
    "status": "deployed"
  },
  "timestamp": "2024-04-09T10:30:00Z"
}
```

**Event Types:**

| Event | Trigger | Data Payload |
|-------|---------|--------------|
| `release_created` | New release created | Full HelmRelease object |
| `release_updated` | Release updated | Full HelmRelease object |
| `release_deleted` | Release deleted | `{version: "2.0.0"}` |
| `recipe_added` | Recipe added to release | `{helmVersion: "2.0.0", recipe: {...}}` |
| `recipe_updated` | Recipe updated in release | `{helmVersion: "2.0.0", recipe: {...}}` |
| `recipe_deleted` | Recipe removed from release | `{helmVersion: "2.0.0", recipeVersion: "1.3.0"}` |
| `status_changed` | Release status changed | `{version: "2.0.0", status: "deployed"}` |
| `deploy_started` | Deployment initiated | `{version: "2.0.0", status: "deploying"}` |
| `deploy_completed` | Deployment completed | `{version: "2.0.0", status: "deployed"}` |

**Example Messages:**

**release_created:**
```json
{
  "event": "release_created",
  "data": {
    "version": "2.0.0",
    "releaseName": "prod-release",
    "status": "draft",
    "recipes": [],
    "createdAt": "2024-04-09T10:30:00Z",
    "updatedAt": "2024-04-09T10:30:00Z"
  },
  "timestamp": "2024-04-09T10:30:00Z"
}
```

**status_changed:**
```json
{
  "event": "status_changed",
  "data": {
    "version": "2.0.0",
    "status": "deployed"
  },
  "timestamp": "2024-04-09T11:45:00Z"
}
```

**recipe_added:**
```json
{
  "event": "recipe_added",
  "data": {
    "helmVersion": "2.0.0",
    "recipe": {
      "version": "1.3.0",
      "description": "Base recipe",
      "components": {...},
      "upgradePaths": [...]
    }
  },
  "timestamp": "2024-04-09T11:00:00Z"
}
```

---

## Request/Response Formats

### Standard Request Headers

```
Content-Type: application/json    (required for POST/PUT)
Accept: application/json           (optional, assumed default)
Authorization: Bearer <token>      (if authentication enabled)
```

### Standard Response Headers

```
Content-Type: application/json
Content-Length: <size>
Date: <timestamp>
```

### Pagination (if implemented)

```
GET /api/helm-releases?page=1&size=10&sort=version,desc

Response Headers:
X-Page-Number: 1
X-Page-Size: 10
X-Total-Pages: 5
X-Total-Items: 50
```

---

## Error Responses

### 400 Bad Request

When request body is invalid or missing required fields.

```json
{
  "error": "Bad Request",
  "message": "Invalid or missing required field: releaseName",
  "statusCode": 400,
  "timestamp": "2024-04-09T10:30:00Z"
}
```

### 404 Not Found

When requested resource doesn't exist.

```json
{
  "error": "Not Found",
  "message": "Release version 3.0.0 not found",
  "statusCode": 404,
  "timestamp": "2024-04-09T10:30:00Z"
}
```

### 409 Conflict

When trying to create resource that already exists.

```json
{
  "error": "Conflict",
  "message": "Release version 2.0.0 already exists",
  "statusCode": 409,
  "timestamp": "2024-04-09T10:30:00Z"
}
```

### 500 Internal Server Error

When server encounters unexpected error.

```json
{
  "error": "Internal Server Error",
  "message": "Failed to push to Git repository",
  "statusCode": 500,
  "timestamp": "2024-04-09T10:30:00Z",
  "details": "Git authentication failed: Invalid token"
}
```

---

## HTTP Status Codes Reference

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, update |
| 201 | Created | Successful POST operation |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request format or missing required fields |
| 401 | Unauthorized | Authentication failed (if enabled) |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error or external service failure |

---

## Complete API Usage Example (Full Workflow)

```bash
# 1. List all catalogs
curl -X GET http://localhost:8081/api/catalogs

# 2. Get recipes from catalog 0.0.1
curl -X GET http://localhost:8081/api/catalogs/0.0.1/recipes

# 3. Get components for recipe 1.3.0
curl -X GET http://localhost:8081/api/recipes/1.3.0/components

# 4. Create a new release
curl -X POST http://localhost:8081/api/helm-releases \
  -H "Content-Type: application/json" \
  -d '{
    "version": "2.0.0",
    "releaseName": "prod-release",
    "status": "draft",
    "description": "New production release"
  }'

# 5. Add recipe to release
curl -X POST http://localhost:8081/api/helm-releases/2.0.0/recipes \
  -H "Content-Type: application/json" \
  -d '{"version": "1.3.0"}'

# 6. Add another recipe
curl -X POST http://localhost:8081/api/helm-releases/2.0.0/recipes \
  -H "Content-Type: application/json" \
  -d '{"version": "1.4.0"}'

# 7. Get release details
curl -X GET http://localhost:8081/api/helm-releases/2.0.0

# 8. Update release status
curl -X PUT http://localhost:8081/api/helm-releases/2.0.0/status \
  -H "Content-Type: application/json" \
  -d '{"status": "ready"}'

# 9. Deploy release (GitOps)
curl -X POST http://localhost:8081/api/helm-releases/2.0.0/deploy

# 10. Compare with previous release
curl -X GET "http://localhost:8081/api/helm-releases/compare?from=1.0.0&to=2.0.0"

# 11. Health check
curl -X GET http://localhost:8081/api/health
```

---

## Testing All Endpoints with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import this collection (save as Postman JSON)
3. Set environment variable: `base_url` = `http://localhost:8081/api`
4. Run requests in sequence

**Postman Collection JSON:**
```json
{
  "info": {
    "name": "HPE Recipe Detection API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/health"
      }
    },
    {
      "name": "List all Catalogs",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/catalogs"
      }
    }
  ]
}
```

---

## Rate Limiting (if configured)

Currently no rate limiting is implemented. Future versions may include:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1639017600
```

---

## Authentication (if enabled)

Currently no authentication is required. All endpoints are public. Future versions should implement:

```
Authorization: Bearer <JWT_TOKEN>
```

Add to all requests that modify data (POST, PUT, DELETE).

---

## Summary Table

| # | Endpoint | Method | Purpose |
|---|----------|--------|---------|
| 1 | `/health` | GET | Health check |
| 2 | `/actuator` | GET | List actuator endpoints |
| 3 | `/actuator/health` | GET | Detailed health info |
| 4 | `/actuator/metrics` | GET | List metrics |
| 5 | `/catalogs` | GET | List all catalogs |
| 6 | `/catalogs/{v}/recipes` | GET | Get recipes from catalog |
| 7 | `/recipes/{v}/components` | GET | Get Recipe components |
| 8 | `/recipes/{v}/upgradePaths` | GET | Get upgrade paths |
| 9 | `/helm-releases` | GET | List all releases |
| 10 | `/helm-releases/{v}` | GET | Get release details |
| 11 | `/helm-releases` | POST | Create release |
| 12 | `/helm-releases/{v}` | PUT | Update release |
| 13 | `/helm-releases/{v}` | DELETE | Delete release |
| 14 | `/helm-releases/{v}/recipes` | GET | List recipes in release |
| 15 | `/helm-releases/{v}/recipes` | POST | Add recipe to release |
| 16 | `/helm-releases/{v}/recipes/{r}` | PUT | Update recipe in release |
| 17 | `/helm-releases/{v}/recipes/{r}` | DELETE | Remove recipe from release |
| 18 | `/helm-releases/{v}/recipes/{r}/components` | GET | Get components in release recipe |
| 19 | `/helm-releases/{v}/recipes/{r}/upgradePaths` | GET | Get upgrade paths in release recipe |
| 20 | `/helm-releases/{v}/status` | PUT | Update release status |
| 21 | `/helm-releases/{v}/deploy` | POST | Deploy release (GitOps) |
| 22 | `/helm-releases/compare` | GET | Compare releases |
| 23 | `/ws/releases` | WS | WebSocket real-time updates |

---

## Environment Variables Needed

For full functionality:

```bash
export GIT_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx          # GitHub PAT (required for deploy)
export GIT_USERNAME=myusername                     # GitHub username (optional, defaults to NaomiiAP)
export SERVER_PORT=8081                            # Backend port (optional)
export SERVER_SERVLET_CONTEXT_PATH=/api            # API context path (optional)
```

---

## Next Steps

- Add API authentication (JWT)
- Implement rate limiting
- Add API versioning (/v1/api/, /v2/api/)
- Add pagination to list endpoints
- Generate OpenAPI/Swagger documentation
- Add request validation with @Valid annotations
- Implement caching for frequently accessed resources
