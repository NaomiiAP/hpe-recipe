# Git Workflow

1. **Clone** -> `git clone <repository_url>`
2. **Create branch** -> `git checkout -b feat/your-feature`
3. **Commit often** -> `git commit -m "feat: descriptive message"`
4. **Push** -> `git push origin feat/your-feature`
5. **Create PR** -> Describe what you did
6. **Code review** -> Team reviews and provides feedback
7. **Merge** -> Merge to `main` after approval

## Version Tracking
Every commit should update:
- `backend/pom.xml` -> `<version>0.0.X</version>`
- `helm/recipe-detection-chart/Chart.yaml` -> `version: 0.0.X`
- `frontend/package.json` -> `"version": "0.0.X"`
