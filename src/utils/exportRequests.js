import axios from "axios";

const exportAxios = axios.create();
const DEFAULT_BATCH_SIZE = 1000;
const MAX_BATCH_SIZE = 2000;
const SINGLE_REQUEST_LIMIT = 2000;

export const safeParseToken = () => {
  const raw = localStorage.getItem("data");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getAuthorizedHeaders = () => {
  const token = safeParseToken();
  const accessToken = token?.access_token;

  if (!accessToken) {
    throw new Error("You are not authorized. Please log in again.");
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

const normalizeItems = (value) => (Array.isArray(value) ? value : []);
const normalizeChunkSize = (value) => {
  const numericValue = Number(value) || DEFAULT_BATCH_SIZE;
  return Math.max(1, Math.min(MAX_BATCH_SIZE, numericValue));
};

export const fetchAllPaginatedData = async ({
  buildUrl,
  chunkSize = DEFAULT_BATCH_SIZE,
  extractItems = (payload) => payload?.data,
  extractTotal = (payload) =>
    payload?.recordsFiltered ?? payload?.recordsTotal ?? payload?.total ?? 0,
}) => {
  if (typeof buildUrl !== "function") {
    throw new Error("A page export URL builder is required.");
  }

  const headers = getAuthorizedHeaders();
  const safeChunkSize = normalizeChunkSize(chunkSize);
  const allItems = [];
  let page = 0;
  let expectedTotal = 0;
  let lastPayload = null;

  while (true) {
    const response = await exportAxios.get(buildUrl(page, safeChunkSize), {
      headers,
    });

    const payload = response?.data;
    const batch = normalizeItems(extractItems(payload));
    const total = Number(extractTotal(payload)) || 0;

    allItems.push(...batch);
    expectedTotal = Math.max(expectedTotal, total);
    lastPayload = payload;

    if (
      batch.length === 0 ||
      batch.length < safeChunkSize ||
      (expectedTotal > 0 && allItems.length >= expectedTotal)
    ) {
      return {
        data: allItems,
        total: expectedTotal || allItems.length,
        raw: lastPayload,
      };
    }

    page += 1;
  }
};

export const fetchCompleteDataSet = async ({
  buildUrl,
  totalCount = 0,
  chunkSize = DEFAULT_BATCH_SIZE,
  extractItems = (payload) => payload?.data,
  extractTotal = (payload) =>
    payload?.recordsFiltered ?? payload?.recordsTotal ?? payload?.total ?? 0,
}) => {
  if (typeof buildUrl !== "function") {
    throw new Error("A page export URL builder is required.");
  }

  const normalizedTotal = Math.max(0, Number(totalCount) || 0);
  const safeChunkSize = normalizeChunkSize(chunkSize);

  if (normalizedTotal > 0 && normalizedTotal <= SINGLE_REQUEST_LIMIT) {
    const headers = getAuthorizedHeaders();
    const response = await exportAxios.get(buildUrl(0, normalizedTotal), {
      headers,
    });

    const payload = response?.data;
    const items = normalizeItems(extractItems(payload));
    const resolvedTotal = Number(extractTotal(payload)) || normalizedTotal;

    if (
      items.length === resolvedTotal ||
      items.length === normalizedTotal ||
      (resolvedTotal === 0 && items.length > 0)
    ) {
      return {
        data: items,
        total: resolvedTotal || items.length,
        raw: payload,
      };
    }
  }

  return fetchAllPaginatedData({
    buildUrl,
    chunkSize:
      normalizedTotal > 0
        ? Math.min(safeChunkSize, normalizedTotal)
        : safeChunkSize,
    extractItems,
    extractTotal,
  });
};
