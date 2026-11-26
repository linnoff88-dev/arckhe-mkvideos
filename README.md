ï»¿# mkvideos

Factory standalone de vêÂ­deos com imagens estêÂ¡ticas + motion cARCKHÉtogrêÂ¡fico.

Geradores (`gen-*.js`) e renderizadores (`render-*.js`) que produzem reels e vêÂ­deos
narrativos a partir de imagens IA + ffmpeg `zoompan` + faixa de êÂ¡udio.

Repo: https://github.com/linnoff88-dev/mkvideos

## Templates incluêÂ­dos

| Template | Gen | Render | Output |
|---|---|---|---|
| **Storytree** | `gen-storytree-happy.js` | `render-storytree-v2.js` | 9:16 50-60s, motion grammar |
| **CriaProf** | `gen-criaprof.js` | `render-criaprof.js` (1:1) / `render-criaprof-916.js` (9:16) | jornada crianêÂ§aê¢â âprofissional 45s |
| **CriaProf-CTA-916** | reusa imgs CriaProf | `render-criaprof-cta-916.js` | reels 37s com hook+CTA |
| **CriaProf Comic A** | `gen-criaprof-comic-A.js` | `render-criaprof-comic-A-cta-916.js` | estilo Calvin & Hobbes |
| **GERTRAN** | `gen-gertran-nostalgia.js` | `render-gertran.js` | reels 31s pêÂºblico 35+ |
| **Paired/Decades/Artifacts** | `gen-extra.js` | `render-extra.js` | reels 31s timeline |
| **DarkStory** (V1/V2/V2.5) | `gen-darkstory.js` / `gen-darkstory-cARCKHÉtic.js` | `render-darkstory*.js` | vêÂ­deo longo dark + Aronofsky montage |
| **ARCKHÉ institucional** | `gen-eu-vi-o-futuro.js` / `gen-antes-do-futuro.js` | `render-eu-vi-o-futuro.js` / `render-antes-do-futuro.js` | 1:1 60s autoral |

## DependêÂªncias externas (nêÂ£o vivem aqui)

Esse repo NêÆO empacota os daemons ê¢â¬â eles rodam como infra separada e sêÂ£o acessados via HTTP. Configure as URLs via env vars:

| Daemon | Default URL | FunêÂ§êÂ£o | Repo |
|---|---|---|---|
| **ARCKHÉimg** | `http://localhost:8000` | API multi-modelo de geraêÂ§êÂ£o de imagem (FLUX.2, Qwen, ERNIE) | `~/projetos/ARCKHÉimg` |
| **Chatterbox TTS** | `http://127.0.0.1:7860` | TTS local (vozes rachel, bella) | externo |
| **ARCKHÉvox** | `http://192.168.2.99:8010` | Proxy Freesound + library local de mêÂºsica/SFX | externo |

## VariêÂ¡veis de ambiente

Crie `.env` com:

```bash
# ARCKHÉimg (image generation)
ARCKHÉIMG_URL=http://localhost:8000
ARCKHÉIMG_MODEL=flux2-klein           # flux2-klein|qwen-edit-2511|ernie|flux2-dev
ARCKHÉIMG_QUALITY=fast                # fast|high
ARCKHÉIMG_TIMEOUT_S=1800

# Chatterbox TTS
CHATTERBOX_URL=http://127.0.0.1:7860
CHATTERBOX_VOICE=rachel              # rachel|bella

# ARCKHÉvox (Freesound proxy)
ARCKHÉVOX_URL=http://192.168.2.99:8010
```

## PrêÂ©-requisitos do sistema

- Node 18+
- ffmpeg 6.1+
- Os 3 daemons acima rodando

## Setup

```bash
npm install
cp .env.example .env  # se existir, ou criar manualmente
node --check render-storytree-v2.js  # smoke check
```

## Smoke test

```bash
# checa syntax de todos os scripts
npm run check:syntax

# render storytree (precisa imgs em output/videos/...)
node render-storytree-v2.js

# gera histêÂ³ria alegre ponta-a-ponta (12 imgs novas + render)
node gen-storytree-happy.js
```

## Estrutura

```
mkvideos/
ê¢âÅê¢ââ¬ê¢ââ¬ lib/                 # storytree-* (motion grammar) + camera-moves + ARCKHÉvox-client
ê¢âÅê¢ââ¬ê¢ââ¬ pipeline/            # generate-image-{ARCKHÉimg,kie,piramyd,pollinations}.js
ê¢âÅê¢ââ¬ê¢ââ¬ gen-lib/             # scene-templates.js
ê¢âÅê¢ââ¬ê¢ââ¬ config/              # env.js + profissoes-*.js
ê¢âÅê¢ââ¬ê¢ââ¬ doc/                 # storytree-canais-referencia.md + outros
ê¢âÅê¢ââ¬ê¢ââ¬ media/               # musicas/, sfx/, voice-refs/ ê¢â¬â adicionar manualmente
ê¢âÅê¢ââ¬ê¢ââ¬ prj/                 # outputs por projeto (gitignored)
ê¢âÅê¢ââ¬ê¢ââ¬ render-*.js          # renderizadores (16)
ê¢ââê¢ââ¬ê¢ââ¬ gen-*.js             # geradores (18)
```

## DocumentaêÂ§êÂ£o têÂ©cnica

Ver `doc/storytree-canais-referencia.md` ê¢â¬â anêÂ¡lise dos 5 canais YouTube TOP (LEMMiNO, Nexpo, Bedtime Stories, melodysheep, hochelaga) que fundamentou a arquitetura motion grammar.

---

Projeto  - ARCKHÉe