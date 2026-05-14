/**
 * /api/fetch-prices
 * Vercel serverless function — runs on cron every 20 min.
 * Fetches live GPU availability + pricing from:
 *   - RunPod (GraphQL API)
 *   - Vast.ai (REST API)
 *   - Lambda Labs (REST API)
 * Writes results to Firebase Realtime DB under /market_prices
 */

const https = require("https");

// ── Firebase config ───────────────────────────────────────────────────────────
const FIREBASE_DB_URL = "https://nexusgpu-crm-default-rtdb.firebaseio.com";
const FIREBASE_SECRET = process.env.FIREBASE_SECRET; // set in Vercel env vars

// GPU name normalization — maps provider-specific names → canonical names
const GPU_CANONICAL = {
  // H100 SXM variants
  "NVIDIA H100 SXM5 80GB": "H100 SXM",
  "NVIDIA H100 SXM 80GB":  "H100 SXM",
  "H100 SXM5 80GB":        "H100 SXM",
  "H100 SXM":              "H100 SXM",
  "gpu_1x_h100_sxm":       "H100 SXM",
  // H100 PCIe variants
  "NVIDIA H100 PCIe 80GB": "H100 PCIe",
  "H100 PCIe 80GB":        "H100 PCIe",
  "H100 PCIe":             "H100 PCIe",
  "gpu_1x_h100_pcie":      "H100 PCIe",
  // H200 variants
  "NVIDIA H200 SXM 141GB": "H200",
  "NVIDIA H200":           "H200",
  "H200 SXM 141GB":        "H200",
  "H200":                  "H200",
  "gpu_1x_h200":           "H200",
  // B200 / B300
  "NVIDIA B200 SXM 192GB": "B200",
  "NVIDIA B300":           "B300",
  "B200":                  "B200",
  "B300":                  "B300",
};

const TARGET_GPUS = new Set(["H100 SXM", "H100 PCIe", "H200", "B200", "B300"]);

function canonicalize(name) {
  if (!name) return null;
  // Direct match
  if (GPU_CANONICAL[name]) return GPU_CANONICAL[name];
  // Partial match
  const upper = name.toUpperCase();
  if (upper.includes("H100") && (upper.includes("SXM") || upper.includes("80GB") && !upper.includes("PCIE"))) return "H100 SXM";
  if (upper.includes("H100") && upper.includes("PCIE")) return "H100 PCIe";
  if (upper.includes("H100")) return "H100 SXM"; // default H100 to SXM
  if (upper.includes("H200")) return "H200";
  if (upper.includes("B300")) return "B300";
  if (upper.includes("B200")) return "B200";
  return null;
}

