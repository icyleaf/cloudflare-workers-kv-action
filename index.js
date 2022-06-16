const core = require('@actions/core');
const github = require('@actions/github');
const WorkersKVREST = require('@sagi.io/workers-kv');

try {
  const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const cfApiKey = process.env.CLOUDFLARE_API_KEY;
  const cfEmail = process.env.CLOUDFLARE_EMAIL;
  const cfNamespaceId = core.getInput('namespace_id');
  const KV = new WorkersKVREST({ cfAccountId, cfApiKey, cfEmail, cfNamespaceId });
  const allKeys = await KV.listAllKeys({ namespaceId })

  console.log(`Using ${cfNamespaceId}!`);
  console.log(`Keys ${allKeys}!`);

  const time = (new Date()).toTimeString();

  core.setOutput('result', true);
  core.setOutput('value', time);

  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
