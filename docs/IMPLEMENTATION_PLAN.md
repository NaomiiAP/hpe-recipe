# Implementation Plan (Week 1-6)

## Week 1-2: Kubernetes Fundamentals
- [x] Create sample ConfigMaps with recipe data manually
- [ ] Practice kubectl CLI commands
- [ ] Verify app runs on minikube with health check

## Week 3: Fabric8 K8s Client Integration
- [ ] `config/KubernetesConfig.java` — Fabric8 client bean
- [ ] `service/ConfigMapService.java` — read ConfigMaps from K8s
- [ ] Unit tests using WireMock
- [ ] ServiceAccount & RBAC templates

## Week 4: Data Models & Helm
- [ ] `service/CatalogService.java` — parse JSON into Catalog objects
- [ ] Enhanced Recipe model for forward compatibility
- [ ] Helm Ingress template (optional)

## Week 5: REST API
- [ ] `controller/CatalogController.java` — all GET/POST endpoints
- [ ] Error handling with `@ControllerAdvice`
- [ ] Integration tests
- [ ] API documentation

## Week 6: Frontend & Visualization
- [ ] `CatalogSelector.jsx` — dropdown for catalog versions
- [ ] `RecipeList.jsx` — table of recipes
- [ ] `UpgradePathGraph.jsx` — React Flow visualization
- [ ] Custom hooks for API integration
- [ ] Styling & responsive layout
