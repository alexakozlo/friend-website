# MoonMade website

**Live site:** https://nicklinkedai.github.io/friend-website/

## How to edit the site with Claude Code

**One-time setup**
1. Install Claude Code: https://claude.com/claude-code
2. Install the GitHub CLI and log in: `brew install gh` then `gh auth login`
3. Download the site: `gh repo clone nickLinkedai/friend-website`

**Making changes**
1. Open the `friend-website` folder in VS Code (or run `claude` in it from the terminal).
2. Ask Claude for what you want, e.g. *"Change the headline to 'Fresh bread every morning'"* or
   *"Add this photo to the About section."*
3. Preview locally: run `python3 -m http.server 8000` in the folder and open http://localhost:8000 (or ask Claude to).
4. When you're happy, tell Claude: **"commit and push"**.
5. Wait about a minute and refresh the live site.

## Editing the bags yourself (shop admin)
Bags, prices, stock and photos can be edited without code at **https://app.pagescms.org**:
1. Sign in with your GitHub account (it must be a collaborator on this repo).
2. Open **friend-website**, then **Bags**.
3. Add or edit a bag, then press **Save**. The live site updates in about a minute.

After each sale, lower that bag's **In stock** number. At 0 it shows as "Sold".

## Adding a real domain later
Buy the domain, then in this repo go to **Settings → Pages → Custom domain** and follow the DNS instructions.
