# Architecture Decisions

## Why Fabric8?
- Cleaner API than official K8s Java client
- Auto-detects in-cluster config vs kubeconfig
- Excellent for ConfigMap operations
- Active community

## Why ConfigMaps (not Secrets)?
- Recipe data is not sensitive
- Easier to debug (readable YAML)
- Secrets are for credentials, ConfigMaps for config

## Why Spring Boot?
- Java is your strongest language
- Fabric8 is Java-first
- Type safety with Jackson
- Perfect for SWE interviews

## Why Helm?
- Templates parameterize Kubernetes YAML
- Industry standard
- Enables multi-environment deployments
- GitOps-friendly

## Why Multi-Stage Docker Build?
- Final image ~200MB (vs ~700MB single-stage)
- Production only needs JRE, not Maven
- Better security posture
