# buildwithvivek.dev

Personal portfolio site for Vivek Patel — projects, case studies, and blog.

## Stack

- Vite
- Hosted on S3, served via CloudFront
- Auto-deployed via CodePipeline on every push to `main`

## Deployment

Pushing to `main` triggers CodePipeline automatically:

1. **Source** — pulls the latest commit via the GitHub CodeStar connection
2. **Build** — CodeBuild runs `npm install` and `npm run build`, producing a `dist/` folder, then syncs `dist/` to S3 and invalidates the CloudFront cache

No manual deploy steps required after a merge to `main`.

## Local development

```bash
npm install
npm run dev
```

Build for production locally (to preview what the pipeline will deploy):

```bash
npm run build
npm run preview
```

## Status

🚧 Placeholder deployed to verify the pipeline. Full site in progress.
