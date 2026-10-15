# GitHub Pages deployment

The browser interface lives in `site/` and is a static application. The repository-root `index.html` links visitors directly to that interface.

## One-time repository setup

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions** and save.
3. Open **Actions → Deploy STL Lab to GitHub Pages** and run the workflow, or push a change under `site/`.
4. Confirm the latest run completes both the build and deploy jobs. The deployment job publishes the URL under the `github-pages` environment.

The workflow needs `contents: read`, `pages: write`, and `id-token: write`. These workflow permissions do not by themselves activate GitHub Pages for the repository. The `actions/configure-pages` step can fail before artifact upload when the Pages site has not yet been enabled/configured. The repository owner or an administrator must complete the Settings → Pages step above.

## Workflow behavior

`.github/workflows/pages.yml` validates the required HTML, CSS, and JavaScript files, checks JavaScript syntax, uploads the contents of `site/`, and deploys the uploaded artifact. It runs on pushes to `main` that change `site/**` or the Pages workflow file, and can also be started manually.

`.github/workflows/validate.yml` runs the Python unit tests, compiles Python sources, and checks static-browser files, JavaScript syntax, and local asset references.

## Local preview

From the repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. The root page links to `/site/`. To serve only the app directory, run `python -m http.server 8000 --directory site`.

## Validation commands

```bash
node --check site/app.js
python -m unittest discover -s tests -v
python -m compileall -q main.py stl_lab tests
```

## Scope and privacy

The browser app simulates an agent clock, skill values, note entries, and generated scalar signal values. All interaction runs client-side. Signal output is synthetic and is not collected from any person or device. The app is not a brain-computer interface, medical device, or consciousness-transfer system.
