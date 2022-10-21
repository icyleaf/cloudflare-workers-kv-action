# Cloudflare Workers KV Action

A GitHub action to Put and get values from Cloudflare Workers KV action.

## Usage

Needs [API Token](https://dash.cloudflare.com/profile/api-tokens) (User Profile 'API Tokens' page) to create one with `Account.Workers KV Storage: Edit` scope role.

## Example workflow

```yml
- name: Fetch repo git commit
  id: git-commit
  working-directory: /workdir
  run: |
    cd $GITHUB_WORKSPACE/openwrt
    GIT_SHA=$(git rev-parse HEAD)
    echo "openwrt git commit: ${GIT_SHA}"
    echo "::set-output name=sha::${GIT_SHA}"

- name: Fetch cached git commit else store it
  uses: icyleaf/cloudflare-workers-kv-action@v0.1.1
  id: cache-git-commit
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
  with:
    namespace_id: ${{ secrets.CLOUDFLARE_NAMESPACE_ID }}
    key: ${{ runner.os }}-repo-git-commit
    value: ${{ steps.git-commit.outputs.sha }}

- name: Store current git commit
  uses: icyleaf/cloudflare-workers-kv-action@v0.1.1
  if: steps.git-commit.outputs.sha != steps.cache-git-commit.outputs.value
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
  with:
    namespace_id: ${{ secrets.CLOUDFLARE_NAMESPACE_ID }}
    key: ${{ runner.os }}-git-commit
    value: ${{ steps-git-commit.outputs.sha }}
    overwrite: true
```
