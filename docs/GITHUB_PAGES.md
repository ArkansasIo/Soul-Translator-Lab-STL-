# GitHub Pages deployment

The browser interface lives in `site/` and is deliberately static. A root-level `index.html` redirects repository-root visitors to the app.

## Enable deployment

1. Open the repository's **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Open **Actions → Deploy STL Lab to GitHub Pages** and confirm the latest run succeeds.
4. Use the published URL from the workflow deployment environment.

The workflow at `.github/workflows/pages.yml` runs after changes to `site/**` land on `main`, or when started manually from the Actions tab. It checks the files, packages `site/`, and deploys the artifact. Enabling Pages may require an administrator to set the Pages source once in repository settings; the workflow's token was not permitted to create the Pages site automatically.

## Local preview

```bash
python -m http.server 8000
```

Open `http://localhost:8000` and the root redirect will open the browser app.

## Validation

```bash
node --check site/app.js
python -m unittest discover -s tests -v
```

## Scope and privacy

The browser app simulates an agent clock, skill values, note entries, and generated scalar signal values. All interaction runs client-side. Signal output is synthetic and is not collected from any person or device. The app is not a BCI, medical device, or consciousness-transfer system.