// ── HTTP helper ───────────────────────────────────────────────────────────────
function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "NexusGPU-CRM/1.0",
        ...(options.headers || {}),
      },
    };
    const req = https.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error: ${data.slice(0, 200)}`)); }
      });
    });
    req.on("error", reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

// ── RunPod ────────────────────────────────────────────────────────────────────
async function fetchRunPod() {
  const query = `{
    gpuTypes {
      id
      displayName
      memoryInGb
      secureCloud
      communityCloud
      lowestPrice(input: { gpuCount: 1 }) {
        minimumBidPrice
        uninterruptablePrice
      }
    }
  }`;

  const data = await fetchJSON("https://api.runpod.io/graphql", {
    method: "POST",
    body: { query },
    headers: { "Content-Type": "application/json" },
  });

  const results = [];
  for (const gpu of (data?.data?.gpuTypes || [])) {
    const canonical = canonicalize(gpu.displayName);
    if (!canonical || !TARGET_GPUS.has(canonical)) continue;
    const odPrice = gpu.lowestPrice?.uninterruptablePrice;
    const spotPrice = gpu.lowestPrice?.minimumBidPrice;
    if (!odPrice && !spotPrice) continue;
    results.push({
      provider: "RunPod",
      providerId: "runpod",
      gpu: canonical,
      gpuRaw: gpu.displayName,
      priceOD: odPrice || null,
      priceSpot: spotPrice || null,
      available: true,
      url: "https://www.runpod.io/gpu-instance/pricing",
    });
  }
  return results;
}

// ── Vast.ai ───────────────────────────────────────────────────────────────────
async function fetchVast() {
  // Public endpoint — no auth needed for market overview
  const data = await fetchJSON(
    "https://console.vast.ai/api/v0/bundles/?q=%7B%22gpu_name%22%3A%7B%22%24in%22%3A%5B%22H100+SXM5%22%2C%22H100+PCIe%22%2C%22H200%22%2C%22B200%22%5D%7D%2C%22rented%22%3Afalse%2C%22rentable%22%3Atrue%7D&order=score-"
  );

  const byGPU = {};
  for (const offer of (data?.offers || [])) {
    const rawName = offer.gpu_name;
    const canonical = canonicalize(rawName);
    if (!canonical || !TARGET_GPUS.has(canonical)) continue;
    const pricePerGPU = offer.dph_total / (offer.num_gpus || 1);
    if (!byGPU[canonical] || pricePerGPU < byGPU[canonical].priceOD) {
      byGPU[canonical] = {
        provider: "Vast.ai",
        providerId: "vast",
        gpu: canonical,
        gpuRaw: rawName,
        priceOD: Math.round(pricePerGPU * 1000) / 1000,
        priceSpot: null,
        available: true,
        count: (byGPU[canonical]?.count || 0) + (offer.num_gpus || 1),
        url: "https://vast.ai/pricing",
      };
    } else {
      byGPU[canonical].count = (byGPU[canonical].count || 0) + (offer.num_gpus || 1);
    }
  }
  return Object.values(byGPU);
}

// ── Lambda Labs ───────────────────────────────────────────────────────────────
async function fetchLambda() {
  // Lambda has a public instance types endpoint
  const data = await fetchJSON(
    "https://cloud.lambdalabs.com/api/v1/instance-types",
    { headers: { Authorization: `Bearer ${process.env.LAMBDA_API_KEY || ""}` } }
  );

  const results = [];
  for (const [id, info] of Object.entries(data?.data || {})) {
    const gpuName = info.instance_type?.gpu_description || info.instance_type?.gpu?.name || "";
    const canonical = canonicalize(gpuName) || canonicalize(id);
    if (!canonical || !TARGET_GPUS.has(canonical)) continue;
    const pricePerHr = info.instance_type?.price_cents_per_hour / 100;
    const gpusPerInstance = info.instance_type?.gpus || 1;
    const pricePerGPU = pricePerHr / gpusPerInstance;
    results.push({
      provider: "Lambda Labs",
      providerId: "lambda",
      gpu: canonical,
      gpuRaw: gpuName || id,
      priceOD: Math.round(pricePerGPU * 1000) / 1000,
      priceSpot: null,
      available: (info.regions_with_capacity_available || []).length > 0,
      regionsAvailable: (info.regions_with_capacity_available || []).map(r => r.name),
      url: "https://lambdalabs.com/service/gpu-cloud",
    });
  }
  return results;
}

// ── Write to Firebase ─────────────────────────────────────────────────────────
async function writeToFirebase(payload) {
  const url = `${FIREBASE_DB_URL}/market_prices.json${FIREBASE_SECRET ? `?auth=${FIREBASE_SECRET}` : ""}`;
  return fetchJSON(url, {
    method: "PUT",
    body: payload,
  });
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Allow manual trigger via GET, and cron trigger
  const secret = req.headers["x-cron-secret"] || req.query.secret;
  if (req.method !== "GET" || (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET)) {
    if (req.query.trigger !== "manual") {
      // Still allow manual trigger from the CRM
    }
  }

  const startTime = Date.now();
  const errors = [];
  let allListings = [];

  // Fetch from all providers in parallel
  const [runpodResult, vastResult, lambdaResult] = await Promise.allSettled([
    fetchRunPod(),
    fetchVast(),
    fetchLambda(),
  ]);

  if (runpodResult.status === "fulfilled") {
    allListings = allListings.concat(runpodResult.value);
  } else {
    errors.push({ provider: "RunPod", error: runpodResult.reason?.message });
  }

  if (vastResult.status === "fulfilled") {
    allListings = allListings.concat(vastResult.value);
  } else {
    errors.push({ provider: "Vast.ai", error: vastResult.reason?.message });
  }

  if (lambdaResult.status === "fulfilled") {
    allListings = allListings.concat(lambdaResult.value);
  } else {
    errors.push({ provider: "Lambda", error: lambdaResult.reason?.message });
  }

  // Build summary: per GPU, cheapest OD price across providers
  const summary = {};
  for (const listing of allListings) {
    const key = listing.gpu;
    if (!summary[key]) summary[key] = { gpu: key, providers: [], cheapestOD: null, cheapestProvider: null };
    summary[key].providers.push(listing);
    if (listing.priceOD && (!summary[key].cheapestOD || listing.priceOD < summary[key].cheapestOD)) {
      summary[key].cheapestOD = listing.priceOD;
      summary[key].cheapestProvider = listing.provider;
    }
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    updatedAtMs: Date.now(),
    durationMs: Date.now() - startTime,
    listings: allListings,
    summary,
    errors,
    providerStatus: {
      runpod: runpodResult.status === "fulfilled" ? "ok" : "error",
      vast: vastResult.status === "fulfilled" ? "ok" : "error",
      lambda: lambdaResult.status === "fulfilled" ? "ok" : "error",
    },
  };

  // Write to Firebase
  try {
    await writeToFirebase(payload);
  } catch (e) {
    errors.push({ provider: "Firebase write", error: e.message });
  }

  res.status(200).json({
    success: true,
    listingsCount: allListings.length,
    gpusFound: Object.keys(summary),
    errors,
    durationMs: Date.now() - startTime,
  });
}
