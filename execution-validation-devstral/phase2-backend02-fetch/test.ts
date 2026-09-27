import { fetchUserData, UserNotFoundError, User } from "./fetchUserData";

const g: any = globalThis;
g.fetch = async (url: string) => {
  if (url.includes("notfound")) {
    return { ok: false, status: 404 };
  }
  if (url.includes("slow")) {
    return new Promise(() => {});
  }
  return {
    ok: true,
    status: 200,
    json: async () => ({ id: "123", name: "Ana", email: "ana@x.com" }),
  };
};

async function run() {
  const ok = await fetchUserData("123");
  console.log("OK ->", JSON.stringify(ok));

  try {
    await fetchUserData("notfound");
    console.log("ERRO: deveria ter lancado UserNotFoundError");
  } catch (e) {
    console.log("404 ->", e instanceof UserNotFoundError ? e.name : e);
  }

  const started = Date.now();
  try {
    await fetchUserData("slow");
    console.log("ERRO: timeout nao disparou");
  } catch (e) {
    const elapsed = Date.now() - started;
    console.log(`timeout -> ${(e as Error).message} (${elapsed}ms)`);
  }
}

run();