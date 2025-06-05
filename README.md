# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/13606cdc-6b16-461d-b2be-0098b12e8f3a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/13606cdc-6b16-461d-b2be-0098b12e8f3a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Linting

Use the `lint` script to check your code for potential issues. Install the
project dependencies first, then run the linter:

```sh
npm install # or bun install
npm run lint
```

## Running tests

Make sure the dependencies are installed first:

```sh
npm install
```

To execute the unit tests once, run:

```sh
npm test
```

For interactive development with automatic re-runs, use:

```sh
npm run test:watch
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/13606cdc-6b16-461d-b2be-0098b12e8f3a) and click on Share -> Publish.

When deploying the Supabase functions, set the `CORS_ALLOWED_ORIGINS` environment
variable with a comma-separated list of domains allowed to call the functions.
Only requests from these origins will be permitted.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Environment setup

Create a `.env` file in the project root and define the following variables used by the Supabase functions:

```sh
ELEVENLABS_API_KEY=<your-elevenlabs-key>
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

These keys should be kept private and are required for the `elevenlabs-speech` function.

## Deploying the `elevenlabs-speech` function

Deploy the text-to-speech function with the Supabase CLI and set the secrets:

```sh
supabase functions deploy elevenlabs-speech --project-ref <project-id>
supabase secrets set ELEVENLABS_API_KEY=<your-elevenlabs-key> \
  SUPABASE_URL=<your-supabase-url> \
  SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

After deployment, invoke the function from your client code:

```ts
const { data, error } = await supabase.functions.invoke('elevenlabs-speech', {
  body: { text: 'Hello world' }
});
```

The client now uses this function for speech synthesis instead of reading `VITE_ELEVENLABS_API_KEY` directly.
