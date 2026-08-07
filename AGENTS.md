<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Stack

| Pkg           | Ver                | Note                                                                                                                                                                 |
| ------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js       | ^16.2              | `reactCompiler: true`, `typedRoutes: true`                                                                                                                           |
| React         | ^19.2              |                                                                                                                                                                      |
| TypeScript    | ^5.9               | strict, ESNext module, bundler resolution                                                                                                                            |
| Prisma        | ^7.9               | Uses `prisma-client` generator (not `prisma-client-js`). Output: `generated/prisma`. Driver adapter: `@prisma/adapter-libsql` for SQLite. Config: `prisma.config.ts` |
| shadcn/ui     | base-vega style    | Components in `src/components/shadcnui/`. Aliased as `@/components/shadcnui`                                                                                         |
| Base UI React | ^1.6               | Primitive provider for shadcn components (e.g., `@base-ui/react/button`)                                                                                             |
| Tailwind CSS  | ^4.3               | `@tailwindcss/postcss` plugin, `tw-animate-css`, `shadcn/tailwind.css`                                                                                               |
| Zod           | ^4.4               | Schema validation. Use `z.email()`, `z.url()` top-level formats                                                                                                     |
| env           | @t3-oss/env-nextjs | Split: `src/lib/env/serverEnv.ts` + `clientEnv.ts`. This version does NOT auto-add `NODE_ENV` — declare it in the schema                                                                      |
| Better Auth   | ^1.6               | Server: `src/lib/auth.ts`, client: `src/lib/auth-client.ts`. Adapter: `prismaAdapter` from `better-auth/adapters/prisma` (provider `"sqlite"`). Add `nextCookies()` plugin for RSC |
| react-icons   | ^5.7               | Used for auth UI (Heroicons v2, e.g. `react-icons/hi2`)                                                                                                              |
| react-toastify| ^11.1              | CSS import: `react-toastify/ReactToastify.css` (not `dist/...`). Provider: `src/components/Providers/ToastProvider.tsx`                                             |
| react-hook-form | ^7.84           | + `@hookform/resolvers` for zod. See Form patterns below                                                                                                            |

Path aliases: `@/*` → `./src/*`, `@generated/*` → `./generated/*`.

## Agent behavior

- **Ask questions** when ambiguous or before destructive actions. Prefer one batched question.
- **Update this file** when you discover non-obvious gotchas, fixes, or conventions.
- **Use skills + MCPs** before writing code matching `prisma-*`, `next-*`, `better-auth-*`, `zod`, etc. Use `shadcn` MCP for component add/search/audit. Use `better-auth` MCP for auth docs.

## Verification

- **Primary**: `bun lint` — runs `next typegen && tsc --noEmit && eslint`
- **Build gate**: `bun run build` — `prisma generate && next build`
- **Full prod**: `bun prod` — `prisma generate && next build && next start` (before schema/env changes)

## Project structure

```
src/
  app/              # App Router (layout.tsx, page.tsx, globals.css)
    (auth)/         # Auth route group (sign-in, sign-up) with centered-card layout
    api/auth/       # Better Auth route handler: [...all]/route.ts
  components/
    auth/           # SignInForm, SignUpForm, SessionPanel
    Layout/         # Header, ThemeToggleButton
    Providers/      # ThemeProvider (next-themes), ToastProvider (react-toastify)
    shadcnui/       # shadcn primitives (button, input, input-group, field, card, toast, ...)
  hooks/            # Custom hooks (currently empty)
  lib/
    auth.ts         # Better Auth server config (prismaAdapter + nextCookies)
    auth-client.ts  # createAuthClient from better-auth/react
    auth-errors.ts  # error code -> friendly message map
    dbClient/       # Prisma singleton with libSQL adapter
    env/            # serverEnv.ts, clientEnv.ts (t3-env)
    fonts.ts        # next/font (Geist, Inter)
    types.ts        # LayoutProps
    utils.ts        # cn() helper (clsx + tailwind-merge)
    zodSchema.ts    # signInSchema / signUpSchema (zod)
  server/           # API routes placeholder (empty)
generated/prisma/   # Prisma client output (gitignored)
prisma/migrations/  # DB migrations (committed); prisma/dev.db is gitignored
public/uploads/     # User uploads (all files ignored except .gitkeep)
```

## Gitignore pattern: uploads

`public/uploads/*` + `!public/uploads/.gitkeep` — ignores all uploaded files but keeps empty dir tracked via `.gitkeep`. Do not add `public/uploads/` itself to gitignore.

## Key restrictions

- **ESLint**: Locked at eslint@9.x until `eslint-plugin-react` ships v10 support. Do NOT bump.
- **TypeScript**: Currently ^5.9. TS 7.0 (Go-native compiler) blocked until typescript-eslint API stabilizes (~Oct 2026). Do not migrate.

## Better Auth + Prisma gotchas

- **CLI**: Run `better-auth` CLI with **node** (`node node_modules/@better-auth/cli/dist/index.mjs`), NOT `bunx`. On Windows, bun's extraction can drop files in the CLI's nested `kysely` copy. Fix: copy the complete `kysely` package from `node_modules/@better-auth/core/node_modules/kysely` into `node_modules/@better-auth/cli/node_modules/better-auth/node_modules/kysely`.
- **Schema regeneration**: `node node_modules/@better-auth/cli/dist/index.mjs generate --output prisma/schema.prisma` then `bun prisma migrate dev`. Run `bun prisma generate` before the CLI if `generated/prisma` is missing.
- **Adapter**: `prismaAdapter(prisma, { provider: "sqlite" })` from `better-auth/adapters/prisma`. Requires `@better-auth/prisma-adapter` installed.
- **RSC sessions**: `nextCookies()` plugin is required for server components; session is read via `auth.api.getSession({ headers: await headers() })`.
- **Auth errors**: Map `error.code` → friendly message in `src/lib/auth-errors.ts`.
- **Env**: `BETTER_AUTH_SECRET` (min 32 chars) + `BETTER_AUTH_URL` in `.env`, declared in `serverEnv.ts`.

## Form patterns

Schemas in `src/lib/zodSchema.ts` — export both schema and `type X = z.infer<typeof xSchema>`.

Components use `"use client"`, `react-hook-form` + `@hookform/resolvers/zod`, and shadcn primitives:

```typescript
const { handleSubmit, control, formState: { isSubmitting } } = useForm({
  resolver: zodResolver(mySchema),
  defaultValues: { ... },
  mode: "all",
});
```

Each field goes through `Controller`:

```typescript
<Controller
  name="fieldName"
  control={control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Label</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="..." />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

Submit: `<form onSubmit={handleSubmit(handler)} noValidate>`. Button disabled while submitting with icon toggle.

## Git commits

Use PowerShell here-strings:

```powershell
git commit -m @"
<commit message here>
"@
```
