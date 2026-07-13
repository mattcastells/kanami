const GITHUB_RELEASE_ENDPOINT =
  'https://api.github.com/repos/mattcastells/kanami/releases/latest';

type GitHubReleaseAsset = {
  name: string;
  browser_download_url: string;
  content_type: string;
  size: number;
};

type GitHubLatestReleaseResponse = {
  tag_name: string;
  html_url: string;
  body: string | null;
  published_at: string;
  assets: GitHubReleaseAsset[];
};

export type AppRelease = {
  version: string;
  tag: string;
  notes: string | null;
  publishedAt: string;
  pageUrl: string;
  apkAsset: GitHubReleaseAsset;
};

export async function fetchLatestRelease(): Promise<AppRelease> {
  const response = await fetch(GITHUB_RELEASE_ENDPOINT, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    throw new Error(`No se pudo consultar GitHub Releases (${response.status}).`);
  }

  const payload = (await response.json()) as GitHubLatestReleaseResponse;
  const apkAsset = payload.assets.find((asset) => asset.name.endsWith('.apk'));

  if (!apkAsset) {
    throw new Error('La release publicada no tiene un APK adjunto.');
  }

  return {
    version: normalizeVersion(payload.tag_name),
    tag: payload.tag_name,
    notes: payload.body,
    publishedAt: payload.published_at,
    pageUrl: payload.html_url,
    apkAsset,
  };
}

export function normalizeVersion(input: string) {
  return input.trim().replace(/^v/i, '');
}

export function compareVersions(left: string, right: string) {
  const leftParts = toSemverTuple(left);
  const rightParts = toSemverTuple(right);

  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] > rightParts[index]) {
      return 1;
    }

    if (leftParts[index] < rightParts[index]) {
      return -1;
    }
  }

  return 0;
}

function toSemverTuple(input: string) {
  const [major = '0', minor = '0', patch = '0'] = normalizeVersion(input).split('.');

  return [major, minor, patch].map((value) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  });
}
