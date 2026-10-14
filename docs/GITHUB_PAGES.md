# GitHub Pages deployment

The browser interface lives in `site/` and is deliberately static. It does not require a Python server, database, API key, or external backend.

## Automated deployment

The workflow at `.github/workflows/pages.yml` runs after changes to `site/**` land on `main`, or when started manually from the Actions tab. It verifies the files, packages `site/`, and deploys the artifact to GitHub Pages.

1. Open the repository's **Settings → Pages**.
2. Set the build and deployment source to **GitHub Actions**.
3. Open **Actions → Deploy STL Lab to GitHub Pages** and confirm the latest run succeeds.
4. Use the published URL from the workflow's deployment environment.

If the workflow cannot deploy, verify that GitHub Pages is enabled for the repository and that repository/organization policy permits Actions deployments.

## Local preview

From the repository root, start a static server. For example:

```bash
python -m http.server 8000 --directory site
```

Open `http://localhost:8000`.

## Validation

```bash
node --check site/app.js
python -m unittest discover -s tests -v
```

## Scope and privacy

The browser app simulates an agent clock, skill values, note entries, and generated scalar signal values. All interaction runs client-side. Signal output is synthetic and is not collected from any person or device. The app is not a BCI, medical device, or consciousness-transfer system.
