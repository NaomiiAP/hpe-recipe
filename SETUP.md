# Setup Instructions

1. **Prerequisites**
   - Docker Desktop or Minikube
   - Java 17+ and Maven
   - Node.js 18+
   - Helm 3+
   - kubectl

2. **Backend Setup**
   ```bash
   cd backend
   mvn clean package
   mvn spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Kubernetes Deployment**
   ```bash
   docker build -t hpe-recipe-detection:0.0.1 .
   minikube image load hpe-recipe-detection:0.0.1
   helm install recipe-detection ./helm/recipe-detection-chart --namespace default
   ```
