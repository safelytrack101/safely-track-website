# /resources

Static assets and the gated EHS-guide funnel, served under `usesafelytrack.com/resources/`.

## Whitepaper PDFs

| File | Guide |
|------|-------|
| `whitepaper-ehs-consultant.pdf` | 5 Things EHS Consultants Need to Know… |
| `whitepaper-loss-control.pdf`   | 5 Things Loss Control Consultants Need to Know… |
| `whitepaper-inhouse-ehs.pdf`    | 5 Things Safety Managers Need to Know… |

## Funnel structure (`resources/ehs-guide/`)

- `index.html` — **chooser**: visitor picks their role (EHS Consultants / Loss Control /
  In-House EHS Teams) and is routed to the matching landing page.
- `consultant/index.html` — EHS consultant landing page → `whitepaper-ehs-consultant.pdf`
- `loss-control/index.html` — loss control landing page → `whitepaper-loss-control.pdf`
- `in-house/index.html` — in-house EHS / safety manager landing page → `whitepaper-inhouse-ehs.pdf`
- `thank-you/index.html` — shared confirmation page; reads `?guide=` to link the right PDF,
  `?email=` to personalize the message.
- `guide.css` / `lead.js` — shared styles and form handler used by all pages.

## Source tracking

Add `?source=linkedin` (or any channel) to a chooser or landing-page URL. The chooser
forwards it into the role link; the landing page stores it in the Formspree submission's
`source` field. Example LinkedIn destination: `…/resources/ehs-guide/?source=linkedin`.

## Lead capture

Forms POST to Formspree (`formspree.io/f/mykakkww`) — the same backend the site's other
gated forms use, so leads land in Tommy's inbox. Each lead is tagged with a `whitepaper`
id (`ehs-consultant-ai-guide` / `loss-control-ai-guide` / `safety-manager-ai-guide`) and
the `source`. To split these leads into their own Formspree inbox, change `FORMSPREE_ENDPOINT`
in `ehs-guide/lead.js`.
