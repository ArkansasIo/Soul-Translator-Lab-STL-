# Soul Translator Lab (STL)

An educational Python project inspired by the fictional Soul Translator from *Sword Art Online: Alicization*. It demonstrates toy virtual-world time scaling, explicit simulated agent memory and learning, synthetic noisy signals, and neuroscience reference notes.

**Now includes a static browser laboratory UI** in `site/`, designed to deploy to GitHub Pages without a server or database.

## Scientific scope

This project does **not** read, write, transfer, or simulate a real person's consciousness. Current brain-computer interfaces decode limited, task-specific neural signals; they are not a means of transferring a person or unrestricted mind-reading. Values in Signal Studio are generated synthetic data, not human recordings.

## Browser interface

Modules include:
- **Overview:** status metrics, quick navigation, and local activity log.
- **Virtual world:** adjustable time acceleration and clock controls.
- **Signal studio:** configurable synthetic amplitude/noise, chart, history table, and CSV export.
- **Agent memory:** simulated skill learning and fictional memory entries.
- **Research library:** brain systems, BCI measurement basics, scientific limitations, ethics, and external starting points.

All browser state is stored in memory for the current page session and resets when the page is reloaded. No login, tracking, sensor connection, API, or database is used.

## GitHub Pages

See [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md). In repository Settings → Pages, select **GitHub Actions** as the source. The workflow at `.github/workflows/pages.yml` validates and deploys `site/` whenever browser files are updated on `main`.

Local preview:

```bash
python -m http.server 8000 --directory site
```

Then open `http://localhost:8000`.

## Python CLI

Requirements: Python 3.10+; standard library only.

```powershell
py main.py
py -m unittest discover -s tests -v
```

## Project layout

```text
main.py
stl_lab/
  __init__.py
  models.py
  brain_model.py
  world.py
  research.py
  cli.py
site/
  index.html
  styles.css
  app.js
docs/
  BRAIN_RESEARCH.md
  BRAIN_CHIP_RESEARCH_PAPER.md
  BRAIN_CHIP_TECHNICAL_BRIEF.md
  STL_SYSTEM_DESIGN.md
  GITHUB_PAGES.md
tests/
  test_world.py
  test_models.py
.github/
  workflows/pages.yml
```

## Research documents

- `docs/BRAIN_RESEARCH.md` — introductory notes on neural systems, memory, consciousness research, and brain measurement.
- `docs/BRAIN_CHIP_RESEARCH_PAPER.md` — educational paper covering BCIs, implanted interfaces, engineering challenges, applications, ethics, and scientific limitations.
- `docs/BRAIN_CHIP_TECHNICAL_BRIEF.md` — technical overview and safe software development roadmap.
- `docs/STL_SYSTEM_DESIGN.md` — project architecture.
- `docs/GITHUB_PAGES.md` — deployment and validation instructions.

## Validation

```bash
node --check site/app.js
python -m unittest discover -s tests -v
```

## Safety and limitations

Synthetic signals are not human recordings. This is not a medical device, clinical tool, brain-computer interface, or systematic literature review. Any future human-subject or implant-related research would require qualified professionals, relevant ethics approvals, and regulatory compliance.

## License

No license has been specified yet. All rights remain with their respective rights holders until a license is added.
