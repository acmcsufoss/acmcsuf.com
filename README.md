# [`acmcsuf.com`][live_url] 🐘

> Official website of CSUF's ACM club.

## Develop

> 💡 This project runs on Node.js; [install the latest long-term support version][node_download] or use a node version manager like
> [fnm][fnm_download].

To get started, clone this repository to your machine and run `npm i` in the root of this project.
Then, run `npm start` to spin up the [development server][dev_server].

## Contributing 🤝

If you're interested in contributing to this project, I'd recommend checking out the [`CONTRIBUTING.md`](CONTRIBUTING.md) document.
For a more detailed overview of this repository's structure, feel free to review the [`ARCHITECTURE.md`](ARCHITECTURE.md) document.

## Deployment 🚀

This site is deployed with Cloudflare Workers.

Whenever a push is made to the main branch, Cloudflare builds the site, tests it, and if there are no errors, it will deploy a preview site.
Once all checks have been passed, the preview site gets promoted to production.

The site can also be deployed manually by those with sufficient permissions using Wrangler. Use `npm run deploy` to do so.

> Make sure you have a `.env.production` file with the correct production variables.

---

Maintained with 💖 by [**acmcsuf.com hub**][team_doc]  
Current Webmaster: [**Mark Gaballa**][webmaster_url]

[node_download]: https://nodejs.org/en/download/
[fnm_download]: https://github.com/Schniz/fnm
[github_action_deploy]: .github/workflows/deploy.yaml
[live_url]: https://acmcsuf.com/
[acm_officers]: https://acmcsuf.com/teams/
[webmaster_url]: https://github.com/GaballaGit
[dev_server]: http://localhost:3000/
[team_doc]: https://docs.google.com/document/d/11GoIBTAAnIOgmWuG1TsgXUE3MMkweQ8V6bB9TbrY0Hs/edit?usp=sharing
