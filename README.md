# Mobile-First Web


APSI Platform (BolaID) is a mobile-first football ecosystem application. Lovable was used for UI assistance and may continue to support approved UI/frontend work.

## Development and Governance

- **VS Code** is the primary development environment. Work locally and use Git for version control.
- **GitHub** is the canonical source of truth for application code, configuration, documentation, and database migration history.
- Use a feature branch for every change. Submit changes through a reviewed pull request; direct commits and pushes to `main` are not the approved workflow.
- **Lovable** may assist with UI design and frontend implementation. Review all generated changes in Git and integrate them through the controlled branch and pull request workflow. Lovable is not the authority for database schema, migrations, RLS, backend authorization, or production infrastructure.
- **Supabase** is the approved backend platform. Database schema and migration source files are managed in this repository. This approval does not mean a Supabase project is configured or connected.
- Production database changes require an explicit plan and owner authorization. Never commit secrets or put privileged credentials in browser code.

## Development in VS Code

You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
git switch -c feature/short-description
npm install
npm run dev
```

See [DEVELOPMENT-WORKFLOW.md](docs/architecture/DEVELOPMENT-WORKFLOW.md) for the review, migration, and deployment governance process. The [Lovable project](https://lovable.dev/projects/534e9573-3c2f-42e3-b9a1-683dc0862811) is for approved UI assistance; generated work is not automatically integrated.
