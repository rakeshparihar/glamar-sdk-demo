# GlamAR Skin Analysis SDK + React Demo

This project is a React + Vite starter that demonstrates how to wire the GlamAR Skin Analysis SDK into a front-end application.

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment variables

Copy the example and add your values:

```bash
cp .env.example .env
```

Required keys:

- `VITE_GLAMAR_SDK_SCRIPT_URL` → script URL from the GlamAR SDK docs
- `VITE_GLAMAR_API_KEY` → your GlamAR API key
- `VITE_GLAMAR_ANALYSIS_TARGET` → optional analysis target (defaults to `face`)

## 3) Run the demo

```bash
npm run dev
```

Open the local URL, then click **Start Skin Analysis**.

## Notes

- The app loads the SDK script dynamically and checks for `window.GlamARSkinAnalysisSDK`.
- If your account uses different init/open options, update `src/App.tsx` to match your SDK configuration from the official docs.
