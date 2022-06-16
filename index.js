const core = require('@actions/core');
const cloudFlareWorkersKV = require('@kikobeats/cloudflare-workers-kv');
const ms = require('ms');

async function main() {
  try {
    const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const cfKey = process.env.CLOUDFLARE_API_TOKEN;
    const cfNamespaceId = core.getInput('namespace_id', { required: true });

    const store = cloudFlareWorkersKV({
      accountId: cfAccountId,
      key: cfKey,
      namespaceId: cfNamespaceId
    })
    console.log(`Using ${cfNamespaceId}!`);

    const inputKey = core.getInput('key', { required: true });
    const inputValue = core.getInput('value');
    const overwrite = core.getBooleanInput('overwrite');
    const expiration = core.getInput('expiration');
    expiration_ttl = null;
    if (expiration && (expiration.length > 0 || Object.keys(expiration).length > 0)) {
      expiration_ttl = ms(expiration);
    }

    core.warning(`expiration is ${expiration_ttl}`);

    body = await store.get(inputKey);
    result = true;
    if (body && (body.length > 0 || Object.keys(body).length > 0)) {
      if (overwrite == true) {
        await store.delete(inputKey);
        core.warning(`Setting value for ${inputKey} (overwrite: ${overwrite})`);

        body = { value: inputValue }
        result = await store.set(inputKey, body, expiration_ttl);
      } else {
        core.warning(`Getting value for ${inputKey}`);
      }
    } else {
      core.warning(`Setting value for ${inputKey}`);

      body = { value: inputValue }
      result = await store.set(inputKey, body, expiration_ttl);
    }

    core.warning(`value is ${body.value}, result is ${result}`);

    core.setOutput('result', result);
    core.setOutput('value', body.value);
  } catch (error) {
    core.setFailed(error.message);
    core.setFailed(error.stack);
  }
}

main()
